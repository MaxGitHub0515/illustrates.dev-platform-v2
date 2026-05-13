import 'dotenv/config'
import express, { Request, Response, NextFunction } from 'express'
import helmet from 'helmet'
import cors from 'cors'
import mongoSanitize from 'express-mongo-sanitize'
import * as Sentry from '@sentry/node'

import { env } from './config/env'
import { requestId } from './middleware/requestId.middleware'
import { globalRateLimiter } from './middleware/rateLimiter.middleware'
import { errorHandler, notFoundHandler } from './middleware/error.middleware'
import {
  metricsHandler,
  httpRequestDuration,
  httpRequestTotal,
  httpActiveConnections,
} from './lib/metrics'
import { v1Router } from './api/v1'
import { clerkWebhookRouter } from './webhooks/clerk.webhook'

if (env.SENTRY_DSN) {
  Sentry.init({
    dsn: env.SENTRY_DSN,
    environment: env.NODE_ENV,
    tracesSampleRate: env.NODE_ENV === 'production' ? 0.2 : 1.0,
  })
}

export const app = express()

app.set('trust proxy', 1)

// ── Request ID — first so every log line can reference it ─────────────────
app.use(requestId)

// ── Security headers ───────────────────────────────────────────────────────
app.use(helmet())

// ── CORS ───────────────────────────────────────────────────────────────────
app.use(
  cors({
    origin:         env.ALLOWED_ORIGINS.split(',').map((o) => o.trim()),
    credentials:    true,
    methods:        ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'x-request-id', 'Idempotency-Key'],
    exposedHeaders: ['x-request-id'],
  })
)

// ── Prometheus metrics — mounted BEFORE the rate limiter ──────────────────
// Reason: Prometheus scrapes every 15s from the same IP. If the metrics
// route sits behind the global rate limiter, scraping will eventually be
// throttled and Grafana dashboards will show gaps.
// In production, protect this endpoint at the network/firewall level instead.
app.get('/metrics', metricsHandler)

// ── Clerk webhooks — raw body required for svix, before json() ────────────
app.use('/webhooks/clerk', clerkWebhookRouter)

// ── Body parsing ───────────────────────────────────────────────────────────
app.use(express.json({ limit: '1mb' }))
app.use(express.urlencoded({ extended: true, limit: '1mb' }))

// ── NoSQL injection sanitisation ───────────────────────────────────────────
app.use(mongoSanitize())

// ── Global rate limiter ────────────────────────────────────────────────────
app.use(globalRateLimiter)

// ── HTTP metrics with normalised route labels ──────────────────────────────
// Uses process.hrtime() + observe() directly instead of startTimer()/end().
// Reason: startTimer() called with no labels + end(labels) is a split-label
// pattern that silently drops observations in prom-client v15 when all labels
// are deferred to the end() call. observe() is explicit and version-proof.
app.use((req: Request, res: Response, next: NextFunction) => {
  const startAt = process.hrtime()

  res.on('finish', () => {
    const [seconds, nanoseconds] = process.hrtime(startAt)
    const durationSeconds        = seconds + nanoseconds / 1e9
    const route                  = normaliseRoute(req)
    const labels = { method: req.method, route, status_code: String(res.statusCode) }

    httpRequestDuration.observe(labels, durationSeconds)
    httpRequestTotal.inc(labels)
  })

  next()
})

/**
 * Returns a safe, low-cardinality route label for Prometheus.
 *
 * Priority:
 *   1. Matched Express route pattern  → '/api/v1/projects/:id'
 *   2. Static path (no dynamic segs)  → '/api/v1/health'
 *   3. Known versioned prefix         → '/api/v1/projects/*'
 *   4. Fallback                       → 'unknown'
 *
 * Never returns a raw URL containing actual IDs or user data.
 */
function normaliseRoute(req: Request): string {
  if (req.route?.path) {
    return (req.baseUrl ?? '') + (req.route.path as string)
  }

  const url = req.path ?? req.url ?? ''

  // Safe: static paths with no ObjectId-shaped segments
  if (!/\/[a-f0-9]{24}(\/|$)/i.test(url) && !url.includes('/:')) {
    return url
  }

  // Bucket by versioned API prefix
  const match = url.match(/^(\/api\/v\d+\/[^/]+)/)
  if (match) return `${match[1]}/*`

  return 'unknown'
}

// ── API routes ─────────────────────────────────────────────────────────────
app.use(`/api/${env.API_VERSION}`, v1Router)

// ── 404 ────────────────────────────────────────────────────────────────────
app.use(notFoundHandler)

// ── Global error handler — must be last ───────────────────────────────────
app.use(errorHandler)

// Exported so server.ts can wire the active connections gauge
export { httpActiveConnections }

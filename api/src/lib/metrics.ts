import client from 'prom-client'
import { RequestHandler } from 'express'
import { logger } from './logger'

// ── Explicit registry — avoids any ambiguity with the implicit default ─────
// Using client.register (the default singleton) works in simple setups but
// can silently conflict when ts-node reloads modules or if prom-client ends
// up with two instances in the module graph. An explicit registry is the safe,
// unambiguous choice.
export const registry = new client.Registry()

// Default process/OS metrics (CPU, memory, event loop lag, GC, etc.)
// These are non-empty even before any traffic hits the server.
client.collectDefaultMetrics({ register: registry, prefix: 'portfolio_' })

// ── HTTP ───────────────────────────────────────────────────────────────────
export const httpRequestDuration = new client.Histogram({
  name:       'portfolio_http_request_duration_seconds',
  help:       'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status_code'],
  buckets:    [0.05, 0.1, 0.3, 0.5, 1, 2, 5],
  registers:  [registry],
})

export const httpRequestTotal = new client.Counter({
  name:       'portfolio_http_requests_total',
  help:       'Total HTTP requests',
  labelNames: ['method', 'route', 'status_code'],
  registers:  [registry],
})

export const httpActiveConnections = new client.Gauge({
  name:      'portfolio_http_active_connections',
  help:      'Number of currently open HTTP connections',
  registers: [registry],
})

// ── Database ───────────────────────────────────────────────────────────────
export const dbOperationDuration = new client.Histogram({
  name:       'portfolio_db_operation_duration_seconds',
  help:       'Duration of MongoDB operations in seconds',
  labelNames: ['operation', 'collection'],
  buckets:    [0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1],
  registers:  [registry],
})

export const mongoPoolCheckedOut = new client.Gauge({
  name:      'portfolio_mongo_pool_checked_out',
  help:      'MongoDB connections currently in use',
  registers: [registry],
})

// ── Cache ──────────────────────────────────────────────────────────────────
export const cacheHitTotal = new client.Counter({
  name:       'portfolio_cache_hits_total',
  help:       'Redis cache hits and misses',
  labelNames: ['status', 'key_prefix'],
  registers:  [registry],
})

// ── Jobs ───────────────────────────────────────────────────────────────────
export const jobsTotal = new client.Counter({
  name:       'portfolio_jobs_total',
  help:       'Total background jobs processed',
  labelNames: ['queue', 'status'],
  registers:  [registry],
})

export const queueDepth = new client.Gauge({
  name:       'portfolio_queue_depth',
  help:       'Number of waiting jobs per queue',
  labelNames: ['queue'],
  registers:  [registry],
})

// ── Auth ───────────────────────────────────────────────────────────────────
export const authFailuresTotal = new client.Counter({
  name:       'portfolio_auth_failures_total',
  help:       'Total authentication failures',
  labelNames: ['reason'],
  registers:  [registry],
})

// ── Errors ─────────────────────────────────────────────────────────────────
export const errorsTotal = new client.Counter({
  name:       'portfolio_errors_total',
  help:       'Total errors handled by the global error handler',
  labelNames: ['type'],
  registers:  [registry],
})

// ── File uploads ───────────────────────────────────────────────────────────
export const fileUploadsTotal = new client.Counter({
  name:       'portfolio_file_uploads_total',
  help:       'Total file uploads',
  labelNames: ['type', 'status'],
  registers:  [registry],
})

export const fileUploadBytes = new client.Histogram({
  name:       'portfolio_file_upload_bytes',
  help:       'Size of uploaded files in bytes',
  labelNames: ['type'],
  buckets:    [1024, 10240, 102400, 1_048_576, 10_485_760, 52_428_800],
  registers:  [registry],
})

// ── Rate limiting ──────────────────────────────────────────────────────────
export const rateLimitHitsTotal = new client.Counter({
  name:       'portfolio_rate_limit_hits_total',
  help:       'Total requests rejected by rate limiter',
  labelNames: ['limiter'],
  registers:  [registry],
})

/**
 * Express route handler for GET /metrics.
 *
 * Mounted directly in app.ts BEFORE the rate limiter so Prometheus scraping
 * is never blocked by the global rate limit.
 *
 * Uses a try/catch because register.metrics() is async — Express 4 does NOT
 * catch unhandled promise rejections in route handlers, meaning a rejection
 * would silently produce an empty response with no error logged.
 */
export const metricsHandler: RequestHandler = async (_req, res) => {
  try {
    const output = await registry.metrics()

    // Safety check — log a warning if we somehow get empty output so it's
    // immediately obvious rather than silently confusing Prometheus.
    if (!output || output.trim().length === 0) {
      logger.warn('Metrics endpoint returned empty output — registry may not be initialised')
    }

    res.setHeader('Content-Type', registry.contentType)
    res.send(output)
  } catch (err) {
    logger.error('Failed to collect Prometheus metrics', { error: err })
    res.status(500).send('# Error collecting metrics\n')
  }
}

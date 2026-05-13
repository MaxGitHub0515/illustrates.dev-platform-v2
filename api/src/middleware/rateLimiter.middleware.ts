import rateLimit from 'express-rate-limit'
import { env } from '../config/env'
import { sendError } from '../utils/response'
import { rateLimitHitsTotal } from '../lib/metrics'

export const globalRateLimiter = rateLimit({
  windowMs:       env.RATE_LIMIT_WINDOW_MS,
  max:            env.RATE_LIMIT_MAX,
  standardHeaders: true,
  legacyHeaders:  false,
  keyGenerator:   (req) => req.ip ?? 'unknown',
  handler: (_req, res) => {
    rateLimitHitsTotal.inc({ limiter: 'global' })
    sendError(res, 429, 'TOO_MANY_REQUESTS', 'Too many requests. Please try again later.')
  },
})

export const strictRateLimiter = rateLimit({
  windowMs:       15 * 60 * 1_000,
  max:            20,
  standardHeaders: true,
  legacyHeaders:  false,
  handler: (_req, res) => {
    rateLimitHitsTotal.inc({ limiter: 'strict' })
    sendError(res, 429, 'TOO_MANY_REQUESTS', 'Too many requests. Please try again later.')
  },
})

import { Request, Response, NextFunction } from 'express'
import { AppError } from '../utils/AppError'
import { sendError } from '../utils/response'
import { logger } from '../lib/logger'
import { errorsTotal } from '../lib/metrics'
import * as Sentry from '@sentry/node'

export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction
): void {
  const requestId = req.headers['x-request-id']

  logger.error('Request error', {
    message: err.message,
    stack:   err.stack,
    method:  req.method,
    url:     req.url,
    requestId,
  })

  // ── Operational errors (AppError) — safe to expose ──────────────────────
  if (err instanceof AppError && err.isOperational) {
    errorsTotal.inc({ type: 'operational' })
    sendError(res, err.statusCode, err.code, err.message, err.details)
    return
  }

  // ── Mongoose validation error ────────────────────────────────────────────
  if (err.name === 'ValidationError') {
    errorsTotal.inc({ type: 'validation' })
    sendError(res, 400, 'VALIDATION_ERROR', err.message)
    return
  }

  // ── Mongoose duplicate key (unique index violation) ──────────────────────
  const mongoErr = err as { code?: number; keyValue?: Record<string, unknown> }
  if (mongoErr.code === 11000) {
    errorsTotal.inc({ type: 'conflict' })
    const field = Object.keys(mongoErr.keyValue ?? {})[0] ?? 'field'
    sendError(res, 409, 'CONFLICT', `${field} already exists`)
    return
  }

  // ── Mongoose CastError (invalid ObjectId, type mismatch) ────────────────
  if (err.name === 'CastError') {
    errorsTotal.inc({ type: 'cast' })
    sendError(res, 400, 'BAD_REQUEST', 'Invalid ID format')
    return
  }

  // ── Unknown / unhandled — never expose internals ─────────────────────────
  errorsTotal.inc({ type: 'unhandled' })
  Sentry.captureException(err, { extra: { requestId } })
  sendError(res, 500, 'INTERNAL_ERROR', 'An unexpected error occurred')
}

export function notFoundHandler(req: Request, res: Response): void {
  sendError(res, 404, 'NOT_FOUND', `Route ${req.method} ${req.path} not found`)
}

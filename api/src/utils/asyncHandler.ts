import { Request, Response, NextFunction, RequestHandler } from 'express'

/**
 * Wraps async route handlers so unhandled promise rejections
 * are forwarded to Express's error middleware automatically.
 */
export function asyncHandler(
  fn: (req: Request, res: Response, next: NextFunction) => Promise<unknown>
): RequestHandler {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next)
  }
}

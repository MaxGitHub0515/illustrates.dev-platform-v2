export class AppError extends Error {
  public readonly statusCode: number
  public readonly code: string
  public readonly isOperational: boolean
  public readonly details?: unknown

  constructor(message: string, statusCode = 500, code = 'INTERNAL_ERROR', details?: unknown) {
    super(message)
    this.statusCode = statusCode
    this.code = code
    this.isOperational = true
    this.details = details
    Object.setPrototypeOf(this, new.target.prototype)
    Error.captureStackTrace(this, this.constructor)
  }

  static badRequest(message: string, details?: unknown) {
    return new AppError(message, 400, 'BAD_REQUEST', details)
  }

  static unauthorized(message = 'Unauthorized') {
    return new AppError(message, 401, 'UNAUTHORIZED')
  }

  static forbidden(message = 'Forbidden') {
    return new AppError(message, 403, 'FORBIDDEN')
  }

  static notFound(message: string) {
    return new AppError(message, 404, 'NOT_FOUND')
  }

  static conflict(message: string) {
    return new AppError(message, 409, 'CONFLICT')
  }

  static tooManyRequests(message = 'Too many requests, slow down') {
    return new AppError(message, 429, 'TOO_MANY_REQUESTS')
  }

  static internal(message = 'Internal server error') {
    return new AppError(message, 500, 'INTERNAL_ERROR')
  }
}

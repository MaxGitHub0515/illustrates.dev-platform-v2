import { Request, Response, NextFunction } from 'express'
import { ZodSchema, ZodError } from 'zod'
import { AppError } from '../utils/AppError'

type Target = 'body' | 'query' | 'params'

function formatZodError(error: ZodError) {
  return error.errors.map((e) => ({
    field: e.path.join('.') || 'root',
    message: e.message,
  }))
}

/**
 * Validates a request target (body/query/params) against a Zod schema.
 * On success, replaces the original with the parsed (and coerced) value.
 */
export function validate(schema: ZodSchema, target: Target = 'body') {
  return (req: Request, _res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req[target])

    if (!result.success) {
      const errors = formatZodError(result.error)
      throw AppError.badRequest('Validation failed', errors)
    }

    // Replace with parsed/coerced/defaulted data
    ;(req as Record<string, unknown>)[target] = result.data
    next()
  }
}

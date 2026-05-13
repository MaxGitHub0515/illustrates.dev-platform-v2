import { Response } from 'express'
import { PaginationMeta } from '../types/common.types'

export interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  error?: {
    code: string
    message: string
    details?: unknown
  }
  meta?: PaginationMeta & Record<string, unknown>
}

export function sendSuccess<T>(res: Response, data: T, statusCode = 200): Response {
  const body: ApiResponse<T> = { success: true, data }
  return res.status(statusCode).json(body)
}

export function sendCreated<T>(res: Response, data: T): Response {
  return sendSuccess(res, data, 201)
}

export function sendNoContent(res: Response): Response {
  return res.status(204).end()
}

export function sendPaginated<T>(res: Response, data: T[], meta: PaginationMeta): Response {
  const body: ApiResponse<T[]> = { success: true, data, meta }
  return res.status(200).json(body)
}

export function sendError(
  res: Response,
  statusCode: number,
  code: string,
  message: string,
  details?: unknown
): Response {
  const body: ApiResponse = {
    success: false,
    error: { code, message, ...(details !== undefined && { details }) },
  }
  return res.status(statusCode).json(body)
}

export function buildPaginationMeta(total: number, page: number, limit: number): PaginationMeta {
  return { total, page, limit, totalPages: Math.ceil(total / limit) }
}

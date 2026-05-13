import { Request, Response, NextFunction } from 'express'
import { createClerkClient, verifyToken } from '@clerk/backend'
import { env } from '../config/env'
import { AppError } from '../utils/AppError'
import { asyncHandler } from '../utils/asyncHandler'
import { authFailuresTotal } from '../lib/metrics'
import type { UserRole } from '../types/express.d'

const clerk = createClerkClient({ secretKey: env.CLERK_SECRET_KEY })

export type Permission =
  | 'projects:read'
  | 'projects:write'
  | 'projects:delete'
  | 'discussions:read'
  | 'discussions:write'
  | 'users:read'
  | 'users:manage'

const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  admin: [
    'projects:read', 'projects:write', 'projects:delete',
    'discussions:read', 'discussions:write',
    'users:read', 'users:manage',
  ],
  user: [
    'projects:read', 'projects:write',
    'discussions:read', 'discussions:write',
  ],
}

export const requireAuth = asyncHandler(
  async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
    const token = req.headers.authorization?.replace('Bearer ', '')

    if (!token) {
      authFailuresTotal.inc({ reason: 'no_token' })
      throw AppError.unauthorized('No token provided')
    }

    try {
      console.log('AUTH HEADER:', req.headers.authorization)
      console.log('TOKEN:', token)
      const payload = await verifyToken(token, {
      secretKey: env.CLERK_SECRET_KEY,
      })
      console.log('PAYLOAD:', payload)
      const user = await clerk.users.getUser(payload.sub)
      console.log('USER:', user.id)
      const role = (user.publicMetadata?.role as UserRole) ?? 'user'

      req.auth = { userId: payload.sub, role, sessionId: payload.sid ?? '' }
      next()
    } catch (err) {
      console.error('AUTH ERROR:', err)
      // Distinguish expired tokens from genuinely invalid ones where possible
      const message = err instanceof Error ? err.message : ''
      const reason  = message.toLowerCase().includes('expir') ? 'expired_token' : 'invalid_token'
      authFailuresTotal.inc({ reason })
      throw AppError.unauthorized('Invalid or expired token')
    }
  }
)

export const requireRole =
  (role: UserRole) =>
  (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.auth) { authFailuresTotal.inc({ reason: 'no_token' }); throw AppError.unauthorized() }
    if (req.auth.role !== role) { authFailuresTotal.inc({ reason: 'forbidden' }); throw AppError.forbidden() }
    next()
  }

export const requirePermission =
  (permission: Permission) =>
  (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.auth) { authFailuresTotal.inc({ reason: 'no_token' }); throw AppError.unauthorized() }
    const perms = ROLE_PERMISSIONS[req.auth.role]
    if (!perms.includes(permission)) { authFailuresTotal.inc({ reason: 'forbidden' }); throw AppError.forbidden() }
    next()
  }

export const requireOwnership =
  (getResourceOwnerId: (req: Request) => string) =>
  (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.auth) { authFailuresTotal.inc({ reason: 'no_token' }); throw AppError.unauthorized() }
    if (req.auth.role === 'admin') return next()
    const ownerId = getResourceOwnerId(req)
    if (req.auth.userId !== ownerId) { authFailuresTotal.inc({ reason: 'forbidden' }); throw AppError.forbidden() }
    next()
  }

/**
 * Like requireAuth but NEVER throws.
 * Sets req.auth if the token is valid, skips silently if missing/invalid.
 * Use on public routes that need to behave differently for admins.
 */
export const optionalAuth = asyncHandler(
  async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
    const token = req.headers.authorization?.replace('Bearer ', '')
    if (token) {
      try {
        const payload = await verifyToken(token, {
        secretKey: env.CLERK_SECRET_KEY,
        })
        const user = await clerk.users.getUser(payload.sub)
        const role = (user.publicMetadata?.role as UserRole) ?? 'user'
        req.auth = { userId: payload.sub, role, sessionId: payload.sid ?? '' }
      } catch {
        // Invalid/expired token on a public route — just ignore it
      }
    }
    next()
  }
)

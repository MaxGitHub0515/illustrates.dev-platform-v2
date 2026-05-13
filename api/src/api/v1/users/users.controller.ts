import { Request, Response } from 'express'
import { createClerkClient } from '@clerk/backend'
import { User }     from './users.model'
import { env }      from '../../../config/env'
import { AppError } from '../../../utils/AppError'
import { sendSuccess, sendPaginated } from '../../../utils/response'
import type { UserQuery } from './users.schema'

const clerk = createClerkClient({ secretKey: env.CLERK_SECRET_KEY })

/* ── Public ─────────────────────────────────────────────────────────────────── */
export async function getUserByUsername(req: Request, res: Response): Promise<void> {
  const user = await User.findOne({ username: req.params.username }).select('-__v')
  if (!user) throw AppError.notFound('User not found')
  sendSuccess(res, user)
}

/* ── Authenticated ───────────────────────────────────────────────────────────── */
export async function getMe(req: Request, res: Response): Promise<void> {
  const user = await User.findOne({ clerkId: req.auth!.userId }).select('-__v')
  if (!user) throw AppError.notFound('User not found')
  sendSuccess(res, user)
}

export async function updateMe(req: Request, res: Response): Promise<void> {
  const user = await User.findOneAndUpdate(
    { clerkId: req.auth!.userId },
    { $set: req.body },
    { new: true }
  ).select('-__v')
  if (!user) throw AppError.notFound('User not found')
  sendSuccess(res, user)
}

/* ── Admin ───────────────────────────────────────────────────────────────────── */
export async function getUsers(req: Request, res: Response): Promise<void> {
  const query = req.query as unknown as UserQuery
  const page  = query.page  ?? 1
  const limit = query.limit ?? 20
  const skip  = (page - 1) * limit

  const filter: Record<string, unknown> = {}
  if (query.role)   filter.role   = query.role
  if (query.search) filter.$or    = [
    { username: new RegExp(query.search, 'i') },
    { email:    new RegExp(query.search, 'i') },
  ]

  const [data, total] = await Promise.all([
    User.find(filter).skip(skip).limit(limit).select('-__v').sort('-createdAt'),
    User.countDocuments(filter),
  ])

  sendPaginated(res, data, { total, page, limit, totalPages: Math.ceil(total / limit) })
}

export async function blockUser(req: Request, res: Response): Promise<void> {
  const user = await User.findByIdAndUpdate(
    req.params.id,
    { blocked: true },
    { new: true }
  )
  if (!user) throw AppError.notFound('User not found')
  if (user.clerkId) await clerk.users.banUser(user.clerkId)
  sendSuccess(res, { blocked: true })
}

export async function unblockUser(req: Request, res: Response): Promise<void> {
  const user = await User.findByIdAndUpdate(
    req.params.id,
    { blocked: false },
    { new: true }
  )
  if (!user) throw AppError.notFound('User not found')
  if (user.clerkId) await clerk.users.unbanUser(user.clerkId)
  sendSuccess(res, { blocked: false })
}

export async function promoteUser(req: Request, res: Response): Promise<void> {
  const user = await User.findByIdAndUpdate(
    req.params.id,
    { role: 'admin' },
    { new: true }
  )
  if (!user) throw AppError.notFound('User not found')
  if (user.clerkId) {
    await clerk.users.updateUser(user.clerkId, {
      publicMetadata: { role: 'admin' }
    })
  }
  sendSuccess(res, { role: 'admin' })
}

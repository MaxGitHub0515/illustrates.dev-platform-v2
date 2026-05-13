import { Router } from 'express'
import { validate } from '../../../middleware/validate.middleware'
import { requireAuth, requireRole } from '../../../middleware/auth.middleware'
import { asyncHandler } from '../../../utils/asyncHandler'
import {
  getUsers, getUserByUsername, getMe, updateMe,
  blockUser, unblockUser, promoteUser,
} from './users.controller'
import { updateProfileSchema, userQuerySchema } from './users.schema'

const router = Router()

// Admin: list all users
router.get('/',  requireAuth, requireRole('admin'), validate(userQuerySchema, 'query'), asyncHandler(getUsers))

// Admin: block / unblock / promote
router.post('/:id/block',   requireAuth, requireRole('admin'), asyncHandler(blockUser))
router.post('/:id/unblock', requireAuth, requireRole('admin'), asyncHandler(unblockUser))
router.post('/:id/promote', requireAuth, requireRole('admin'), asyncHandler(promoteUser))

// Self
router.get  ('/me',   requireAuth, asyncHandler(getMe))
router.patch('/me',   requireAuth, validate(updateProfileSchema), asyncHandler(updateMe))

// Public: profile by username
router.get('/:username', asyncHandler(getUserByUsername))

export { router as usersRouter }

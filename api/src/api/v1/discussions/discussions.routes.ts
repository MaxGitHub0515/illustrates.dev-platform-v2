import { Router } from 'express'
import { validate } from '../../../middleware/validate.middleware'
import { requireAuth, requirePermission } from '../../../middleware/auth.middleware'
import { strictRateLimiter } from '../../../middleware/rateLimiter.middleware'
import { asyncHandler } from '../../../utils/asyncHandler'
import {
  getThreads,
  getThread,
  createThread,
  updateThread,
  deleteThread,
  getReplies,
  createReply,
  markAccepted,
} from './discussions.controller'
import {
  createThreadSchema,
  createReplySchema,
  updateDiscussionSchema,
  discussionQuerySchema,
  discussionParamsSchema,
} from './discussions.schema'

const router = Router()

// ── Threads ───────────────────────────────────────────────────────────────
router.get('/',    validate(discussionQuerySchema, 'query'), asyncHandler(getThreads))
router.get('/:id', validate(discussionParamsSchema, 'params'), asyncHandler(getThread))

router.post(
  '/',
  requireAuth,
  requirePermission('discussions:write'),
  strictRateLimiter,
  validate(createThreadSchema),
  asyncHandler(createThread)
)

router.patch(
  '/:id',
  requireAuth,
  validate(discussionParamsSchema, 'params'),
  validate(updateDiscussionSchema),
  asyncHandler(updateThread)
)

router.delete(
  '/:id',
  requireAuth,
  validate(discussionParamsSchema, 'params'),
  asyncHandler(deleteThread)
)

// ── Replies ───────────────────────────────────────────────────────────────
router.get(
  '/:id/replies',
  validate(discussionParamsSchema, 'params'),
  asyncHandler(getReplies)
)

router.post(
  '/:id/replies',
  requireAuth,
  requirePermission('discussions:write'),
  validate(discussionParamsSchema, 'params'),
  validate(createReplySchema),
  asyncHandler(createReply)
)

router.patch(
  '/replies/:replyId/accept',
  requireAuth,
  asyncHandler(markAccepted)
)

// User's own threads (used by dashboard)
router.get('/me',
  requireAuth,
  asyncHandler(async (req, res) => {
    // const { DiscussionService } = await import('./discussions.service')
    const { sendPaginated } = await import('../../../utils/response')
    // const mongoose = (await import('mongoose')).default
    const { Discussion } = await import('./discussions.model')
    const { trackDb } = await import('../../../lib/db')
    const { buildPaginationMeta } = await import('../../../utils/response')
    const page  = Number(req.query.page)  || 1
    const limit = Number(req.query.limit) || 20
    const skip  = (page - 1) * limit
    const filter = { authorId: req.auth!.userId, parentId: null }
    const [data, total] = await Promise.all([
      trackDb('find', 'discussions', () =>
        Discussion.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean()
      ),
      trackDb('countDocuments', 'discussions', () => Discussion.countDocuments(filter)),
    ])
    sendPaginated(res, data, buildPaginationMeta(total, page, limit))
  })
)

export { router as discussionsRouter }

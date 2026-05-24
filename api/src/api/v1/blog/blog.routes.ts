import { Router }   from 'express'
import { validate } from '../../../middleware/validate.middleware'
import { requireAuth, optionalAuth } from '../../../middleware/auth.middleware'
import { asyncHandler } from '../../../utils/asyncHandler'
import {
  getPosts, getPostBySlug, getMyDraft,
  createPost, updatePost, deletePost,
} from './blog.controller'
import {
  createBlogPostSchema, updateBlogPostSchema,
  blogQuerySchema, blogParamsSchema, blogIdParamsSchema,
} from './blog.schema'
import { uploadMiddleware, uploadBlogImage } from './blog.upload'

const router = Router()

// ── Image upload ────────────────────────────────────────────────────────────
router.post('/upload-image',
  requireAuth,
  uploadMiddleware,
  asyncHandler(uploadBlogImage)
)

// ── Static segments first ───────────────────────────────────────────────────
router.get('/drafts/:id',
  requireAuth,
  validate(blogIdParamsSchema, 'params'),
  asyncHandler(getMyDraft)
)

// ── Public ──────────────────────────────────────────────────────────────────
router.get('/',      optionalAuth, validate(blogQuerySchema,  'query'),  asyncHandler(getPosts))
router.get('/:slug', optionalAuth, validate(blogParamsSchema, 'params'), asyncHandler(getPostBySlug))

// ── Authenticated ───────────────────────────────────────────────────────────
router.post('/',    requireAuth, validate(createBlogPostSchema), asyncHandler(createPost))
router.patch('/:id',  requireAuth, validate(blogIdParamsSchema, 'params'), validate(updateBlogPostSchema), asyncHandler(updatePost))
router.delete('/:id', requireAuth, validate(blogIdParamsSchema, 'params'), asyncHandler(deletePost))

export { router as blogRouter }

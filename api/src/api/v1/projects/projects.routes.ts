import { Router } from 'express'
import multer from 'multer'
import { validate } from '../../../middleware/validate.middleware'
import { requireAuth, requirePermission, optionalAuth } from '../../../middleware/auth.middleware'
import { strictRateLimiter } from '../../../middleware/rateLimiter.middleware'
import { asyncHandler } from '../../../utils/asyncHandler'
import {
  getProjects, getProject, getMyProjects,
  createProject, updateProject, deleteProject, uploadProjectFile,
} from './projects.controller'
import {
  createProjectSchema, updateProjectSchema,
  projectQuerySchema, projectParamsSchema,
} from './projects.schema'

const router = Router()
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 50 * 1024 * 1024 } })

// ── Static segments MUST come before parameterised ones ────────────────────
router.get('/me',
  requireAuth,
  validate(projectQuerySchema, 'query'),
  asyncHandler(getMyProjects)
)

// ── Public ─────────────────────────────────────────────────────────────────
router.get('/', optionalAuth, validate(projectQuerySchema, 'query'), asyncHandler(getProjects))
router.get('/:id', optionalAuth, validate(projectParamsSchema, 'params'), asyncHandler(getProject))

// ── Authenticated ──────────────────────────────────────────────────────────
router.post('/',
  requireAuth,
  requirePermission('projects:write'),
  strictRateLimiter,
  validate(createProjectSchema),
  asyncHandler(createProject)
)
router.patch('/:id',
  requireAuth,
  validate(projectParamsSchema, 'params'),
  validate(updateProjectSchema),
  asyncHandler(updateProject)
)
router.delete('/:id',
  requireAuth,
  validate(projectParamsSchema, 'params'),
  asyncHandler(deleteProject)
)
router.post('/:id/files',
  requireAuth,
  validate(projectParamsSchema, 'params'),
  upload.single('file'),
  asyncHandler(uploadProjectFile)
)

export { router as projectsRouter }

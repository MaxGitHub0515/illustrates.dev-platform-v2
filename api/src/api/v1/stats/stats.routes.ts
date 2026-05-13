import { Router } from 'express'
import { requireAuth, requireRole } from '../../../middleware/auth.middleware'
import { asyncHandler } from '../../../utils/asyncHandler'
import { getStats } from './stats.controller'

const router = Router()

router.get('/', requireAuth, requireRole('admin'), asyncHandler(getStats))

export { router as statsRouter }

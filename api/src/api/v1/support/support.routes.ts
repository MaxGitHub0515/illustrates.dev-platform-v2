import { Router } from 'express'
import { validate } from '../../../middleware/validate.middleware'
import { strictRateLimiter } from '../../../middleware/rateLimiter.middleware'
import { asyncHandler } from '../../../utils/asyncHandler'
import { submitSupportRequest } from './support.controller'
import { supportRequestSchema } from './support.schema'

const router = Router()

// Strict rate limit — prevents form spam
router.post(
  '/',
  strictRateLimiter,
  validate(supportRequestSchema),
  asyncHandler(submitSupportRequest)
)

export { router as supportRouter }

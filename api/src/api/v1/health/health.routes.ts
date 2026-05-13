import { Router } from 'express'
import { asyncHandler } from '../../../utils/asyncHandler'
import { healthCheck } from './health.controller'

const router = Router()

router.get('/', asyncHandler(healthCheck))

export { router as healthRouter }

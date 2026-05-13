import { Router, Request, Response } from 'express'
import express from 'express'
import { Webhook } from 'svix'
import { env } from '../config/env'
import { logger } from '../lib/logger'
import { sendSuccess, sendError } from '../utils/response'
import { UserService } from '../api/v1/users/users.service'

interface ClerkWebhookEvent {
  type: string
  data: {
    id:             string
    username?:      string | null
    email_addresses: { email_address: string }[]
    first_name?:    string | null
    last_name?:     string | null
    image_url?:     string
  }
}

const router = Router()

router.post('/', express.raw({ type: 'application/json' }), async (req: Request, res: Response) => {
  const svixId        = req.headers['svix-id'] as string
  const svixTimestamp = req.headers['svix-timestamp'] as string
  const svixSignature = req.headers['svix-signature'] as string

  if (!svixId || !svixTimestamp || !svixSignature) {
    sendError(res, 400, 'BAD_REQUEST', 'Missing Svix headers')
    return
  }

  if (!env.CLERK_WEBHOOK_SECRET) {
    logger.warn('Clerk webhook received but CLERK_WEBHOOK_SECRET not set — ignoring')
    sendSuccess(res, { received: false, reason: 'webhook_not_configured' })
    return
  }
  const wh = new Webhook(env.CLERK_WEBHOOK_SECRET)
  let event: ClerkWebhookEvent

  try {
    event = wh.verify(req.body as Buffer, {
      'svix-id':        svixId,
      'svix-timestamp': svixTimestamp,
      'svix-signature': svixSignature,
    }) as ClerkWebhookEvent
  } catch (error) {
    logger.warn('Clerk webhook signature verification failed', { error })
    sendError(res, 400, 'BAD_REQUEST', 'Invalid webhook signature')
    return
  }

  logger.info('Clerk webhook', { type: event.type, clerkId: event.data.id })

  try {
    const clerkUser = {
      id:             event.data.id,
      username:       event.data.username,
      emailAddresses: event.data.email_addresses.map((e) => ({ emailAddress: e.email_address })),
      firstName:      event.data.first_name,
      lastName:       event.data.last_name,
      imageUrl:       event.data.image_url,
    }

    switch (event.type) {
      case 'user.created':
        await UserService.syncFromClerk(clerkUser)
        break

      case 'user.updated':
        await UserService.updateFromClerk(clerkUser)
        break

      case 'user.deleted':
        await UserService.handleDeletion(event.data.id)
        break

      default:
        logger.debug('Unhandled Clerk webhook type', { type: event.type })
    }
  } catch (error) {
    // Return 200 so Clerk doesn't retry — log for investigation
    logger.error('Error processing Clerk webhook', { type: event.type, error })
  }

  sendSuccess(res, { received: true })
})

export { router as clerkWebhookRouter }

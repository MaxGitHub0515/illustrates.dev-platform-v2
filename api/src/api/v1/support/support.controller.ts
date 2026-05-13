import { Request, Response } from 'express'
import { sendSuccess } from '../../../utils/response'
import { emailQueue } from '../../../jobs/queues'
import { env } from '../../../config/env'
import { logger } from '../../../lib/logger'
import type { SupportRequestDto } from './support.schema'

export async function submitSupportRequest(req: Request, res: Response): Promise<void> {
  const data = req.body as SupportRequestDto

  await emailQueue.add('support-request', {
    to:       env.SUPPORT_EMAIL,           // configured in .env (SUPPORT_EMAIL)
    subject:  `[${data.type.toUpperCase()}] ${data.subject}`,
    template: 'support-request',
    variables: {
      name:    data.name,
      email:   data.email,
      type:    data.type,
      subject: data.subject,
      message: data.message,
    },
  })

  logger.info('Support request received', { type: data.type, from: data.email })

  sendSuccess(res, {
    message: 'Your request has been received. We will get back to you within 24 hours.',
  })
}

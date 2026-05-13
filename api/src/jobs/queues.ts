import { Queue } from 'bullmq'
import { bullMQRedis } from '../lib/redis'

const connection = bullMQRedis

// ── Queue definitions ──────────────────────────────────────────────────────
export const fileProcessorQueue = new Queue('file-processor', {
  connection,
  defaultJobOptions: {
    attempts: 3,
    backoff: { type: 'exponential', delay: 2_000 },
    removeOnComplete: { count: 100 },
    removeOnFail: { count: 500 },
  },
})

export const notificationQueue = new Queue('notifications', {
  connection,
  defaultJobOptions: {
    attempts: 3,
    backoff: { type: 'fixed', delay: 5_000 },
    removeOnComplete: { count: 50 },
    removeOnFail: { count: 200 },
  },
})

export const emailQueue = new Queue('emails', {
  connection,
  defaultJobOptions: {
    attempts: 5,
    backoff: { type: 'exponential', delay: 5_000 },
    removeOnComplete: { count: 50 },
    removeOnFail: { count: 200 },
  },
})

// ── Job payload types ──────────────────────────────────────────────────────
export type FileProcessorJobData = {
  fileKey: string
  userId: string
  projectId: string
  type: 'image' | 'document'
  originalName: string
  mimeType: string
}

export type NotificationJobData = {
  recipientId: string
  type: 'new_comment' | 'project_liked' | 'new_follower' | 'project_approved'
  payload: Record<string, unknown>
}

export type EmailJobData = {
  to: string
  subject: string
  template: string
  variables: Record<string, unknown>
}

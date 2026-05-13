import { Worker, Job } from 'bullmq'
import { bullMQRedis } from '../../lib/redis'
import { logger } from '../../lib/logger'
import { workerRegistry } from '../registry'
import { jobsTotal } from '../../lib/metrics'
import type { NotificationJobData } from '../queues'

const worker = new Worker<NotificationJobData>(
  'notifications',
  async (job: Job<NotificationJobData>) => {
    const { recipientId, type, payload } = job.data
    logger.info('Processing notification', { jobId: job.id, type, recipientId })

    // TODO: persist to notifications collection in MongoDB
    // TODO: push via WebSocket if recipient is online

    jobsTotal.inc({ queue: 'notifications', status: 'completed' })
    return { sent: true, type, recipientId, payload }
  },
  {
    connection: bullMQRedis,
    concurrency: 10,
  }
)

worker.on('failed', (job, error) => {
  logger.error('Notification job failed', { jobId: job?.id, error: error.message })
  jobsTotal.inc({ queue: 'notifications', status: 'failed' })
})

workerRegistry.register(worker)

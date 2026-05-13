import { Worker, Job } from 'bullmq'
import { bullMQRedis } from '../../lib/redis'
import { logger } from '../../lib/logger'
import { workerRegistry } from '../registry'
import { jobsTotal } from '../../lib/metrics'
import type { FileProcessorJobData } from '../queues'

const worker = new Worker<FileProcessorJobData>(
  'file-processor',
  async (job: Job<FileProcessorJobData>) => {
    const { fileKey, type, userId, projectId } = job.data
    logger.info('Processing file job', { jobId: job.id, fileKey, type })

    await job.updateProgress(10)

    if (type === 'image') {
      // TODO: resize to multiple sizes, generate thumbnail, strip EXIF
      logger.info('Image processing', { fileKey, userId })
    } else {
      // TODO: extract text content, generate preview
      logger.info('Document processing', { fileKey, projectId })
    }

    await job.updateProgress(100)
    jobsTotal.inc({ queue: 'file-processor', status: 'completed' })
    return { processed: true, fileKey }
  },
  {
    connection: bullMQRedis,
    concurrency: 3,
  }
)

worker.on('failed', (job, error) => {
  logger.error('File processor job failed', { jobId: job?.id, error: error.message })
  jobsTotal.inc({ queue: 'file-processor', status: 'failed' })
})

worker.on('completed', (job) => {
  logger.debug('File processor job completed', { jobId: job.id })
})

// Self-registers so server.ts can just import this file
workerRegistry.register(worker)

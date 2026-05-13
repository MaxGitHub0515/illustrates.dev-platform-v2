import { fileProcessorQueue, notificationQueue, emailQueue } from './queues'
import { queueDepth } from '../lib/metrics'
import { logger } from '../lib/logger'

const QUEUES = [
  { name: 'file-processor',  queue: fileProcessorQueue },
  { name: 'notifications',   queue: notificationQueue },
  { name: 'emails',          queue: emailQueue },
]

async function collectQueueDepths(): Promise<void> {
  await Promise.all(
    QUEUES.map(async ({ name, queue }) => {
      try {
        const count = await queue.getWaitingCount()
        queueDepth.set({ queue: name }, count)
      } catch (err) {
        // Redis may be momentarily unreachable — skip, don't crash
        logger.warn('Failed to collect queue depth', { queue: name, error: err })
      }
    })
  )
}

/**
 * Starts a 30-second interval that polls BullMQ queue depths
 * and records them as Prometheus gauges.
 * Returns the interval handle so tests can clear it.
 */
export function startQueueDepthCollector(intervalMs = 30_000): NodeJS.Timeout {
  // Collect immediately on start
  collectQueueDepths().catch(() => undefined)
  return setInterval(() => collectQueueDepths().catch(() => undefined), intervalMs)
}

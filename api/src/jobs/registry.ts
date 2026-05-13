import { Worker } from 'bullmq'
import { logger } from '../lib/logger'

/**
 * Central registry for all BullMQ workers.
 * Workers register themselves on import (side-effect driven).
 * Shutdown calls closeAll() to drain in-flight jobs gracefully.
 */
class WorkerRegistry {
  private readonly workers: Map<string, Worker> = new Map()

  register(worker: Worker): void {
    this.workers.set(worker.name, worker)
    logger.info(`Worker registered: ${worker.name}`)
  }

  async closeAll(): Promise<void> {
    const names = [...this.workers.keys()]
    logger.info(`Closing ${names.length} worker(s): ${names.join(', ')}`)
    await Promise.all([...this.workers.values()].map((w) => w.close()))
    logger.info('All workers closed')
  }
}

export const workerRegistry = new WorkerRegistry()

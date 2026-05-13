import { Server } from 'http'
import { disconnectDB } from '../lib/db'
import { disconnectRedis } from '../lib/redis'
import { logger } from '../lib/logger'
import { workerRegistry } from '../jobs/registry'

const FORCE_EXIT_TIMEOUT_MS = 30_000

export function setupGracefulShutdown(server: Server): void {
  const shutdown = async (signal: string): Promise<void> => {
    logger.info(`${signal} received — starting graceful shutdown`)

    // Stop accepting new connections
    server.close(async (err) => {
      if (err) {
        logger.error('Error closing HTTP server', { error: err })
        process.exit(1)
      }

      logger.info('HTTP server closed')

      try {
        // Close BullMQ workers first (let in-progress jobs finish)
        await workerRegistry.closeAll()

        // Then disconnect from data stores
        await Promise.all([disconnectDB(), disconnectRedis()])

        logger.info('Graceful shutdown complete')
        process.exit(0)
      } catch (error) {
        logger.error('Error during shutdown cleanup', { error })
        process.exit(1)
      }
    })

    // Hard exit if graceful shutdown takes too long
    setTimeout(() => {
      logger.error(`Forced exit after ${FORCE_EXIT_TIMEOUT_MS}ms timeout`)
      process.exit(1)
    }, FORCE_EXIT_TIMEOUT_MS).unref()
  }

  process.on('SIGTERM', () => shutdown('SIGTERM'))
  process.on('SIGINT', () => shutdown('SIGINT'))

  process.on('uncaughtException', (error) => {
    logger.error('Uncaught exception', { error })
    shutdown('uncaughtException')
  })

  process.on('unhandledRejection', (reason) => {
    logger.error('Unhandled promise rejection', { reason })
    shutdown('unhandledRejection')
  })
}

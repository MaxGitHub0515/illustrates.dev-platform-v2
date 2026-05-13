import { Redis } from 'ioredis'
import { env } from '../config/env'
import { logger } from './logger'

function createRedisClient(label: string): Redis {
  const client = new Redis({
    host: env.REDIS_HOST,
    port: env.REDIS_PORT,
    password: env.REDIS_PASSWORD,
    // BullMQ requires this to be null
    maxRetriesPerRequest: null,
    retryStrategy: (times) => {
      if (times > 10) return null
      return Math.min(times * 200, 3_000)
    },
    lazyConnect: true,
  })

  client.on('connect', () => logger.info(`Redis [${label}] connected`))
  client.on('error', (error) => logger.error(`Redis [${label}] error`, { error }))
  client.on('close', () => logger.warn(`Redis [${label}] connection closed`))

  return client
}

// General-purpose cache client
export const redis = createRedisClient('cache')

// Dedicated connection for BullMQ (must not be shared with pub/sub or blocking ops)
export const bullMQRedis = createRedisClient('bullmq')

export async function disconnectRedis(): Promise<void> {
  await redis.quit()
  await bullMQRedis.quit()
  logger.info('Redis connections closed')
}

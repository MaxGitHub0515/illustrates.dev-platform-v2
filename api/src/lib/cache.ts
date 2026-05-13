import { redis } from './redis'
import { cacheHitTotal } from './metrics'
import { logger } from './logger'

/**
 * Get-or-set cache helper. Tracks hit/miss in Prometheus automatically.
 *
 * @param key      Full Redis key (e.g. 'project:64f1a2b3...')
 * @param prefix   Short label for the metric (e.g. 'project', 'blog')
 * @param ttl      TTL in seconds
 * @param fetcher  Called on cache miss to get the real value
 */
export async function getOrSet<T>(
  key: string,
  prefix: string,
  ttl: number,
  fetcher: () => Promise<T>
): Promise<T> {
  try {
    const cached = await redis.get(key)
    if (cached !== null) {
      cacheHitTotal.inc({ status: 'hit', key_prefix: prefix })
      return JSON.parse(cached) as T
    }
  } catch (err) {
    // Redis down — degrade gracefully, don't block the request
    logger.warn('Cache read failed', { key, error: err })
  }

  cacheHitTotal.inc({ status: 'miss', key_prefix: prefix })
  const value = await fetcher()

  try {
    await redis.setex(key, ttl, JSON.stringify(value))
  } catch (err) {
    logger.warn('Cache write failed', { key, error: err })
  }

  return value
}

export async function invalidate(...keys: string[]): Promise<void> {
  if (keys.length === 0) return
  try {
    await redis.del(...keys)
  } catch (err) {
    logger.warn('Cache invalidation failed', { keys, error: err })
  }
}

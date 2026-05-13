import { Request, Response } from 'express'
import mongoose from 'mongoose'
import { redis } from '../../../lib/redis'
import { sendSuccess } from '../../../utils/response'

export async function healthCheck(_req: Request, res: Response): Promise<void> {
  const mongoOk = mongoose.connection.readyState === 1

  let redisOk = false
  try {
    const pong = await redis.ping()
    redisOk = pong === 'PONG'
  } catch {
    redisOk = false
  }

  const healthy = mongoOk && redisOk

  sendSuccess(
    res,
    {
      status: healthy ? 'ok' : 'degraded',
      timestamp: new Date().toISOString(),
      uptime: Math.floor(process.uptime()),
      version: process.env.npm_package_version ?? '1.0.0',
      services: {
        mongo: mongoOk ? 'ok' : 'down',
        redis: redisOk ? 'ok' : 'down',
      },
    },
    healthy ? 200 : 503
  )
}

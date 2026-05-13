import mongoose from 'mongoose'
import { env } from '../config/env'
import { logger } from './logger'
import { dbOperationDuration, mongoPoolCheckedOut } from './metrics'

export async function connectDB(): Promise<void> {
  try {
    mongoose.set('strictQuery', true)
    await mongoose.connect(env.MONGODB_URI)
    logger.info('MongoDB connected', { host: mongoose.connection.host })

    // Pool metrics
    mongoose.connection.on('connectionCheckedOut', () => mongoPoolCheckedOut.inc())
    mongoose.connection.on('connectionCheckedIn',  () => mongoPoolCheckedOut.dec())
  } catch (error) {
    logger.error('MongoDB connection failed', { error })
    process.exit(1)
  }
}

export async function disconnectDB(): Promise<void> {
  await mongoose.disconnect()
  logger.info('MongoDB disconnected')
}

/**
 * Wraps a Mongoose operation and records its duration in Prometheus.
 *
 * Usage:
 *   const result = await trackDb('findOne', 'projects', () => Project.findById(id))
 */
export async function trackDb<T>(
  operation: string,
  collection: string,
  fn: () => Promise<T>
): Promise<T> {
  const end = dbOperationDuration.startTimer({ operation, collection })
  try {
    return await fn()
  } finally {
    end()
  }
}

mongoose.connection.on('error', (error) => {
  logger.error('MongoDB runtime error', { error })
})

mongoose.connection.on('disconnected', () => {
  logger.warn('MongoDB disconnected unexpectedly')
})

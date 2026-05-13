import { app, httpActiveConnections } from './app'
import { connectDB } from './lib/db'
import { env } from './config/env'
import { logger } from './lib/logger'
import { setupGracefulShutdown } from './utils/shutdown'
import { startQueueDepthCollector } from './jobs/queueDepthCollector'
import type { Socket } from 'net'

import './jobs/workers/fileProcessor.worker'
import './jobs/workers/notification.worker'
import './jobs/workers/email.worker'

async function bootstrap(): Promise<void> {
  await connectDB()

  const server = app.listen(env.PORT, () => {
    logger.info('Server running', {
      port: env.PORT,
      env:  env.NODE_ENV,
      api:  `/api/${env.API_VERSION}`,
      docs: `/api/${env.API_VERSION}/docs`,
    })
  })

  // Track open HTTP connections for Prometheus.
  // IMPORTANT: server.on('close') fires ONCE when the server itself shuts down —
  // not per individual connection. To track active connections correctly we must
  // listen on each socket's own 'close' event.
  server.on('connection', (socket: Socket) => {
    httpActiveConnections.inc()
    socket.once('close', () => httpActiveConnections.dec())
  })

  startQueueDepthCollector()
  setupGracefulShutdown(server)
}

bootstrap().catch((error) => {
  console.error('Failed to bootstrap server:', error)
  process.exit(1)
})

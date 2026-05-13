import mongoose from 'mongoose'
import { MongoMemoryServer } from 'mongodb-memory-server'

let mongoServer: MongoMemoryServer

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create()
  await mongoose.connect(mongoServer.getUri())
})

afterAll(async () => {
  await mongoose.disconnect()
  await mongoServer.stop()
})

afterEach(async () => {
  // Clean all collections between tests for isolation
  const collections = mongoose.connection.collections
  await Promise.all(
    Object.values(collections).map((c) => c.deleteMany({}))
  )
})

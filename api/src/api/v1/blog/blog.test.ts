import request from 'supertest'
import { app } from '../../../app'

describe('Blog API', () => {
  describe('GET /api/v1/blog', () => {
    it('returns paginated posts', async () => {
      const res = await request(app).get('/api/v1/blog').expect(200)
      expect(res.body.success).toBe(true)
      expect(Array.isArray(res.body.data)).toBe(true)
    })
  })

  describe('GET /api/v1/blog/:slug', () => {
    it('returns 404 for unknown slug', async () => {
      const res = await request(app).get('/api/v1/blog/this-post-does-not-exist').expect(404)
      expect(res.body.error.code).toBe('NOT_FOUND')
    })
  })

  describe('POST /api/v1/blog', () => {
    it('returns 401 without auth', async () => {
      const res = await request(app)
        .post('/api/v1/blog')
        .send({ title: 'Test', description: 'Desc', body: 'Content' })
        .expect(401)
      expect(res.body.error.code).toBe('UNAUTHORIZED')
    })
  })
})

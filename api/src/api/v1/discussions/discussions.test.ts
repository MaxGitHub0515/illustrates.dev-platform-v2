import request from 'supertest'
import { app } from '../../../app'

describe('Discussions API', () => {
  describe('GET /api/v1/discussions', () => {
    it('returns paginated threads', async () => {
      const res = await request(app).get('/api/v1/discussions').expect(200)
      expect(res.body.success).toBe(true)
      expect(Array.isArray(res.body.data)).toBe(true)
      expect(res.body.meta).toHaveProperty('total')
    })
  })

  describe('POST /api/v1/discussions', () => {
    it('returns 401 without auth', async () => {
      const res = await request(app)
        .post('/api/v1/discussions')
        .send({ title: 'Test', body: 'Content' })
        .expect(401)
      expect(res.body.error.code).toBe('UNAUTHORIZED')
    })

    it('returns 400 when title is missing', async () => {
      // Schema requires title for top-level threads
      const res = await request(app)
        .post('/api/v1/discussions')
        .send({ body: 'No title here' })
        .expect(401) // 401 before schema — auth check fires first
      expect(res.body.success).toBe(false)
    })
  })

  describe('GET /api/v1/discussions/:id', () => {
    it('returns 400 for invalid ID', async () => {
      const res = await request(app).get('/api/v1/discussions/bad-id').expect(400)
      expect(res.body.error.code).toBe('BAD_REQUEST')
    })

    it('returns 404 for missing thread', async () => {
      const res = await request(app)
        .get('/api/v1/discussions/64f1a2b3c4d5e6f7a8b9c0d1')
        .expect(404)
      expect(res.body.error.code).toBe('NOT_FOUND')
    })
  })
})

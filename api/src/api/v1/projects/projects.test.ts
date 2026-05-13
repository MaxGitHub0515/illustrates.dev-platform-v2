import request from 'supertest'
import { app } from '../../../app'

describe('Projects API', () => {
  describe('GET /api/v1/projects', () => {
    it('returns 200 with paginated response shape', async () => {
      const res = await request(app).get('/api/v1/projects').expect(200)

      expect(res.body.success).toBe(true)
      expect(Array.isArray(res.body.data)).toBe(true)
      expect(res.body.meta).toMatchObject({
        page: 1,
        limit: 20,
        total: expect.any(Number),
        totalPages: expect.any(Number),
      })
    })

    it('rejects page=0 with 400', async () => {
      const res = await request(app).get('/api/v1/projects?page=0').expect(400)

      expect(res.body.success).toBe(false)
      expect(res.body.error.code).toBe('BAD_REQUEST')
      expect(res.body.error.details).toBeDefined()
    })

    it('rejects limit > 100 with 400', async () => {
      const res = await request(app).get('/api/v1/projects?limit=200').expect(400)

      expect(res.body.success).toBe(false)
    })
  })

  describe('GET /api/v1/projects/:id', () => {
    it('returns 400 for invalid ObjectId format', async () => {
      const res = await request(app).get('/api/v1/projects/not-an-id').expect(400)

      expect(res.body.success).toBe(false)
      expect(res.body.error.code).toBe('BAD_REQUEST')
    })

    it('returns 404 for non-existent project', async () => {
      const res = await request(app)
        .get('/api/v1/projects/64f1a2b3c4d5e6f7a8b9c0d1')
        .expect(404)

      expect(res.body.success).toBe(false)
      expect(res.body.error.code).toBe('NOT_FOUND')
    })
  })

  describe('POST /api/v1/projects', () => {
    it('rejects unauthenticated requests with 401', async () => {
      const res = await request(app)
        .post('/api/v1/projects')
        .send({ title: 'Test', description: 'Desc', body: 'Body' })
        .expect(401)

      expect(res.body.success).toBe(false)
      expect(res.body.error.code).toBe('UNAUTHORIZED')
    })
  })
})

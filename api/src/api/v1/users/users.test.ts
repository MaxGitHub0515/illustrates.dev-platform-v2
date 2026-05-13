import request from 'supertest'
import { app } from '../../../app'

describe('Users API', () => {
  describe('GET /api/v1/users/me', () => {
    it('returns 401 without auth', async () => {
      const res = await request(app).get('/api/v1/users/me').expect(401)
      expect(res.body.success).toBe(false)
      expect(res.body.error.code).toBe('UNAUTHORIZED')
    })
  })

  describe('GET /api/v1/users/:username', () => {
    it('returns 404 for unknown username', async () => {
      const res = await request(app).get('/api/v1/users/ghost-user-xyz').expect(404)
      expect(res.body.success).toBe(false)
      expect(res.body.error.code).toBe('NOT_FOUND')
    })
  })
})

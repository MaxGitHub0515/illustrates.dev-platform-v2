export type UserRole = 'admin' | 'user'

declare global {
  namespace Express {
    interface Request {
      auth?: {
        userId: string
        role: UserRole
        sessionId: string
      }
    }
  }
}

import { z } from 'zod'

export const updateProfileSchema = z.object({
  firstName: z.string().max(50).trim().optional(),
  lastName:  z.string().max(50).trim().optional(),
  bio:       z.string().max(500).trim().optional(),
  website:   z.string().url().optional().or(z.literal('')),
  github:    z.string().max(100).trim().optional(),
  twitter:   z.string().max(100).trim().optional(),
})

export const userQuerySchema = z.object({
  page:   z.coerce.number().min(1).default(1),
  limit:  z.coerce.number().min(1).max(100).default(20),
  role:   z.enum(['admin', 'user']).optional(),
  search: z.string().optional(),
})

export const userParamsSchema = z.object({
  id: z.string().min(1),   // accepts either Mongo _id or Clerk ID
})

export type UpdateProfileDto = z.infer<typeof updateProfileSchema>
export type UserQuery        = z.infer<typeof userQuerySchema>

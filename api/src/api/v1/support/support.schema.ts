import { z } from 'zod'

export const supportRequestSchema = z.object({
  name:    z.string().min(1).max(100).trim(),
  email:   z.string().email().max(254).toLowerCase().trim(),
  subject: z.string().min(1).max(200).trim(),
  message: z.string().min(10).max(5_000).trim(),
  type:    z.enum(['bug', 'feature', 'general', 'billing']).default('general'),
})

export type SupportRequestDto = z.infer<typeof supportRequestSchema>

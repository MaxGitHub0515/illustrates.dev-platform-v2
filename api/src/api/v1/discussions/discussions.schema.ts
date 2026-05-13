import { z } from 'zod'

export const createThreadSchema = z.object({
  title:     z.string().min(1).max(300).trim(),
  body:      z.string().min(1).max(10_000).trim(),
  projectId: z.string().regex(/^[a-f\d]{24}$/i).optional(),
  tags:      z.array(z.string().trim().toLowerCase()).max(5).optional().default([]),
})

export const createReplySchema = z.object({
  body: z.string().min(1).max(10_000).trim(),
})

export const updateDiscussionSchema = z.object({
  title:  z.string().min(1).max(300).trim().optional(),
  body:   z.string().min(1).max(10_000).trim().optional(),
  status: z.enum(['open', 'closed', 'locked']).optional(),
  tags:   z.array(z.string()).max(5).optional(),
})

export const discussionQuerySchema = z.object({
  page:      z.coerce.number().min(1).default(1),
  limit:     z.coerce.number().min(1).max(100).default(20),
  projectId: z.string().regex(/^[a-f\d]{24}$/i).optional(),
  tag:       z.string().optional(),
  search:    z.string().optional(),
  status:    z.enum(['open', 'closed', 'locked']).optional(),
  sort:      z.enum(['createdAt', 'likeCount', 'replyCount']).default('createdAt'),
  order:     z.enum(['asc', 'desc']).default('desc'),
})

export const discussionParamsSchema = z.object({
  id: z.string().regex(/^[a-f\d]{24}$/i, 'Invalid discussion ID'),
})

export type CreateThreadDto      = z.infer<typeof createThreadSchema>
export type CreateReplyDto       = z.infer<typeof createReplySchema>
export type UpdateDiscussionDto  = z.infer<typeof updateDiscussionSchema>
export type DiscussionQuery      = z.infer<typeof discussionQuerySchema>

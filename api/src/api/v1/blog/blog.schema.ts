import { z } from 'zod'

export const createBlogPostSchema = z.object({
  title:       z.string().min(1).max(250).trim(),
  description: z.string().min(1).max(500).trim(),
  body:        z.string().min(1),
  tags:        z.array(z.string().trim().toLowerCase()).max(10).optional().default([]),
  categories:  z.array(z.string().trim().toLowerCase()).max(5).optional().default([]),
  status:      z.enum(['draft', 'published']).optional().default('draft'),
  featured:    z.boolean().optional().default(false),
})

export const updateBlogPostSchema = createBlogPostSchema.partial()

export const blogQuerySchema = z.object({
  page:     z.coerce.number().min(1).default(1),
  limit:    z.coerce.number().min(1).max(100).default(20),
  tag:      z.string().optional(),
  category: z.string().optional(),
  search:   z.string().optional(),
  featured: z.coerce.boolean().optional(),
  status:   z.enum(['draft', 'published', 'archived', 'all']).optional(),
  sort:     z.enum(['publishedAt', 'viewCount', 'createdAt']).default('createdAt'),
  order:    z.enum(['asc', 'desc']).default('desc'),
})

export const blogParamsSchema = z.object({
  slug: z.string().min(1),
})

export const blogIdParamsSchema = z.object({
  id: z.string().regex(/^[a-f\d]{24}$/i, 'Invalid blog post ID'),
})

export type CreateBlogPostDto = z.infer<typeof createBlogPostSchema>
export type UpdateBlogPostDto = z.infer<typeof updateBlogPostSchema>
export type BlogQuery         = z.infer<typeof blogQuerySchema>

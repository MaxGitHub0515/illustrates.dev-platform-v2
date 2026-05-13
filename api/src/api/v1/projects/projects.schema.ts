import { z } from 'zod'

export const createProjectSchema = z.object({
  title:       z.string().min(1).max(200).trim(),
  description: z.string().min(1).max(1_000).trim(),
  body:        z.string().min(1),
  tags:        z.array(z.string().trim().toLowerCase()).max(10).optional().default([]),
  techStack:   z.array(z.string().trim()).max(20).optional().default([]),
  githubUrl:   z.string().url('Invalid GitHub URL').optional().or(z.literal('')),
  liveUrl:     z.string().url('Invalid URL').optional().or(z.literal('')),
  status:      z.enum(['draft', 'published']).optional().default('draft'),
})

export const updateProjectSchema = createProjectSchema.partial()

export const projectQuerySchema = z.object({
  page:     z.coerce.number().min(1).default(1),
  limit:    z.coerce.number().min(1).max(100).default(20),
  status:   z.enum(['draft', 'published', 'archived', 'all']).optional(),
  tag:      z.string().optional(),
  search:   z.string().optional(),
  featured: z.coerce.boolean().optional(),
  sort:     z.enum(['createdAt', 'viewCount', 'likeCount']).default('createdAt'),
  order:    z.enum(['asc', 'desc']).default('desc'),
})

export const projectParamsSchema = z.object({
  id: z.string().regex(/^[a-f\d]{24}$/i, 'Invalid project ID'),
})

export type CreateProjectDto  = z.infer<typeof createProjectSchema>
export type UpdateProjectDto  = z.infer<typeof updateProjectSchema>
export type ProjectQuery      = z.infer<typeof projectQuerySchema>
export type ProjectParams     = z.infer<typeof projectParamsSchema>

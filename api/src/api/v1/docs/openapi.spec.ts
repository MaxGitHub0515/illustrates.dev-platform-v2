/**
 * All route registrations for OpenAPI docs.
 * Importing this file is a side-effect — it populates the registry.
 * Import it once, in docs.routes.ts, before serving Swagger UI.
 */
import { z } from 'zod'
import { registry, PaginationMetaSchema, ErrorResponseSchema } from '../../../lib/openapi'
import { createProjectSchema, updateProjectSchema, projectQuerySchema } from '../projects/projects.schema'
import { createThreadSchema, createReplySchema, discussionQuerySchema } from '../discussions/discussions.schema'
import { createBlogPostSchema, blogQuerySchema } from '../blog/blog.schema'
import { updateProfileSchema } from '../users/users.schema'
import { supportRequestSchema } from '../support/support.schema'

const auth = [{ BearerAuth: [] }]

// ── Shared inline schemas ──────────────────────────────────────────────────

const ProjectSchema = registry.register(
  'Project',
  createProjectSchema.extend({
    _id:       z.string().openapi({ example: '64f1a2b3c4d5e6f7a8b9c0d1' }),
    slug:      z.string().openapi({ example: 'my-project-1719000000000' }),
    authorId:  z.string().openapi({ example: 'user_2abc123' }),
    viewCount: z.number().openapi({ example: 142 }),
    likeCount: z.number().openapi({ example: 17 }),
    createdAt: z.string().datetime(),
    updatedAt: z.string().datetime(),
  })
)

const DiscussionSchema = registry.register(
  'Discussion',
  createThreadSchema.extend({
    _id:        z.string(),
    authorId:   z.string(),
    replyCount: z.number(),
    likeCount:  z.number(),
    status:     z.enum(['open', 'closed', 'locked']),
    isPinned:   z.boolean(),
    createdAt:  z.string().datetime(),
    updatedAt:  z.string().datetime(),
  })
)

const BlogPostSchema = registry.register(
  'BlogPost',
  createBlogPostSchema.extend({
    _id:       z.string(),
    slug:      z.string(),
    authorId:  z.string(),
    readTime:  z.number().openapi({ example: 5 }),
    viewCount: z.number(),
    publishedAt: z.string().datetime().optional(),
    createdAt: z.string().datetime(),
    updatedAt: z.string().datetime(),
  })
)

const UserSchema = registry.register(
  'User',
  updateProfileSchema.extend({
    _id:          z.string(),
    clerkId:      z.string(),
    username:     z.string(),
    email:        z.string().email(),
    avatarUrl:    z.string(),
    role:         z.enum(['admin', 'user']),
    projectCount: z.number(),
    createdAt:    z.string().datetime(),
  })
)

// ── Health ─────────────────────────────────────────────────────────────────

registry.registerPath({
  method: 'get', path: '/health', tags: ['Health'],
  summary: 'Health check — returns status of all services',
  responses: {
    200: {
      description: 'All services healthy',
      content: { 'application/json': { schema: z.object({
        success: z.literal(true),
        data: z.object({
          status:    z.enum(['ok', 'degraded']),
          timestamp: z.string().datetime(),
          uptime:    z.number(),
          services:  z.object({ mongo: z.string(), redis: z.string() }),
        }),
      }) } },
    },
    503: { description: 'One or more services are down' },
  },
})

// ── Projects ───────────────────────────────────────────────────────────────

registry.registerPath({
  method: 'get', path: '/projects', tags: ['Projects'],
  summary: 'List published projects with pagination, filtering, full-text search',
  request: { query: projectQuerySchema },
  responses: {
    200: {
      description: 'Paginated project list',
      content: { 'application/json': { schema: z.object({
        success: z.literal(true),
        data: z.array(ProjectSchema),
        meta: PaginationMetaSchema,
      }) } },
    },
    400: { description: 'Invalid query params', content: { 'application/json': { schema: ErrorResponseSchema } } },
  },
})

registry.registerPath({
  method: 'get', path: '/projects/me', tags: ['Projects'],
  summary: "Authenticated user's own projects (all statuses)",
  security: auth,
  request: { query: projectQuerySchema },
  responses: {
    200: { description: 'OK', content: { 'application/json': { schema: z.object({ success: z.literal(true), data: z.array(ProjectSchema), meta: PaginationMetaSchema }) } } },
    401: { description: 'Unauthorized', content: { 'application/json': { schema: ErrorResponseSchema } } },
  },
})

registry.registerPath({
  method: 'get', path: '/projects/{id}', tags: ['Projects'],
  summary: 'Get a single project by ID',
  request: { params: z.object({ id: z.string().openapi({ example: '64f1a2b3c4d5e6f7a8b9c0d1' }) }) },
  responses: {
    200: { description: 'OK', content: { 'application/json': { schema: z.object({ success: z.literal(true), data: ProjectSchema }) } } },
    404: { description: 'Not found', content: { 'application/json': { schema: ErrorResponseSchema } } },
  },
})

registry.registerPath({
  method: 'post', path: '/projects', tags: ['Projects'],
  summary: 'Create a project', security: auth,
  request: { body: { content: { 'application/json': { schema: createProjectSchema } } } },
  responses: {
    201: { description: 'Created', content: { 'application/json': { schema: z.object({ success: z.literal(true), data: ProjectSchema }) } } },
    400: { description: 'Validation error', content: { 'application/json': { schema: ErrorResponseSchema } } },
    401: { description: 'Unauthorized', content: { 'application/json': { schema: ErrorResponseSchema } } },
  },
})

registry.registerPath({
  method: 'patch', path: '/projects/{id}', tags: ['Projects'],
  summary: 'Update a project (owner or admin)', security: auth,
  request: {
    params: z.object({ id: z.string() }),
    body: { content: { 'application/json': { schema: updateProjectSchema } } },
  },
  responses: {
    200: { description: 'Updated', content: { 'application/json': { schema: z.object({ success: z.literal(true), data: ProjectSchema }) } } },
    403: { description: 'Forbidden', content: { 'application/json': { schema: ErrorResponseSchema } } },
    404: { description: 'Not found', content: { 'application/json': { schema: ErrorResponseSchema } } },
  },
})

registry.registerPath({
  method: 'delete', path: '/projects/{id}', tags: ['Projects'],
  summary: 'Delete a project (owner or admin)', security: auth,
  request: { params: z.object({ id: z.string() }) },
  responses: {
    204: { description: 'Deleted' },
    403: { description: 'Forbidden', content: { 'application/json': { schema: ErrorResponseSchema } } },
  },
})

registry.registerPath({
  method: 'post', path: '/projects/{id}/files', tags: ['Projects'],
  summary: 'Upload a file — queued for async processing', security: auth,
  request: {
    params: z.object({ id: z.string() }),
    body: { content: { 'multipart/form-data': { schema: z.object({ file: z.instanceof(File) }) } } },
  },
  responses: {
    202: { description: 'Accepted — processing in background' },
    400: { description: 'No file provided' },
  },
})

// ── Discussions ────────────────────────────────────────────────────────────

registry.registerPath({
  method: 'get', path: '/discussions', tags: ['Discussions'],
  summary: 'List threads (optionally filtered by project)',
  request: { query: discussionQuerySchema },
  responses: {
    200: { description: 'OK', content: { 'application/json': { schema: z.object({ success: z.literal(true), data: z.array(DiscussionSchema), meta: PaginationMetaSchema }) } } },
  },
})

registry.registerPath({
  method: 'get', path: '/discussions/{id}', tags: ['Discussions'],
  summary: 'Get a thread by ID',
  request: { params: z.object({ id: z.string() }) },
  responses: {
    200: { description: 'OK', content: { 'application/json': { schema: z.object({ success: z.literal(true), data: DiscussionSchema }) } } },
    404: { description: 'Not found', content: { 'application/json': { schema: ErrorResponseSchema } } },
  },
})

registry.registerPath({
  method: 'post', path: '/discussions', tags: ['Discussions'],
  summary: 'Create a new thread', security: auth,
  request: { body: { content: { 'application/json': { schema: createThreadSchema } } } },
  responses: {
    201: { description: 'Created' },
    401: { description: 'Unauthorized', content: { 'application/json': { schema: ErrorResponseSchema } } },
  },
})

registry.registerPath({
  method: 'get', path: '/discussions/{id}/replies', tags: ['Discussions'],
  summary: 'Get replies for a thread (oldest first)',
  request: {
    params: z.object({ id: z.string() }),
    query: z.object({ page: z.coerce.number().default(1), limit: z.coerce.number().default(20) }),
  },
  responses: {
    200: { description: 'OK', content: { 'application/json': { schema: z.object({ success: z.literal(true), data: z.array(DiscussionSchema), meta: PaginationMetaSchema }) } } },
  },
})

registry.registerPath({
  method: 'post', path: '/discussions/{id}/replies', tags: ['Discussions'],
  summary: 'Reply to a thread', security: auth,
  request: {
    params: z.object({ id: z.string() }),
    body: { content: { 'application/json': { schema: createReplySchema } } },
  },
  responses: {
    201: { description: 'Reply created' },
    403: { description: 'Thread is locked' },
  },
})

// ── Blog ───────────────────────────────────────────────────────────────────

registry.registerPath({
  method: 'get', path: '/blog', tags: ['Blog'],
  summary: 'List published blog posts',
  request: { query: blogQuerySchema },
  responses: {
    200: { description: 'OK', content: { 'application/json': { schema: z.object({ success: z.literal(true), data: z.array(BlogPostSchema), meta: PaginationMetaSchema }) } } },
  },
})

registry.registerPath({
  method: 'get', path: '/blog/{slug}', tags: ['Blog'],
  summary: 'Get a blog post by slug',
  request: { params: z.object({ slug: z.string().openapi({ example: 'my-first-post-1719000000000' }) }) },
  responses: {
    200: { description: 'OK', content: { 'application/json': { schema: z.object({ success: z.literal(true), data: BlogPostSchema }) } } },
    404: { description: 'Not found', content: { 'application/json': { schema: ErrorResponseSchema } } },
  },
})

registry.registerPath({
  method: 'post', path: '/blog', tags: ['Blog'],
  summary: 'Create a blog post', security: auth,
  request: { body: { content: { 'application/json': { schema: createBlogPostSchema } } } },
  responses: {
    201: { description: 'Created' },
    401: { description: 'Unauthorized', content: { 'application/json': { schema: ErrorResponseSchema } } },
  },
})

// ── Users ──────────────────────────────────────────────────────────────────

registry.registerPath({
  method: 'get', path: '/users/me', tags: ['Users'],
  summary: "Get the authenticated user's profile", security: auth,
  responses: {
    200: { description: 'OK', content: { 'application/json': { schema: z.object({ success: z.literal(true), data: UserSchema }) } } },
    401: { description: 'Unauthorized', content: { 'application/json': { schema: ErrorResponseSchema } } },
  },
})

registry.registerPath({
  method: 'patch', path: '/users/me', tags: ['Users'],
  summary: "Update the authenticated user's profile", security: auth,
  request: { body: { content: { 'application/json': { schema: updateProfileSchema } } } },
  responses: {
    200: { description: 'OK', content: { 'application/json': { schema: z.object({ success: z.literal(true), data: UserSchema }) } } },
  },
})

registry.registerPath({
  method: 'get', path: '/users/{username}', tags: ['Users'],
  summary: 'Get a public user profile by username',
  request: { params: z.object({ username: z.string().openapi({ example: 'johndoe' }) }) },
  responses: {
    200: { description: 'OK', content: { 'application/json': { schema: z.object({ success: z.literal(true), data: UserSchema }) } } },
    404: { description: 'Not found', content: { 'application/json': { schema: ErrorResponseSchema } } },
  },
})

// ── Support ────────────────────────────────────────────────────────────────

registry.registerPath({
  method: 'post', path: '/support', tags: ['Support'],
  summary: 'Submit a support request (rate limited to 20 req / 15 min)',
  request: { body: { content: { 'application/json': { schema: supportRequestSchema } } } },
  responses: {
    200: { description: 'Request received and queued' },
    400: { description: 'Validation error' },
    429: { description: 'Rate limit exceeded' },
  },
})

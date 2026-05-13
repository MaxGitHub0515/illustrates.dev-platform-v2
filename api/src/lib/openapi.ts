import { OpenAPIRegistry, OpenApiGeneratorV3 } from '@asteasolutions/zod-to-openapi'
import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi'
import { z } from 'zod'

// Extend Zod globally — must run before any schema uses .openapi()
extendZodWithOpenApi(z)

export const registry = new OpenAPIRegistry()

// ── Reusable response schemas ───────────────────────────────────────────────
export const PaginationMetaSchema = registry.register(
  'PaginationMeta',
  z.object({
    total:      z.number().openapi({ example: 42 }),
    page:       z.number().openapi({ example: 1 }),
    limit:      z.number().openapi({ example: 20 }),
    totalPages: z.number().openapi({ example: 3 }),
  })
)

export const ErrorResponseSchema = registry.register(
  'ErrorResponse',
  z.object({
    success: z.literal(false),
    error: z.object({
      code:    z.string().openapi({ example: 'NOT_FOUND' }),
      message: z.string().openapi({ example: 'Resource not found' }),
      details: z.unknown().optional(),
    }),
  })
)

// ── Security scheme ────────────────────────────────────────────────────────
registry.registerComponent('securitySchemes', 'BearerAuth', {
  type: 'http',
  scheme: 'bearer',
  bearerFormat: 'JWT',
  description: 'Clerk session token — include as: Authorization: Bearer <token>',
})

export function generateOpenApiDocument() {
  const generator = new OpenApiGeneratorV3(registry.definitions)

  return generator.generateDocument({
    openapi: '3.0.0',
    info: {
      title:       'Portfolio Platform API',
      version:     '1.0.0',
      description: 'REST API for the portfolio platform. All authenticated routes require a Clerk JWT.',
      contact: { name: 'Portfolio', url: 'https://illustrates.dev' },
    },
    servers: [
      { url: '/api/v1', description: 'Current version' },
    ],
    tags: [
      { name: 'Health',      description: 'Service health checks' },
      { name: 'Projects',    description: 'Portfolio projects — CRUD, file uploads, pagination' },
      { name: 'Discussions', description: 'Community threads and replies' },
      { name: 'Blog',        description: 'Blog posts' },
      { name: 'Users',       description: 'User profiles' },
      { name: 'Support',     description: 'Support form submissions' },
    ],
  })
}

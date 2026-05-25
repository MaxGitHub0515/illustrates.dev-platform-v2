import { z } from 'zod'
import dotenv from 'dotenv'

dotenv.config()

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.coerce.number().default(5001),

  MONGODB_URI: z.string().min(1),

  REDIS_HOST:     z.string().default('localhost'),
  REDIS_PORT:     z.coerce.number().default(6379),
  REDIS_PASSWORD: z.string().optional(),

  CLERK_SECRET_KEY:     z.string().startsWith('sk_'),
  // Optional in dev — the webhook is only needed when you configure it in Clerk Dashboard.
  // In production set this to the whsec_... value from your Clerk webhook endpoint.
  CLERK_WEBHOOK_SECRET: z.string().optional().default(''),

  SENTRY_DSN: z.string().url().optional().or(z.literal('')),

  STORAGE_ENDPOINT:   z.string().min(1),
  STORAGE_ACCESS_KEY: z.string().min(1),
  STORAGE_SECRET_KEY: z.string().min(1),
  STORAGE_BUCKET:     z.string().min(1),
  STORAGE_PUBLIC_URL: z.string().url().optional().default(''),
  STORAGE_REGION:     z.string().default('us-east-1'),
  STORAGE_USE_SSL:    z.string().transform((v) => v === 'true').default('false'),

  ALLOWED_ORIGINS:      z.string().default('http://localhost:3000'),
  API_VERSION:          z.string().default('v1'),

  // Increased for a public portfolio — 200 req / 15 min per IP is reasonable
  RATE_LIMIT_WINDOW_MS: z.coerce.number().default(900_000),
  RATE_LIMIT_MAX:       z.coerce.number().default(300),

  // Email (Resend — https://resend.com)
  RESEND_API_KEY: z.string().optional().default(''),
  SUPPORT_EMAIL:  z.string().email().default('hello@illustrates.dev'),
  FROM_EMAIL:     z.string().email().default('noreply@illustrates.dev'),
})

const parsed = envSchema.safeParse(process.env)

if (!parsed.success) {
  console.error('\n❌ Invalid environment variables:\n')
  console.error(parsed.error.flatten().fieldErrors)
  console.error('\nCheck your .env file against .env.example\n')
  process.exit(1)
}

export const env = parsed.data
export type Env = typeof env

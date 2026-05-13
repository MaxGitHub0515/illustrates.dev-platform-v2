import { Router } from 'express'
import swaggerUi from 'swagger-ui-express'
import { generateOpenApiDocument } from '../../../lib/openapi'

// Registering paths is a side-effect of importing the spec file
import './openapi.spec'

const router = Router()

// Cache the document so it's only generated once on first request
let cachedDocument: ReturnType<typeof generateOpenApiDocument> | null = null

function getDocument() {
  if (!cachedDocument) cachedDocument = generateOpenApiDocument()
  return cachedDocument
}

// Serve the raw JSON spec (useful for client code generation)
router.get('/openapi.json', (_req, res) => {
  res.setHeader('Content-Type', 'application/json')
  res.json(getDocument())
})

// Serve Swagger UI
router.use(
  '/',
  swaggerUi.serve,
  swaggerUi.setup(undefined, {
    swaggerOptions: { url: '/api/v1/docs/openapi.json' },
    customSiteTitle: 'Portfolio API Docs',
  })
)

export { router as docsRouter }

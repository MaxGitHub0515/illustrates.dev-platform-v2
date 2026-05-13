import { Router } from 'express'
import { healthRouter }      from './health/health.routes'
import { projectsRouter }    from './projects/projects.routes'
import { discussionsRouter } from './discussions/discussions.routes'
import { blogRouter }        from './blog/blog.routes'
import { usersRouter }       from './users/users.routes'
import { supportRouter }     from './support/support.routes'
import { docsRouter }        from './docs/docs.routes'
import { statsRouter }       from './stats/stats.routes'

const router = Router()

router.use('/health',      healthRouter)
router.use('/stats',       statsRouter)
router.use('/projects',    projectsRouter)
router.use('/discussions', discussionsRouter)
router.use('/blog',        blogRouter)
router.use('/users',       usersRouter)
router.use('/support',     supportRouter)
router.use('/docs',        docsRouter)

export { router as v1Router }

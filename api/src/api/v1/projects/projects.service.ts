import mongoose from 'mongoose'
import { Project, IProject } from './projects.model'
import { CreateProjectDto, UpdateProjectDto, ProjectQuery } from './projects.schema'
import { AppError } from '../../../utils/AppError'
import { buildPaginationMeta } from '../../../utils/response'
import { getOrSet, invalidate } from '../../../lib/cache'
import { trackDb } from '../../../lib/db'
import { fileProcessorQueue } from '../../../jobs/queues'
import { uploadFile } from '../../../lib/storage'
import { fileUploadsTotal, fileUploadBytes } from '../../../lib/metrics'

const CACHE_TTL  = 300
const CACHE_KEY  = (id: string) => `project:${id}`

function slugify(title: string): string {
  return (
    title.toLowerCase().trim()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-') + '-' + Date.now()
  )
}

export class ProjectService {
  static async create(data: CreateProjectDto, authorId: string): Promise<IProject> {
    const project = await trackDb('insertOne', 'projects', () =>
      Project.create({ ...data, slug: slugify(data.title), authorId })
    )
    return project
  }

  static async findAll(query: ProjectQuery, isAdmin = false) {
    const { page, limit, status, tag, search, featured, sort, order } = query
    const skip   = (page - 1) * limit
    // Admin sees all statuses unless a specific one is requested
    const filter: Record<string, unknown> = {}
    if (!isAdmin) filter.status = status ?? 'published'
    else if (status && status !== 'all') filter.status = status
    if (tag)      filter.tags = tag
    if (featured !== undefined) filter.featured = featured
    if (search)   filter.$text = { $search: search }
    const sortObj: Record<string, 1 | -1> = { [sort]: order === 'asc' ? 1 : -1 }

    const [data, total] = await Promise.all([
      trackDb('find', 'projects', () =>
        Project.find(filter).sort(sortObj).skip(skip).limit(limit).lean()
      ),
      trackDb('countDocuments', 'projects', () =>
        Project.countDocuments(filter)
      ),
    ])

    return { data, meta: buildPaginationMeta(total, page, limit) }
  }

  static async findById(id: string): Promise<IProject> {
    if (!mongoose.isValidObjectId(id)) throw AppError.notFound('Project not found')

    return getOrSet<IProject>(
      CACHE_KEY(id),
      'project',
      CACHE_TTL,
      async () => {
        const project = await trackDb('findById', 'projects', () => Project.findById(id))
        if (!project) throw AppError.notFound('Project not found')
        return project
      }
    )
  }

  static async findByAuthor(authorId: string, query: ProjectQuery) {
    const { page, limit, status, sort, order } = query
    const skip   = (page - 1) * limit
    const filter: Record<string, unknown> = { authorId }
    if (status) filter.status = status
    const sortObj: Record<string, 1 | -1> = { [sort]: order === 'asc' ? 1 : -1 }

    const [data, total] = await Promise.all([
      trackDb('find', 'projects', () =>
        Project.find(filter).sort(sortObj).skip(skip).limit(limit).lean()
      ),
      trackDb('countDocuments', 'projects', () =>
        Project.countDocuments(filter)
      ),
    ])

    return { data, meta: buildPaginationMeta(total, page, limit) }
  }

  static async update(id: string, data: UpdateProjectDto, authorId: string, isAdmin = false): Promise<IProject> {
    if (!mongoose.isValidObjectId(id)) throw AppError.notFound('Project not found')

    const project = await trackDb('findOneAndUpdate', 'projects', () =>
      Project.findOneAndUpdate(
        isAdmin ? { _id: id } : { _id: id, authorId },
        { $set: data },
        { new: true, runValidators: true }
      )
    )

    if (!project) throw AppError.notFound('Project not found or access denied')
    await invalidate(CACHE_KEY(id))
    return project
  }

  static async delete(id: string, authorId: string, role: string): Promise<void> {
    if (!mongoose.isValidObjectId(id)) throw AppError.notFound('Project not found')
    const filter = role === 'admin' ? { _id: id } : { _id: id, authorId }

    const project = await trackDb('findOneAndDelete', 'projects', () =>
      Project.findOneAndDelete(filter)
    )
    if (!project) throw AppError.notFound('Project not found or access denied')
    await invalidate(CACHE_KEY(id))
  }

  static async incrementView(id: string): Promise<void> {
    if (!mongoose.isValidObjectId(id)) return
    await trackDb('updateOne', 'projects', () =>
      Project.findByIdAndUpdate(id, { $inc: { viewCount: 1 } })
    )
    await invalidate(CACHE_KEY(id))
  }

  static async uploadFile(
    id: string,
    file: Express.Multer.File,
    authorId: string
  ): Promise<{ key: string; url: string }> {
    if (!mongoose.isValidObjectId(id)) throw AppError.notFound('Project not found')
    const project = await this.findById(id)
    if (project.authorId !== authorId) throw AppError.forbidden()

    const fileType = file.mimetype.startsWith('image/') ? 'image' : 'document'

    try {
      const { key, url } = await uploadFile(file, `projects/${id}`)

      await trackDb('updateOne', 'projects', () =>
        Project.findByIdAndUpdate(id, {
          $push: { files: { key, url, name: file.originalname, size: file.size, mimeType: file.mimetype } },
        })
      )

      await fileProcessorQueue.add('process-file', {
        fileKey: key, userId: authorId, projectId: id,
        type: fileType, originalName: file.originalname, mimeType: file.mimetype,
      })

      fileUploadsTotal.inc({ type: fileType, status: 'success' })
      fileUploadBytes.observe({ type: fileType }, file.size)

      await invalidate(CACHE_KEY(id))
      return { key, url }
    } catch (err) {
      fileUploadsTotal.inc({ type: fileType, status: 'failed' })
      throw err
    }
  }
}

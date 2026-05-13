import mongoose from 'mongoose'
import { BlogPost, IBlogPost } from './blog.model'
import { CreateBlogPostDto, UpdateBlogPostDto, BlogQuery } from './blog.schema'
import { AppError } from '../../../utils/AppError'
import { buildPaginationMeta } from '../../../utils/response'
import { getOrSet, invalidate } from '../../../lib/cache'
import { trackDb } from '../../../lib/db'

const CACHE_TTL = 600
const CACHE_KEY = (slug: string) => `blog:${slug}`

function slugify(title: string): string {
  return (
    title.toLowerCase().trim()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-') + '-' + Date.now()
  )
}

export class BlogService {
  static async create(data: CreateBlogPostDto, authorId: string): Promise<IBlogPost> {
    const wordCount = data.body.split(/\s+/).filter(Boolean).length
    const readTime  = Math.max(1, Math.round(wordCount / 200)) // avg 200 wpm
    return trackDb('insertOne', 'blogposts', () =>
      BlogPost.create({ ...data, slug: slugify(data.title), authorId, readTime })
    )
  }

  static async findAll(query: BlogQuery, isAdmin = false) {
    const { page, limit, tag, category, search, featured, sort, order } = query
    const skip   = (page - 1) * limit
    const filter: Record<string, unknown> = {}
    if (!isAdmin) filter.status = query.status ?? 'published'
    else if (query.status && query.status !== 'all') filter.status = query.status
    if (tag)      filter.tags = tag
    if (category) filter.categories = category
    if (featured !== undefined) filter.featured = featured
    if (search)   filter.$text = { $search: search }
    const sortObj: Record<string, 1 | -1> = { [sort]: order === 'asc' ? 1 : -1 }

    const [data, total] = await Promise.all([
      trackDb('find', 'blogposts', () =>
        BlogPost.find(filter).sort(sortObj).skip(skip).limit(limit).lean()
      ),
      trackDb('countDocuments', 'blogposts', () =>
        BlogPost.countDocuments(filter)
      ),
    ])

    return { data, meta: buildPaginationMeta(total, page, limit) }
  }

  static async findBySlug(slug: string, isAdmin = false): Promise<IBlogPost> {
    return getOrSet<IBlogPost>(
      CACHE_KEY(slug),
      'blog',
      isAdmin ? 0 : CACHE_TTL,
      async () => {
        const filter = isAdmin ? { slug } : { slug, status: 'published' }
        const post = await trackDb('findOne', 'blogposts', () =>
          BlogPost.findOne(filter)
        )
        if (!post) throw AppError.notFound('Blog post not found')
        return post
      }
    )
  }

  static async findDraftById(id: string, authorId: string): Promise<IBlogPost> {
    if (!mongoose.isValidObjectId(id)) throw AppError.notFound('Post not found')
    const post = await trackDb('findOne', 'blogposts', () =>
      BlogPost.findOne({ _id: id, authorId })
    )
    if (!post) throw AppError.notFound('Post not found')
    return post
  }

  static async update(id: string, data: UpdateBlogPostDto, authorId: string): Promise<IBlogPost> {
    if (!mongoose.isValidObjectId(id)) throw AppError.notFound('Post not found')

    const post = await trackDb('findOneAndUpdate', 'blogposts', () =>
      BlogPost.findOneAndUpdate(
        { _id: id, authorId },
        { $set: data },
        { new: true, runValidators: true }
      )
    )
    if (!post) throw AppError.notFound('Post not found or access denied')

    await invalidate(CACHE_KEY(post.slug))
    return post
  }

  static async delete(id: string, authorId: string, role: string): Promise<void> {
    if (!mongoose.isValidObjectId(id)) throw AppError.notFound('Post not found')
    const filter = role === 'admin' ? { _id: id } : { _id: id, authorId }

    const post = await trackDb('findOneAndDelete', 'blogposts', () =>
      BlogPost.findOneAndDelete(filter)
    )
    if (!post) throw AppError.notFound('Post not found or access denied')
    await invalidate(CACHE_KEY(post.slug))
  }

  static async incrementView(slug: string): Promise<void> {
    await trackDb('updateOne', 'blogposts', () =>
      BlogPost.findOneAndUpdate({ slug }, { $inc: { viewCount: 1 } })
    )
    await invalidate(CACHE_KEY(slug))
  }
}

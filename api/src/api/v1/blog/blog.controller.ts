import { Request, Response } from 'express'
import { BlogService } from './blog.service'
import { sendSuccess, sendCreated, sendNoContent, sendPaginated } from '../../../utils/response'
import type { BlogQuery, CreateBlogPostDto, UpdateBlogPostDto } from './blog.schema'

export async function getPosts(req: Request, res: Response): Promise<void> {
  const isAdmin = req.auth?.role === 'admin'
  const { data, meta } = await BlogService.findAll(req.query as unknown as BlogQuery, isAdmin)
  sendPaginated(res, data, meta)
}

export async function getPostBySlug(req: Request, res: Response): Promise<void> {
  const isAdmin = req.auth?.role === 'admin'
  const post = await BlogService.findBySlug(req.params.slug, isAdmin)
  BlogService.incrementView(req.params.slug).catch(() => undefined)
  sendSuccess(res, post)
}

export async function getMyDraft(req: Request, res: Response): Promise<void> {
  const post = await BlogService.findDraftById(req.params.id, req.auth!.userId)
  sendSuccess(res, post)
}

export async function createPost(req: Request, res: Response): Promise<void> {
  const post = await BlogService.create(req.body as CreateBlogPostDto, req.auth!.userId)
  sendCreated(res, post)
}

export async function updatePost(req: Request, res: Response): Promise<void> {
  const post = await BlogService.update(req.params.id, req.body as UpdateBlogPostDto, req.auth!.userId)
  sendSuccess(res, post)
}

export async function deletePost(req: Request, res: Response): Promise<void> {
  await BlogService.delete(req.params.id, req.auth!.userId, req.auth!.role)
  sendNoContent(res)
}

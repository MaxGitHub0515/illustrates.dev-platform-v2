import { Request, Response } from 'express'
import { DiscussionService } from './discussions.service'
import { User } from '../users/users.model'
import {
  sendSuccess, sendCreated, sendNoContent, sendPaginated,
} from '../../../utils/response'
import type { DiscussionQuery, CreateThreadDto, CreateReplyDto, UpdateDiscussionDto } from './discussions.schema'

/** Resolve the Clerk userId to a stored username for denormalisation */
async function resolveUsername(clerkId: string): Promise<string> {
  try {
    const user = await User.findOne({ clerkId }).select('username').lean()
    return user?.username ?? 'unknown'
  } catch { return 'unknown' }
}

export async function getThreads(req: Request, res: Response): Promise<void> {
  const { data, meta } = await DiscussionService.findThreads(req.query as unknown as DiscussionQuery)
  sendPaginated(res, data, meta)
}

export async function getThread(req: Request, res: Response): Promise<void> {
  const thread = await DiscussionService.findThreadById(req.params.id)
  sendSuccess(res, thread)
}

export async function createThread(req: Request, res: Response): Promise<void> {
  const authorUsername = await resolveUsername(req.auth!.userId)
  const thread = await DiscussionService.createThread(
    req.body as CreateThreadDto,
    req.auth!.userId,
    authorUsername,
  )
  sendCreated(res, thread)
}

export async function updateThread(req: Request, res: Response): Promise<void> {
  const thread = await DiscussionService.updateThread(
    req.params.id,
    req.body as UpdateDiscussionDto,
    req.auth!.userId,
    req.auth!.role
  )
  sendSuccess(res, thread)
}

export async function deleteThread(req: Request, res: Response): Promise<void> {
  await DiscussionService.deleteThread(req.params.id, req.auth!.userId, req.auth!.role)
  sendNoContent(res)
}

export async function createReply(req: Request, res: Response): Promise<void> {
  const authorUsername = await resolveUsername(req.auth!.userId)
  const reply = await DiscussionService.createReply(
    req.params.id,
    req.body as CreateReplyDto,
    req.auth!.userId,
    authorUsername,
  )
  sendCreated(res, reply)
}

export async function getReplies(req: Request, res: Response): Promise<void> {
  const page  = Number(req.query.page)  || 1
  const limit = Number(req.query.limit) || 20
  const { data, meta } = await DiscussionService.findReplies(req.params.id, page, limit)
  sendPaginated(res, data, meta)
}

export async function markAccepted(req: Request, res: Response): Promise<void> {
  await DiscussionService.markAccepted(req.params.replyId, req.auth!.userId)
  sendSuccess(res, { accepted: true })
}

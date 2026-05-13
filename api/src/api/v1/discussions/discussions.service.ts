import mongoose from 'mongoose'
import { Discussion, IDiscussion } from './discussions.model'
import { CreateThreadDto, CreateReplyDto, UpdateDiscussionDto, DiscussionQuery } from './discussions.schema'
import { AppError } from '../../../utils/AppError'
import { buildPaginationMeta } from '../../../utils/response'
import { notificationQueue } from '../../../jobs/queues'
import { trackDb } from '../../../lib/db'

export class DiscussionService {
  static async createThread(data: CreateThreadDto, authorId: string, authorUsername = 'unknown'): Promise<IDiscussion> {
    return trackDb('insertOne', 'discussions', () =>
      Discussion.create({
        ...data,
        authorId,
        authorUsername,
        parentId:  null,
        projectId: data.projectId ? new mongoose.Types.ObjectId(data.projectId) : undefined,
      })
    )
  }

  static async findThreads(query: DiscussionQuery) {
    const { page, limit, projectId, tag, search, status, sort, order } = query
    const skip   = (page - 1) * limit
    const filter: Record<string, unknown> = { parentId: null }
    if (projectId) filter.projectId = new mongoose.Types.ObjectId(projectId)
    if (tag)       filter.tags = tag
    if (status)    filter.status = status
    if (search)    filter.$text = { $search: search }
    const sortObj: Record<string, 1 | -1> = { isPinned: -1, [sort]: order === 'asc' ? 1 : -1 }

    const [data, total] = await Promise.all([
      trackDb('find', 'discussions', () =>
        Discussion.find(filter).sort(sortObj).skip(skip).limit(limit).lean()
      ),
      trackDb('countDocuments', 'discussions', () =>
        Discussion.countDocuments(filter)
      ),
    ])

    return { data, meta: buildPaginationMeta(total, page, limit) }
  }

  static async findThreadById(id: string): Promise<IDiscussion> {
    if (!mongoose.isValidObjectId(id)) throw AppError.notFound('Discussion not found')
    const thread = await trackDb('findOne', 'discussions', () =>
      Discussion.findOne({ _id: id, parentId: null })
    )
    if (!thread) throw AppError.notFound('Discussion not found')
    return thread
  }

  static async updateThread(
    id: string,
    data: UpdateDiscussionDto,
    requesterId: string,
    requesterRole: string
  ): Promise<IDiscussion> {
    if (!mongoose.isValidObjectId(id)) throw AppError.notFound('Discussion not found')
    const filter =
      requesterRole === 'admin'
        ? { _id: id, parentId: null }
        : { _id: id, parentId: null, authorId: requesterId }

    const thread = await trackDb('findOneAndUpdate', 'discussions', () =>
      Discussion.findOneAndUpdate(filter, { $set: data }, { new: true, runValidators: true })
    )
    if (!thread) throw AppError.notFound('Discussion not found or access denied')
    return thread
  }

  static async deleteThread(id: string, requesterId: string, requesterRole: string): Promise<void> {
    if (!mongoose.isValidObjectId(id)) throw AppError.notFound('Discussion not found')

    if (requesterRole === 'admin') {
      await trackDb('deleteMany', 'discussions', () =>
        Discussion.deleteMany({ $or: [{ _id: id }, { parentId: new mongoose.Types.ObjectId(id) }] })
      )
    } else {
      const deleted = await trackDb('findOneAndDelete', 'discussions', () =>
        Discussion.findOneAndDelete({ _id: id, authorId: requesterId })
      )
      if (!deleted) throw AppError.notFound('Discussion not found or access denied')
      await trackDb('deleteMany', 'discussions', () =>
        Discussion.deleteMany({ parentId: new mongoose.Types.ObjectId(id) })
      )
    }
  }

  static async createReply(
    threadId: string,
    data: CreateReplyDto,
    authorId: string,
    authorUsername = 'unknown'
  ): Promise<IDiscussion> {
    if (!mongoose.isValidObjectId(threadId)) throw AppError.notFound('Thread not found')

    const thread = await trackDb('findOne', 'discussions', () =>
      Discussion.findOne({ _id: threadId, parentId: null })
    )
    if (!thread) throw AppError.notFound('Thread not found')
    if (thread.status === 'locked') throw AppError.forbidden('Thread is locked')

    const [reply] = await Promise.all([
      trackDb('insertOne', 'discussions', () =>
        Discussion.create({ body: data.body, authorId, authorUsername, parentId: new mongoose.Types.ObjectId(threadId) })
      ),
      trackDb('updateOne', 'discussions', () =>
        Discussion.findByIdAndUpdate(threadId, { $inc: { replyCount: 1 } })
      ),
    ])

    if (thread.authorId !== authorId) {
      await notificationQueue.add('new-reply', {
        recipientId: thread.authorId,
        type:        'new_comment',
        payload:     { threadId, replyId: reply._id, authorId },
      })
    }

    return reply
  }

  static async findReplies(threadId: string, page: number, limit: number) {
    if (!mongoose.isValidObjectId(threadId)) throw AppError.notFound('Thread not found')
    const skip   = (page - 1) * limit
    const filter = { parentId: new mongoose.Types.ObjectId(threadId) }

    const [data, total] = await Promise.all([
      trackDb('find', 'discussions', () =>
        Discussion.find(filter).sort({ createdAt: 1 }).skip(skip).limit(limit).lean()
      ),
      trackDb('countDocuments', 'discussions', () =>
        Discussion.countDocuments(filter)
      ),
    ])

    return { data, meta: buildPaginationMeta(total, page, limit) }
  }

  static async markAccepted(replyId: string, requesterId: string): Promise<void> {
    if (!mongoose.isValidObjectId(replyId)) throw AppError.notFound('Reply not found')

    const reply = await trackDb('findById', 'discussions', () => Discussion.findById(replyId))
    if (!reply?.parentId) throw AppError.notFound('Reply not found')

    const thread = await trackDb('findById', 'discussions', () =>
      Discussion.findById(reply.parentId)
    )
    if (!thread) throw AppError.notFound('Thread not found')
    if (thread.authorId !== requesterId) throw AppError.forbidden()

    await Promise.all([
      trackDb('updateMany', 'discussions', () =>
        Discussion.updateMany({ parentId: reply.parentId, isAccepted: true }, { $set: { isAccepted: false } })
      ),
      trackDb('updateOne', 'discussions', () =>
        Discussion.findByIdAndUpdate(replyId, { $set: { isAccepted: true } })
      ),
    ])
  }
}

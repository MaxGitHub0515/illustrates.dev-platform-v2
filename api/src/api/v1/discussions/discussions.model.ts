import { Schema, model, Document, Types } from 'mongoose'

/**
 * Two-level discussion model.
 * - parentId = null  → top-level thread (has title, tags, status, isPinned)
 * - parentId = ObjectId → reply to a thread
 *
 * projectId links a thread to a specific project (optional — supports
 * both project discussions and general community threads).
 */
export interface IDiscussion extends Document {
  _id:        Types.ObjectId
  title:      string
  body:       string
  authorId:   string          // Clerk user ID
  authorUsername?: string   // denormalized for display
  projectId?: Types.ObjectId
  parentId?:  Types.ObjectId  // null = top-level thread
  tags:       string[]
  status:     'open' | 'closed' | 'locked'
  isPinned:   boolean
  isAccepted: boolean         // reply marked as accepted answer
  likeCount:  number
  replyCount: number          // denormalized, only on top-level threads
  createdAt:  Date
  updatedAt:  Date
}

const discussionSchema = new Schema<IDiscussion>(
  {
    title:      { type: String, maxlength: 300 },
    body:       { type: String, required: true },
    authorId:      { type: String, required: true },
    authorUsername: { type: String, default: 'unknown' },
    projectId:  { type: Schema.Types.ObjectId, ref: 'Project' },
    parentId:   { type: Schema.Types.ObjectId, ref: 'Discussion', default: null },
    tags:       [{ type: String, trim: true, lowercase: true }],
    status:     { type: String, enum: ['open', 'closed', 'locked'], default: 'open' },
    isPinned:   { type: Boolean, default: false },
    isAccepted: { type: Boolean, default: false },
    likeCount:  { type: Number, default: 0, min: 0 },
    replyCount: { type: Number, default: 0, min: 0 },
  },
  { timestamps: true }
)

// Top-level threads on a project, newest first
discussionSchema.index({ projectId: 1, parentId: 1, createdAt: -1 })

// All top-level threads (general community board)
discussionSchema.index({ parentId: 1, createdAt: -1 })

// Replies to a thread
discussionSchema.index({ parentId: 1, createdAt: 1 })

// Thread author's own threads
discussionSchema.index({ authorId: 1, parentId: 1, createdAt: -1 })

// Pinned threads surface first
discussionSchema.index({ isPinned: -1, createdAt: -1 })

// Full-text search on thread titles and bodies
discussionSchema.index(
  { title: 'text', body: 'text', tags: 'text' },
  { weights: { title: 10, tags: 5, body: 1 }, name: 'discussion_text_search' }
)

export const Discussion = model<IDiscussion>('Discussion', discussionSchema)

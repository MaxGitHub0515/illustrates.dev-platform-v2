import { Schema, model, Document, Types } from 'mongoose'

export interface IProjectFile {
  key: string
  url: string
  name: string
  size: number
  mimeType: string
}

export interface IProject extends Document {
  _id: Types.ObjectId
  title: string
  description: string
  body: string
  slug: string
  coverImageKey?: string
  coverImageUrl?: string
  tags: string[]
  techStack: string[]
  githubUrl?: string
  liveUrl?: string
  authorId: string      // Clerk user ID — source of truth for ownership
  featured: boolean
  status: 'draft' | 'published' | 'archived'
  viewCount: number
  likeCount: number
  files: IProjectFile[]
  createdAt: Date
  updatedAt: Date
}

const projectSchema = new Schema<IProject>(
  {
    title:         { type: String, required: true, trim: true, maxlength: 200 },
    description:   { type: String, required: true, trim: true, maxlength: 1_000 },
    body:          { type: String, required: true },
    slug:          { type: String, required: true, unique: true, lowercase: true, trim: true },
    coverImageKey: { type: String },
    coverImageUrl: { type: String },
    tags:          [{ type: String, trim: true, lowercase: true }],
    techStack:     [{ type: String, trim: true }],
    githubUrl:     { type: String },
    liveUrl:       { type: String },
    authorId:      { type: String, required: true },
    featured:      { type: Boolean, default: false },
    status:        { type: String, enum: ['draft', 'published', 'archived'], default: 'draft' },
    viewCount:     { type: Number, default: 0, min: 0 },
    likeCount:     { type: Number, default: 0, min: 0 },
    files: [
      {
        key:      { type: String, required: true },
        url:      { type: String, required: true },
        name:     { type: String, required: true },
        size:     { type: Number, required: true },
        mimeType: { type: String, required: true },
      },
    ],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
)

// ── Indexes ────────────────────────────────────────────────────────────────
// Compound: user's projects sorted by date (dashboard grid + me-page)
projectSchema.index({ authorId: 1, createdAt: -1 })

// Compound: public listing sorted by date / views / likes
projectSchema.index({ status: 1, createdAt: -1 })
projectSchema.index({ status: 1, viewCount: -1 })
projectSchema.index({ status: 1, likeCount: -1 })

// Filtering by tag
projectSchema.index({ tags: 1 })

// Featured projects widget
projectSchema.index({ featured: 1, status: 1 })

// Full-text search across title, description, tags
projectSchema.index(
  { title: 'text', description: 'text', tags: 'text' },
  { weights: { title: 10, tags: 5, description: 1 }, name: 'project_text_search' }
)

export const Project = model<IProject>('Project', projectSchema)

import { Schema, model, Document, Types } from 'mongoose'

export interface IBlogPost extends Document {
  _id:           Types.ObjectId
  title:         string
  description:   string
  body:          string
  slug:          string
  coverImageKey?: string
  coverImageUrl?: string
  tags:          string[]
  categories:    string[]
  authorId:      string
  status:        'draft' | 'published' | 'archived'
  featured:      boolean
  publishedAt?:  Date
  readTime:      number   // minutes, calculated from body word count
  viewCount:     number
  createdAt:     Date
  updatedAt:     Date
}

const blogPostSchema = new Schema<IBlogPost>(
  {
    title:         { type: String, required: true, trim: true, maxlength: 250 },
    description:   { type: String, required: true, trim: true, maxlength: 500 },
    body:          { type: String, required: true },
    slug:          { type: String, required: true, unique: true, lowercase: true, trim: true },
    coverImageKey: { type: String },
    coverImageUrl: { type: String },
    tags:          [{ type: String, trim: true, lowercase: true }],
    categories:    [{ type: String, trim: true, lowercase: true }],
    authorId:      { type: String, required: true },
    status:        { type: String, enum: ['draft', 'published', 'archived'], default: 'draft' },
    featured:      { type: Boolean, default: false },
    publishedAt:   { type: Date },
    readTime:      { type: Number, default: 1, min: 1 },
    viewCount:     { type: Number, default: 0, min: 0 },
  },
  { timestamps: true }
)

// Calculate readTime before save (200 wpm average reading speed)
blogPostSchema.pre('save', function (next) {
  if (this.isModified('body')) {
    const wordCount = this.body.trim().split(/\s+/).length
    this.readTime = Math.max(1, Math.ceil(wordCount / 200))
  }
  if (this.isModified('status') && this.status === 'published' && !this.publishedAt) {
    this.publishedAt = new Date()
  }
  next()
})

blogPostSchema.index({ authorId: 1, createdAt: -1 })
blogPostSchema.index({ status: 1, publishedAt: -1 })
blogPostSchema.index({ status: 1, featured: 1 })
blogPostSchema.index({ tags: 1 })
blogPostSchema.index({ categories: 1 })
blogPostSchema.index(
  { title: 'text', description: 'text', tags: 'text' },
  { weights: { title: 10, tags: 5, description: 2 }, name: 'blog_text_search' }
)

export const BlogPost = model<IBlogPost>('BlogPost', blogPostSchema)

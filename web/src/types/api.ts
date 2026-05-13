export interface ApiResponse<T = unknown> {
  success: boolean
  data?:   T
  error?:  { code: string; message: string; details?: unknown }
  meta?:   PaginationMeta
}
export interface PaginationMeta {
  total: number; page: number; limit: number; totalPages: number
}

export interface ApiProject {
  _id: string; title: string; description: string; body: string
  slug: string; tags: string[]; techStack: string[]
  githubUrl?: string; liveUrl?: string; featured?: boolean
  status: 'draft' | 'published' | 'archived'
  viewCount: number; likeCount: number
  authorId: string; createdAt: string; updatedAt: string
}
export interface CreateProjectDto {
  title: string; description: string; body: string
  tags?: string[]; techStack?: string[]
  githubUrl?: string; liveUrl?: string
  status?: 'draft' | 'published'
}

export interface ApiPost {
  _id: string; title: string; slug: string
  description: string
  body: string
  tags: string[]; categories: string[]
  status: 'draft' | 'published' | 'archived'
  featured: boolean; readTime: number; viewCount: number
  authorId: string; publishedAt?: string
  createdAt: string; updatedAt: string
}
export interface CreatePostDto {
  title:       string
  description: string
  body:        string
  tags?:       string[]
  categories?: string[]
  status?:     'draft' | 'published'
  featured?:   boolean
}

export interface ApiUser {
  _id: string; clerkId: string; username: string; email: string
  firstName?: string; lastName?: string
  role: 'user' | 'admin'; blocked?: boolean
  isActive: boolean; createdAt: string
}

export interface ApiDiscussion {
  _id: string; title: string; body: string; tags: string[]
  status: 'open' | 'closed' | 'locked'
  authorId:       string
  authorUsername: string   // stored denormalised on the document
  replyCount: number; likeCount: number; projectId?: string
  isPinned: boolean; isAccepted: boolean
  createdAt: string; updatedAt: string
}

export interface ApiStats {
  projects:    { total: number; published: number; draft: number; archived: number; totalViews: number; totalLikes: number }
  posts:       { total: number; published: number; draft: number; totalViews: number }
  discussions: { total: number; open: number; closed: number; locked: number }
  users:       { total: number }
}

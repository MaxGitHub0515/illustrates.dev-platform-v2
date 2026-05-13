import type { Metadata } from 'next'
import { notFound }    from 'next/navigation'
import { Nav }         from '@/components/landing/Nav'
import { Footer }      from '@/components/landing/Footer'
import { PostContent } from '@/components/blog/PostContent'
import { serverGet }   from '@/lib/api/server'
import type { ApiPost } from '@/types/api'

interface Props { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const post = await serverGet<ApiPost>(`/blog/${slug}`)
  if (!post) return { title: 'Post not found' }
  return { title: post.title, description: post.description }
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params
  const post = await serverGet<ApiPost>(`/blog/${slug}`, 30)
  if (!post) notFound()
  return (
    <>
      <Nav />
      <main><PostContent post={post} /></main>
      <Footer />
    </>
  )
}

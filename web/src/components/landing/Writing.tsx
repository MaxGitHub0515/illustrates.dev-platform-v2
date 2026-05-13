'use client'
import Link from 'next/link'
import type { ApiPost } from '@/types/api'

const BAR_BG = [
  'linear-gradient(180deg,#6366f1,#06b6d4)',
  'linear-gradient(180deg,#fb923c,#f472b6)',
  'linear-gradient(180deg,#34d399,#10b981)',
]

export function Writing({ posts }: { posts: ApiPost[] }) {
  return (
    <section id="writing" className="px-6 md:px-7 py-12 md:py-[52px]"
             style={{ background: 'var(--section-writing)' }}>
      <div className="max-w-[1200px] mx-auto">
        <div className="flex justify-between items-baseline mb-6">
          <div>
            <p className="g-warm text-[10px] uppercase tracking-[0.12em] font-medium mb-1">Writing</p>
            <h2 className="text-[18px] font-medium text-[var(--text-1)]">From the blog</h2>
          </div>
          <Link href="/blog" className="text-[12px] text-orange-400 no-underline hover:opacity-75">All posts →</Link>
        </div>

        {posts.length === 0 ? (
          <div className="py-10 text-center border border-orange-400/15 rounded-xl text-[var(--text-3)] text-[13px]">
            No posts yet —{' '}
            <Link href="/admin/posts" className="text-orange-400 no-underline">write one via admin</Link>
          </div>
        ) : (
          <div className="border border-orange-400/15 rounded-xl overflow-hidden">
            {posts.map((post, i) => (
              <div key={post._id}>
                {i > 0 && <div className="h-px bg-[var(--border)]" />}
                <Link href={`/blog/${post.slug}`}
                      className="grid grid-cols-[3px_1fr_auto] items-center no-underline transition-colors duration-150 hover:bg-[var(--bg-surface-2)]"
                      style={{ background: 'var(--bg-surface)' }}>
                  <div className="self-stretch" style={{ background: BAR_BG[i % BAR_BG.length] }} />
                  <div className="py-4 px-4">
                    <p className="text-[13px] font-medium text-[var(--text-1)] mb-1">{post.title}</p>
                    <div className="flex gap-1.5 items-center flex-wrap">
                      {post.tags.slice(0,2).map(t => <span key={t} className="tag">{t}</span>)}
                      <span className="text-[11px] text-[var(--text-3)]">{post.viewCount} views</span>
                    </div>
                  </div>
                  <span className="px-4 text-[12px] text-[var(--text-3)] whitespace-nowrap">
                    {new Date(post.createdAt).toLocaleDateString('en-GB',{day:'2-digit',month:'short'})}
                  </span>
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

'use client'
import { useState, useMemo } from 'react'
import Link from 'next/link'
import { usePosts } from '@/lib/api/posts'
import { EmptyState } from '@/components/ui/EmptyState'
import type { ApiPost } from '@/types/api'

const BAR_COLORS = [
  'bg-gradient-to-b from-indigo-500 to-cyan-400',
  'bg-gradient-to-b from-orange-400 to-pink-400',
  'bg-gradient-to-b from-emerald-400 to-emerald-500',
]

export function BlogList() {
  const [search,    setSearch]    = useState('')
  const [activeTag, setActiveTag] = useState<string | null>(null)

  const { data, isLoading, error } = usePosts('status=published&sort=createdAt&order=desc&limit=50')

  const allTags = useMemo(() =>
    Array.from(new Set((data?.data ?? []).flatMap(p => p.tags))),
  [data])

  const filtered = useMemo(() => (data?.data ?? []).filter((p: ApiPost) => {
    const s = search.toLowerCase()
    return (!s || `${p.title} ${p.tags.join(' ')}`.toLowerCase().includes(s))
        && (!activeTag || p.tags.includes(activeTag))
  }), [data, search, activeTag])

  return (
    <div className="bg-[var(--bg-base)] min-h-[70vh]">
      <div className="max-w-[820px] mx-auto px-7 py-12">

        {/* Header */}
        <p className="g-warm text-[10px] uppercase tracking-widest font-medium mb-1.5">Writing</p>
        <div className="flex justify-between items-end mb-6">
          <div>
            <h1 className="text-2xl font-medium text-[var(--text-1)] tracking-tight mb-1">All posts</h1>
            <p className="text-[13px] text-[var(--text-3)]">
              {isLoading ? 'Loading...' : `${data?.meta?.total ?? 0} posts`}
            </p>
          </div>
        </div>

        {/* Search */}
        <div className="relative mb-3">
          <i className="ti ti-search absolute left-3 top-1/2 -translate-y-1/2 text-[13px] text-[var(--text-3)]" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search posts..."
            className="input-base pl-9"
          />
        </div>

        {/* Tags Links */}
        {allTags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-7">
            <button
              onClick={() => setActiveTag(null)}
              className={`px-3 py-1 rounded-full text-[11px] font-medium border transition-all cursor-pointer
                ${!activeTag
                  ? 'bg-orange-400/12 border-orange-400/35 text-orange-400'
                  : 'bg-transparent border-[var(--border)] text-[var(--text-3)] hover:border-[var(--border-mid)]'}`}
            >All</button>
            {allTags.map(t => (
              <button
                key={t}
                onClick={() => setActiveTag(activeTag === t ? null : t)}
                className={`px-3 py-1 rounded-full text-[11px] font-medium border transition-all cursor-pointer
                  ${activeTag === t
                    ? 'bg-orange-400/12 border-orange-400/35 text-orange-400'
                    : 'bg-transparent border-[var(--border)] text-[var(--text-3)] hover:border-[var(--border-mid)]'}`}
              >{t}</button>
            ))}
          </div>
        )}

        {error && (
          <div className="px-4 py-3 rounded-lg bg-red-500/10 border border-red-500/25 text-red-400 text-[13px] mb-5">
            ⚠ Could not load posts
          </div>
        )}

        {isLoading ? (
          <div className="py-12 text-center text-[var(--text-3)]">Loading posts...</div>
        ) : filtered.length === 0 ? (
          <EmptyState
            icon="ti-file-text"
            title={search || activeTag ? 'No posts match' : 'No posts yet'}
            desc={!search && !activeTag ? 'Publish your first post via the admin dashboard.' : undefined}
            action={(search || activeTag) ? { label: 'Clear', onClick: () => { setSearch(''); setActiveTag(null) } } : undefined}
          />
        ) : (
          /* Solid, Unified List Feed mapping strategy */
          <div className="flex flex-col gap-4">
            {filtered.map((post: ApiPost, index: number) => (
              <Link 
                href={`/blog/${post.slug}`} 
                key={post._id || post.slug} 
                className="block no-underline"
              >
                {/* Grid structural alignment check: 
                  4px vertical bar width -> pl-5 padding to push clean text off the accent bar margin layout
                */}
                <div className="grid grid-cols-[4px_1fr] border border-[var(--border)] bg-[var(--bg-surface)] hover:border-[var(--border-mid)] rounded-xl overflow-hidden transition-all duration-150">
                  
                  {/* Left accent color strip */}
                  <div className={BAR_COLORS[index % BAR_COLORS.length]} />
                  
                  {/* Outer Padding Box */}
                  <div className="p-6">
                    {/* Header Row tags */}
                    <div className="flex flex-wrap items-center gap-1.5 mb-2.5">
                      {post.tags.slice(0, 3).map(t => (
                        <span key={t} className="tag">{t}</span>
                      ))}
                      <span className="ml-auto text-[11px] text-[var(--text-3)]">
                        {post.viewCount ?? 0} views
                      </span>
                    </div>

                    {/* Title */}
                    <h2 className="text-[17px] font-medium text-[var(--text-1)] tracking-tight mb-1.5 leading-tight font-syne">
                      {post.title}
                    </h2>

                    {/* Description */}
                    {post.description && (
                      <p className="text-[13px] text-[var(--text-2)] leading-relaxed mb-3.5">
                        {post.description}
                      </p>
                    )}

                    {/* Footer Date Line */}
                    <div className="text-[12px] text-[var(--text-3)]">
                      {new Date(post.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </div>
                  </div>

                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
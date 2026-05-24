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

  // Always split into featured + rest regardless of active tag or search
  const [featured, ...rest] = filtered

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

        {/* Tags */}
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
          <>
            {/* Featured card — always shows the first result, tag filter or not */}
            {featured && (
              <Link href={`/blog/${featured.slug}`} className="block no-underline mb-3">
                <div className="grid grid-cols-[4px_1fr] card overflow-hidden">
                  <div className={BAR_COLORS[0]} />
                  <div className="p-6">
                    <div className="flex gap-1.5 mb-2.5">
                      {featured.tags.slice(0, 3).map(t => (
                        <span key={t} className="tag">{t}</span>
                      ))}
                      <span className="ml-auto text-[11px] text-[var(--text-3)]">{featured.viewCount} views</span>
                    </div>
                    <h2 className="text-[17px] font-medium text-[var(--text-1)] tracking-tight mb-1.5 leading-tight">{featured.title}</h2>
                    {featured.description && <p className="text-[13px] text-[var(--text-2)] leading-relaxed mb-3">{featured.description}</p>}
                    <span className="text-[12px] text-[var(--text-3)]">
                      {new Date(featured.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </span>
                  </div>
                </div>
              </Link>
            )}

            {/* Row list — remaining results */}
            {rest.length > 0 && (
              <div className="border border-[var(--border)] rounded-xl overflow-hidden">
                {rest.map((post: ApiPost, i: number) => (
                  <div key={post._id}>
                    {i > 0 && <div className="h-px bg-[var(--border)]" />}
                    <Link href={`/blog/${post.slug}`} className="grid grid-cols-[4px_1fr_auto] items-center no-underline row-hover">
                      <div className={`self-stretch ${BAR_COLORS[(i + 1) % BAR_COLORS.length]}`} />
                      <div className="py-4 px-4.5">
                        <p className="text-[14px] font-medium text-[var(--text-1)] mb-1">{post.title}</p>
                        <div className="flex gap-1.5 items-center">
                          {post.tags.slice(0, 3).map(t => <span key={t} className="tag">{t}</span>)}
                          <span className="text-[11px] text-[var(--text-3)] ml-1">{post.viewCount} views</span>
                        </div>
                      </div>
                      <span className="px-4 text-[12px] text-[var(--text-3)] whitespace-nowrap">
                        {new Date(post.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })}
                      </span>
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

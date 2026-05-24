'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useUser } from '@clerk/nextjs'
import type { ApiPost } from '@/types/api'

/* ── Markdown-lite renderer ─────────────────────────────────────────────────── */
function renderBody(body: string) {
  const inline = (text: string) =>
    text.split(/(\*\*[^*]+\*\*)/).map((part, j) =>
      part.startsWith('**') && part.endsWith('**')
        ? <strong key={j} className="text-[var(--text-1)] font-medium">{part.slice(2, -2)}</strong>
        : <span key={j}>{part}</span>
    )

  // Split on code fences FIRST so blank lines inside code blocks are preserved
  const segments = body.split(/(```[\s\S]*?```)/g)
  const nodes: React.ReactNode[] = []
  let key = 0

  for (const seg of segments) {
    if (seg.startsWith('```')) {
      const firstNewline = seg.indexOf('\n')
      const lang = firstNewline > 3 ? seg.slice(3, firstNewline).trim() : ''
      const code = seg
        .slice(firstNewline > 0 ? firstNewline + 1 : 3)
        .replace(/```\s*$/, '')
        .replace(/\n$/, '')
      nodes.push(
        <div key={key++} className="rounded-lg overflow-hidden my-5 border border-[var(--border)]">
          <div className="flex items-center gap-1.5 px-3.5 py-2 bg-[var(--bg-surface)] border-b border-[var(--border)]">
            {['#ff5f57','#ffbd2e','#28c840'].map(c => (
              <div key={c} className="w-2 h-2 rounded-full opacity-75" style={{ background: c }} />
            ))}
            {lang && (
              <span className="ml-auto text-[10px] font-mono text-[var(--text-3)] uppercase tracking-wider">
                {lang}
              </span>
            )}
          </div>
          <pre className="m-0 p-4 bg-[#080a14] overflow-x-auto">
            <code className="text-[12px] font-mono text-white/70 leading-[1.8] whitespace-pre">{code}</code>
          </pre>
        </div>
      )
      continue
    }

    const blocks = seg.split(/\n\n+/).filter(b => b.trim())
    for (const block of blocks) {
      const trimmed = block.trim()

      if (trimmed.startsWith('## ')) {
        nodes.push(
          <h2 key={key++} className="text-[17px] font-medium text-[var(--text-1)] tracking-tight mt-8 mb-2.5 font-syne">
            {trimmed.replace(/^##\s+/, '')}
          </h2>
        )
        continue
      }

      if (trimmed.startsWith('### ')) {
        nodes.push(
          <h3 key={key++} className="text-[15px] font-medium text-[var(--text-1)] tracking-tight mt-6 mb-2">
            {trimmed.replace(/^###\s+/, '')}
          </h3>
        )
        continue
      }

      if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
        const items = trimmed.split('\n').filter(l => /^[-*]\s/.test(l))
        nodes.push(
          <ul key={key++} className="m-0 mb-4 p-0 list-none flex flex-col gap-2">
            {items.map((item, j) => (
              <li key={j} className="flex gap-2.5 text-[14px] text-[var(--text-2)] leading-[1.7]">
                <span className="text-indigo-400 flex-shrink-0">→</span>
                {inline(item.replace(/^[-*]\s/, ''))}
              </li>
            ))}
          </ul>
        )
        continue
      }

      nodes.push(
        <p key={key++} className="text-[14px] text-[var(--text-2)] leading-[1.85] mb-4">
          {inline(trimmed)}
        </p>
      )
    }
  }

  return nodes
}

/* ── Comments ────────────────────────────────────────────────────────────────── */
interface Comment { id: string; initials: string; color: string; handle: string; body: string; time: string }

function Comments({ slug }: { slug: string }) {
  const { isSignedIn, user } = useUser()
  const [list,    setList]    = useState<Comment[]>([])
  const [draft,   setDraft]   = useState('')
  const [posting, setPosting] = useState(false)

  async function submit() {
    if (!draft.trim() || !isSignedIn) return
    setPosting(true)
    await new Promise(r => setTimeout(r, 400))
    const name = user.firstName ?? user.username ?? 'You'
    setList(prev => [...prev, {
      id:       Date.now().toString(),
      initials: name.slice(0, 2).toUpperCase(),
      color:    '#06b6d4',
      handle:   user.username ?? name,
      body:     draft.trim(),
      time:     'just now',
    }])
    setDraft('')
    setPosting(false)
  }

  return (
    <section className="mt-14">
      <div className="h-px bg-[var(--border)] mb-7" />
      <h3 className="text-[15px] font-medium text-[var(--text-1)] mb-6">
        {list.length} comment{list.length !== 1 ? 's' : ''}
      </h3>

      {list.length > 0 && (
        <div className="flex flex-col gap-5 mb-7">
          {list.map(c => (
            <div key={c.id} className="flex gap-3">
              <div
                className="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center border"
                style={{ background: `${c.color}20`, borderColor: `${c.color}40` }}
              >
                <span className="text-[10px] font-semibold" style={{ color: c.color }}>{c.initials}</span>
              </div>
              <div>
                <div className="flex gap-2 items-center mb-1.5">
                  <span className="text-[12px] font-medium text-[var(--text-1)]">@{c.handle}</span>
                  <span className="text-[11px] text-[var(--text-3)]">{c.time}</span>
                </div>
                <p className="text-[13px] text-[var(--text-2)] leading-[1.65]">{c.body}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {isSignedIn ? (
        <div className="flex gap-2.5">
          <div className="w-8 h-8 rounded-full flex-shrink-0 mt-0.5 bg-cyan-500/15 border border-cyan-400/30 flex items-center justify-center">
            <span className="text-[10px] font-semibold text-cyan-400">
              {(user.firstName ?? user.username ?? 'U').slice(0, 2).toUpperCase()}
            </span>
          </div>
          <div className="flex-1">
            <textarea
              value={draft}
              onChange={e => setDraft(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) submit() }}
              placeholder="Leave a comment… (⌘↵ to post)"
              rows={3}
              className="input-base resize-none"
            />
            <div className="flex justify-end mt-2">
              <button
                onClick={submit}
                disabled={!draft.trim() || posting}
                className={draft.trim() ? 'btn-primary btn-sm' : 'btn-ghost btn-sm opacity-40 cursor-not-allowed'}
              >
                {posting ? 'Posting…' : 'Post comment'}
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="py-5 px-6 rounded-xl text-center border border-[var(--border)] bg-[var(--bg-surface)]">
          <p className="text-[13px] text-[var(--text-2)] mb-3.5">Sign in to join the discussion</p>
          <div className="flex gap-2 justify-center">
            <Link href="/login"  className="btn-ghost btn-sm no-underline">Sign in</Link>
            <Link href="/signup" className="btn-primary btn-sm no-underline">Get started</Link>
          </div>
        </div>
      )}
    </section>
  )
}

/* ── Full post ───────────────────────────────────────────────────────────────── */
export function PostContent({ post }: { post: ApiPost }) {
  return (
    <div className="bg-[var(--bg-base)] min-h-[80vh]">
      {/* Header */}
      <div className="px-7 pt-11 pb-8 border-b border-[var(--border)] relative overflow-hidden"
           style={{ background: 'linear-gradient(180deg,#0a0312,#0f0608)' }}>
        {/* Accent line */}
        <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-warm" />

        <div className="max-w-[720px] mx-auto">
          <Link href="/blog" className="text-[12px] text-[var(--text-3)] no-underline inline-flex items-center gap-1.5 mb-5 hover:text-[var(--text-1)] transition-colors">
            ← Writing
          </Link>

          <h1 className="text-[clamp(20px,3vw,28px)] font-medium text-[var(--text-1)] tracking-tight leading-tight mb-3 font-syne">
            {post.title}
          </h1>
          {post.description && (
            <p className="text-[14px] text-[var(--text-2)] leading-relaxed mb-5 max-w-[560px]">
              {post.description}
            </p>
          )}

          {/* Meta */}
          <div className="flex items-center gap-3.5 flex-wrap text-[12px] text-[var(--text-3)]">
            <span className="text-[var(--text-2)]">illustrates.dev</span>
            <span className="text-[var(--border-mid)]">·</span>
            <span>{new Date(post.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
            <span className="text-[var(--border-mid)]">·</span>
            <span>{post.viewCount} views</span>
          </div>

          {/* Tags */}
          <div className="flex gap-1.5 mt-3.5">
            {post.tags.map(t => <span key={t} className="tag">{t}</span>)}
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="max-w-[720px] mx-auto px-7 py-9 pb-16">
        <article>{renderBody(post.body)}</article>
        <Comments slug={post.slug} />
        <div className="mt-10 pt-5 border-t border-[var(--border)]">
          <Link href="/blog" className="text-[13px] text-orange-400 no-underline hover:opacity-75 transition-opacity">
            ← All posts
          </Link>
        </div>
      </div>
    </div>
  )
}

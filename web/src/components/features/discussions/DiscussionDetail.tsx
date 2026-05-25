'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useUser } from '@clerk/nextjs'
import { useDiscussion, useReplies, useCreateReply } from '@/lib/hooks/useDiscussions'
import { Badge } from '@/components/ui/Badge'

function statusVariant(s: string) {
  if (s === 'open')   return 'cyan'
  if (s === 'locked') return 'red'
  return 'neutral'
}

export function DiscussionDetail({ id }: { id: string }) {
  const { isSignedIn, user } = useUser()
  const { data: discussion, isLoading, error } = useDiscussion(id)
  const { data: repliesData, isLoading: repliesLoading } = useReplies(id)
  const createReply = useCreateReply()

  const [body, setBody]   = useState('')
  const [err,  setErr]    = useState('')
  const [posting, setPosting] = useState(false)

  const replies = repliesData?.data ?? []
  const d = discussion

  async function submit() {
    if (!body.trim()) { setErr('Reply cannot be empty'); return }
    if (body.trim().length < 5) { setErr('At least 5 characters'); return }
    setPosting(true); setErr('')
    try {
      await createReply.mutateAsync({ discussionId: id, body: body.trim() })
      setBody('')
    } catch (e) {
      setErr((e as Error).message || 'Failed to post reply')
    } finally {
      setPosting(false)
    }
  }

  if (isLoading) return (
    <div style={{ background:'linear-gradient(180deg,#07041a,#08051c)', minHeight:'70vh', display:'flex', alignItems:'center', justifyContent:'center' }}>
      <p style={{ color:'rgba(255,255,255,0.3)', fontSize:13 }}>Loading…</p>
    </div>
  )

  if (error || !d) return (
    <div style={{ background:'linear-gradient(180deg,#07041a,#08051c)', minHeight:'70vh', display:'flex', alignItems:'center', justifyContent:'center' }}>
      <div style={{ textAlign:'center' }}>
        <p style={{ color:'#f87171', fontSize:13, marginBottom:12 }}>Could not load discussion.</p>
        <Link href="/discussions" style={{ color:'rgba(255,255,255,0.4)', fontSize:13 }}>← Back to discussions</Link>
      </div>
    </div>
  )

  const canReply = isSignedIn && d.status === 'open'

  return (
    <div style={{ background:'linear-gradient(180deg,#07041a,#08051c)', minHeight:'70vh' }}>
      <div style={{ maxWidth:720, margin:'0 auto', padding:'48px 28px 80px' }}>

        {/* Back */}
        <Link href="/discussions" style={{ fontSize:12, color:'rgba(255,255,255,0.3)', textDecoration:'none', display:'inline-block', marginBottom:24 }}>
          ← Discussions
        </Link>

        {/* Discussion header */}
        <div style={{ padding:'24px', borderRadius:12, background:'rgba(255,255,255,0.02)', border:'0.5px solid rgba(255,255,255,0.08)', marginBottom:24 }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:12 }}>
            <h1 style={{ fontSize:20, fontWeight:500, color:'#f0f4ff', letterSpacing:'-0.02em', flex:1, marginRight:12 }}>{d.title}</h1>
            <Badge variant={statusVariant(d.status)}>{d.status}</Badge>
          </div>

          <p style={{ fontSize:14, color:'rgba(255,255,255,0.55)', lineHeight:1.75, marginBottom:16, whiteSpace:'pre-wrap' }}>{d.body}</p>

          <div style={{ display:'flex', gap:12, fontSize:11, color:'rgba(255,255,255,0.25)', alignItems:'center', flexWrap:'wrap' }}>
            <span>@{d.authorUsername ?? 'unknown'}</span>
            <span>·</span>
            <span>{new Date(d.createdAt).toLocaleDateString('en-GB', { day:'2-digit', month:'short', year:'numeric' })}</span>
            <span>·</span>
            <span>{d.replyCount} {d.replyCount === 1 ? 'reply' : 'replies'}</span>
            {d.tags?.map((t: string) => (
              <span key={t} style={{ padding:'1px 6px', borderRadius:3, background:'rgba(255,255,255,0.06)', border:'0.5px solid rgba(255,255,255,0.1)', fontFamily:'monospace' }}>{t}</span>
            ))}
          </div>
        </div>

        {/* Replies */}
        {repliesLoading ? (
          <p style={{ color:'rgba(255,255,255,0.25)', fontSize:13, marginBottom:24 }}>Loading replies…</p>
        ) : replies.length > 0 ? (
          <div style={{ display:'flex', flexDirection:'column', gap:8, marginBottom:24 }}>
            {replies.map((r: any) => (
              <div key={r._id} style={{ padding:'16px 20px', borderRadius:10, background:'rgba(255,255,255,0.02)', border:'0.5px solid rgba(255,255,255,0.07)' }}>
                <div style={{ display:'flex', gap:8, alignItems:'center', marginBottom:8 }}>
                  <div style={{ width:26, height:26, borderRadius:'50%', background:'rgba(6,182,212,0.15)', border:'0.5px solid rgba(6,182,212,0.3)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:10, fontWeight:600, color:'#06b6d4' }}>
                    {(r.authorUsername ?? 'U').slice(0,2).toUpperCase()}
                  </div>
                  <span style={{ fontSize:12, fontWeight:500, color:'rgba(255,255,255,0.6)' }}>@{r.authorUsername ?? 'unknown'}</span>
                  <span style={{ fontSize:11, color:'rgba(255,255,255,0.2)' }}>{new Date(r.createdAt).toLocaleDateString()}</span>
                </div>
                <p style={{ fontSize:13, color:'rgba(255,255,255,0.5)', lineHeight:1.7, whiteSpace:'pre-wrap' }}>{r.body}</p>
              </div>
            ))}
          </div>
        ) : (
          <p style={{ color:'rgba(255,255,255,0.2)', fontSize:13, marginBottom:24 }}>No replies yet — be the first.</p>
        )}

        {/* Reply form */}
        {d.status === 'locked' && (
          <div style={{ padding:'12px 16px', borderRadius:8, background:'rgba(239,68,68,0.08)', border:'0.5px solid rgba(239,68,68,0.2)', fontSize:13, color:'rgba(239,68,68,0.7)' }}>
            🔒 This discussion is locked. No new replies can be posted.
          </div>
        )}

        {d.status === 'closed' && (
          <div style={{ padding:'12px 16px', borderRadius:8, background:'rgba(255,255,255,0.04)', border:'0.5px solid rgba(255,255,255,0.08)', fontSize:13, color:'rgba(255,255,255,0.3)' }}>
            This discussion is closed.
          </div>
        )}

        {canReply && (
          <div style={{ padding:'20px', borderRadius:12, background:'rgba(255,255,255,0.02)', border:'0.5px solid rgba(255,255,255,0.08)' }}>
            <div style={{ display:'flex', gap:12 }}>
              <div style={{ width:28, height:28, borderRadius:'50%', background:'rgba(6,182,212,0.15)', border:'0.5px solid rgba(6,182,212,0.3)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:10, fontWeight:600, color:'#06b6d4', flexShrink:0 }}>
                {(user?.firstName ?? user?.username ?? 'U').slice(0,2).toUpperCase()}
              </div>
              <div style={{ flex:1, display:'flex', flexDirection:'column', gap:10 }}>
                <textarea
                  value={body}
                  onChange={e => { setBody(e.target.value); setErr('') }}
                  onKeyDown={e => { if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) submit() }}
                  rows={4}
                  placeholder="Write a reply… (⌘↵ to post)"
                  style={{ width:'100%', padding:'10px 12px', borderRadius:8, border:`0.5px solid ${err ? 'rgba(239,68,68,0.5)' : 'rgba(255,255,255,0.1)'}`, background:'rgba(255,255,255,0.04)', color:'#f0f4ff', fontSize:13, lineHeight:1.6, outline:'none', resize:'vertical', fontFamily:'inherit' }}
                />
                {err && <p style={{ fontSize:11, color:'#f87171' }}>⚠ {err}</p>}
                <div style={{ display:'flex', justifyContent:'flex-end' }}>
                  <button
                    onClick={submit}
                    disabled={!body.trim() || posting}
                    style={{ padding:'7px 16px', borderRadius:8, border:'none', background: body.trim() ? 'linear-gradient(135deg,#06b6d4,#818cf8)' : 'rgba(255,255,255,0.08)', color: body.trim() ? '#fff' : 'rgba(255,255,255,0.3)', fontSize:13, fontWeight:500, cursor: body.trim() ? 'pointer' : 'not-allowed', fontFamily:'inherit' }}
                  >
                    {posting ? 'Posting…' : 'Post reply'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {!isSignedIn && d.status === 'open' && (
          <div style={{ padding:'16px 20px', borderRadius:10, textAlign:'center', background:'rgba(255,255,255,0.02)', border:'0.5px solid rgba(255,255,255,0.08)' }}>
            <p style={{ fontSize:13, color:'rgba(255,255,255,0.3)', marginBottom:12 }}>Sign in to reply</p>
            <Link href="/login" style={{ padding:'7px 16px', borderRadius:8, background:'rgba(6,182,212,0.15)', border:'0.5px solid rgba(6,182,212,0.3)', color:'#06b6d4', fontSize:13, textDecoration:'none' }}>Sign in</Link>
          </div>
        )}
      </div>
    </div>
  )
}

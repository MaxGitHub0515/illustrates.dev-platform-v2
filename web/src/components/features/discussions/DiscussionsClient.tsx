'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useDiscussions } from '@/lib/hooks/useDiscussions'
import { useUser }        from '@clerk/nextjs'
import { Badge }          from '@/components/ui/Badge'
import { EmptyState }     from '@/components/ui/EmptyState'
import { Button }         from '@/components/ui/Button'
import type { ApiDiscussion } from '@/types/api'

export function DiscussionsClient() {
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('open')
  const { isSignedIn } = useUser()

  const params = `status=${status}${search ? `&search=${encodeURIComponent(search)}` : ''}&sort=createdAt&order=desc`
  const { data, isLoading, error } = useDiscussions(params)
  const items = data?.data ?? []

  return (
    <div style={{ background:'linear-gradient(180deg,#07041a,#08051c)', minHeight:'70vh' }}>
      <div style={{ maxWidth:860, margin:'0 auto', padding:'48px 28px 64px' }}>

        {/* Header */}
        <p style={{ fontSize:10, letterSpacing:'0.12em', textTransform:'uppercase', fontWeight:500, marginBottom:6, background:'linear-gradient(90deg,#06b6d4,#818cf8)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>Community</p>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-end', marginBottom:24 }}>
          <div>
            <h1 style={{ fontSize:24, fontWeight:500, color:'#f0f4ff', letterSpacing:'-0.03em', marginBottom:4 }}>Discussions</h1>
            <p style={{ fontSize:13, color:'rgba(255,255,255,0.3)' }}>{isLoading ? 'Loading...' : `${data?.meta?.total ?? 0} threads`}</p>
          </div>
          {isSignedIn ? (
            <Link href="/discussions/new"><Button size="sm">+ New thread</Button></Link>
          ) : (
            <Link href="/login"><Button variant="ghost" size="sm">Sign in to post</Button></Link>
          )}
        </div>

        {/* Filters */}
        <div style={{ display:'flex', gap:10, marginBottom:18 }}>
          <div style={{ position:'relative', flex:1 }}>
            <i className="ti ti-search" style={{ position:'absolute', left:11, top:'50%', transform:'translateY(-50%)', fontSize:13, color:'rgba(255,255,255,0.25)' }} />
            <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search discussions..."
                   style={{ width:'100%', padding:'9px 12px 9px 32px', borderRadius:8, border:'0.5px solid rgba(255,255,255,0.1)', background:'rgba(255,255,255,0.04)', color:'#f0f4ff', fontSize:13, outline:'none', fontFamily:'inherit' }} />
          </div>
          <div style={{ display:'flex', gap:5 }}>
            {(['open','closed','locked'] as const).map(s => (
              <button key={s} onClick={()=>setStatus(s)} style={{ padding:'6px 14px', borderRadius:7, fontSize:12, cursor:'pointer', border:'0.5px solid', background:status===s?'rgba(6,182,212,0.15)':'transparent', borderColor:status===s?'rgba(6,182,212,0.4)':'rgba(255,255,255,0.08)', color:status===s?'#06b6d4':'rgba(255,255,255,0.4)', fontWeight:status===s?500:400 }}>{s}</button>
            ))}
          </div>
        </div>

        {error && <div style={{ padding:'12px', borderRadius:8, background:'rgba(239,68,68,0.1)', border:'0.5px solid rgba(239,68,68,0.25)', color:'#f87171', fontSize:13, marginBottom:18 }}>⚠ Could not load discussions — is the backend running?</div>}

        {isLoading ? (
          <div style={{ padding:'48px', textAlign:'center', color:'rgba(255,255,255,0.3)' }}>Loading...</div>
        ) : items.length === 0 ? (
          <EmptyState icon="ti-messages" title="No discussions yet"
            desc={isSignedIn ? 'Start the first thread!' : 'Sign in to start a discussion.'} />
        ) : (
          <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
            {items.map((d: ApiDiscussion) => (
              <Link key={d._id} href={`/discussions/${d._id}`} style={{ textDecoration:'none', display:'block' }}>
                <div style={{ padding:'18px 20px', borderRadius:10, background:'rgba(255,255,255,0.02)', border:'0.5px solid rgba(255,255,255,0.08)', cursor:'pointer', transition:'all 0.15s' }} className="hover-card">
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:8 }}>
                    <p style={{ fontSize:14, fontWeight:500, color:'#f0f4ff', flex:1, marginRight:12 }}>{d.title}</p>
                    <Badge variant={d.status==='open'?'cyan':d.status==='locked'?'red':'neutral'}>{d.status}</Badge>
                  </div>
                  <p style={{ fontSize:12, color:'rgba(255,255,255,0.35)', marginBottom:10 }}>{d.body.slice(0,140)}…</p>
                  <div style={{ display:'flex', gap:12, fontSize:11, color:'rgba(255,255,255,0.25)', alignItems:'center' }}>
                    <span>@{d.authorUsername ?? 'unknown'}</span>
                    <span>·</span>
                    <span>{d.replyCount} replies</span>
                    <span>·</span>
                    <span>{new Date(d.createdAt).toLocaleDateString()}</span>
                    {d.tags.map(t => (
                      <span key={t} style={{ padding:'1px 6px', borderRadius:3, background:'rgba(255,255,255,0.06)', border:'0.5px solid rgba(255,255,255,0.1)', fontFamily:'monospace' }}>{t}</span>
                    ))}
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

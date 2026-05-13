'use client'
import { useState } from 'react'
import { useMyDiscussions } from '@/lib/hooks/useDiscussions'
import type { ApiDiscussion } from '@/types/api'

export default function DashboardDiscussions() {
  const { data, isLoading } = useMyDiscussions()
  const discussions = data?.data ?? []

  return (
    <div>
      <h1 style={{ fontSize:20, fontWeight:500, color:'#f0f4ff', marginBottom:4 }}>My discussions</h1>
      <p style={{ fontSize:13, color:'rgba(255,255,255,0.35)', marginBottom:24 }}>{discussions.length} total</p>

      {isLoading ? (
        <div style={{ padding:'48px', textAlign:'center', color:'rgba(255,255,255,0.3)' }}>Loading...</div>
      ) : discussions.length === 0 ? (
        <div style={{ padding:'40px', textAlign:'center', border:'0.5px solid rgba(255,255,255,0.07)', borderRadius:10 }}>
          <p style={{ fontSize:14, color:'rgba(255,255,255,0.35)', marginBottom:8 }}>No discussions yet</p>
          <p style={{ fontSize:12, color:'rgba(255,255,255,0.25)' }}>Start a thread on any project page.</p>
        </div>
      ) : (
        <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
          {discussions.map((d: ApiDiscussion) => (
            <div key={d._id} style={{ padding:'18px 20px', borderRadius:10, background:'rgba(255,255,255,0.03)', border:'0.5px solid rgba(255,255,255,0.07)' }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:6 }}>
                <p style={{ fontSize:14, fontWeight:500, color:'#f0f4ff' }}>{d.title}</p>
                <span style={{ fontSize:10, padding:'2px 8px', borderRadius:999, background: d.status==='open' ? 'rgba(34,197,94,0.1)' : 'rgba(255,255,255,0.06)', color: d.status==='open' ? '#22c55e' : 'rgba(255,255,255,0.35)', border: d.status==='open' ? '0.5px solid rgba(34,197,94,0.25)' : '0.5px solid rgba(255,255,255,0.1)', marginLeft:12, flexShrink:0 }}>
                  {d.status}
                </span>
              </div>
              <p style={{ fontSize:12, color:'rgba(255,255,255,0.35)', marginBottom:8 }}>{d.body.slice(0,120)}...</p>
              <div style={{ display:'flex', gap:12, fontSize:11, color:'rgba(255,255,255,0.25)' }}>
                <span>{d.replyCount} replies</span>
                <span>·</span>
                <span>{new Date(d.createdAt).toLocaleDateString()}</span>
                {d.tags.map(t => <span key={t} style={{ padding:'1px 6px', borderRadius:3, background:'rgba(255,255,255,0.06)', border:'0.5px solid rgba(255,255,255,0.1)', fontFamily:'monospace' }}>{t}</span>)}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

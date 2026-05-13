'use client'
import { useEffect, useCallback } from 'react'
import type { ApiProject } from '@/types/api'

interface Props { project: ApiProject | null; onClose: () => void }

export function ProjectModal({ project, onClose }: Props) {
  const handleKey = useCallback((e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }, [onClose])
  useEffect(() => {
    if (!project) return
    document.addEventListener('keydown', handleKey)
    document.body.style.overflow = 'hidden'
    return () => { document.removeEventListener('keydown', handleKey); document.body.style.overflow = '' }
  }, [project, handleKey])

  if (!project) return null

  return (
    <>
      <style>{`@keyframes modal-in{from{opacity:0;transform:scale(0.97)}to{opacity:1;transform:scale(1)}}`}</style>
      <div onClick={onClose} role="dialog" aria-modal="true" aria-label={project.title} style={{ position:'fixed', inset:0, zIndex:100, background:'rgba(4,2,16,0.85)', backdropFilter:'blur(8px)', display:'flex', alignItems:'center', justifyContent:'center', padding:24, animation:'modal-in 0.2s ease' }}>
        <div onClick={e=>e.stopPropagation()} style={{ width:'100%', maxWidth:800, maxHeight:'88vh', background:'linear-gradient(180deg,#0d0b1e,#0a0818)', border:'0.5px solid rgba(99,102,241,0.25)', borderRadius:14, overflow:'hidden', display:'flex', flexDirection:'column' }}>

          {/* Header */}
          <div style={{ padding:'18px 24px', borderBottom:'0.5px solid rgba(255,255,255,0.06)', display:'flex', alignItems:'center', gap:12, background:'rgba(99,102,241,0.04)', flexShrink:0 }}>
            <div style={{ flex:1 }}>
              <p style={{ fontSize:15, fontWeight:500, color:'#f0f4ff' }}>{project.title}</p>
              <p style={{ fontSize:11, color:'rgba(255,255,255,0.3)', marginTop:1 }}>
                {new Date(project.createdAt).getFullYear()} · {project.techStack?.[0] ?? 'project'}
              </p>
            </div>
            <div style={{ display:'flex', gap:8 }}>
              {project.githubUrl && <a href={project.githubUrl} target="_blank" rel="noreferrer" style={{ display:'inline-flex', alignItems:'center', gap:5, fontSize:12, padding:'6px 12px', borderRadius:6, border:'0.5px solid rgba(6,182,212,0.28)', background:'rgba(6,182,212,0.08)', color:'#06b6d4', textDecoration:'none' }}>Code ↗</a>}
              {project.liveUrl   && <a href={project.liveUrl}   target="_blank" rel="noreferrer" style={{ display:'inline-flex', alignItems:'center', gap:5, fontSize:12, padding:'6px 12px', borderRadius:6, border:'0.5px solid rgba(6,182,212,0.28)', background:'rgba(6,182,212,0.08)', color:'#06b6d4', textDecoration:'none' }}>Live ↗</a>}
              <button onClick={onClose} style={{ width:30, height:30, borderRadius:7, border:'0.5px solid rgba(255,255,255,0.08)', background:'rgba(255,255,255,0.04)', color:'rgba(255,255,255,0.4)', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center' }}>✕</button>
            </div>
          </div>

          {/* Body */}
          <div style={{ overflowY:'auto', flex:1, padding:24 }}>
            <p style={{ fontSize:14, color:'rgba(255,255,255,0.5)', lineHeight:1.8, marginBottom:20 }}>{project.description}</p>

            {/* Metrics */}
            <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:10, marginBottom:22 }}>
              {[
                { label:'Views',  value: project.viewCount, color:'#06b6d4' },
                { label:'Likes',  value: project.likeCount, color:'#f472b6' },
                { label:'Status', value: project.status,    color:'#22c55e' },
              ].map(m => (
                <div key={m.label} style={{ padding:'12px', borderRadius:8, background:'rgba(255,255,255,0.03)', border:'0.5px solid rgba(255,255,255,0.07)', textAlign:'center' }}>
                  <p style={{ fontSize:18, fontWeight:600, color:m.color, lineHeight:1 }}>{m.value}</p>
                  <p style={{ fontSize:10, color:'rgba(255,255,255,0.3)', marginTop:3 }}>{m.label}</p>
                </div>
              ))}
            </div>

            {/* Tech stack */}
            {project.techStack?.length > 0 && (
              <div style={{ marginBottom:18 }}>
                <p style={{ fontSize:10, letterSpacing:'0.1em', textTransform:'uppercase', color:'rgba(255,255,255,0.25)', marginBottom:10 }}>Tech stack</p>
                <div style={{ display:'flex', flexWrap:'wrap', gap:5 }}>
                  {project.techStack.map(t => (
                    <span key={t} style={{ display:'inline-block', padding:'3px 9px', borderRadius:4, fontSize:11, fontFamily:'monospace', background:'rgba(255,255,255,0.06)', border:'0.5px solid rgba(255,255,255,0.1)', color:'rgba(255,255,255,0.5)' }}>{t}</span>
                  ))}
                </div>
              </div>
            )}

            {/* Body markdown (raw for now) */}
            {project.body && (
              <div>
                <p style={{ fontSize:10, letterSpacing:'0.1em', textTransform:'uppercase', color:'rgba(255,255,255,0.25)', marginBottom:10 }}>About this project</p>
                <div style={{ fontSize:13, color:'rgba(255,255,255,0.45)', lineHeight:1.8, whiteSpace:'pre-wrap' }}>{project.body}</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

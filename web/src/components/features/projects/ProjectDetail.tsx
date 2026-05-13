'use client'
import Link from 'next/link'
import type { ApiProject } from '@/types/api'
import { Badge } from '@/components/ui/Badge'

function renderMarkdown(body: string) {
  return body.split('\n\n').map((block, i) => {
    if (block.startsWith('## ')) return <h2 key={i} style={{ fontSize:18, fontWeight:500, color:'#f0f4ff', margin:'28px 0 10px' }}>{block.replace('## ','')}</h2>
    if (block.startsWith('```')) {
      const code = block.replace(/```[a-z]*/,'').replace(/```/,'').trim()
      return <pre key={i} style={{ background:'#080a14', border:'0.5px solid rgba(255,255,255,0.08)', borderRadius:8, padding:'14px 18px', overflow:'auto', fontSize:12, color:'rgba(255,255,255,0.7)', lineHeight:1.8, fontFamily:"'JetBrains Mono',monospace", margin:'16px 0' }}>{code}</pre>
    }
    return <p key={i} style={{ fontSize:14, color:'rgba(255,255,255,0.5)', lineHeight:1.85, marginBottom:16 }}>{block}</p>
  })
}

export function ProjectDetail({ project }: { project: ApiProject }) {
  const statusVariant = project.status === 'published' ? 'green' : project.status === 'draft' ? 'orange' : 'neutral'

  return (
    <div style={{ background:'linear-gradient(180deg,#060412,#08051c)', minHeight:'80vh' }}>
      {/* Header */}
      <div style={{ padding:'44px 28px 36px', borderBottom:'0.5px solid rgba(99,102,241,0.15)', position:'relative', overflow:'hidden' }}>
        <div style={{ position:'absolute', top:0, left:0, right:0, height:3, background:'linear-gradient(90deg,#4f46e5,#06b6d4)' }} />
        <div style={{ maxWidth:900, margin:'0 auto' }}>
          <Link href="/projects" style={{ fontSize:12, color:'rgba(255,255,255,0.35)', textDecoration:'none', display:'inline-flex', alignItems:'center', gap:5, marginBottom:20 }}>← Projects</Link>

          <div style={{ display:'grid', gridTemplateColumns:'1fr auto', gap:24, alignItems:'start' }}>
            <div>
              <div style={{ display:'flex', gap:8, alignItems:'center', marginBottom:14 }}>
                <Badge variant={statusVariant}>{project.status}</Badge>
                {project.featured && <Badge variant="indigo">Featured</Badge>}
              </div>
              <h1 style={{ fontSize:'clamp(22px,3vw,32px)', fontWeight:500, color:'#f0f4ff', letterSpacing:'-0.03em', lineHeight:1.2, marginBottom:10 }}>{project.title}</h1>
              <p style={{ fontSize:14, color:'rgba(255,255,255,0.4)', lineHeight:1.65, maxWidth:600 }}>{project.description}</p>
            </div>

            {/* Info card */}
            <div style={{ padding:'18px 20px', borderRadius:10, background:'rgba(255,255,255,0.03)', border:'0.5px solid rgba(255,255,255,0.08)', minWidth:180 }}>
              {[
                { label:'Year',  value: new Date(project.createdAt).getFullYear() },
                { label:'Views', value: project.viewCount },
                { label:'Likes', value: project.likeCount },
              ].map(r => (
                <div key={r.label} style={{ display:'flex', justifyContent:'space-between', padding:'6px 0', borderBottom:'0.5px solid rgba(255,255,255,0.05)' }}>
                  <span style={{ fontSize:11, color:'rgba(255,255,255,0.35)' }}>{r.label}</span>
                  <span style={{ fontSize:11, color:'#f0f4ff', fontWeight:500 }}>{r.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Links */}
          <div style={{ display:'flex', gap:10, marginTop:22 }}>
            {project.githubUrl && <a href={project.githubUrl} target="_blank" rel="noreferrer" style={{ display:'inline-flex', alignItems:'center', gap:6, padding:'8px 16px', borderRadius:7, border:'0.5px solid rgba(6,182,212,0.3)', background:'rgba(6,182,212,0.08)', color:'#06b6d4', textDecoration:'none', fontSize:13 }}>↗ View source</a>}
            {project.liveUrl   && <a href={project.liveUrl}   target="_blank" rel="noreferrer" style={{ display:'inline-flex', alignItems:'center', gap:6, padding:'8px 16px', borderRadius:7, background:'linear-gradient(135deg,#4f46e5,#06b6d4)', color:'#fff', textDecoration:'none', fontSize:13, fontWeight:500 }}>↗ Live demo</a>}
          </div>

          {/* Tags */}
          {project.tags?.length > 0 && (
            <div style={{ display:'flex', gap:5, marginTop:16, flexWrap:'wrap' }}>
              {project.tags.map(t => <span key={t} style={{ display:'inline-block', padding:'3px 9px', borderRadius:4, fontSize:11, fontFamily:'monospace', background:'rgba(255,255,255,0.06)', border:'0.5px solid rgba(255,255,255,0.1)', color:'rgba(255,255,255,0.5)' }}>{t}</span>)}
            </div>
          )}
        </div>
      </div>

      {/* Body */}
      <div style={{ maxWidth:900, margin:'0 auto', padding:'36px 28px 64px', display:'grid', gridTemplateColumns:'1fr 240px', gap:40, alignItems:'start' }}>
        <article>{project.body ? renderMarkdown(project.body) : <p style={{ color:'rgba(255,255,255,0.25)', fontSize:13 }}>No description written yet.</p>}</article>

        {/* Tech stack sidebar */}
        {project.techStack?.length > 0 && (
          <div style={{ padding:'18px', borderRadius:10, background:'rgba(255,255,255,0.02)', border:'0.5px solid rgba(255,255,255,0.07)', position:'sticky', top:70 }}>
            <p style={{ fontSize:10, letterSpacing:'0.1em', textTransform:'uppercase', color:'rgba(255,255,255,0.25)', marginBottom:12 }}>Tech stack</p>
            <div style={{ display:'flex', flexWrap:'wrap', gap:5 }}>
              {project.techStack.map(t => <span key={t} style={{ display:'inline-block', padding:'3px 8px', borderRadius:4, fontSize:11, fontFamily:'monospace', background:'rgba(255,255,255,0.05)', border:'0.5px solid rgba(255,255,255,0.1)', color:'rgba(255,255,255,0.5)' }}>{t}</span>)}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

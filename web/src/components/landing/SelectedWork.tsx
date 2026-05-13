'use client'
import Link from 'next/link'
import type { ApiProject } from '@/types/api'

export function SelectedWork({ projects }: { projects: ApiProject[] }) {
  const [featured, ...rest] = projects

  return (
    <section id="work" className="px-6 md:px-7 py-12 md:py-[52px]"
             style={{ background: 'var(--section-work)' }}>
      <div className="max-w-[1200px] mx-auto">
        <div className="flex justify-between items-baseline mb-6">
          <div>
            <p className="g-primary text-[10px] uppercase tracking-[0.12em] font-medium mb-1">Portfolio</p>
            <h2 className="text-[18px] font-medium text-[var(--text-1)]">Selected work</h2>
          </div>
          <Link href="/projects" className="text-[12px] text-cyan-400 no-underline hover:opacity-75">All projects →</Link>
        </div>

        {projects.length === 0 ? (
          <div className="py-10 text-center border border-[var(--border)] rounded-xl text-[var(--text-3)] text-[13px]">
            No projects yet —{' '}
            <Link href="/admin/projects" className="text-indigo-400 no-underline">add one via admin</Link>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {/* Featured */}
            {featured && (
              <div className="rounded-xl p-5 md:p-6 border"
                   style={{ background:'linear-gradient(135deg,rgba(99,102,241,0.09),rgba(6,182,212,0.06))', borderColor:'rgba(99,102,241,0.28)' }}>
                <div className="flex flex-col md:flex-row md:items-start gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2.5 mb-3">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                           style={{ background:'linear-gradient(135deg,#4f46e5,#06b6d4)' }}>
                        <span className="text-sm text-white">⬡</span>
                      </div>
                      <div>
                        <p className="text-[14px] font-medium text-[var(--text-1)]">{featured.title}</p>
                        <p className="text-[11px] text-[var(--text-3)]">
                          {new Date(featured.createdAt).getFullYear()} · {featured.techStack?.[0] ?? 'full-stack'}
                        </p>
                      </div>
                    </div>
                    <p className="text-[13px] text-[var(--text-2)] leading-relaxed mb-3">{featured.description}</p>
                    <div className="flex flex-wrap gap-1">
                      {featured.tags.map(t => <span key={t} className="tag">{t}</span>)}
                    </div>
                  </div>
                  <div className="flex items-center gap-3 md:flex-col md:items-end md:flex-shrink-0">
                    <div className="flex gap-3">
                      {featured.githubUrl && <a href={featured.githubUrl} target="_blank" rel="noreferrer" className="text-[11px] text-cyan-400 no-underline hover:opacity-75">Code ↗</a>}
                      {featured.liveUrl   && <a href={featured.liveUrl}   target="_blank" rel="noreferrer" className="text-[11px] text-cyan-400 no-underline hover:opacity-75">Live ↗</a>}
                    </div>
                    <div className="text-right">
                      <p className="g-primary text-[20px] font-medium leading-none">{featured.viewCount}</p>
                      <p className="text-[10px] text-[var(--text-3)] mt-0.5">views</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Rest */}
            {rest.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {rest.map((p, i) => {
                  const accent = i === 0 ? '#22c55e' : '#fb923c'
                  return (
                    <div key={p._id} className="rounded-xl p-4 border-l-[3px]"
                         style={{ background:`linear-gradient(135deg,${accent}12,${accent}08)`, borderColor: accent, borderTopWidth:1, borderRightWidth:1, borderBottomWidth:1, borderTopColor: `${accent}25`, borderRightColor:`${accent}25`, borderBottomColor:`${accent}25` }}>
                      <div className="flex justify-between mb-2">
                        <p className="text-[13px] font-medium text-[var(--text-1)]">{p.title}</p>
                        <p className="text-[15px] font-medium" style={{ color: accent }}>{p.viewCount}</p>
                      </div>
                      <p className="text-[12px] text-[var(--text-2)] leading-relaxed mb-2.5">{p.description}</p>
                      <div className="flex flex-wrap gap-1 mb-2.5">
                        {p.tags.slice(0,3).map(t => <span key={t} className="tag">{t}</span>)}
                      </div>
                      <div className="flex gap-3">
                        {p.githubUrl && <a href={p.githubUrl} target="_blank" rel="noreferrer" className="text-[12px] no-underline hover:opacity-75" style={{ color: accent }}>↗ Code</a>}
                        {p.liveUrl   && <a href={p.liveUrl}   target="_blank" rel="noreferrer" className="text-[12px] no-underline hover:opacity-75" style={{ color: accent }}>↗ Live</a>}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  )
}

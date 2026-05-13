'use client'
import React, { useState, useMemo } from 'react'
import { useProjects }     from '@/lib/api/projects'
import { useProjectStore } from '@/lib/store/project.store'
import { ProjectModal }    from './ProjectModal'
import { EmptyState }      from '@/components/ui/EmptyState'
import { Badge }           from '@/components/ui/Badge'
import type { ApiProject } from '@/types/api'

function ProjectCard({ project, onClick }: { project: ApiProject; onClick: () => void }) {
  const locked = project.status !== 'published'
  const v = project.status === 'published' ? 'green' : project.status === 'draft' ? 'orange' : 'neutral'
  return (
    <div onClick={locked ? undefined : onClick}
         className={`card card-hover overflow-hidden flex flex-col ${locked ? 'opacity-60' : 'cursor-pointer'}`}>
      <div className="h-16 sm:h-20 flex items-center justify-center relative"
           style={{ background:'rgba(99,102,241,0.08)', borderBottom:'1px solid var(--border)' }}>
        <span className="text-2xl sm:text-3xl opacity-20">⬡</span>
        <div className="absolute top-1.5 right-1.5 sm:top-2 sm:right-2">
          <Badge variant={v} dot>{project.status}</Badge>
        </div>
      </div>
      <div className="p-3 sm:p-3.5 flex flex-col flex-1">
        <div className="flex justify-between items-start mb-1">
          <p className="text-[12px] sm:text-[13px] font-medium text-[var(--text-1)] leading-tight flex-1 mr-1">{project.title}</p>
          <span className="text-[11px] sm:text-[12px] font-medium text-[var(--accent-from)] flex-shrink-0">{project.viewCount}</span>
        </div>
        <p className="text-[11px] text-[var(--text-2)] leading-relaxed mb-2 flex-1 line-clamp-2">{project.description}</p>
        <div className="flex flex-wrap gap-1 mb-2">
          {project.tags.slice(0, 3).map(t => <span key={t} className="tag">{t}</span>)}
        </div>
        <div className="flex gap-2 items-center">
          {project.githubUrl && <a href={project.githubUrl} target="_blank" rel="noreferrer" onClick={e=>e.stopPropagation()} className="text-[11px] text-[var(--accent-to)] no-underline hover:opacity-70">↗ Code</a>}
          {project.liveUrl   && <a href={project.liveUrl}   target="_blank" rel="noreferrer" onClick={e=>e.stopPropagation()} className="text-[11px] text-[var(--accent-to)] no-underline hover:opacity-70">↗ Live</a>}
          {locked && <i className="ti ti-lock text-[12px] text-[var(--text-3)] ml-auto" />}
        </div>
      </div>
    </div>
  )
}

export function ProjectsClient() {
  const [selected, setSelected] = useState<ApiProject | null>(null)
  const { search, sort, setSearch, setSort, clearFilters } = useProjectStore()

  const params = `status=published&sort=createdAt&order=desc&limit=50${search ? `&search=${encodeURIComponent(search)}` : ''}`
  const { data, isLoading, error } = useProjects(params)

  const projects = useMemo(() => {
    let list = [...(data?.data ?? [])]
    if (sort === 'views') list.sort((a,b) => b.viewCount - a.viewCount)
    if (sort === 'alpha') list.sort((a,b) => a.title.localeCompare(b.title))
    return list
  }, [data, sort])

  return (
    <>
      <div className="bg-[var(--bg-base)] px-4 sm:px-6 md:px-7 pt-7 sm:pt-9">
        <div className="max-w-[1100px] mx-auto">
          <p className="g-primary text-[10px] uppercase tracking-widest font-medium mb-1">Portfolio</p>
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end mb-4 sm:mb-5 gap-1">
            <div>
              <h1 className="text-xl sm:text-2xl font-medium text-[var(--text-1)] tracking-tight mb-0.5">Projects</h1>
              <p className="text-[12px] sm:text-[13px] text-[var(--text-3)]">
                {isLoading ? 'Loading…' : `${data?.meta?.total ?? 0} published`}
              </p>
            </div>
          </div>
          {/* Search + sort — stack on mobile */}
          <div className="flex flex-col sm:flex-row gap-2 pb-4 border-b border-[var(--border)]">
            <div className="relative flex-1">
              <i className="ti ti-search absolute left-3 top-1/2 -translate-y-1/2 text-[12px] text-[var(--text-3)]" />
              <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search projects…"
                     className="input-base pl-8 w-full" />
            </div>
            <select value={sort} onChange={e=>setSort(e.target.value as 'newest'|'views'|'alpha')}
                    className="input-base w-full sm:w-[140px] cursor-pointer">
              <option value="newest">Newest first</option>
              <option value="views">Most viewed</option>
              <option value="alpha">A–Z</option>
            </select>
          </div>
        </div>
      </div>

      <div className="bg-[var(--bg-base)] px-4 sm:px-6 md:px-7 py-4 sm:py-6 pb-10 sm:pb-12">
        <div className="max-w-[1100px] mx-auto">
          {error && <p className="px-4 py-3 rounded-lg mb-4 text-[12px] sm:text-[13px] text-red-400" style={{background:'rgba(239,68,68,0.1)',border:'1px solid rgba(239,68,68,0.25)'}}>⚠ Could not load projects — is the backend running?</p>}
          {isLoading ? (
            <div className="py-12 sm:py-16 text-center text-[var(--text-3)]">Loading projects…</div>
          ) : projects.length === 0 ? (
            <EmptyState icon="ti-code"
              title={search ? 'No projects match' : 'No projects yet'}
              desc={!search ? 'Add your first project via the admin dashboard.' : undefined}
              action={search ? { label:'Clear search', onClick: clearFilters } : undefined} />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3">
              {projects.map(p => <ProjectCard key={p._id} project={p} onClick={() => setSelected(p)} />)}
            </div>
          )}
        </div>
      </div>

      <ProjectModal project={selected} onClose={() => setSelected(null)} />
    </>
  )
}

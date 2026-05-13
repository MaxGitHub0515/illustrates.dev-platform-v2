'use client'
import { useState } from 'react'
import { useProjects, useDeleteProject, useCreateProject, useUpdateProject } from '@/lib/hooks/useProjects'
import { AdminError } from '@/components/admin/AdminError'
import type { ApiProject, CreateProjectDto } from '@/types/api'

const EMPTY: CreateProjectDto = {
  title:'', description:'', body:'', tags:[], techStack:[], githubUrl:'', liveUrl:'', status:'draft',
}

type FieldErrors = Partial<Record<keyof CreateProjectDto, string>>

function validate(dto: CreateProjectDto): FieldErrors {
  const e: FieldErrors = {}
  if (!dto.title?.trim())                   e.title = 'Title is required'
  else if (dto.title.trim().length < 3)     e.title = 'Title must be at least 3 characters'
  if (!dto.description?.trim())             e.description = 'Description is required'
  else if (dto.description.trim().length < 10) e.description = 'Description must be at least 10 characters'
  if (!dto.body?.trim())                    e.body = 'Project content is required'
  return e
}

const inputCls = (err?: string) =>
  `input-base ${err ? 'border-red-400/60 focus:border-red-400' : ''}`

function Field({ label, error, required, children }: {
  label: string; error?: string; required?: boolean; children: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-[11px] uppercase tracking-wide font-medium text-[var(--text-2)]">
        {label}{required && <span className="text-red-400 ml-0.5">*</span>}
      </label>
      {children}
      {error && <span className="text-[11px] text-red-400 flex items-center gap-1">⚠ {error}</span>}
    </div>
  )
}

function ProjectForm({ initial, onSave, onCancel, saving, saveError }: {
  initial: CreateProjectDto
  onSave:  (dto: CreateProjectDto) => void
  onCancel: () => void
  saving:   boolean
  saveError: string
}) {
  const [form,   setForm]   = useState<CreateProjectDto>(initial)
  const [errors, setErrors] = useState<FieldErrors>({})
  const set = (k: keyof CreateProjectDto, v: string) => {
    setForm(f => ({ ...f, [k]: v }))
    if (errors[k]) setErrors(e => ({ ...e, [k]: undefined }))
  }

  function submit() {
    const errs = validate(form)
    if (Object.keys(errs).length > 0) { setErrors(errs); return }
    onSave(form)
  }

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4"
         style={{ background:'rgba(4,2,16,0.88)', backdropFilter:'blur(8px)' }}>
      <div className="w-full max-w-[600px] rounded-2xl overflow-hidden border border-indigo-500/20"
           style={{ background:'#0d0b1e', maxHeight:'90vh', display:'flex', flexDirection:'column' }}>

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--border)] flex-shrink-0">
          <h3 className="text-[15px] font-medium text-[var(--text-1)]">
            {initial.title ? 'Edit project' : 'New project'}
          </h3>
          <button onClick={onCancel}
                  className="w-7 h-7 rounded-lg border border-[var(--border)] bg-[var(--bg-surface)] text-[var(--text-2)] flex items-center justify-center hover:bg-[var(--bg-surface-2)] cursor-pointer">
            ✕
          </button>
        </div>

        {/* Form body */}
        <div className="overflow-y-auto flex-1 p-5 flex flex-col gap-4">
          <Field label="Title" required error={errors.title}>
            <input value={form.title} onChange={e=>set('title',e.target.value)}
                   className={inputCls(errors.title)} placeholder="e.g. Portfolio API" />
          </Field>

          <Field label="Description" required error={errors.description}>
            <input value={form.description} onChange={e=>set('description',e.target.value)}
                   className={inputCls(errors.description)} placeholder="One-line summary of the project" />
          </Field>

          <Field label="Body (Markdown)" required error={errors.body}>
            <textarea value={form.body} onChange={e=>set('body',e.target.value)}
                      rows={5} className={`${inputCls(errors.body)} resize-y`}
                      placeholder="## Overview&#10;Describe what you built, why, and how..." />
          </Field>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="GitHub URL">
              <input value={form.githubUrl ?? ''} onChange={e=>set('githubUrl',e.target.value)}
                     className="input-base" placeholder="https://github.com/you/repo" />
            </Field>
            <Field label="Live URL">
              <input value={form.liveUrl ?? ''} onChange={e=>set('liveUrl',e.target.value)}
                     className="input-base" placeholder="https://your-app.com" />
            </Field>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Tags (comma separated)">
              <input
                value={Array.isArray(form.tags) ? form.tags.join(', ') : ''}
                onChange={e => setForm(f=>({...f, tags:e.target.value.split(',').map(t=>t.trim()).filter(Boolean)}))}
                className="input-base" placeholder="react, typescript, api" />
            </Field>
            <Field label="Tech stack (comma separated)">
              <input
                value={Array.isArray(form.techStack) ? form.techStack.join(', ') : ''}
                onChange={e => setForm(f=>({...f, techStack:e.target.value.split(',').map(t=>t.trim()).filter(Boolean)}))}
                className="input-base" placeholder="express, mongodb, redis" />
            </Field>
          </div>

          <Field label="Status">
            <select value={form.status} onChange={e=>set('status',e.target.value)}
                    className="input-base cursor-pointer" style={{ appearance:'none' }}>
              <option value="draft">Draft — saved but not visible publicly</option>
              <option value="published">Published — visible on the site</option>
            </select>
            <p className="text-[11px] text-[var(--text-3)]">
              Drafts are saved to the database but not shown on the public site.
            </p>
          </Field>

          {saveError && (
            <div className="p-3 rounded-lg border border-red-500/25 bg-red-500/8 text-red-400 text-[13px]">
              ⚠ {saveError}
              <p className="text-[11px] mt-1 text-red-400/60">
                Is the backend running? Check that NEXT_PUBLIC_API_URL is set in .env.local
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-4 border-t border-[var(--border)] flex gap-2.5 justify-end flex-shrink-0">
          <button onClick={onCancel} className="btn-ghost btn-sm">Cancel</button>
          <button onClick={submit} disabled={saving}
                  className="btn-primary btn-sm">
            {saving ? 'Saving…' : initial.title ? 'Update project' : 'Create project'}
          </button>
        </div>
      </div>
    </div>
  )
}

const STATUS_V = (s: string) => s === 'published' ? 'emerald' : s === 'draft' ? 'orange' : 'neutral'
const STATUS_CLS: Record<string, string> = {
  published: 'bg-emerald-500/10 border-emerald-500/25 text-emerald-400',
  draft:     'bg-orange-400/10  border-orange-400/25  text-orange-400',
  archived:  'bg-[var(--bg-surface-2)] border-[var(--border)] text-[var(--text-3)]',
}

export default function AdminProjects() {
  const [search,    setSearch]    = useState('')
  const [modal,     setModal]     = useState<'create' | { project: ApiProject } | null>(null)
  const [saveError, setSaveError] = useState('')

  // Pass no status so admin backend returns all (draft + published + archived)
  const { data, isLoading, error, refetch } = useProjects('sort=createdAt&order=desc&limit=100')
  const createMut = useCreateProject()
  const updateMut = useUpdateProject()
  const deleteMut = useDeleteProject()

  const projects = (data?.data ?? []).filter(p =>
    `${p.title} ${p.tags.join(' ')}`.toLowerCase().includes(search.toLowerCase())
  )

  async function handleSave(dto: CreateProjectDto) {
    setSaveError('')
    try {
      if (modal === 'create') {
        await createMut.mutateAsync(dto)
      } else if (modal && typeof modal === 'object') {
        await updateMut.mutateAsync({ id: modal.project._id, dto })
      }
      setModal(null) // only close on success
    } catch (err) {
      setSaveError((err as Error).message || 'Failed to save project')
      // modal stays open so user can fix the issue
    }
  }

  const getInitial = (): CreateProjectDto => {
    if (!modal || modal === 'create') return EMPTY
    const p = modal.project
    return {
      title: p.title, description: p.description, body: p.body,
      tags: p.tags, techStack: p.techStack,
      githubUrl: p.githubUrl, liveUrl: p.liveUrl,
      status: p.status as 'draft' | 'published',
    }
  }

  const saving = createMut.isPending || updateMut.isPending

  return (
    <div className="p-6 sm:p-9">
      {modal && (
        <ProjectForm
          initial={getInitial()}
          onSave={handleSave}
          onCancel={() => { setModal(null); setSaveError('') }}
          saving={saving}
          saveError={saveError}
        />
      )}

      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 mb-6">
        <div>
          <h1 className="text-[20px] sm:text-[22px] font-medium text-[var(--text-1)] mb-1">Projects</h1>
          <p className="text-[13px] text-[var(--text-3)]">
            {isLoading ? 'Loading…' : `${data?.meta?.total ?? projects.length} total`}
          </p>
        </div>
        <button onClick={() => { setModal('create'); setSaveError('') }}
                className="btn-primary self-start sm:self-auto">
          + New project
        </button>
      </div>

      <div className="relative mb-4">
        <i className="ti ti-search absolute left-3 top-1/2 -translate-y-1/2 text-[13px] text-[var(--text-3)]" />
        <input value={search} onChange={e=>setSearch(e.target.value)}
               placeholder="Search projects…" className="input-base pl-8 max-w-[360px]" />
      </div>

      {error && (
        <AdminError
          message={(error as Error).message}
          hint="Make sure the backend API is running and NEXT_PUBLIC_API_URL is set in .env.local"
          onRetry={() => refetch()}
        />
      )}

      {isLoading ? (
        <div className="py-12 text-center text-[var(--text-3)]">Loading projects…</div>
      ) : (
        <div className="border border-[var(--border)] rounded-xl overflow-hidden">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-[var(--bg-surface)]">
                {['Title', 'Status', 'Tags', 'Views', 'Actions'].map(h => (
                  <th key={h} className="px-4 py-2.5 text-left text-[11px] text-[var(--text-3)] font-medium uppercase tracking-wider border-b border-[var(--border)] whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {projects.map((p, i) => (
                <tr key={p._id} className={i < projects.length-1 ? 'border-b border-[var(--border)]' : ''}>
                  <td className="px-4 py-3">
                    <p className="text-[13px] font-medium text-[var(--text-1)]">{p.title}</p>
                    <p className="text-[11px] text-[var(--text-3)]">{new Date(p.createdAt).toLocaleDateString()}</p>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-[10px] px-2 py-0.5 rounded-full border font-medium ${STATUS_CLS[p.status] ?? STATUS_CLS.archived}`}>
                      {p.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1 flex-wrap">
                      {p.tags.slice(0,3).map(t=><span key={t} className="tag">{t}</span>)}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-[13px] text-[var(--text-2)] font-mono">{p.viewCount}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1.5">
                      <button onClick={() => { setModal({ project: p }); setSaveError('') }}
                              className="btn-ghost btn-sm">Edit</button>
                      <button onClick={() => deleteMut.mutate(p._id)} disabled={deleteMut.isPending}
                              className="btn-danger btn-sm">
                        {deleteMut.isPending ? '…' : 'Delete'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {projects.length === 0 && !isLoading && (
                <tr><td colSpan={5} className="px-4 py-10 text-center text-[13px] text-[var(--text-3)]">
                  No projects yet. Click "New project" to add one.
                </td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

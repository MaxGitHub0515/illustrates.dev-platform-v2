'use client'
import { useState } from 'react'
import { usePosts, useDeletePost, useCreatePost, useUpdatePost } from '@/lib/hooks/usePosts'
import { AdminError } from '@/components/admin/AdminError'
import type { ApiPost, CreatePostDto } from '@/types/api'

const EMPTY: CreatePostDto = { title:'', description:'', body:'', tags:[], status:'draft' }

type FieldErrors = Partial<Record<keyof CreatePostDto, string>>

function validate(dto: CreatePostDto): FieldErrors {
  const e: FieldErrors = {}
  if (!dto.title?.trim())               e.title = 'Title is required'
  else if (dto.title.trim().length < 5) e.title = 'At least 5 characters'
  if (!dto.description?.trim())         e.description = 'Description is required (shown in blog list and SEO)'
  else if (dto.description.trim().length < 10) e.description = 'At least 10 characters'
  if (!dto.body?.trim())                e.body = 'Content is required'
  else if (dto.body.trim().length < 20) e.body = 'At least 20 characters'
  return e
}

const inputCls = (err?: string) => `input-base ${err ? 'border-red-400/60' : ''}`

function Field({ label, error, required, hint, children }: {
  label: string; error?: string; required?: boolean; hint?: string; children: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-[11px] uppercase tracking-wide font-medium text-[var(--text-2)]">
        {label}{required && <span className="text-red-400 ml-0.5">*</span>}
      </label>
      {children}
      {hint && !error && <span className="text-[11px] text-[var(--text-3)]">{hint}</span>}
      {error && <span className="text-[11px] text-red-400">⚠ {error}</span>}
    </div>
  )
}

function PostForm({ initial, onSave, onCancel, saving, saveError }: {
  initial: CreatePostDto; onSave: (dto: CreatePostDto) => void
  onCancel: () => void; saving: boolean; saveError: string
}) {
  const [form, setForm]     = useState<CreatePostDto>(initial)
  const [errors, setErrors] = useState<FieldErrors>({})
  const set = (k: keyof CreatePostDto, v: string) => {
    setForm(f => ({ ...f, [k]: v }))
    if (errors[k]) setErrors(e => ({ ...e, [k]: undefined }))
  }

  function submit() {
    const errs = validate(form)
    if (Object.keys(errs).length) { setErrors(errs); return }
    onSave(form)
  }

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4"
         style={{ background:'rgba(4,2,16,0.88)', backdropFilter:'blur(8px)' }}>
      <div className="w-full max-w-[640px] rounded-2xl overflow-hidden border border-orange-400/20"
           style={{ background:'#0d0b1e', maxHeight:'90vh', display:'flex', flexDirection:'column' }}>
        <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--border)] flex-shrink-0">
          <h3 className="text-[15px] font-medium text-[var(--text-1)]">
            {initial.title ? 'Edit post' : 'New post'}
          </h3>
          <button onClick={onCancel}
                  className="w-7 h-7 rounded-lg border border-[var(--border)] bg-[var(--bg-surface)] text-[var(--text-2)] flex items-center justify-center cursor-pointer">✕</button>
        </div>

        <div className="overflow-y-auto flex-1 p-5 flex flex-col gap-4">
          <Field label="Title" required error={errors.title}>
            <input value={form.title} onChange={e=>set('title',e.target.value)}
                   className={inputCls(errors.title)} placeholder="e.g. Building a scalable API with Node.js" />
          </Field>

          <Field label="Description" required error={errors.description}
                 hint="Short summary shown in blog list and used for SEO (max 500 chars)">
            <input value={form.description} onChange={e=>set('description',e.target.value)}
                   className={inputCls(errors.description)} placeholder="One paragraph that hooks the reader" />
          </Field>

          <Field label="Body (Markdown)" required error={errors.body}>
            <textarea value={form.body} onChange={e=>set('body',e.target.value)}
                      rows={8} className={`${inputCls(errors.body)} resize-y`}
                      placeholder="## Introduction&#10;Write your post in Markdown..." />
          </Field>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label="Tags (comma separated)">
              <input
                value={Array.isArray(form.tags) ? form.tags.join(', ') : ''}
                onChange={e=>setForm(f=>({...f, tags:e.target.value.split(',').map(t=>t.trim()).filter(Boolean)}))}
                className="input-base" placeholder="nodejs, typescript, api" />
            </Field>
            <Field label="Status">
              <select value={form.status} onChange={e=>set('status',e.target.value)}
                      className="input-base cursor-pointer" style={{appearance:'none'}}>
                <option value="draft">Draft — not visible publicly</option>
                <option value="published">Published — live on the blog</option>
              </select>
            </Field>
          </div>

          {saveError && (
            <div className="p-3 rounded-lg border border-red-500/25 bg-red-500/8 text-red-400 text-[13px]">
              ⚠ {saveError}
              <p className="text-[11px] mt-1 text-red-400/60">Is the backend running? Check NEXT_PUBLIC_API_URL</p>
            </div>
          )}
        </div>

        <div className="px-5 py-4 border-t border-[var(--border)] flex gap-2.5 justify-end flex-shrink-0">
          <button onClick={onCancel} className="btn-ghost btn-sm">Cancel</button>
          <button onClick={submit} disabled={saving}
                  className="btn-primary btn-sm"
                  style={{background:'linear-gradient(135deg,#fb923c,#f472b6)'}}>
            {saving ? 'Saving…' : initial.title ? 'Update post' : 'Publish post'}
          </button>
        </div>
      </div>
    </div>
  )
}

const STATUS_CLS: Record<string,string> = {
  published: 'bg-emerald-500/10 border-emerald-500/25 text-emerald-400',
  draft:     'bg-orange-400/10  border-orange-400/25  text-orange-400',
  archived:  'bg-[var(--bg-surface-2)] border-[var(--border)] text-[var(--text-3)]',
}

export default function AdminPosts() {
  const [search,    setSearch]    = useState('')
  const [modal,     setModal]     = useState<'create'|{post:ApiPost}|null>(null)
  const [saveError, setSaveError] = useState('')

  // Pass no status filter — admin sees all (backend now returns all for admin)
  const { data, isLoading, error, refetch } = usePosts()
  const createMut = useCreatePost()
  const updateMut = useUpdatePost()
  const deleteMut = useDeletePost()

  const posts = (data?.data ?? []).filter(p =>
    `${p.title} ${p.tags.join(' ')}`.toLowerCase().includes(search.toLowerCase())
  )

  async function handleSave(dto: CreatePostDto) {
    setSaveError('')
    try {
      if (modal === 'create') await createMut.mutateAsync(dto)
      else if (modal && typeof modal === 'object') await updateMut.mutateAsync({ id: modal.post._id, dto })
      setModal(null)
    } catch (err) {
      setSaveError((err as Error).message || 'Failed to save post')
    }
  }

  const getInitial = (): CreatePostDto => {
    if (!modal || modal === 'create') return EMPTY
    const p = modal.post
    return { title:p.title, description:p.description, body:p.body, tags:p.tags, status:p.status as 'draft'|'published' }
  }

  const saving = createMut.isPending || updateMut.isPending

  return (
    <div className="p-6 sm:p-9">
      {modal && (
        <PostForm initial={getInitial()} onSave={handleSave}
                  onCancel={() => { setModal(null); setSaveError('') }}
                  saving={saving} saveError={saveError} />
      )}

      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 mb-6">
        <div>
          <h1 className="text-[22px] font-medium text-[var(--text-1)] mb-1">Posts</h1>
          <p className="text-[13px] text-[var(--text-3)]">
            {isLoading ? 'Loading…' : `${data?.meta?.total ?? posts.length} total`}
          </p>
        </div>
        <button onClick={() => { setModal('create'); setSaveError('') }}
                className="btn-primary self-start"
                style={{background:'linear-gradient(135deg,#fb923c,#f472b6)'}}>
          + New post
        </button>
      </div>

      <div className="relative mb-4">
        <i className="ti ti-search absolute left-3 top-1/2 -translate-y-1/2 text-[13px] text-[var(--text-3)]" />
        <input value={search} onChange={e=>setSearch(e.target.value)}
               placeholder="Search posts…" className="input-base pl-8 max-w-[360px]" />
      </div>

      {error && <AdminError message={(error as Error).message} hint="Check backend is running and NEXT_PUBLIC_API_URL is set" onRetry={() => refetch()} />}

      {isLoading ? (
        <div className="py-12 text-center text-[var(--text-3)]">Loading posts…</div>
      ) : (
        <div className="border border-[var(--border)] rounded-xl overflow-hidden">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-[var(--bg-surface)]">
                {['Title','Description','Status','Tags','Views','Actions'].map(h=>(
                  <th key={h} className="px-4 py-2.5 text-left text-[11px] text-[var(--text-3)] font-medium uppercase tracking-wider border-b border-[var(--border)] whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {posts.map((p, i) => (
                <tr key={p._id} className={i < posts.length-1 ? 'border-b border-[var(--border)]' : ''}>
                  <td className="px-4 py-3 max-w-[200px]">
                    <p className="text-[13px] font-medium text-[var(--text-1)] truncate">{p.title}</p>
                    <p className="text-[11px] text-[var(--text-3)]">{new Date(p.createdAt).toLocaleDateString()}</p>
                  </td>
                  <td className="px-4 py-3 max-w-[200px]">
                    <p className="text-[12px] text-[var(--text-2)] truncate">{p.description}</p>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-[10px] px-2 py-0.5 rounded-full border font-medium ${STATUS_CLS[p.status] ?? ''}`}>{p.status}</span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1 flex-wrap">{p.tags.map(t=><span key={t} className="tag">{t}</span>)}</div>
                  </td>
                  <td className="px-4 py-3 text-[13px] text-[var(--text-2)] font-mono">{p.viewCount}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1.5">
                      <button onClick={()=>{setModal({post:p});setSaveError('')}} className="btn-ghost btn-sm">Edit</button>
                      <button onClick={()=>deleteMut.mutate(p._id)} disabled={deleteMut.isPending} className="btn-danger btn-sm">
                        {deleteMut.isPending?'…':'Delete'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {posts.length===0 && <tr><td colSpan={6} className="px-4 py-10 text-center text-[13px] text-[var(--text-3)]">No posts yet.</td></tr>}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

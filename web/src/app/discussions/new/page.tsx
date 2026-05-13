'use client'
import { useState }      from 'react'
import { useRouter }     from 'next/navigation'
import { useAuth }       from '@clerk/nextjs'
import { useQueryClient } from '@tanstack/react-query'
import { Nav }    from '@/components/landing/Nav'
import { Footer } from '@/components/landing/Footer'
import * as api   from '@/lib/api/client'

export default function NewDiscussionPage() {
  const { getToken, isSignedIn } = useAuth()
  const router = useRouter()
  const qc = useQueryClient()

  const [title,   setTitle]   = useState('')
  const [body,    setBody]    = useState('')
  const [tags,    setTags]    = useState('')
  const [errors,  setErrors]  = useState<Record<string,string>>({})
  const [saving,  setSaving]  = useState(false)
  const [apiErr,  setApiErr]  = useState('')

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    const errs: Record<string,string> = {}
    if (!title.trim())             errs.title = 'Title is required'
    else if (title.trim().length < 5) errs.title = 'At least 5 characters'
    if (!body.trim())              errs.body  = 'Body is required'
    else if (body.trim().length < 20) errs.body = 'At least 20 characters'
    if (Object.keys(errs).length) { setErrors(errs); return }

    setSaving(true); setApiErr('')
    try {
      const token = await getToken()
      await api.post('/discussions', {
        title: title.trim(),
        body:  body.trim(),
        tags:  tags.split(',').map(t=>t.trim()).filter(Boolean),
      }, token)
      qc.invalidateQueries({ queryKey: ['discussions'] })
      router.push('/discussions')
    } catch (err) {
      setApiErr((err as Error).message || 'Failed to create discussion')
      setSaving(false)
    }
  }

  if (!isSignedIn) {
    return (
      <>
        <Nav />
        <main className="bg-[var(--bg-base)] min-h-[70vh] flex items-center justify-center px-6">
          <div className="text-center">
            <p className="text-[var(--text-2)] mb-4">Sign in to start a discussion.</p>
            <a href="/login" className="btn-primary">Sign in</a>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Nav />
      <main className="bg-[var(--bg-base)] min-h-[70vh] px-6 py-12">
        <div className="max-w-[680px] mx-auto">
          <p className="text-[12px] text-[var(--text-3)] mb-6">
            <a href="/discussions" className="no-underline text-[var(--text-3)] hover:text-[var(--text-1)]">← Discussions</a>
          </p>
          <h1 className="text-[22px] font-medium text-[var(--text-1)] mb-1">New discussion</h1>
          <p className="text-[13px] text-[var(--text-3)] mb-8">Ask a question, share an idea, or start a conversation.</p>

          <form onSubmit={submit} className="flex flex-col gap-5">
            <div>
              <label className="block text-[11px] uppercase tracking-wide font-medium text-[var(--text-2)] mb-1">
                Title <span className="text-red-400">*</span>
              </label>
              <input value={title} onChange={e=>{setTitle(e.target.value);setErrors(p=>({...p,title:''}))}}
                     className={`input-base ${errors.title ? 'border-red-400/60' : ''}`}
                     placeholder="What's your question or topic?" />
              {errors.title && <p className="text-[11px] text-red-400 mt-1">⚠ {errors.title}</p>}
            </div>

            <div>
              <label className="block text-[11px] uppercase tracking-wide font-medium text-[var(--text-2)] mb-1">
                Body <span className="text-red-400">*</span>
              </label>
              <textarea value={body} onChange={e=>{setBody(e.target.value);setErrors(p=>({...p,body:''}))}}
                        rows={6} className={`input-base resize-y ${errors.body ? 'border-red-400/60' : ''}`}
                        placeholder="Describe your question in detail. Markdown is supported." />
              {errors.body && <p className="text-[11px] text-red-400 mt-1">⚠ {errors.body}</p>}
            </div>

            <div>
              <label className="block text-[11px] uppercase tracking-wide font-medium text-[var(--text-2)] mb-1">
                Tags (optional, comma separated)
              </label>
              <input value={tags} onChange={e=>setTags(e.target.value)}
                     className="input-base" placeholder="e.g. typescript, api, docker" />
            </div>

            {apiErr && (
              <div className="p-3 rounded-lg border border-red-500/25 bg-red-500/8 text-red-400 text-[13px]">
                ⚠ {apiErr}
              </div>
            )}

            <div className="flex gap-3">
              <button type="submit" disabled={saving} className="btn-primary">
                {saving ? 'Posting…' : 'Post discussion'}
              </button>
              <a href="/discussions" className="btn-ghost">Cancel</a>
            </div>
          </form>
        </div>
      </main>
      <Footer />
    </>
  )
}

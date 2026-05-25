'use client'
import { useState } from 'react'
import { useDiscussions, useDeleteDiscussion, useUpdateDiscussionStatus } from '@/lib/hooks/useDiscussions'
import { AdminError } from '@/components/admin/AdminError'
import type { ApiDiscussion } from '@/types/api'

const STATUS_CLS: Record<string, string> = {
  open:   'bg-emerald-500/10 border-emerald-500/25 text-emerald-400',
  closed: 'bg-[var(--bg-surface-2)] border-[var(--border)] text-[var(--text-3)]',
  locked: 'bg-red-500/10 border-red-500/25 text-red-400',
}

function ConfirmDelete({ name, onConfirm, onCancel }: {
  name: string; onConfirm: () => void; onCancel: () => void
}) {
  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4"
         style={{ background:'rgba(4,2,16,0.88)', backdropFilter:'blur(8px)' }}>
      <div className="w-full max-w-[400px] rounded-2xl border border-red-500/20 p-6"
           style={{ background:'#0d0b1e' }}>
        <h3 className="text-[15px] font-medium text-[var(--text-1)] mb-2">Delete discussion?</h3>
        <p className="text-[13px] text-[var(--text-2)] mb-5">
          <strong className="text-[var(--text-1)]">"{name}"</strong> and all its replies will be permanently deleted. This cannot be undone.
        </p>
        <div className="flex gap-2.5 justify-end">
          <button onClick={onCancel} className="btn-ghost btn-sm">Cancel</button>
          <button onClick={onConfirm} className="btn-danger btn-sm">Yes, delete</button>
        </div>
      </div>
    </div>
  )
}

export default function AdminDiscussions() {
  const [search,    setSearch]    = useState('')
  const [status,    setStatus]    = useState('all')
  const [confirmId, setConfirmId] = useState<{ id: string; title: string } | null>(null)

  const params = `${status !== 'all' ? `status=${status}&` : ''}${search ? `search=${encodeURIComponent(search)}&` : ''}sort=createdAt&order=desc`
  const { data, isLoading, error, refetch } = useDiscussions(params)
  const deleteMut = useDeleteDiscussion()
  const statusMut = useUpdateDiscussionStatus()
  const items = data?.data ?? []

  function handleDeleteConfirm() {
    if (!confirmId) return
    deleteMut.mutate(confirmId.id)
    setConfirmId(null)
  }

  return (
    <div className="p-6 sm:p-9">
      {confirmId && (
        <ConfirmDelete
          name={confirmId.title}
          onConfirm={handleDeleteConfirm}
          onCancel={() => setConfirmId(null)}
        />
      )}

      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 mb-6">
        <div>
          <h1 className="text-[22px] font-medium text-[var(--text-1)] mb-1">Discussions</h1>
          <p className="text-[13px] text-[var(--text-3)]">{isLoading ? 'Loading…' : `${data?.meta?.total ?? items.length} threads`}</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-2.5 mb-4">
        <div className="relative flex-1">
          <i className="ti ti-search absolute left-3 top-1/2 -translate-y-1/2 text-[13px] text-[var(--text-3)]" />
          <input value={search} onChange={e=>setSearch(e.target.value)}
                 placeholder="Search discussions…" className="input-base pl-8 w-full" />
        </div>
        <div className="flex gap-1.5">
          {['all','open','closed','locked'].map(s=>(
            <button key={s} onClick={()=>setStatus(s)}
                    className={`btn-sm border cursor-pointer capitalize ${status===s ? 'btn-primary' : 'btn-ghost'}`}>
              {s}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <AdminError
          message={(error as Error).message}
          hint="Invalid token: check CLERK_SECRET_KEY in api/.env matches your Clerk app's secret key."
          onRetry={() => refetch()}
        />
      )}

      {isLoading ? (
        <div className="py-12 text-center text-[var(--text-3)]">Loading discussions…</div>
      ) : items.length === 0 ? (
        <div className="py-10 text-center border border-[var(--border)] rounded-xl text-[13px] text-[var(--text-3)]">
          No discussions yet.
        </div>
      ) : (
        <div className="border border-[var(--border)] rounded-xl overflow-hidden">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-[var(--bg-surface)]">
                {['Title','Author','Status','Replies','Date','Actions'].map(h=>(
                  <th key={h} className="px-4 py-2.5 text-left text-[11px] text-[var(--text-3)] font-medium uppercase tracking-wider border-b border-[var(--border)] whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {items.map((d: ApiDiscussion, i: number) => (
                <tr key={d._id} className={i < items.length-1 ? 'border-b border-[var(--border)]' : ''}>
                  <td className="px-4 py-3 max-w-[240px]">
                    <p className="text-[13px] font-medium text-[var(--text-1)] truncate">{d.title}</p>
                    <p className="text-[11px] text-[var(--text-3)] truncate">{d.body.slice(0,60)}…</p>
                  </td>
                  <td className="px-4 py-3 text-[12px] text-[var(--text-2)]">@{d.authorUsername ?? '—'}</td>
                  <td className="px-4 py-3">
                    <span className={`text-[10px] px-2 py-0.5 rounded-full border font-medium ${STATUS_CLS[d.status] ?? ''}`}>{d.status}</span>
                  </td>
                  <td className="px-4 py-3 text-[13px] text-[var(--text-2)] font-mono">{d.replyCount}</td>
                  <td className="px-4 py-3 text-[12px] text-[var(--text-3)]">{new Date(d.createdAt).toLocaleDateString()}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1.5 flex-wrap">
                      {d.status !== 'open' && (
                        <button onClick={()=>statusMut.mutate({id:d._id, status:'open'})}
                                className="btn-ghost btn-sm text-emerald-400">Open</button>
                      )}
                      {d.status !== 'closed' && (
                        <button onClick={()=>statusMut.mutate({id:d._id, status:'closed'})}
                                className="btn-ghost btn-sm">Close</button>
                      )}
                      {d.status !== 'locked' && (
                        <button onClick={()=>statusMut.mutate({id:d._id, status:'locked'})}
                                className="btn-ghost btn-sm text-red-400">Lock</button>
                      )}
                      <button onClick={() => setConfirmId({ id: d._id, title: d.title })}
                              disabled={deleteMut.isPending} className="btn-danger btn-sm">
                        {deleteMut.isPending ? '…' : 'Delete'}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

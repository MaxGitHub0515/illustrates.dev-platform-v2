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

export default function AdminDiscussions() {
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('all')

  const params = `${status !== 'all' ? `status=${status}&` : ''}${search ? `search=${encodeURIComponent(search)}&` : ''}sort=createdAt&order=desc`
  const { data, isLoading, error, refetch } = useDiscussions(params)
  const deleteMut = useDeleteDiscussion()
  const statusMut = useUpdateDiscussionStatus()
  const items = data?.data ?? []

  return (
    <div className="p-6 sm:p-9">
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
                    <div className="flex gap-1.5">
                      {d.status !== 'locked' ? (
                        <button onClick={()=>statusMut.mutate({id:d._id, status:'locked'})} className="btn-ghost btn-sm">Lock</button>
                      ) : (
                        <button onClick={()=>statusMut.mutate({id:d._id, status:'open'})} className="btn-ghost btn-sm text-emerald-400">Open</button>
                      )}
                      <button onClick={()=>deleteMut.mutate(d._id)} disabled={deleteMut.isPending} className="btn-danger btn-sm">
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

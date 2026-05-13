'use client'
import { useUsers, useBlockUser, usePromoteUser } from '@/lib/hooks/useUsers'
import { AdminError } from '@/components/admin/AdminError'
import type { ApiUser } from '@/types/api'

export default function AdminUsers() {
  const { data, isLoading, error, refetch } = useUsers()
  const blockMut   = useBlockUser()
  const promoteMut = usePromoteUser()
  const users = data?.data ?? []

  return (
    <div className="p-6 sm:p-9">
      <h1 className="text-[22px] font-medium text-[var(--text-1)] mb-1">Users</h1>
      <p className="text-[13px] text-[var(--text-3)] mb-6">
        {isLoading ? 'Loading…' : `${data?.meta?.total ?? users.length} registered`}
      </p>

      {error && (
        <AdminError
          message={(error as Error).message || 'Failed to load users'}
          hint={`"Invalid or expired token" means the backend can't verify your Clerk session.
Fix: Make sure api/.env has the correct CLERK_SECRET_KEY matching your Clerk app.
It starts with sk_test_... or sk_live_... — copy it from Clerk Dashboard → API Keys.`}
          onRetry={() => refetch()}
        />
      )}

      {isLoading ? (
        <div className="py-12 text-center text-[var(--text-3)]">Loading users…</div>
      ) : users.length === 0 && !error ? (
        <div className="py-10 text-center border border-[var(--border)] rounded-xl text-[13px] text-[var(--text-3)]">
          No users yet. Make sure the Clerk webhook is configured to sync users.
          <p className="text-[11px] mt-2 text-[var(--text-3)]">Clerk Dashboard → Webhooks → Add endpoint → https://your-domain.com/webhooks/clerk</p>
        </div>
      ) : (
        <div className="border border-[var(--border)] rounded-xl overflow-hidden">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-[var(--bg-surface)]">
                {['User','Email','Role','Status','Joined','Actions'].map(h=>(
                  <th key={h} className="px-4 py-2.5 text-left text-[11px] text-[var(--text-3)] font-medium uppercase tracking-wider border-b border-[var(--border)]">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {users.map((u: ApiUser, i: number) => (
                <tr key={u._id} className={`${i < users.length-1 ? 'border-b border-[var(--border)]' : ''} ${u.blocked ? 'opacity-60' : ''}`}>
                  <td className="px-4 py-3">
                    <p className="text-[13px] font-medium text-[var(--text-1)]">{u.firstName} {u.lastName}</p>
                    <p className="text-[11px] text-[var(--text-3)]">@{u.username}</p>
                  </td>
                  <td className="px-4 py-3 text-[12px] text-[var(--text-2)]">{u.email}</td>
                  <td className="px-4 py-3">
                    <span className={`text-[10px] px-2 py-0.5 rounded-full border font-medium ${u.role==='admin' ? 'bg-indigo-500/15 border-indigo-400/35 text-indigo-400' : 'bg-[var(--bg-surface-2)] border-[var(--border)] text-[var(--text-3)]'}`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-[10px] px-2 py-0.5 rounded-full border font-medium ${u.blocked ? 'bg-red-500/10 border-red-500/25 text-red-400' : 'bg-emerald-500/10 border-emerald-500/25 text-emerald-400'}`}>
                      {u.blocked ? 'Blocked' : 'Active'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-[12px] text-[var(--text-3)]">{new Date(u.createdAt).toLocaleDateString()}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-1.5">
                      <button onClick={()=>blockMut.mutate({ id:u._id, block:!u.blocked })} disabled={blockMut.isPending}
                              className={u.blocked ? 'btn-ghost btn-sm' : 'btn-danger btn-sm'}>
                        {blockMut.isPending ? '…' : u.blocked ? 'Unblock' : 'Block'}
                      </button>
                      {u.role !== 'admin' && (
                        <button onClick={()=>promoteMut.mutate(u._id)} disabled={promoteMut.isPending}
                                className="btn-ghost btn-sm">
                          {promoteMut.isPending ? '…' : '↑ Admin'}
                        </button>
                      )}
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

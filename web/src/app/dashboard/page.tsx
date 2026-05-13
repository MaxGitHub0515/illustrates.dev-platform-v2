'use client'
import { useUser } from '@clerk/nextjs'
import Link from 'next/link'
import { useMyDiscussions } from '@/lib/hooks/useDiscussions'

export default function DashboardPage() {
  const { user } = useUser()
  const { data: discussions } = useMyDiscussions()

  const myDiscussions = discussions?.data ?? []
  // publicMetadata is available directly from Clerk on the client
  const isAdmin = (user?.publicMetadata?.role as string) === 'admin'

  return (
    <div>
      {/* Welcome card */}
      <div className="grid grid-cols-[auto_1fr] gap-5 items-center p-5 sm:p-6 rounded-xl mb-6 border border-indigo-500/20"
           style={{ background:'rgba(99,102,241,0.06)' }}>
        <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center text-xl sm:text-2xl font-semibold text-white flex-shrink-0"
             style={{ background:'linear-gradient(135deg,var(--accent-from),var(--accent-to))' }}>
          {(user?.firstName ?? user?.username ?? '?')[0].toUpperCase()}
        </div>
        <div>
          <p className="text-[16px] sm:text-[18px] font-medium text-[var(--text-1)] mb-1">
            Welcome back, {user?.firstName ?? user?.username ?? 'there'} 👋
          </p>
          <p className="text-[12px] sm:text-[13px] text-[var(--text-3)]">
            {isAdmin ? '⚡ Admin account' : 'Member'}
            {' · '}@{user?.username ?? '—'}
          </p>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
        {/* Discussions */}
        <Link href="/dashboard/discussions"
              className="no-underline p-4 sm:p-5 rounded-xl border border-[var(--border)] bg-[var(--bg-surface)] block hover:border-cyan-400/30 transition-colors">
          <p className="text-[11px] uppercase tracking-wider text-[var(--text-3)] mb-2">Discussions</p>
          <p className="text-[22px] font-semibold text-cyan-400">{myDiscussions.length}</p>
        </Link>

        {/* Premium */}
        <Link href="/dashboard/premium"
              className="no-underline p-4 sm:p-5 rounded-xl border border-[var(--border)] bg-[var(--bg-surface)] block hover:border-orange-400/30 transition-colors">
          <p className="text-[11px] uppercase tracking-wider text-[var(--text-3)] mb-2">Premium</p>
          <p className="text-[22px] font-semibold text-orange-400">Free</p>
        </Link>

        {/* Admin access — green if admin, red-ish if not */}
        <Link
          href={isAdmin ? '/admin' : '/dashboard/premium'}
          className={`no-underline p-4 sm:p-5 rounded-xl border bg-[var(--bg-surface)] block transition-colors ${
            isAdmin
              ? 'border-emerald-500/30 hover:border-emerald-400/50'
              : 'border-[var(--border)] hover:border-[var(--border-mid)]'
          }`}
        >
          <p className="text-[11px] uppercase tracking-wider text-[var(--text-3)] mb-2">Admin access</p>
          {isAdmin ? (
            <p className="text-[22px] font-semibold text-emerald-400">Yes ✓</p>
          ) : (
            <p className="text-[22px] font-semibold text-red-400/70">No</p>
          )}
          {isAdmin && (
            <p className="text-[11px] text-emerald-400/60 mt-1">→ Open dashboard</p>
          )}
        </Link>
      </div>

      {/* Recent discussions */}
      <div>
        <h2 className="text-[15px] font-medium text-[var(--text-1)] mb-3.5">Your recent discussions</h2>
        {myDiscussions.length === 0 ? (
          <div className="p-8 text-center border border-[var(--border)] rounded-xl">
            <p className="text-[13px] text-[var(--text-3)] mb-3">No discussions yet</p>
            <Link href="/projects" className="text-[13px] text-cyan-400 no-underline hover:opacity-75">Browse projects →</Link>
          </div>
        ) : (
          <div className="border border-[var(--border)] rounded-xl overflow-hidden">
            {myDiscussions.slice(0, 5).map((d, i) => (
              <div key={d._id}
                   className={`px-4 py-3.5 flex justify-between items-center ${i < Math.min(myDiscussions.length,5)-1 ? 'border-b border-[var(--border)]' : ''}`}>
                <div>
                  <p className="text-[13px] font-medium text-[var(--text-1)] mb-1">{d.title}</p>
                  <p className="text-[11px] text-[var(--text-3)]">
                    {d.replyCount} replies · {new Date(d.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <span className={`text-[10px] px-2 py-0.5 rounded-full border font-medium ${
                  d.status === 'open'
                    ? 'bg-emerald-500/10 border-emerald-500/25 text-emerald-400'
                    : 'bg-[var(--bg-surface-2)] border-[var(--border)] text-[var(--text-3)]'
                }`}>{d.status}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

'use client'
import { useStats } from '@/lib/hooks/useAnalytics'
import { AdminError } from '@/components/admin/AdminError'

function Bar({ value, max, color }: { value: number; max: number; color: string }) {
  const pct = max > 0 ? Math.round((value / max) * 100) : 0
  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 h-2 rounded-full bg-[var(--bg-surface-2)]">
        <div className="h-full rounded-full transition-all duration-500"
             style={{ width:`${pct}%`, background:color }} />
      </div>
      <span className="text-[12px] font-mono text-[var(--text-2)] w-12 text-right">{value.toLocaleString()}</span>
    </div>
  )
}

function StatCard({ label, value, sub, color, loading }: {
  label: string; value: number; sub?: string; color: string; loading?: boolean
}) {
  return (
    <div className="p-5 rounded-xl border border-[var(--border)] bg-[var(--bg-surface)]">
      <p className="text-[11px] uppercase tracking-wider font-medium text-[var(--text-3)] mb-2">{label}</p>
      <p className="text-[28px] font-semibold leading-none mb-1" style={{ color }}>
        {loading ? '—' : value.toLocaleString()}
      </p>
      {sub && <p className="text-[11px] text-[var(--text-3)]">{sub}</p>}
    </div>
  )
}

export default function AdminAnalytics() {
  const { data: stats, isLoading, error, refetch } = useStats()

  return (
    <div className="p-6 sm:p-9">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-7">
        <div>
          <h1 className="text-[20px] sm:text-[22px] font-medium text-[var(--text-1)] mb-1">Analytics</h1>
          <p className="text-[13px] text-[var(--text-3)]">
            {isLoading ? 'Fetching…' : error ? 'Offline' : 'Live from MongoDB · auto-refreshes every 30s'}
          </p>
        </div>
        <button onClick={() => refetch()} className="btn-ghost btn-sm self-start">
          <i className="ti ti-refresh text-[13px]" /> Refresh
        </button>
      </div>

      {error && (
        <AdminError
          message={(error as Error).message}
          hint={`The stats endpoint requires the backend API.
• For local dev: set NEXT_PUBLIC_API_URL=http://localhost:5001/api/v1 in web/.env.local and start the API with: cd api && npm run dev
• The "invalid token" error means CLERK_SECRET_KEY is missing or wrong in api/.env`}
          onRetry={() => refetch()}
        />
      )}

      {isLoading ? (
        <div className="py-16 text-center text-[var(--text-3)]">Loading analytics…</div>
      ) : stats && (
        <>
          {/* Top cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-7">
            <StatCard label="Projects"    value={stats.projects.total}    sub={`${stats.projects.published} published`}  color="#818cf8" />
            <StatCard label="Post views"  value={stats.posts.totalViews}  sub="all time"                                  color="#fb923c" />
            <StatCard label="Discussions" value={stats.discussions.total} sub={`${stats.discussions.open} open`}          color="#06b6d4" />
            <StatCard label="Users"       value={stats.users.total}       sub="registered"                                color="#22c55e" />
          </div>

          {/* Detail breakdown */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {/* Projects */}
            <div className="p-5 rounded-xl border border-[var(--border)] bg-[var(--bg-surface)]">
              <p className="text-[11px] uppercase tracking-wider font-medium text-indigo-400 mb-4">Projects</p>
              {[
                { label:'Published', value: stats.projects.published, color:'#22c55e' },
                { label:'Draft',     value: stats.projects.draft,     color:'#fb923c' },
                { label:'Archived',  value: stats.projects.archived,  color:'rgba(255,255,255,0.3)' },
              ].map(r => (
                <div key={r.label} className="mb-3 last:mb-0">
                  <div className="flex justify-between mb-1">
                    <span className="text-[12px] text-[var(--text-2)]">{r.label}</span>
                    <span className="text-[12px] font-medium" style={{ color: r.color }}>{r.value}</span>
                  </div>
                  <Bar value={r.value} max={stats.projects.total || 1} color={r.color} />
                </div>
              ))}
              <div className="mt-4 pt-3 border-t border-[var(--border)]">
                <div className="flex justify-between">
                  <span className="text-[12px] text-[var(--text-3)]">Total views</span>
                  <span className="text-[12px] font-medium text-indigo-400">{stats.projects.totalViews.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Posts */}
            <div className="p-5 rounded-xl border border-[var(--border)] bg-[var(--bg-surface)]">
              <p className="text-[11px] uppercase tracking-wider font-medium text-orange-400 mb-4">Blog</p>
              {[
                { label:'Published', value: stats.posts.published, color:'#22c55e' },
                { label:'Draft',     value: stats.posts.draft,     color:'#fb923c' },
              ].map(r => (
                <div key={r.label} className="mb-3 last:mb-0">
                  <div className="flex justify-between mb-1">
                    <span className="text-[12px] text-[var(--text-2)]">{r.label}</span>
                    <span className="text-[12px] font-medium" style={{ color: r.color }}>{r.value}</span>
                  </div>
                  <Bar value={r.value} max={stats.posts.total || 1} color={r.color} />
                </div>
              ))}
              <div className="mt-4 pt-3 border-t border-[var(--border)]">
                <div className="flex justify-between">
                  <span className="text-[12px] text-[var(--text-3)]">Total reads</span>
                  <span className="text-[12px] font-medium text-orange-400">{stats.posts.totalViews.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Community */}
            <div className="p-5 rounded-xl border border-[var(--border)] bg-[var(--bg-surface)]">
              <p className="text-[11px] uppercase tracking-wider font-medium text-cyan-400 mb-4">Community</p>
              {[
                { label:'Open discussions',  value: stats.discussions.open,   color:'#06b6d4' },
                { label:'Closed',            value: stats.discussions.closed, color:'rgba(255,255,255,0.3)' },
                { label:'Locked',            value: stats.discussions.locked, color:'#fb923c' },
              ].map(r => (
                <div key={r.label} className="mb-3 last:mb-0">
                  <div className="flex justify-between mb-1">
                    <span className="text-[12px] text-[var(--text-2)]">{r.label}</span>
                    <span className="text-[12px] font-medium" style={{ color: r.color }}>{r.value}</span>
                  </div>
                  <Bar value={r.value} max={stats.discussions.total || 1} color={r.color} />
                </div>
              ))}
              <div className="mt-4 pt-3 border-t border-[var(--border)]">
                <div className="flex justify-between">
                  <span className="text-[12px] text-[var(--text-3)]">Registered users</span>
                  <span className="text-[12px] font-medium text-emerald-400">{stats.users.total}</span>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

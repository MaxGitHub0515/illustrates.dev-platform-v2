'use client'
import Link from 'next/link'
import { useProjects } from '@/lib/hooks/useProjects'
import { usePosts }    from '@/lib/hooks/usePosts'
import { useUsers }    from '@/lib/hooks/useUsers'
import { useStats }    from '@/lib/hooks/useAnalytics'
import { Badge }       from '@/components/ui/Badge'
import type { ApiProject } from '@/types/api'

function StatCard({ label, value, sub, icon, colorClass, loading = false }: {
  label: string; value: string | number; sub?: string
  icon: string; colorClass: string; loading?: boolean
}) {
  return (
    <div className="p-5 rounded-xl bg-[var(--bg-surface)] border border-[var(--border)]">
      <div className="flex justify-between items-center mb-3">
        <p className="text-[11px] uppercase tracking-wider font-medium text-[var(--text-3)]">{label}</p>
        <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${colorClass}`}>
          <i className={`ti ${icon} text-[14px]`} aria-hidden="true" />
        </div>
      </div>
      <p className="text-[28px] font-semibold text-[var(--text-1)] leading-none">
        {loading ? '…' : value}
      </p>
      {sub && <p className="text-[11px] text-[var(--text-3)] mt-1">{sub}</p>}
    </div>
  )
}

export default function AdminOverview() {
  const { data: pd, isLoading: pl } = useProjects()
  const { data: bd, isLoading: bl } = usePosts()
  const { data: ud, isLoading: ul } = useUsers()
  const { data: stats }             = useStats()

  const projects = pd?.data ?? []

  return (
    <div className="p-9">
      <div className="mb-7">
        <h1 className="text-[22px] font-medium text-[var(--text-1)] mb-1">Dashboard</h1>
        <p className="text-[13px] text-[var(--text-3)]">
          {pl || bl || ul ? 'Fetching live data…' : 'Live from MongoDB · refreshes every 30s'}
        </p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-4 gap-3 mb-8">
        <StatCard loading={pl} label="Projects"     value={pd?.meta?.total ?? 0}              sub={`${stats?.projects?.published ?? 0} published`}  colorClass="bg-indigo-500/15 text-indigo-400"   icon="ti-code"      />
        <StatCard loading={pl} label="Total views"  value={stats?.projects?.totalViews ?? 0}  sub="project views"                                    colorClass="bg-cyan-500/15 text-cyan-400"      icon="ti-eye"       />
        <StatCard loading={bl} label="Posts"        value={bd?.meta?.total ?? 0}              sub={`${stats?.posts?.totalViews ?? 0} reads`}         colorClass="bg-orange-400/15 text-orange-400"  icon="ti-file-text" />
        <StatCard loading={ul} label="Users"        value={ud?.meta?.total ?? 0}              sub="registered"                                       colorClass="bg-emerald-500/15 text-emerald-400" icon="ti-users"     />
      </div>

      {/* Recent projects table */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-3.5">
          <h2 className="text-[14px] font-medium text-[var(--text-1)]">Recent projects</h2>
          <Link href="/admin/projects" className="text-[12px] text-indigo-400 no-underline hover:opacity-75">View all →</Link>
        </div>

        {pl ? (
          <div className="py-6 text-center text-[var(--text-3)] text-[13px] border border-[var(--border)] rounded-xl">Loading…</div>
        ) : (
          <div className="border border-[var(--border)] rounded-xl overflow-hidden">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-[var(--bg-surface)]">
                  {['Title','Status','Tags','Views'].map(h => (
                    <th key={h} className="px-4 py-2.5 text-left text-[11px] text-[var(--text-3)] font-medium uppercase tracking-wider border-b border-[var(--border)]">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {projects.slice(0, 5).map((p: ApiProject, i: number) => (
                  <tr key={p._id} className={i < Math.min(projects.length, 5) - 1 ? 'border-b border-[var(--border)]' : ''}>
                    <td className="px-4 py-3 text-[13px] font-medium text-[var(--text-1)]">{p.title}</td>
                    <td className="px-4 py-3">
                      <Badge variant={p.status === 'published' ? 'green' : p.status === 'draft' ? 'orange' : 'neutral'}>
                        {p.status}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1">
                        {p.tags.slice(0, 3).map(t => <span key={t} className="tag">{t}</span>)}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-[13px] text-[var(--text-2)] font-mono">{p.viewCount}</td>
                  </tr>
                ))}
                {projects.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-4 py-8 text-center text-[13px] text-[var(--text-3)]">
                      No projects yet — <Link href="/admin/projects" className="text-indigo-400 no-underline">add one</Link>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

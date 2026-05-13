'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { UserButton } from '@clerk/nextjs'

const LINKS = [
  { href:'/dashboard',             label:'Overview'    },
  { href:'/dashboard/discussions', label:'Discussions' },
  { href:'/dashboard/premium',     label:'Premium ✦'   },
  { href:'/dashboard/settings',    label:'Settings'    },
]

export function DashboardNav() {
  const path = usePathname()
  return (
    <header className="sticky top-0 z-40 h-12 backdrop-blur-md border-b border-[var(--border)]"
            style={{ background: 'var(--bg-nav)' }}>
      <div className="max-w-[900px] mx-auto px-4 md:px-6 h-full flex items-center">
        <Link href="/" className="no-underline mr-auto">
          <span className="g-logo text-[12px] font-medium font-mono">illustrates.dev</span>
        </Link>
        <nav className="flex gap-0.5 mr-3 overflow-x-auto">
          {LINKS.map(l => {
            const active = l.href === '/dashboard' ? path === '/dashboard' : path.startsWith(l.href)
            return (
              <Link key={l.href} href={l.href}
                    className={`nav-link whitespace-nowrap ${active ? 'nav-link-active' : ''}`}>
                {l.label}
              </Link>
            )
          })}
        </nav>
        <UserButton afterSignOutUrl="/" />
      </div>
    </header>
  )
}

'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { UserButton } from '@clerk/nextjs'

const NAV = [
  { href: '/admin',             icon: 'ti-layout-dashboard', label: 'Overview'    },
  { href: '/admin/analytics',   icon: 'ti-chart-bar',        label: 'Analytics'   },
  { href: '/admin/projects',    icon: 'ti-code',             label: 'Projects'    },
  { href: '/admin/posts',       icon: 'ti-file-text',        label: 'Posts'       },
  { href: '/admin/discussions', icon: 'ti-messages',         label: 'Discussions' },
  { href: '/admin/users',       icon: 'ti-users',            label: 'Users'       },
  { href: '/admin/settings',    icon: 'ti-settings',         label: 'Settings'    },
]

export function AdminSidebar() {
  const path    = usePathname()
  const [open, setOpen] = useState(false)
  const isActive = (href: string) =>
    href === '/admin' ? path === '/admin' : path.startsWith(href)

  const NavItems = () => (
    <>
      {NAV.map(item => {
        const active = isActive(item.href)
        return (
          <Link key={item.href} href={item.href} onClick={() => setOpen(false)}
                className={`flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-[13px] no-underline
                  transition-all duration-150 border-l-2
                  ${active
                    ? 'bg-indigo-500/15 text-indigo-400 font-medium border-indigo-500'
                    : 'text-[var(--text-2)] hover:bg-[var(--bg-surface-2)] border-transparent'
                  }`}>
            <i className={`ti ${item.icon} text-[15px]`} aria-hidden="true" />
            {item.label}
          </Link>
        )
      })}
    </>
  )

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden md:flex w-[220px] flex-shrink-0 flex-col py-5 border-r border-[var(--border)] bg-[var(--bg-surface)]"
             style={{ minHeight: '100vh' }}>
        <div className="px-[18px] pb-5 border-b border-[var(--border)]">
          <Link href="/" className="no-underline block">
            <span className="g-logo text-[12px] font-medium font-mono">illustrates.dev</span>
          </Link>
          <p className="text-[10px] text-[var(--text-3)] mt-0.5 font-mono">admin studio</p>
        </div>
        <nav className="flex-1 p-2.5 flex flex-col gap-0.5">
          <NavItems />
        </nav>
        <div className="px-[18px] pt-3.5 border-t border-[var(--border)] flex flex-col gap-2.5">
          <Link href="/" className="text-[11px] text-[var(--text-3)] no-underline flex items-center gap-1.5 hover:text-[var(--text-1)]">
            <i className="ti ti-arrow-left text-xs" /> Back to site
          </Link>
          <div className="flex items-center gap-2">
            <UserButton afterSignOutUrl="/" />
            <span className="text-[12px] text-[var(--text-2)]">Admin</span>
          </div>
        </div>
      </aside>

      {/* Mobile top bar */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 h-12 flex items-center px-4 border-b border-[var(--border)]"
           style={{ background: 'var(--bg-nav)', backdropFilter: 'blur(12px)' }}>
        <Link href="/" className="no-underline mr-auto">
          <span className="g-logo text-[12px] font-medium font-mono">illustrates.dev</span>
        </Link>
        <button onClick={() => setOpen(!open)}
                className="w-8 h-8 rounded-lg border border-[var(--border)] bg-[var(--bg-surface)] flex items-center justify-center text-[var(--text-2)] cursor-pointer">
          <i className={`ti ${open ? 'ti-x' : 'ti-menu-2'} text-[14px]`} />
        </button>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div className="md:hidden fixed inset-0 z-40 pt-12"
             onClick={() => setOpen(false)}>
          <div className="w-[220px] h-full flex flex-col py-4 border-r border-[var(--border)]"
               style={{ background: 'var(--bg-base)', backdropFilter: 'blur(12px)' }}
               onClick={e => e.stopPropagation()}>
            <nav className="flex-1 px-2.5 flex flex-col gap-0.5">
              <NavItems />
            </nav>
            <div className="px-4 pt-3.5 border-t border-[var(--border)]">
              <UserButton afterSignOutUrl="/" />
            </div>
          </div>
        </div>
      )}
    </>
  )
}

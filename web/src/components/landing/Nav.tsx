'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import { useUser } from '@clerk/nextjs'
import { useTheme } from '@/components/theme/ThemeProvider'
import { CvModal } from './CvModal'

const NAV_LINKS = [
  { href: '/projects',    label: 'Projects'    },
  { href: '/blog',        label: 'Writing'     },
  { href: '/discussions', label: 'Discussions' },
  { href: '/about',       label: 'About'       },
]

export function Nav() {
  const pathname             = usePathname()
  const { theme, toggle }    = useTheme()
  const { isSignedIn }       = useUser()
  const [scrolled, setScrolled]   = useState(false)
  const [menuOpen, setMenuOpen]   = useState(false)
  const [cvOpen,   setCvOpen]     = useState(false)

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 16)
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])

  useEffect(() => { setMenuOpen(false) }, [pathname])

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href)

  const isLight = theme === 'light'

  return (
    <>
      <header
        className="sticky top-0 z-50 backdrop-blur-md transition-all duration-300"
        style={{
          height: 48,
          background: scrolled
            ? (isLight ? 'rgba(244,243,255,0.97)' : 'rgba(6,4,18,0.97)')
            : 'var(--bg-nav)',
          borderBottom: '1px solid var(--border)',
        }}
      >
        <nav className="max-w-[1200px] mx-auto px-4 md:px-6 h-full flex items-center">
          {/* Logo */}
          <Link href="/" className="no-underline mr-auto">
            <span className="g-logo text-[13px] font-medium font-mono">illustrates.dev</span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-0.5 mr-2.5">
            {NAV_LINKS.map(l => (
              <Link key={l.href} href={l.href}
                    className={`nav-link ${isActive(l.href) ? 'nav-link-active' : ''}`}>
                {l.label}
              </Link>
            ))}
          </div>

          <div className="hidden md:block w-px h-3.5 bg-[var(--border)] mx-2.5" />

          {/* Theme toggle */}
          <button onClick={toggle} aria-label="Toggle theme"
                  className="w-7 h-7 rounded-lg border border-[var(--border)] bg-[var(--bg-surface)]
                             text-[var(--text-2)] flex items-center justify-center mr-2
                             hover:bg-[var(--bg-surface-2)] transition-colors cursor-pointer">
            {isLight
              ? <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/></svg>
              : <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
            }
          </button>

          {/* Desktop auth */}
          <div className="hidden md:flex items-center gap-1.5">
            {isSignedIn
              ? <Link href="/dashboard" className="btn-ghost btn-sm">Dashboard</Link>
              : <>
                  <Link href="/login"  className="btn-ghost btn-sm">Sign in</Link>
                  <Link href="/signup" className="btn-primary btn-sm">Get started</Link>
                </>
            }
          </div>

          {/* Mobile hamburger */}
          <button onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu"
                  className="md:hidden w-7 h-7 rounded-lg border border-[var(--border)] bg-[var(--bg-surface)]
                             text-[var(--text-2)] flex items-center justify-center ml-1
                             hover:bg-[var(--bg-surface-2)] transition-colors cursor-pointer">
            {menuOpen
              ? <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              : <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
            }
          </button>
        </nav>

        {/* Mobile dropdown */}
        {menuOpen && (
          <div className="md:hidden border-t border-[var(--border)]"
               style={{ background: isLight ? 'rgba(244,243,255,0.98)' : 'rgba(6,4,18,0.98)', backdropFilter:'blur(14px)' }}>
            <div className="px-4 py-3 flex flex-col gap-1">
              {NAV_LINKS.map(l => (
                <Link key={l.href} href={l.href}
                      className={`nav-link text-left ${isActive(l.href) ? 'nav-link-active' : ''}`}>
                  {l.label}
                </Link>
              ))}
              <div className="h-px bg-[var(--border)] my-2" />
              {isSignedIn
                ? <Link href="/dashboard" className="nav-link">Dashboard</Link>
                : <>
                    <Link href="/login"  className="nav-link">Sign in</Link>
                    <Link href="/signup" className="nav-link text-indigo-400">Get started</Link>
                  </>
              }
            </div>
          </div>
        )}
      </header>
      <CvModal open={cvOpen} onClose={() => setCvOpen(false)} />
    </>
  )
}

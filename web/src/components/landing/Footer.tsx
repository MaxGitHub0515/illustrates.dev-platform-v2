'use client'
import Link from 'next/link'

const LINKS = [
  { href: '/projects',    label: 'Projects'    },
  { href: '/blog',        label: 'Writing'     },
  { href: '/discussions', label: 'Discussions' },
  { href: '/about',       label: 'About'       },
  { href: '/support',     label: 'Contact'     },
]

export function Footer() {
  return (
    <footer className="border-t border-[var(--border)] bg-[var(--bg-base)] py-5 px-6 md:py-4 md:px-7">
      <div className="max-w-[1200px] mx-auto flex flex-col items-center gap-4 sm:flex-row sm:items-center">

        {/* Logo */}
        <Link href="/" className="no-underline flex-shrink-0">
          <span className="g-logo text-xs font-medium font-mono">illustrates.dev</span>
        </Link>

        {/* Nav links — wrap on very small screens */}
        <nav className="flex flex-wrap justify-center gap-x-4 gap-y-1.5 sm:flex-1 sm:justify-center">
          {LINKS.map(l => (
            <Link
              key={l.href}
              href={l.href}
              className="text-[11px] text-[var(--text-3)] no-underline hover:text-[var(--text-1)] transition-colors duration-150 whitespace-nowrap"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        {/* Copyright */}
        <span className="text-[11px] font-mono text-[var(--text-3)] flex-shrink-0">
          © {new Date().getFullYear()}
        </span>
      </div>
    </footer>
  )
}

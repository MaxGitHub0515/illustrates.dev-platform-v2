'use client'
import { useState } from 'react'
import Link from 'next/link'
import { Terminal } from './Terminal'
import { CvModal }  from './CvModal'

export function Hero() {
  const [cvOpen, setCvOpen] = useState(false)

  return (
    <>
      <section
        id="hero"
        className="relative overflow-hidden px-6 py-14 md:py-[72px] md:px-7"
        style={{ background: 'var(--section-hero)' }}
      >
        {/* Decorative orbs — hidden on mobile for perf */}
        <div className="hidden md:block absolute -top-20 -left-20 w-[340px] h-[340px] rounded-full pointer-events-none"
             style={{ background: 'radial-gradient(circle,rgba(99,102,241,0.13),transparent 70%)' }} />
        <div className="hidden md:block absolute -top-12 right-14 w-[300px] h-[300px] rounded-full pointer-events-none"
             style={{ background: 'radial-gradient(circle,rgba(6,182,212,0.1),transparent 70%)' }} />

        <div className="max-w-[1200px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10 items-center relative">
          {/* Left */}
          <div>
            {/* Badge */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full mb-5 border border-emerald-500/30"
                 style={{ background: 'rgba(34,197,94,0.1)' }}>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 block" />
              <span className="text-[11px] text-emerald-400 font-medium">Available for new projects</span>
            </div>

            <h1 className="text-[clamp(28px,5vw,46px)] font-medium leading-[1.08] tracking-[-0.04em] mb-4 text-[var(--text-1)]">
              I build the<br />
              <span className="g-headline">backend things</span><br />
              no one sees.
            </h1>

            <p className="text-[14px] text-[var(--text-2)] leading-[1.75] max-w-[400px] mb-7">
              Full-stack developer focused on distributed systems, APIs, and infrastructure that actually holds up.
            </p>

            <div className="flex flex-wrap gap-2">
              <Link href="/projects" className="btn-primary">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="2" y="7" width="20" height="14" rx="2"/>
                  <path d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16"/>
                </svg>
                See my work
              </Link>
              <a href="https://github.com" target="_blank" rel="noreferrer" className="btn-ghost">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
                </svg>
                GitHub
              </a>
              <button onClick={() => setCvOpen(true)} className="btn-ghost">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
                  <polyline points="14,2 14,8 20,8"/>
                </svg>
                CV
              </button>
            </div>
          </div>

          {/* Terminal — hidden on small mobile */}
          <div className="hidden sm:block"><Terminal /></div>
        </div>
      </section>

      <CvModal open={cvOpen} onClose={() => setCvOpen(false)} />
    </>
  )
}

'use client'
import Link from 'next/link'

export function About() {
  return (
    <section id="about" className="px-6 md:px-7 py-12 md:py-[52px]"
             style={{ background: 'var(--section-about)' }}>
      <div className="max-w-[1200px] mx-auto flex flex-col sm:flex-row gap-6 items-start">
        {/* Avatar */}
        <div className="w-[72px] h-[72px] rounded-full p-[1.5px] flex-shrink-0"
             style={{ background: 'linear-gradient(135deg,#34d399,#06b6d4)' }}>
          <div className="w-full h-full rounded-full flex items-center justify-center bg-[#060f0c]">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#34d399" strokeWidth="1.5">
              <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
              <circle cx="12" cy="7" r="4"/>
            </svg>
          </div>
        </div>
        <div>
          <p className="g-green text-[10px] uppercase tracking-[0.12em] font-medium mb-2">About</p>
          <p className="text-[13px] text-[var(--text-2)] leading-relaxed mb-4 max-w-[540px]">
            Full-stack developer with a bias towards the backend. I build systems that scale, APIs that are pleasant to work with, and infrastructure that doesn&apos;t wake you up at 3am.
          </p>
          <div className="flex flex-wrap gap-3 items-center">
            {[
              { label:'GitHub',   href:'https://github.com' },
              { label:'LinkedIn', href:'https://linkedin.com' },
              { label:'Discord',  href:'https://discord.com' },
            ].map(s => (
              <a key={s.label} href={s.href} target="_blank" rel="noreferrer"
                 className="text-[12px] text-emerald-400 no-underline hover:opacity-70 transition-opacity">
                {s.label} ↗
              </a>
            ))}
            <Link href="/about" className="text-[12px] text-emerald-400 no-underline hover:opacity-70">More about me →</Link>
          </div>
        </div>
      </div>
    </section>
  )
}

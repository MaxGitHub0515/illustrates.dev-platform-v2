import React from 'react'
import Link from 'next/link'

interface Props {
  heading: string; subheading: string
  switchText: string; switchLabel: string; switchHref: string
  children: React.ReactNode
}

export function AuthShell({ heading, subheading, switchText, switchLabel, switchHref, children }: Props) {
  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2">
      {/* Left panel — brand — hidden on mobile */}
      <aside
        className="hidden lg:flex flex-col justify-between p-12 relative overflow-hidden border-r border-white/8"
        style={{ background: 'linear-gradient(135deg,#060412 0%,#0d0520 60%,#060c1e 100%)' }}
      >
        <div className="absolute -top-16 -left-12 w-64 h-64 rounded-full pointer-events-none"
             style={{ background: 'radial-gradient(circle,rgba(99,102,241,0.14),transparent 70%)' }} />
        <div className="absolute -bottom-12 -right-8 w-52 h-52 rounded-full pointer-events-none"
             style={{ background: 'radial-gradient(circle,rgba(6,182,212,0.1),transparent 70%)' }} />

        <div className="relative">
          <Link href="/" className="no-underline block mb-10">
            <span className="g-logo text-[13px] font-medium font-mono">illustrates.dev</span>
          </Link>
          <h2 className="text-[22px] font-medium text-white leading-tight tracking-tight mb-2">
            Built in public.<br />
            <span className="g-headline">Shipped for real.</span>
          </h2>
          <p className="text-[12px] text-white/40 leading-relaxed max-w-[260px]">
            A space for developers who build, write, and talk through the hard parts.
          </p>
        </div>

        <div className="relative">
          <p className="text-[10px] uppercase tracking-widest font-medium text-white/25 mb-4">What you get</p>
          {[
            { label:'Project showcase',     sub:'Rich pages with tech stack, demos, source' },
            { label:'Community discussions', sub:'Ask, answer, share what you know'         },
            { label:'Technical writing',     sub:'Publish posts that live on your profile'  },
          ].map((f,i) => (
            <div key={f.label} className="flex gap-2.5 mb-3">
              <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 flex-shrink-0 mt-1.5" />
              <div>
                <p className="text-[12px] font-medium text-white mb-0.5">{f.label}</p>
                <p className="text-[11px] text-white/30">{f.sub}</p>
              </div>
            </div>
          ))}
        </div>
      </aside>

      {/* Right panel — form */}
      <main className="flex items-center justify-center p-6 md:p-10 min-h-screen"
            style={{ background: 'linear-gradient(180deg,#08051a,#060412)' }}>
        <div className="w-full max-w-[380px]">
          {/* Mobile logo */}
          <Link href="/" className="no-underline block mb-8 lg:hidden">
            <span className="g-logo text-[13px] font-medium font-mono">illustrates.dev</span>
          </Link>

          <div className="mb-6">
            <h1 className="text-[20px] font-medium text-white mb-1.5 tracking-tight">{heading}</h1>
            <p className="text-[12px] text-white/35">{subheading}</p>
          </div>

          {children}

          <p className="text-center text-[12px] text-white/30 mt-5">
            {switchText}{' '}
            <Link href={switchHref} className="text-indigo-400 font-medium no-underline hover:text-indigo-300">{switchLabel}</Link>
          </p>
          <p className="text-center text-[11px] text-white/18 mt-3">
            <Link href="/terms"   className="text-white/30 no-underline">Terms</Link>
            {' · '}
            <Link href="/privacy" className="text-white/30 no-underline">Privacy</Link>
          </p>
        </div>
      </main>
    </div>
  )
}

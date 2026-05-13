'use client'
export function Contact() {
  return (
    <section id="contact" className="relative overflow-hidden px-6 py-12 md:py-14 text-center"
             style={{ background: 'var(--section-contact)' }}>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[180px] rounded-full pointer-events-none"
           style={{ background: 'radial-gradient(ellipse,rgba(99,102,241,0.12),transparent 70%)' }} />
      <div className="relative max-w-[480px] mx-auto">
        <p className="g-primary text-[10px] uppercase tracking-[0.12em] font-medium mb-3">Contact</p>
        <h2 className="text-[20px] sm:text-[24px] font-medium tracking-tight mb-2 text-[var(--text-1)]">
          Let&apos;s work together.
        </h2>
        <p className="text-[13px] text-[var(--text-2)] mb-6 max-w-[300px] mx-auto">
          Open to freelance, contracts, and full-time. Response within 24h.
        </p>
        <a href="mailto:hello@illustrates.dev"
           className="btn-primary inline-flex text-[13px] sm:text-[14px] px-5 sm:px-7 py-2.5 sm:py-3 break-all sm:break-normal">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="flex-shrink-0">
            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
            <polyline points="22,6 12,13 2,6"/>
          </svg>
          <span className="hidden sm:inline">hello@illustrates.dev</span>
          <span className="sm:hidden">Get in touch</span>
        </a>
      </div>
    </section>
  )
}

'use client'
import Link from 'next/link'
import { useState } from 'react'
import { useSubmitSupport } from '@/lib/hooks/useSupport'
import type { SupportDto } from '@/lib/hooks/useSupport'

const STACK = [
  { label:'TypeScript', color:'#3b82f6' },{ label:'Node.js', color:'#22c55e' },
  { label:'Express',    color:'#818cf8' },{ label:'MongoDB', color:'#22c55e' },
  { label:'Redis',      color:'#ef4444' },{ label:'BullMQ',  color:'#f472b6' },
  { label:'Docker',     color:'#06b6d4' },{ label:'Next.js', color:'#f0f4ff' },
  { label:'PostgreSQL', color:'#818cf8' },{ label:'Nginx',   color:'#22c55e' },
  { label:'Prometheus', color:'#fb923c' },{ label:'Grafana', color:'#fb923c' },
  { label:'MinIO',      color:'#fb923c' },{ label:'Tailwind',color:'#06b6d4' },
]

function ContactForm() {
  const { mutateAsync, isPending, isSuccess, error, reset } = useSubmitSupport()
  const [form, setForm] = useState<SupportDto>({ name:'', email:'', subject:'', message:'', type:'general' })
  const set = (k: keyof SupportDto, v: string) => setForm(f => ({ ...f, [k]: v }))

  if (isSuccess) {
    return (
      <div className="p-5 rounded-xl text-center border border-emerald-500/25"
           style={{ background: 'rgba(34,197,94,0.08)' }}>
        <p className="text-xl mb-1">✓</p>
        <p className="text-[14px] font-medium text-emerald-400 mb-1">Message sent!</p>
        <p className="text-[12px] text-[var(--text-3)] mb-4">I&apos;ll get back to you soon.</p>
        <button onClick={() => { reset(); setForm({ name:'', email:'', subject:'', message:'', type:'general' }) }}
                className="btn-ghost btn-sm">Send another</button>
      </div>
    )
  }

  return (
    <form onSubmit={async e => { e.preventDefault(); await mutateAsync(form) }}
          className="flex flex-col gap-3.5">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-[11px] uppercase tracking-wide font-medium text-emerald-400/70 mb-1">Name</label>
          <input required value={form.name} onChange={e=>set('name',e.target.value)} className="input-base" placeholder="Max Smith" />
        </div>
        <div>
          <label className="block text-[11px] uppercase tracking-wide font-medium text-emerald-400/70 mb-1">Email</label>
          <input required type="email" value={form.email} onChange={e=>set('email',e.target.value)} className="input-base" placeholder="you@example.com" />
        </div>
      </div>
      <div>
        <label className="block text-[11px] uppercase tracking-wide font-medium text-emerald-400/70 mb-1">Subject</label>
        <input required value={form.subject} onChange={e=>set('subject',e.target.value)} className="input-base" placeholder="Project collaboration" />
      </div>
      <div>
        <label className="block text-[11px] uppercase tracking-wide font-medium text-emerald-400/70 mb-1">Type</label>
        <select value={form.type} onChange={e=>set('type',e.target.value)} className="input-base cursor-pointer"
                style={{ appearance:'none' }}>
          <option value="general">General enquiry</option>
          <option value="feature">Project collaboration</option>
          <option value="billing">Billing / Premium</option>
          <option value="bug">Bug report</option>
        </select>
      </div>
      <div>
        <label className="block text-[11px] uppercase tracking-wide font-medium text-emerald-400/70 mb-1">Message</label>
        <textarea required rows={4} value={form.message} onChange={e=>set('message',e.target.value)}
                  className="input-base resize-y" />
      </div>
      {error && <p className="text-[12px] text-red-400">⚠ {(error as Error).message}</p>}
      <button type="submit" disabled={isPending}
              className="btn-primary w-full justify-center"
              style={{ background: 'linear-gradient(135deg,#34d399,#06b6d4)' }}>
        {isPending ? 'Sending…' : 'Send message'}
      </button>
    </form>
  )
}

export function AboutPage() {
  return (
    <div className="bg-[var(--bg-base)] min-h-[80vh]">
      {/* Hero */}
      <div className="px-6 md:px-7 py-12 md:py-14 border-b border-[var(--border)]"
           style={{ background: 'var(--section-about)' }}>
        <div className="max-w-[820px] mx-auto">
          <div className="flex flex-col sm:flex-row gap-5 sm:gap-8 items-start">
            {/* Avatar */}
            <div className="w-[80px] h-[80px] rounded-full p-[2px] flex-shrink-0"
                 style={{ background: 'linear-gradient(135deg,#34d399,#06b6d4)' }}>
              <div className="w-full h-full rounded-full flex items-center justify-center bg-[#060f0c]">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#34d399" strokeWidth="1.5">
                  <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
                  <circle cx="12" cy="7" r="4"/>
                </svg>
              </div>
            </div>
            <div className="flex-1">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-emerald-500/28 mb-3"
                   style={{ background: 'rgba(34,197,94,0.1)' }}>
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span className="text-[11px] text-emerald-400 font-medium">Available for new projects</span>
              </div>
              <h1 className="text-[22px] md:text-[26px] font-medium text-[var(--text-1)] tracking-tight mb-2">Full-stack developer</h1>
              <p className="text-[13px] text-[var(--text-3)] mb-4">illustrates.dev · Building in public</p>
              <div className="flex flex-wrap gap-2">
                {[{label:'GitHub',href:'https://github.com'},{label:'LinkedIn',href:'https://linkedin.com'},{label:'Discord',href:'https://discord.com'}].map(s => (
                  <a key={s.label} href={s.href} target="_blank" rel="noreferrer"
                     className="btn-ghost btn-sm">{s.label} ↗</a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main grid */}
      <div className="max-w-[820px] mx-auto px-6 md:px-7 py-10 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-8 md:gap-10">
          {/* Left — bio + stack */}
          <div>
            <section className="mb-8">
              <p className="text-[10px] uppercase tracking-[0.12em] font-medium text-emerald-400/70 mb-3">Background</p>
              <div className="flex flex-col gap-3.5">
                {[
                  'I care about systems that are actually observable — not just running, but measurable. Prometheus metrics, Grafana dashboards, alerts before users notice.',
                  'Before building this platform I spent time across different stacks — the problems are the same. Routing, validation, caching, queues, deployments. The details differ, the thinking doesn\'t.',
                  'I write about what I build. Not tutorials — actual build logs. What broke, what the fix was, what I\'d do differently.',
                ].map((p, i) => <p key={i} className="text-[13px] text-[var(--text-2)] leading-relaxed">{p}</p>)}
              </div>
            </section>

            <section className="mb-8">
              <p className="text-[10px] uppercase tracking-[0.12em] font-medium text-emerald-400/70 mb-3">Currently building</p>
              <div className="p-4 rounded-xl border border-emerald-500/15"
                   style={{ background: 'rgba(52,211,153,0.05)' }}>
                <p className="text-[14px] font-medium text-[var(--text-1)] mb-1.5">illustrates.dev</p>
                <p className="text-[12px] text-[var(--text-2)] leading-relaxed">
                  Portfolio platform — Express API, Next.js 15 frontend, Clerk auth, Redis, Prometheus, MinIO, Docker. Everything open and documented.
                </p>
              </div>
            </section>

            <section>
              <p className="text-[10px] uppercase tracking-[0.12em] font-medium text-emerald-400/70 mb-3">Tech stack</p>
              <div className="flex flex-wrap gap-1.5">
                {STACK.map(s => (
                  <span key={s.label} className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-mono border border-[var(--border)] bg-[var(--bg-surface)] text-[var(--text-2)]">
                    <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: s.color }} />
                    {s.label}
                  </span>
                ))}
              </div>
            </section>
          </div>

          {/* Right — contact + support */}
          <div className="flex flex-col gap-4">
            <div className="p-4 md:p-5 rounded-xl border border-emerald-500/18"
                 style={{ background: 'rgba(52,211,153,0.04)' }}>
              <p className="text-[13px] font-medium text-[var(--text-1)] mb-1">Get in touch</p>
              <p className="text-[12px] text-[var(--text-3)] mb-4">I respond within 24h.</p>
              <ContactForm />
            </div>

            <div className="p-4 rounded-xl border border-[var(--border)] bg-[var(--bg-surface)]">
              <p className="text-[10px] uppercase tracking-wide font-medium text-[var(--text-3)] mb-2">Support the work</p>
              <p className="text-[12px] text-[var(--text-3)] leading-relaxed mb-3">Everything here is free. If it&apos;s useful, support it directly.</p>
              <div className="flex flex-col gap-2">
                <a href="https://buymeacoffee.com" target="_blank" rel="noreferrer"
                   className="flex items-center gap-2 px-3 py-2.5 rounded-lg font-medium text-[13px] no-underline"
                   style={{ background:'#FFDD00', color:'#1a1a1a' }}>
                  ☕ Buy me a coffee
                </a>
                <a href="https://patreon.com" target="_blank" rel="noreferrer"
                   className="flex items-center gap-2 px-3 py-2.5 rounded-lg font-medium text-[13px] no-underline border border-red-400/35"
                   style={{ background:'rgba(255,66,77,0.1)', color:'#ff424d' }}>
                  ♥ Support on Patreon
                </a>
              </div>
            </div>

            <div className="p-4 rounded-xl border border-[var(--border)] bg-[var(--bg-surface)]">
              <p className="text-[10px] uppercase tracking-wide font-medium text-[var(--text-3)] mb-3">At a glance</p>
              {[
                { label:'Open to work', value:'Yes ✓', color:'#34d399' },
                { label:'Location',     value:'Remote', color:'var(--text-2)' },
                { label:'Response',     value:'< 24h',  color:'var(--text-2)' },
                { label:'Preferred',    value:'Backend', color:'var(--text-2)' },
              ].map(r => (
                <div key={r.label} className="flex justify-between py-1.5 border-b border-[var(--border)] last:border-0">
                  <span className="text-[12px] text-[var(--text-3)]">{r.label}</span>
                  <span className="text-[12px] font-medium" style={{ color: r.color }}>{r.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

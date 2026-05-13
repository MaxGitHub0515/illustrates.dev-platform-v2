'use client'
import { useState, useEffect } from 'react'
import { useUser, useAuth }  from '@clerk/nextjs'
import { useTheme }          from '@/components/theme/ThemeProvider'
import { ACCENTS, DEFAULT_ACCENT, saveUserAccent, applyAccentVars } from '@/components/theme/AccentProvider'

type NotifKey = 'replies' | 'mentions' | 'newsletter'
const NOTIF_LABELS: Record<NotifKey, { label: string; sub: string }> = {
  replies:    { label: 'Discussion replies',  sub: 'When someone replies to your thread' },
  mentions:   { label: 'Mentions',            sub: 'When someone mentions @you'          },
  newsletter: { label: 'Newsletter',          sub: 'Monthly build logs and updates'      },
}

export default function SettingsPage() {
  const { user }          = useUser()
  const { userId }        = useAuth()
  const { theme, toggle } = useTheme()

  const [accent,  setAccent]  = useState('indigo')
  const [notifs,  setNotifs]  = useState<Record<NotifKey, boolean>>({
    replies: true, mentions: true, newsletter: false,
  })
  const [saved,   setSaved]   = useState(false)
  const [saving,  setSaving]  = useState(false)

  // Load this user's saved prefs
  useEffect(() => {
    if (!userId) return
    const a = localStorage.getItem(`illustrates-accent-${userId}`) ?? 'indigo'
    setAccent(a)

    const n = localStorage.getItem(`illustrates-notifs-${userId}`)
    if (n) { try { setNotifs(JSON.parse(n)) } catch {} }
  }, [userId])

  function handleAccent(id: string) {
    if (!userId) return
    setAccent(id)
    saveUserAccent(userId, id)
  }

  function toggleNotif(key: NotifKey) {
    setNotifs(prev => ({ ...prev, [key]: !prev[key] }))
  }

  async function handleSave() {
    if (!userId) return
    setSaving(true)
    localStorage.setItem(`illustrates-accent-${userId}`, accent)
    localStorage.setItem(`illustrates-notifs-${userId}`, JSON.stringify(notifs))
    await new Promise(r => setTimeout(r, 500))
    setSaving(false); setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  const currentAccent = ACCENTS[accent] ?? DEFAULT_ACCENT

  return (
    <div className="max-w-[580px]">
      <h1 className="text-[20px] font-medium text-[var(--text-1)] mb-1">Settings</h1>
      <p className="text-[13px] text-[var(--text-3)] mb-8">Personalise your experience.</p>

      {/* Profile */}
      <section className="mb-7">
        <h2 className="text-[11px] uppercase tracking-wider font-medium text-[var(--text-3)] mb-3">Profile</h2>
        <div className="p-4 rounded-xl border border-[var(--border)] bg-[var(--bg-surface)] flex items-center gap-4">
          <div className="w-11 h-11 rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0"
               style={{ background: `linear-gradient(135deg,${currentAccent.f},${currentAccent.t})` }}>
            {(user?.firstName ?? user?.username ?? '?')[0].toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[14px] font-medium text-[var(--text-1)]">{user?.firstName} {user?.lastName}</p>
            <p className="text-[12px] text-[var(--text-3)] truncate">{user?.primaryEmailAddress?.emailAddress}</p>
          </div>
        </div>
      </section>

      {/* Appearance */}
      <section className="mb-7">
        <h2 className="text-[11px] uppercase tracking-wider font-medium text-[var(--text-3)] mb-3">Appearance</h2>
        <div className="p-4 rounded-xl border border-[var(--border)] bg-[var(--bg-surface)] flex flex-col gap-5">
          {/* Theme toggle */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[13px] font-medium text-[var(--text-1)]">Color mode</p>
              <p className="text-[12px] text-[var(--text-3)]">Switch between dark and light</p>
            </div>
            <button onClick={toggle} className="btn-ghost btn-sm capitalize flex items-center gap-1.5">
              {theme === 'dark'
                ? <><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>Dark</>
                : <><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"/></svg>Light</>
              }
            </button>
          </div>

          {/* Accent picker */}
          <div>
            <p className="text-[13px] font-medium text-[var(--text-1)] mb-0.5">Accent color</p>
            <p className="text-[12px] text-[var(--text-3)] mb-3">
              Changes buttons, gradient text, and highlights. Saved per account.
            </p>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              {Object.entries(ACCENTS).map(([id, c]) => (
                <button key={id} onClick={() => handleAccent(id)} title={id}
                        className="flex flex-col items-center gap-1.5 p-2 rounded-lg border cursor-pointer transition-all"
                        style={{
                          borderColor: accent === id ? c.f : 'var(--border)',
                          background:  accent === id ? `${c.f}18` : 'var(--bg-surface)',
                        }}>
                  <div className="w-8 h-5 rounded-md" style={{ background:`linear-gradient(135deg,${c.f},${c.t})` }} />
                  <span className="text-[10px] font-medium capitalize"
                        style={{ color: accent === id ? c.f : 'var(--text-3)' }}>{id}</span>
                </button>
              ))}
            </div>
            {/* Live preview */}
            <div className="mt-3 p-3 rounded-lg border border-[var(--border)] bg-[var(--bg-surface-2)] flex items-center gap-3 flex-wrap">
              <span className="text-[12px] text-[var(--text-3)]">Preview:</span>
              <span className="g-logo text-[13px] font-mono font-medium">illustrates.dev</span>
              <button className="btn-primary btn-sm ml-auto">Get started</button>
            </div>
          </div>
        </div>
      </section>

      {/* Notifications */}
      <section className="mb-7">
        <h2 className="text-[11px] uppercase tracking-wider font-medium text-[var(--text-3)] mb-3">Notifications</h2>
        <div className="p-4 rounded-xl border border-[var(--border)] bg-[var(--bg-surface)] flex flex-col divide-y divide-[var(--border)]">
          {(Object.keys(NOTIF_LABELS) as NotifKey[]).map(key => (
            <label key={key} className="flex items-center justify-between py-3 first:pt-0 last:pb-0 cursor-pointer">
              <div className="pr-4">
                <p className="text-[13px] font-medium text-[var(--text-1)]">{NOTIF_LABELS[key].label}</p>
                <p className="text-[12px] text-[var(--text-3)]">{NOTIF_LABELS[key].sub}</p>
              </div>
              <button role="switch" aria-checked={notifs[key]} onClick={() => toggleNotif(key)}
                      className="relative w-10 h-5 rounded-full flex-shrink-0 cursor-pointer border-0 transition-colors"
                      style={{
                        background: notifs[key]
                          ? `linear-gradient(135deg,${currentAccent.f},${currentAccent.t})`
                          : 'var(--bg-surface-2)',
                        outline: '1px solid var(--border-mid)',
                      }}>
                <span className="absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all duration-200"
                      style={{ left: notifs[key] ? '22px' : '2px' }} />
              </button>
            </label>
          ))}
        </div>
      </section>

      <button onClick={handleSave} disabled={saving} className="btn-primary">
        {saving ? 'Saving…' : saved ? '✓ Saved' : 'Save settings'}
      </button>
    </div>
  )
}

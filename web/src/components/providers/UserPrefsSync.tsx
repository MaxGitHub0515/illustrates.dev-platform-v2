'use client'
/**
 * Syncs user preferences (accent colour) with auth state.
 *
 * Behaviour:
 *  - On LOGOUT  → reset accent to default indigo immediately
 *  - On LOGIN   → restore the accent stored in localStorage (from last session)
 *
 * This means each browser session has its own accent stored locally.
 * Accent persists across page loads but resets when a different user logs in.
 */
import { useEffect, useRef } from 'react'
import { useAuth } from '@clerk/nextjs'

const ACCENTS: Record<string, { f:string; t:string; la:string; lb:string }> = {
  indigo:  { f:'#4f46e5', t:'#06b6d4', la:'#7dd3fc', lb:'#c084fc' },
  violet:  { f:'#7c3aed', t:'#a855f7', la:'#c084fc', lb:'#e879f9' },
  emerald: { f:'#059669', t:'#06b6d4', la:'#34d399', lb:'#06b6d4' },
  rose:    { f:'#e11d48', t:'#f43f5e', la:'#fda4af', lb:'#fb7185' },
  amber:   { f:'#d97706', t:'#f59e0b', la:'#fcd34d', lb:'#fb923c' },
  sky:     { f:'#0284c7', t:'#38bdf8', la:'#7dd3fc', lb:'#38bdf8' },
}

function applyAccent(id: string) {
  const c = ACCENTS[id] ?? ACCENTS.indigo
  const r = document.documentElement
  r.style.setProperty('--accent-from',   c.f)
  r.style.setProperty('--accent-to',     c.t)
  r.style.setProperty('--accent-logo-a', c.la)
  r.style.setProperty('--accent-logo-b', c.lb)
}

function resetToDefault() {
  applyAccent('indigo')
  localStorage.removeItem('illustrates-accent')
}

function restoreFromStorage() {
  const saved = localStorage.getItem('illustrates-accent')
  applyAccent(saved ?? 'indigo')
}

export function UserPrefsSync() {
  const { isSignedIn } = useAuth()
  const prevSignedIn = useRef<boolean | undefined>(undefined)

  useEffect(() => {
    const prev = prevSignedIn.current

    if (prev === true && isSignedIn === false) {
      // User just signed out — reset to default
      resetToDefault()
    }

    if (prev === false && isSignedIn === true) {
      // User just signed in — restore their saved prefs
      restoreFromStorage()
    }

    prevSignedIn.current = isSignedIn
  }, [isSignedIn])

  return null  // render nothing
}

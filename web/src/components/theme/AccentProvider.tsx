'use client'
/**
 * Manages accent color per user.
 * - On login:  loads the user's saved accent from localStorage
 * - On logout: resets CSS vars to default (indigo)
 * - On change: saves under illustrates-accent-{userId} so each user has their own
 */
import { useEffect, useRef } from 'react'
import { useAuth } from '@clerk/nextjs'

const DEFAULT_ACCENT = {
  f:  '#4f46e5', t:  '#06b6d4',
  la: '#7dd3fc', lb: '#c084fc',
}

const ACCENTS: Record<string, typeof DEFAULT_ACCENT> = {
  indigo:  { f:'#4f46e5', t:'#06b6d4', la:'#7dd3fc', lb:'#c084fc' },
  violet:  { f:'#7c3aed', t:'#a855f7', la:'#c084fc', lb:'#e879f9' },
  emerald: { f:'#059669', t:'#06b6d4', la:'#34d399', lb:'#06b6d4' },
  rose:    { f:'#e11d48', t:'#f43f5e', la:'#fda4af', lb:'#fb7185' },
  amber:   { f:'#d97706', t:'#f59e0b', la:'#fcd34d', lb:'#fb923c' },
  sky:     { f:'#0284c7', t:'#38bdf8', la:'#7dd3fc', lb:'#38bdf8' },
}

export function applyAccentVars(c: typeof DEFAULT_ACCENT) {
  const r = document.documentElement
  r.style.setProperty('--accent-from',   c.f)
  r.style.setProperty('--accent-to',     c.t)
  r.style.setProperty('--accent-logo-a', c.la)
  r.style.setProperty('--accent-logo-b', c.lb)
}

/** Call this from the settings page when user picks a color */
export function saveUserAccent(userId: string, accentId: string) {
  const c = ACCENTS[accentId] ?? DEFAULT_ACCENT
  localStorage.setItem(`illustrates-accent-${userId}`, accentId)
  applyAccentVars(c)
}

export function AccentProvider({ children }: { children: React.ReactNode }) {
  const { userId } = useAuth()
  const prevUserId = useRef<string | null | undefined>(undefined)

  useEffect(() => {
    const prev = prevUserId.current
    prevUserId.current = userId

    if (!userId) {
      // Logged out (or never logged in) → reset to default
      applyAccentVars(DEFAULT_ACCENT)
      return
    }

    if (prev !== userId) {
      // New user logged in → load their accent
      const saved = localStorage.getItem(`illustrates-accent-${userId}`) ?? 'indigo'
      const c = ACCENTS[saved] ?? DEFAULT_ACCENT
      applyAccentVars(c)
    }
  }, [userId])

  return <>{children}</>
}

export { ACCENTS, DEFAULT_ACCENT }

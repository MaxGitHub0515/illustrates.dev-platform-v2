'use client'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface AuthPrefs {
  redirectAfterLogin: string
  lastVisited:        string
  setRedirect:        (url: string) => void
  setLastVisited:     (url: string) => void
  clearRedirect:      () => void
}

export const useAuthStore = create<AuthPrefs>()(
  persist(
    (set) => ({
      redirectAfterLogin: '/',
      lastVisited:        '/',
      setRedirect:     (url) => set({ redirectAfterLogin: url }),
      setLastVisited:  (url) => set({ lastVisited: url }),
      clearRedirect:   ()    => set({ redirectAfterLogin: '/' }),
    }),
    { name: 'illustrates-auth' }
  )
)

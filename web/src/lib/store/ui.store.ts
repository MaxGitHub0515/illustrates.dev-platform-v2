'use client'
import { create } from 'zustand'

interface UIState {
  sidebarOpen:  boolean
  activeModal:  string | null
  setSidebar:   (open: boolean)  => void
  openModal:    (id: string)     => void
  closeModal:   ()               => void
}

export const useUIStore = create<UIState>()((set) => ({
  sidebarOpen: false,
  activeModal: null,
  setSidebar:  (open)  => set({ sidebarOpen: open }),
  openModal:   (id)    => set({ activeModal: id }),
  closeModal:  ()      => set({ activeModal: null }),
}))

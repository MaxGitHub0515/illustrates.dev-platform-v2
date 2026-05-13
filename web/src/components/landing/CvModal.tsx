'use client'
import { useEffect } from 'react'

interface Props { open: boolean; onClose: () => void }

export function CvModal({ open, onClose }: Props) {
  useEffect(() => {
    if (!open) return
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', handler)
      document.body.style.overflow = ''
    }
  }, [open, onClose])

  if (!open) return null

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-[100] flex items-center justify-center p-6 animate-modal"
      style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(6px)' }}
    >
      <div
        onClick={e => e.stopPropagation()}
        className="w-full max-w-[860px] flex flex-col rounded-xl overflow-hidden border border-indigo-500/25"
        style={{ height: '90vh', background: '#0d0b18' }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-[var(--border)] bg-white/[0.02] flex-shrink-0">
          <span className="text-[13px] font-medium text-[var(--text-1)]">Curriculum Vitae</span>
          <div className="flex items-center gap-2.5">
            <a
              href="/cv.pdf"
              download
              className="btn-primary btn-sm"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
                <polyline points="7,10 12,15 17,10"/>
                <line x1="12" y1="15" x2="12" y2="3"/>
              </svg>
              Download PDF
            </a>
            <button
              onClick={onClose}
              aria-label="Close"
              className="w-7 h-7 rounded-md border border-[var(--border)] bg-[var(--bg-surface)] text-[var(--text-2)] flex items-center justify-center hover:bg-[var(--bg-surface-2)] transition-colors cursor-pointer"
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18"/>
                <line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          </div>
        </div>

        <iframe
          src="/cv.pdf"
          title="Curriculum Vitae"
          className="flex-1 w-full border-none bg-white"
        />
      </div>
    </div>
  )
}

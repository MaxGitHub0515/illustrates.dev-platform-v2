import React from 'react'

type Variant = 'green' | 'orange' | 'red' | 'indigo' | 'cyan' | 'neutral'

const cls: Record<Variant, string> = {
  green:   'bg-emerald-500/10  border-emerald-500/30  text-emerald-400',
  orange:  'bg-orange-400/10   border-orange-400/30   text-orange-400',
  red:     'bg-red-500/10      border-red-500/30      text-red-400',
  indigo:  'bg-indigo-500/15   border-indigo-400/35   text-indigo-400',
  cyan:    'bg-cyan-500/10     border-cyan-400/30     text-cyan-400',
  neutral: 'bg-[var(--bg-surface-2)] border-[var(--border-mid)] text-[var(--text-3)]',
}

interface BadgeProps {
  children:  React.ReactNode
  variant?:  Variant
  dot?:      boolean
}

export function Badge({ children, variant = 'neutral', dot }: BadgeProps) {
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium border ${cls[variant]}`}>
      {dot && <span className="w-1 h-1 rounded-full bg-current" />}
      {children}
    </span>
  )
}

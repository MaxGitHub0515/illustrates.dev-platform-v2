import React from 'react'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  icon?:  React.ReactNode
}

export function Input({ label, error, icon, className = '', ...props }: InputProps) {
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label className="text-[11px] font-medium uppercase tracking-wider text-[var(--text-2)]">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--text-3)]">
            {icon}
          </span>
        )}
        <input
          {...props}
          className={`input-base ${icon ? 'pl-9' : ''} ${error ? '!border-red-400/60' : ''} ${className}`}
        />
      </div>
      {error && <span className="text-[11px] text-red-400">{error}</span>}
    </div>
  )
}

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
}

export function Textarea({ label, error, className = '', ...props }: TextareaProps) {
  return (
    <div className="flex flex-col gap-1">
      {label && <label className="text-[11px] font-medium uppercase tracking-wider text-[var(--text-2)]">{label}</label>}
      <textarea {...props} className={`input-base resize-y ${error ? '!border-red-400/60' : ''} ${className}`} />
      {error && <span className="text-[11px] text-red-400">{error}</span>}
    </div>
  )
}

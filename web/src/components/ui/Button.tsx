import React from 'react'

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger'
type Size    = 'sm' | 'md' | 'lg'

const variantCls: Record<Variant, string> = {
  primary:   'btn-primary',
  secondary: 'btn-ghost bg-indigo-500/10 border-indigo-400/35 text-indigo-400 hover:bg-indigo-500/15',
  ghost:     'btn-ghost',
  danger:    'btn-danger',
}

const sizeCls: Record<Size, string> = {
  sm:  'btn-sm',
  md:  '',
  lg:  'btn-lg',
}

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:  Variant
  size?:     Size
  loading?:  boolean
  as?:       'button' | 'a'
}

export function Button({ variant='primary', size='md', loading, children, disabled, className='', ...props }: ButtonProps) {
  return (
    <button
      {...props}
      disabled={disabled || loading}
      className={`${variantCls[variant]} ${sizeCls[size]} ${className}`}
    >
      {loading ? (
        <>
          <svg className="animate-spin w-3 h-3" viewBox="0 0 24 24" fill="none">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          Loading…
        </>
      ) : children}
    </button>
  )
}

'use client'
interface Props { message: string; hint?: string; onRetry?: () => void }

export function AdminError({ message, hint, onRetry }: Props) {
  return (
    <div className="p-4 rounded-xl border border-red-500/25 bg-red-500/8 mb-5">
      <p className="text-[13px] font-medium text-red-400 mb-1">⚠ {message}</p>
      {hint && <p className="text-[12px] text-red-400/60">{hint}</p>}
      {onRetry && (
        <button onClick={onRetry} className="mt-3 btn-ghost btn-sm text-red-400 border-red-500/25">
          Retry
        </button>
      )}
    </div>
  )
}

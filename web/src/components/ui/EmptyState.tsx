interface EmptyStateProps {
  icon?:    string
  title:    string
  desc?:    string
  action?:  { label: string; onClick: () => void }
}

export function EmptyState({ icon = 'ti-inbox', title, desc, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 border border-[var(--border)] rounded-xl text-center">
      <i className={`ti ${icon} text-4xl text-[var(--text-3)] mb-4 block`} aria-hidden="true" />
      <p className="text-[15px] font-medium text-[var(--text-2)] mb-1">{title}</p>
      {desc && <p className="text-[13px] text-[var(--text-3)] mb-5">{desc}</p>}
      {action && (
        <button onClick={action.onClick} className="btn-ghost btn-sm">
          {action.label}
        </button>
      )}
    </div>
  )
}

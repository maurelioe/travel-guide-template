import type { ReactNode } from 'react'

type Tone =
  | 'gold' | 'red' | 'green' | 'blue' | 'muted'
  | 'paid' | 'partial' | 'pending' | 'cancelled'
  | 'critical'

interface Props {
  children: ReactNode
  tone?: Tone
  className?: string
  pulse?: boolean
}

const toneClass: Record<Tone, string> = {
  gold:      'bg-[var(--accent-dim)] text-[var(--accent-soft)] border-[var(--border-accent)]',
  red:       'bg-[var(--accent-red-dim)] text-red-300 border-red-600/40',
  green:     'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
  blue:      'bg-sky-500/15 text-sky-300 border-sky-500/30',
  muted:     'bg-white/5 text-[var(--text-secondary)] border-white/10',
  paid:      'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
  partial:   'bg-amber-500/15 text-amber-300 border-amber-500/30',
  pending:   'bg-[var(--accent-red-dim)] text-red-300 border-red-600/40',
  cancelled: 'bg-neutral-700/40 text-neutral-400 border-neutral-600/40 line-through',
  critical:  'bg-[var(--accent-red-dim)] text-red-300 border-red-500/50',
}

export function Badge({ children, tone = 'muted', className = '', pulse = false }: Props) {
  return (
    <span
      className={[
        'inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[11px] font-medium uppercase tracking-wider',
        toneClass[tone],
        pulse ? 'pulse-red' : '',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {children}
    </span>
  )
}

import type { ReactNode, CSSProperties } from 'react'
import { motion } from 'framer-motion'

interface Props {
  children: ReactNode
  className?: string
  hover?: boolean
  padded?: boolean
  accent?: 'gold' | 'red' | 'green' | 'none'
  onClick?: () => void
  style?: CSSProperties
}

export function GlassCard({
  children,
  className = '',
  hover = false,
  padded = true,
  accent = 'none',
  onClick,
  style,
}: Props) {
  const accentBorder =
    accent === 'gold'
      ? 'border-[var(--border-accent)]'
      : accent === 'red'
        ? 'border-red-500/40'
        : accent === 'green'
          ? 'border-emerald-500/30'
          : 'border-white/[0.08]'

  const accentGlow =
    accent === 'gold'
      ? 'shadow-[0_0_24px_rgba(201,168,76,0.12)]'
      : accent === 'red'
        ? 'shadow-[0_0_24px_rgba(220,38,38,0.18)]'
        : accent === 'green'
          ? 'shadow-[0_0_20px_rgba(16,185,129,0.12)]'
          : ''

  return (
    <motion.div
      onClick={onClick}
      whileHover={
        hover
          ? { y: -2, boxShadow: '0 0 32px rgba(201,168,76,0.22)' }
          : undefined
      }
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className={[
        'relative rounded-2xl border bg-white/[0.03] backdrop-blur-xl',
        padded ? 'p-5 sm:p-6' : '',
        accentBorder,
        accentGlow,
        hover ? 'cursor-pointer transition-colors hover:bg-white/[0.05]' : '',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      style={{ boxShadow: 'var(--shadow-card)', ...style }}
    >
      {children}
    </motion.div>
  )
}

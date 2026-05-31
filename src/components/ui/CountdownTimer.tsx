import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface Props {
  target: Date
}

function diff(target: Date) {
  const ms = Math.max(0, target.getTime() - Date.now())
  const days = Math.floor(ms / 86_400_000)
  const hours = Math.floor((ms % 86_400_000) / 3_600_000)
  const minutes = Math.floor((ms % 3_600_000) / 60_000)
  const seconds = Math.floor((ms % 60_000) / 1000)
  return { days, hours, minutes, seconds }
}

export function CountdownTimer({ target }: Props) {
  const [t, setT] = useState(() => diff(target))

  useEffect(() => {
    const i = setInterval(() => setT(diff(target)), 1000)
    return () => clearInterval(i)
  }, [target])

  const cells = [
    { label: 'dias', value: t.days },
    { label: 'horas', value: t.hours },
    { label: 'min', value: t.minutes },
    { label: 'seg', value: t.seconds },
  ]

  return (
    <div className="grid grid-cols-4 gap-2">
      {cells.map((c) => (
        <div
          key={c.label}
          className="relative overflow-hidden rounded-xl border border-white/10 bg-white/[0.04] px-1 py-3 text-center backdrop-blur-md"
        >
          <AnimatePresence mode="popLayout" initial={false}>
            <motion.div
              key={c.value}
              initial={{ y: 14, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -14, opacity: 0 }}
              transition={{ duration: 0.35, ease: 'easeOut' }}
              className="flex items-center justify-center font-display text-2xl font-semibold tabular-nums leading-none tracking-tight text-[var(--accent-soft)] sm:text-3xl"
            >
              {String(c.value).padStart(2, '0')}
            </motion.div>
          </AnimatePresence>
          <div className="mt-1 text-[10px] uppercase tracking-[0.18em] text-[var(--text-muted)]">
            {c.label}
          </div>
        </div>
      ))}
    </div>
  )
}

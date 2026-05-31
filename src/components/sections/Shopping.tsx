import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, MapPin, Lightbulb } from 'lucide-react'
import { shopping } from '../../data/shopping'
import { GlassCard } from '../ui/GlassCard'
import { Badge } from '../ui/Badge'
import { PageTransition, containerStagger, cardEnter } from '../layout/PageTransition'

export function Shopping() {
  const [openId, setOpenId] = useState<string | null>(shopping[0]?.id ?? null)

  return (
    <PageTransition sectionKey="shopping">
      <motion.div
        variants={containerStagger}
        initial="initial"
        animate="animate"
        className="grid grid-cols-1 lg:grid-cols-2 gap-4"
      >
        {shopping.map((s) => {
          const open = openId === s.id
          return (
            <motion.div key={s.id} variants={cardEnter}>
              <GlassCard padded={false} accent={open ? 'gold' : 'none'}>
                <button
                  onClick={() => setOpenId(open ? null : s.id)}
                  className="w-full flex items-center gap-4 p-5 sm:p-6 text-left"
                >
                  <div className="text-4xl shrink-0">{s.emoji}</div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="font-display text-xl text-[var(--text-primary)] leading-tight">{s.title}</h4>
                      {s.taxFree && (
                        <Badge tone="green">
                          <Sparkles className="h-3 w-3" /> Tax Free
                        </Badge>
                      )}
                    </div>
                    <div className="mt-1 text-xs text-[var(--text-muted)] font-mono">{s.budget}</div>
                  </div>
                  <div className={`text-[var(--accent-soft)] transition-transform ${open ? 'rotate-180' : ''}`}>▾</div>
                </button>

                <AnimatePresence initial={false}>
                  {open && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 sm:px-6 pb-5 sm:pb-6 border-t border-white/5">
                        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-[0.3em] text-[var(--accent-soft)] mb-2">
                              <MapPin className="h-3 w-3" />
                              Onde ir
                            </div>
                            <ul className="space-y-1.5">
                              {s.where.map((w, i) => (
                                <li key={i} className="text-sm text-[var(--text-primary)] flex items-start gap-2">
                                  <span className="text-[var(--accent-soft)] mt-0.5">▸</span>
                                  <span>{w}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div>
                            <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-[0.3em] text-sky-300 mb-2">
                              <Lightbulb className="h-3 w-3" />
                              Tips
                            </div>
                            <ul className="space-y-1.5">
                              {s.tips.map((t, i) => (
                                <li key={i} className="text-sm text-[var(--text-secondary)] leading-snug">
                                  <span className="text-sky-300 mr-1.5">·</span>
                                  {t}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </GlassCard>
            </motion.div>
          )
        })}
      </motion.div>
    </PageTransition>
  )
}

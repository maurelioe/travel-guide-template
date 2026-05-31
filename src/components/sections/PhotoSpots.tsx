import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Clock, X, MapPin } from 'lucide-react'
import { photoSpots } from '../../data/photoSpots'
import { Badge } from '../ui/Badge'
import { PageTransition, containerStagger, cardEnter } from '../layout/PageTransition'
import type { PhotoSpot } from '../../types'

export function PhotoSpots() {
  const [selected, setSelected] = useState<PhotoSpot | null>(null)

  return (
    <PageTransition sectionKey="photo-spots">
      <motion.div
        variants={containerStagger}
        initial="initial"
        animate="animate"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
      >
        {photoSpots.map((p) => (
          <motion.button
            key={p.id}
            variants={cardEnter}
            onClick={() => setSelected(p)}
            whileHover={{ y: -3 }}
            transition={{ duration: 0.25 }}
            className="group relative overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.02] text-left aspect-[4/5]"
          >
            <img
              src={p.image}
              alt={p.name}
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-void)] via-[var(--bg-void)]/40 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-4">
              <Badge tone="gold">{p.city}</Badge>
              <h4 className="mt-2 font-display text-xl text-[var(--text-primary)] leading-tight">{p.name}</h4>
              <div className="mt-1.5 flex items-center gap-1.5 text-xs text-[var(--text-secondary)]">
                <Clock className="h-3 w-3 text-[var(--accent-soft)]" strokeWidth={2} />
                <span>{p.bestTime}</span>
              </div>
            </div>
          </motion.button>
        ))}
      </motion.div>

      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelected(null)}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-3xl rounded-2xl overflow-hidden border border-white/10 bg-[var(--bg-elevated)] max-h-[90vh] overflow-y-auto"
            >
              <div className="relative h-[300px] sm:h-[380px]">
                <img src={selected.image} alt={selected.name} className="absolute inset-0 h-full w-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-elevated)] via-transparent to-transparent" />
                <button
                  onClick={() => setSelected(null)}
                  className="absolute top-3 right-3 p-2 rounded-full bg-black/40 hover:bg-black/60 backdrop-blur-md"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="p-6 sm:p-8">
                <div className="flex items-center gap-2 mb-2">
                  <Badge tone="gold">{selected.city}</Badge>
                  <Badge tone="muted">
                    <Clock className="h-3 w-3" /> {selected.bestTime}
                  </Badge>
                </div>
                <h3 className="font-display text-3xl text-[var(--text-primary)]">{selected.name}</h3>
                <p className="mt-2 text-sm text-[var(--text-secondary)] leading-relaxed">{selected.description}</p>

                <div className="mt-5">
                  <div className="text-[10px] uppercase tracking-[0.3em] text-[var(--accent-soft)] mb-2">Dicas de Fotografia</div>
                  <ul className="space-y-1.5">
                    {selected.tips.map((t, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-[var(--text-primary)]/90">
                        <span className="text-[var(--accent-soft)] mt-0.5">▸</span>
                        <span>{t}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-5 flex flex-wrap items-center gap-2">
                  {selected.hashtags.map((h) => (
                    <span key={h} className="text-xs text-sky-300/80">{h}</span>
                  ))}
                </div>

                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${selected.coordinates[0]},${selected.coordinates[1]}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-5 inline-flex items-center gap-2 rounded-full border border-white/10 hover:bg-white/[0.05] px-4 py-2 text-xs"
                >
                  <MapPin className="h-3 w-3 text-[var(--accent-soft)]" />
                  Abrir no Google Maps
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </PageTransition>
  )
}

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, MapPin, Ticket, Clock, Wallet, Train, Lightbulb, Luggage, ShoppingCart, ChevronDown } from 'lucide-react'
import { intercityRoutes, passOptions } from '../../data/intercity'
import type { IntercityRoute, PassOption } from '../../data/intercity'
import { GlassCard } from '../ui/GlassCard'
import { Badge } from '../ui/Badge'
import { containerStagger, cardEnter } from '../layout/PageTransition'

const worthMap: Record<PassOption['worthIt'], { tone: 'green' | 'gold' | 'red'; label: string }> = {
  sim:     { tone: 'green', label: '✓ COMPRE' },
  parcial: { tone: 'gold',  label: '~ TALVEZ' },
  'não':   { tone: 'red',   label: '✗ EVITE' },
}

export function IntercityCard() {
  const [openId, setOpenId] = useState<string | null>(intercityRoutes[0]?.id ?? null)

  return (
    <div className="space-y-6">
      {/* Hero */}
      <GlassCard accent="gold">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center gap-4">
            <div className="text-4xl">🚄</div>
            <div>
              <div className="text-[10px] uppercase tracking-[0.3em] text-[var(--accent-soft)] mb-1">
                Intercity Routes
              </div>
              <h3 className="font-display text-2xl text-[var(--text-primary)] leading-tight">
                How to Move Between Cities
              </h3>
              <p className="text-xs text-[var(--text-secondary)] mt-1">
                Tokyo · Kyoto · Nara · Nikko · Kobe — passes, preços reais 2026, plataformas e dicas
              </p>
            </div>
          </div>
          <div className="text-right shrink-0">
            <div className="font-display text-3xl text-[var(--accent-soft)]">{intercityRoutes.length}</div>
            <div className="text-[10px] uppercase tracking-wider text-[var(--text-muted)]">rotas</div>
          </div>
        </div>
      </GlassCard>

      {/* Strategy panel */}
      <div>
        <div className="text-[10px] uppercase tracking-[0.4em] text-[var(--accent-soft)] mb-3">Pass Strategy</div>
        <motion.div variants={containerStagger} initial="initial" animate="animate" className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {passOptions.map((p) => {
            const w = worthMap[p.worthIt]
            return (
              <motion.div key={p.id} variants={cardEnter}>
                <GlassCard accent={p.worthIt === 'sim' ? 'green' : p.worthIt === 'não' ? 'red' : 'gold'}>
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <h4 className="font-display text-lg text-[var(--text-primary)] leading-tight">{p.name}</h4>
                      <div className="text-[10px] uppercase tracking-wider text-[var(--text-muted)] mt-0.5">{p.validity}</div>
                    </div>
                    <Badge tone={w.tone}>{w.label}</Badge>
                  </div>

                  <div className="mt-3 flex items-baseline gap-3">
                    <div className="font-mono text-2xl text-[var(--accent-soft)]">
                      {p.priceDest === 0 ? 'Free' : `{'{{DEST_SYMBOL}}'} ${p.priceDest.toLocaleString('en')}`}
                    </div>
                    {p.priceHome > 0 && (
                      <div className="text-xs text-[var(--text-muted)] font-mono">≈ {'{{HOME_SYMBOL}}'} {p.priceHome}</div>
                    )}
                  </div>

                  <div className="mt-3 space-y-1">
                    <div className="text-[10px] uppercase tracking-[0.25em] text-[var(--text-secondary)]">Cobre</div>
                    <ul className="text-xs text-[var(--text-primary)]/90 space-y-0.5">
                      {p.coverage.map((c, i) => (
                        <li key={i}>
                          <span className="text-[var(--accent-soft)] mr-1.5">·</span>{c}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <p className="mt-3 text-xs text-[var(--text-secondary)] leading-relaxed italic border-l-2 border-[var(--border-accent)] pl-3">
                    {p.recommendation}
                  </p>
                </GlassCard>
              </motion.div>
            )
          })}
        </motion.div>
      </div>

      {/* Routes */}
      <div>
        <div className="flex items-baseline justify-between mb-3">
          <div className="text-[10px] uppercase tracking-[0.4em] text-[var(--accent-soft)]">Detailed Routes</div>
          <div className="text-xs text-[var(--text-muted)]">Click to expand</div>
        </div>
        <motion.div variants={containerStagger} initial="initial" animate="animate" className="space-y-3">
          {intercityRoutes.map((r) => (
            <motion.div key={r.id} variants={cardEnter}>
              <RouteCard route={r} open={openId === r.id} onToggle={() => setOpenId(openId === r.id ? null : r.id)} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  )
}

function RouteCard({ route, open, onToggle }: { route: IntercityRoute; open: boolean; onToggle: () => void }) {
  return (
    <GlassCard padded={false} accent={open ? 'gold' : 'none'}>
      <button onClick={onToggle} className="w-full p-4 sm:p-5 text-left flex flex-wrap items-center gap-3 sm:gap-5">
        <div className="text-3xl shrink-0">{route.emoji}</div>

        {/* From → To */}
        <div className="flex items-center gap-2 min-w-0">
          <div>
            <div className="text-[10px] uppercase tracking-[0.25em] text-[var(--text-muted)]">De</div>
            <div className="font-display text-lg text-[var(--text-primary)]">{route.from}</div>
          </div>
          <ArrowRight className="h-4 w-4 text-[var(--accent-soft)] mx-1" strokeWidth={1.5} />
          <div>
            <div className="text-[10px] uppercase tracking-[0.25em] text-[var(--text-muted)]">Para</div>
            <div className="font-display text-lg text-[var(--text-primary)]">{route.to}</div>
          </div>
        </div>

        <div className="hidden sm:flex flex-1" />

        {/* Quick stats */}
        <div className="flex items-center gap-4 ml-auto">
          <div className="text-right">
            <div className="flex items-center gap-1 justify-end text-[var(--accent-soft)]">
              <Clock className="h-3 w-3" strokeWidth={2} />
              <span className="text-sm font-mono">{route.duration}</span>
            </div>
            <div className="text-[10px] text-[var(--text-muted)] font-mono">{'{{DEST_SYMBOL}}'} {route.costDest.toLocaleString('en')} · {'{{HOME_SYMBOL}}'} {route.costHome}</div>
          </div>
          <ChevronDown className={`h-5 w-5 text-[var(--accent-soft)] transition-transform ${open ? 'rotate-180' : ''}`} strokeWidth={1.5} />
        </div>
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
            <div className="px-4 sm:px-5 pb-5 border-t border-white/5 pt-4 space-y-4">
              {/* Resumo */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <Stat icon={<Train className="h-3 w-3" />} label="Type" value={route.trainType} tone="text-sky-300" />
                <Stat icon={<Clock className="h-3 w-3" />} label="Duration" value={route.duration} tone="text-[var(--accent-soft)]" />
                <Stat icon={<Wallet className="h-3 w-3" />} label="Cost" value={`{'{{DEST_SYMBOL}}'} ${route.costDest.toLocaleString('en')}`} tone="text-emerald-300" />
                <Stat icon={<MapPin className="h-3 w-3" />} label="Distance" value={route.distance} tone="text-fuchsia-300" />
              </div>

              {/* Pass info */}
              {route.recommendedPass && (
                <div className="rounded-xl bg-[var(--accent-dim)] border border-[var(--border-accent)] p-3">
                  <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] text-[var(--accent-soft)] mb-1">
                    <Ticket className="h-3 w-3" />
                    Ticket Type
                  </div>
                  <div className="text-sm text-[var(--text-primary)]">{route.recommendedPass}</div>
                  {route.alternativeCost && (
                    <div className="text-xs text-[var(--text-secondary)] mt-1.5 italic">{route.alternativeCost}</div>
                  )}
                </div>
              )}

              {/* Onde + como comprar */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-[0.3em] text-emerald-300 mb-2">
                    <ShoppingCart className="h-3 w-3" />
                    Where to Buy
                  </div>
                  <ul className="space-y-1.5">
                    {route.whereToBuy.map((w, i) => (
                      <li key={i} className="text-xs text-[var(--text-primary)] flex items-start gap-2">
                        <span className="text-emerald-300 mt-0.5 shrink-0">▸</span>
                        <span>{w}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-[0.3em] text-sky-300 mb-2">
                    <Ticket className="h-3 w-3" />
                    How to Buy
                  </div>
                  <ul className="space-y-1.5">
                    {route.howToBuy.map((h, i) => (
                      <li key={i} className="text-xs text-[var(--text-primary)] flex items-start gap-2">
                        <span className="text-sky-300 mt-0.5 shrink-0">▸</span>
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Platform */}
              <div className="rounded-xl bg-white/[0.03] border border-white/10 p-3">
                <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-[0.3em] text-[var(--accent-soft)] mb-1">
                  <MapPin className="h-3 w-3" />
                  Platform & Access
                </div>
                <div className="text-xs text-[var(--text-primary)]/90 leading-relaxed">{route.platformTip}</div>
              </div>

              {/* Baggage */}
              {route.baggageRule && (
                <div className="rounded-xl bg-amber-500/5 border border-amber-500/20 p-3">
                  <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-[0.3em] text-amber-300 mb-1">
                    <Luggage className="h-3 w-3" />
                    Baggage Rule
                  </div>
                  <div className="text-xs text-[var(--text-primary)]/90 leading-relaxed">{route.baggageRule}</div>
                </div>
              )}

              {/* Tips */}
              <div>
                <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-[0.3em] text-fuchsia-300 mb-2">
                  <Lightbulb className="h-3 w-3" />
                  Additional Tips
                </div>
                <ul className="space-y-1.5">
                  {route.tips.map((t, i) => (
                    <li key={i} className="text-xs text-[var(--text-secondary)] flex items-start gap-2 leading-snug">
                      <span className="text-fuchsia-300 mt-0.5 shrink-0">·</span>
                      <span>{t}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </GlassCard>
  )
}

function Stat({ icon, label, value, tone }: { icon: React.ReactNode; label: string; value: string; tone: string }) {
  return (
    <div>
      <div className={`flex items-center gap-1 text-[10px] uppercase tracking-wider ${tone}`}>
        {icon}<span>{label}</span>
      </div>
      <div className="text-xs text-[var(--text-primary)] mt-0.5 leading-tight">{value}</div>
    </div>
  )
}

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Clock, Ticket, ListOrdered, Smartphone, Sunrise, Utensils, LogOut, AlertTriangle, Zap } from 'lucide-react'
import { parks } from '../../data/parks'
import type { ParkGuide } from '../../types'
import { GlassCard } from '../ui/GlassCard'
import { Badge } from '../ui/Badge'
import { PageTransition, containerStagger, cardEnter } from '../layout/PageTransition'

export function ParkStrategy() {
  const [activeId, setActiveId] = useState<ParkGuide['id']>('tdl')
  const park = parks.find((p) => p.id === activeId) ?? parks[0]

  return (
    <PageTransition sectionKey="parks">
      {/* Park selector */}
      <div className="flex flex-wrap gap-2 mb-5">
        {parks.map((p) => (
          <button
            key={p.id}
            onClick={() => setActiveId(p.id)}
            className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm transition-colors ${
              activeId === p.id
                ? 'bg-[var(--accent-dim)] text-[var(--accent-soft)] border-[var(--border-accent)]'
                : 'text-[var(--text-secondary)] border-white/10 hover:bg-white/[0.04]'
            }`}
          >
            <span>{p.emoji}</span>
            <span>{p.shortName}</span>
            <span className="text-[10px] text-[var(--text-muted)] hidden sm:inline">· {p.name}</span>
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={park.id}
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.3 }}
          className="space-y-5"
        >
          {/* Hero */}
          <div className="relative h-[260px] sm:h-[320px] rounded-2xl overflow-hidden border border-white/[0.06]">
            <img src={park.heroImage} alt={park.name} className="absolute inset-0 h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-void)] via-[var(--bg-void)]/40 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-5 sm:p-7">
              <div className="flex items-center gap-2 mb-2">
                <Badge tone="gold">{park.city}</Badge>
                <Badge tone="muted">
                  <Clock className="h-3 w-3" /> {park.openingHour.split(' ')[0]} – {park.closingHour.split(' ')[0]}
                </Badge>
              </div>
              <h2 className="font-display text-3xl sm:text-4xl text-[var(--text-primary)]">
                {park.emoji} {park.name}
              </h2>
              <div className="mt-1 text-xs text-[var(--text-secondary)]">
                Abertura {park.openingHour} · Fechamento {park.closingHour}
              </div>
            </div>
          </div>

          {/* Alerts */}
          {park.criticalAlerts.length > 0 && (
            <GlassCard accent="red">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-red-400 shrink-0 mt-0.5" />
                <div className="flex-1">
                  <div className="text-[10px] uppercase tracking-[0.3em] text-red-300 mb-2">Alertas Críticos</div>
                  <ul className="space-y-1.5">
                    {park.criticalAlerts.map((a, i) => (
                      <li key={i} className="text-sm text-[var(--text-primary)] leading-snug">
                        {a}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </GlassCard>
          )}

          {/* Ticket Window */}
          <GlassCard accent="gold">
            <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] text-[var(--accent-soft)] mb-3">
              <Ticket className="h-3 w-3" />
              Janela de Compra · Ingressos
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="text-[10px] uppercase tracking-wider text-[var(--text-muted)] mb-1">Quando comprar</div>
                <div className="text-sm text-[var(--text-primary)] leading-snug">{park.ticketWindow.when}</div>
              </div>
              <div>
                <div className="text-[10px] uppercase tracking-wider text-[var(--text-muted)] mb-1">Onde comprar</div>
                <div className="text-sm text-[var(--text-primary)] leading-snug">{park.ticketWindow.where}</div>
              </div>
              <div>
                <div className="text-[10px] uppercase tracking-wider text-[var(--text-muted)] mb-1">Custo JPY</div>
                <div className="font-mono text-base text-[var(--accent-soft)]">{park.ticketWindow.costDest}</div>
              </div>
              <div>
                <div className="text-[10px] uppercase tracking-wider text-[var(--text-muted)] mb-1">Aprox. BRL</div>
                <div className="font-mono text-base text-emerald-300">{park.ticketWindow.costHome}</div>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-white/10 text-xs text-[var(--text-secondary)] italic leading-relaxed">
              💡 {park.ticketWindow.tip}
            </div>
          </GlassCard>

          {/* Must-do order */}
          <div>
            <div className="text-[10px] uppercase tracking-[0.4em] text-[var(--accent-soft)] mb-3 flex items-center gap-2">
              <ListOrdered className="h-3 w-3" />
              Ordem Ideal de Atrações
            </div>
            <motion.div variants={containerStagger} initial="initial" animate="animate" className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {park.mustDoOrder.map((m) => (
                <motion.div key={m.priority} variants={cardEnter}>
                  <GlassCard padded={true} accent={m.expressPass ? 'gold' : 'none'}>
                    <div className="flex items-start gap-3">
                      <div className="shrink-0 h-8 w-8 rounded-full bg-[var(--accent-dim)] border border-[var(--border-accent)] flex items-center justify-center font-mono text-sm text-[var(--accent-soft)]">
                        {m.priority}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="font-display text-base text-[var(--text-primary)] leading-tight">{m.attraction}</h4>
                          {m.expressPass && (
                            <Badge tone="gold">
                              <Zap className="h-3 w-3" /> Express
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-[var(--text-secondary)] mt-1 leading-snug">{m.why}</p>
                      </div>
                    </div>
                  </GlassCard>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Express Pass tier + Apps */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <GlassCard>
              <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] text-[var(--accent-soft)] mb-3">
                <Zap className="h-3 w-3" />
                Express Pass · Prioridade de Compra
              </div>
              <ol className="space-y-2">
                {park.expressPassTier.map((t, i) => (
                  <li key={i} className="text-sm text-[var(--text-primary)] flex items-start gap-2 leading-snug">
                    <span className="text-[var(--accent-soft)] font-mono text-xs mt-0.5">{i + 1}.</span>
                    <span>{t}</span>
                  </li>
                ))}
              </ol>
            </GlassCard>

            <GlassCard>
              <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] text-sky-300 mb-3">
                <Smartphone className="h-3 w-3" />
                Apps Obrigatórios
              </div>
              <ul className="space-y-3">
                {park.requiredApps.map((a, i) => (
                  <li key={i}>
                    <div className="flex items-center gap-2 text-sm font-medium text-[var(--text-primary)]">
                      <span>{a.name}</span>
                      <Badge tone="muted">{a.platform}</Badge>
                    </div>
                    <div className="text-xs text-[var(--text-secondary)] mt-0.5">{a.purpose}</div>
                  </li>
                ))}
              </ul>
            </GlassCard>
          </div>

          {/* Rope drop tactic */}
          <GlassCard>
            <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] text-amber-300 mb-3">
              <Sunrise className="h-3 w-3" />
              Rope Drop · Estratégia de Abertura
            </div>
            <p className="text-sm text-[var(--text-primary)] leading-relaxed">{park.ropeDropTactic}</p>
          </GlassCard>

          {/* Mobile Order */}
          {park.mobileOrderSetup && (
            <GlassCard>
              <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] text-fuchsia-300 mb-3">
                <Smartphone className="h-3 w-3" />
                Mobile Order · Setup
              </div>
              <ul className="space-y-1.5">
                {park.mobileOrderSetup.map((m, i) => (
                  <li key={i} className="text-sm text-[var(--text-primary)] flex items-start gap-2 leading-snug">
                    <span className="text-fuchsia-300 mt-0.5">▸</span>
                    <span>{m}</span>
                  </li>
                ))}
              </ul>
            </GlassCard>
          )}

          {/* Food strategy */}
          <GlassCard>
            <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] text-emerald-300 mb-3">
              <Utensils className="h-3 w-3" />
              Estratégia Gastronômica
            </div>
            <ul className="space-y-1.5">
              {park.foodStrategy.map((f, i) => (
                <li key={i} className="text-sm text-[var(--text-primary)] flex items-start gap-2 leading-snug">
                  <span className="text-emerald-300 mt-0.5">·</span>
                  <span>{f}</span>
                </li>
              ))}
            </ul>
          </GlassCard>

          {/* Exit strategy */}
          <GlassCard>
            <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] text-sky-300 mb-3">
              <LogOut className="h-3 w-3" />
              Saída · Como Sair Rápido
            </div>
            <p className="text-sm text-[var(--text-primary)] leading-relaxed">{park.exitStrategy}</p>
          </GlassCard>
        </motion.div>
      </AnimatePresence>
    </PageTransition>
  )
}

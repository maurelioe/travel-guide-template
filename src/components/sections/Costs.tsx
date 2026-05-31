import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { costs } from '../../data/costs'
import { GlassCard } from '../ui/GlassCard'
import { PageTransition, containerStagger, cardEnter } from '../layout/PageTransition'
import { useAppStore } from '../../store/useAppStore'
import { useExchange } from '../../api/useExchange'
import type { CostItem } from '../../types'

const categoryConfig: Record<CostItem['category'], { label: string; emoji: string; color: string }> = {
  flight:        { label: 'Flights',    emoji: '✈️', color: '#c9a84c' },
  accommodation: { label: 'Accommodation',   emoji: '🏨', color: '#38bdf8' },
  food:          { label: 'Food',  emoji: '🍣', color: '#f97316' },
  transport:     { label: 'Transport',   emoji: '🚄', color: '#a78bfa' },
  themed:        { label: 'Theme Parks',    emoji: '🎢', color: '#f472b6' },
  tours:         { label: 'Tours',     emoji: '🗺️', color: '#fbbf24' },
  shopping:      { label: 'Shopping',      emoji: '🛍️', color: '#10b981' },
  misc:          { label: 'Misc',     emoji: '🎁', color: '#94a3b8' },
}

export function Costs() {
  const actuals = useAppStore((s) => s.costsActual)
  const setActual = useAppStore((s) => s.setCostActual)
  const { rates } = useExchange()

  const totals = useMemo(() => {
    const byCat: Record<string, { est: number; act: number }> = {}
    let est = 0, act = 0
    for (const c of costs) {
      const a = actuals[c.id] ?? 0
      est += c.estimatedHome
      act += a
      if (!byCat[c.category]) byCat[c.category] = { est: 0, act: 0 }
      byCat[c.category].est += c.estimatedHome
      byCat[c.category].act += a
    }
    return { byCat, est, act }
  }, [actuals])

  const totalDest = rates ? totals.est * rates.dest : null

  // SVG pie
  const pieData = Object.entries(totals.byCat).map(([cat, t]) => ({
    cat,
    value: t.est,
    cfg: categoryConfig[cat as CostItem['category']],
  }))
  const totalPie = pieData.reduce((s, p) => s + p.value, 0)
  let cumulative = 0
  const arcs = pieData.map((p) => {
    const start = (cumulative / totalPie) * Math.PI * 2
    cumulative += p.value
    const end = (cumulative / totalPie) * Math.PI * 2
    return { ...p, start, end }
  })

  function arcPath(start: number, end: number, r = 78, cx = 90, cy = 90) {
    const large = end - start > Math.PI ? 1 : 0
    const x1 = cx + r * Math.sin(start)
    const y1 = cy - r * Math.cos(start)
    const x2 = cx + r * Math.sin(end)
    const y2 = cy - r * Math.cos(end)
    return `M${cx},${cy} L${x1},${y1} A${r},${r} 0 ${large},1 ${x2},${y2} Z`
  }

  return (
    <PageTransition sectionKey="costs">
      <motion.div
        variants={containerStagger}
        initial="initial"
        animate="animate"
        className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-5 mb-6"
      >
        <motion.div variants={cardEnter}>
          <GlassCard accent="gold" className="h-full">
            <div className="text-[10px] uppercase tracking-[0.3em] text-[var(--accent-soft)] mb-3">Total Estimated</div>
            <div className="font-display text-4xl text-[var(--accent-soft)]">
              {'{{HOME_SYMBOL}}'} {totals.est.toLocaleString('en')}
            </div>
            {totalDest && (
              <div className="mt-1 text-sm text-[var(--text-secondary)] font-mono">
                ≈ {'{{DEST_SYMBOL}}'} {totalDest.toLocaleString('en', { maximumFractionDigits: 0 })}
              </div>
            )}
            <div className="mt-4 pt-4 border-t border-white/10">
              <div className="text-[10px] uppercase tracking-[0.3em] text-emerald-300 mb-1">Spent</div>
              <div className="font-display text-2xl text-emerald-300">
                {'{{HOME_SYMBOL}}'} {totals.act.toLocaleString('en')}
              </div>
              <div className="mt-2 h-1.5 rounded-full bg-white/5 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(100, (totals.act / Math.max(1, totals.est)) * 100)}%` }}
                  className="h-full rounded-full bg-emerald-400/80"
                />
              </div>
            </div>
          </GlassCard>
        </motion.div>

        <motion.div variants={cardEnter}>
          <GlassCard className="h-full">
            <div className="text-[10px] uppercase tracking-[0.3em] text-[var(--text-secondary)] mb-3">
              Distribution by Category
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <svg viewBox="0 0 180 180" width="180" height="180" className="shrink-0">
                {arcs.map((a) => (
                  <path
                    key={a.cat}
                    d={arcPath(a.start, a.end)}
                    fill={a.cfg.color}
                    opacity={0.85}
                    stroke="var(--bg-elevated)"
                    strokeWidth={1.5}
                  />
                ))}
                <circle cx="90" cy="90" r="38" fill="var(--bg-elevated)" />
                <text x="90" y="86" textAnchor="middle" className="fill-[var(--text-muted)]" fontSize="9" letterSpacing="2">
                  TOTAL
                </text>
                <text x="90" y="104" textAnchor="middle" className="fill-[var(--accent-soft)]" fontSize="14" fontFamily="DM Sans" fontWeight="600">
                  {'{{HOME_SYMBOL}}'} {(totals.est / 1000).toFixed(1)}k
                </text>
              </svg>
              <div className="flex-1 grid grid-cols-2 gap-2 w-full">
                {pieData.sort((a, b) => b.value - a.value).map((p) => (
                  <div key={p.cat} className="flex items-center gap-2 text-xs">
                    <span className="h-2.5 w-2.5 rounded-full" style={{ background: p.cfg.color }} />
                    <span className="text-[var(--text-secondary)] truncate">{p.cfg.label}</span>
                    <span className="ml-auto text-[var(--text-primary)] font-mono">
                      {Math.round((p.value / totalPie) * 100)}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </GlassCard>
        </motion.div>
      </motion.div>

      <motion.div variants={containerStagger} initial="initial" animate="animate" className="space-y-2">
        {costs.map((c) => {
          const actual = actuals[c.id] ?? c.actualHome ?? 0
          const cfg = categoryConfig[c.category]
          const pct = Math.min(100, (actual / Math.max(1, c.estimatedHome)) * 100)
          return (
            <motion.div key={c.id} variants={cardEnter}>
              <GlassCard padded={false}>
                <div className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center gap-4">
                  <div className="text-2xl shrink-0">{cfg.emoji}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline justify-between gap-2">
                      <div className="text-sm text-[var(--text-primary)] font-medium truncate">{c.description}</div>
                      <div className="text-[10px] uppercase tracking-wider text-[var(--text-muted)] shrink-0">{cfg.label}</div>
                    </div>
                    <div className="mt-2 h-1 rounded-full bg-white/5 overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: `${pct}%`, background: cfg.color, opacity: 0.85 }} />
                    </div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <div>
                      <div className="text-[10px] uppercase tracking-wider text-[var(--text-muted)]">Est.</div>
                      <div className="text-sm font-mono text-[var(--text-secondary)]">{'{{HOME_SYMBOL}}'} {c.estimatedHome.toLocaleString('en')}</div>
                    </div>
                    <div>
                      <div className="text-[10px] uppercase tracking-wider text-emerald-300/80">Actual</div>
                      <input
                        type="number"
                        defaultValue={actual || ''}
                        onBlur={(e) => setActual(c.id, e.target.value === '' ? undefined : Number(e.target.value))}
                        placeholder="0"
                        className="w-24 rounded-md border border-white/10 bg-white/[0.04] px-2 py-1 text-right text-sm font-mono text-emerald-300 placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--border-accent)]"
                      />
                    </div>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          )
        })}
      </motion.div>
    </PageTransition>
  )
}

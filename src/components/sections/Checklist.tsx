import { useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { AlertTriangle, FileText, Check, FileDown } from 'lucide-react'
import { checklistData } from '../../data/checklist'
import { GlassCard } from '../ui/GlassCard'
import { Badge } from '../ui/Badge'
import { PageTransition, containerStagger, cardEnter } from '../layout/PageTransition'
import { useAppStore } from '../../store/useAppStore'
import type { ChecklistCategory } from '../../types'

const categoryConfig: Record<ChecklistCategory, { label: string; emoji: string; tone: string }> = {
  documents:    { label: 'Documentos',  emoji: '📄', tone: 'text-amber-300' },
  tickets:      { label: 'Ingressos',   emoji: '🎟️', tone: 'text-fuchsia-300' },
  transport:    { label: 'Transporte',  emoji: '🚄', tone: 'text-sky-300' },
  clothes:      { label: 'Roupas',      emoji: '🧥', tone: 'text-blue-200' },
  pharmacy:     { label: 'Farmácia',    emoji: '💊', tone: 'text-emerald-300' },
  electronics:  { label: 'Eletrônicos', emoji: '🔌', tone: 'text-purple-300' },
  financial:    { label: 'Financeiro',  emoji: '💳', tone: 'text-yellow-300' },
  reservations: { label: 'Reservas',    emoji: '📅', tone: 'text-[var(--accent-soft)]' },
}

export function Checklist() {
  const done = useAppStore((s) => s.checklistDone)
  const toggle = useAppStore((s) => s.toggleChecklist)
  const [exporting, setExporting] = useState(false)

  const grouped = useMemo(() => {
    const map: Record<ChecklistCategory, typeof checklistData> = {} as never
    for (const item of checklistData) {
      if (!map[item.category]) map[item.category] = []
      map[item.category].push(item)
    }
    return map
  }, [])

  const total = checklistData.length
  const completed = checklistData.filter((c) => done[c.id]).length
  const progress = Math.round((completed / total) * 100)

  const exportPDF = async () => {
    setExporting(true)
    try {
      const [{ default: jsPDF }, autoTableMod] = await Promise.all([
        import('jspdf'),
        import('jspdf-autotable'),
      ])
      const doc = new jsPDF()
      type AutoTableFn = (doc: unknown, opts: object) => void
      const autoTable = (autoTableMod as { default: AutoTableFn }).default
      doc.setFontSize(20)
      doc.text('Japan 2027 — Checklist Completo', 14, 18)
      doc.setFontSize(10)
      doc.setTextColor(120)
      doc.text(`Progresso: ${completed}/${total} (${progress}%)`, 14, 25)

      let y = 32
      for (const cat of Object.keys(grouped) as ChecklistCategory[]) {
        const cfg = categoryConfig[cat]
        const rows = grouped[cat].map((i) => [
          done[i.id] ? '✓' : '☐',
          i.label,
          i.detail ?? '',
          i.critical ? 'CRÍTICO' : '',
        ])
        autoTable(doc, {
          startY: y,
          head: [[`${cfg.emoji} ${cfg.label}`, '', '', '']],
          body: rows,
          theme: 'striped',
          styles: { fontSize: 9, cellPadding: 2 },
          headStyles: { fillColor: [201, 168, 76], textColor: 0 },
          columnStyles: { 0: { cellWidth: 10 }, 3: { cellWidth: 22, textColor: [220, 38, 38] } },
        })
        const last = (doc as unknown as { lastAutoTable?: { finalY: number } }).lastAutoTable
        y = (last?.finalY ?? y) + 6
      }
      doc.save('japan-2027-checklist.pdf')
    } finally {
      setExporting(false)
    }
  }

  return (
    <PageTransition sectionKey="checklist">
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-4">
          <div>
            <div className="text-[10px] uppercase tracking-[0.3em] text-[var(--accent-soft)]">Preparação</div>
            <div className="flex items-baseline gap-2">
              <span className="font-display text-3xl text-[var(--text-primary)]">{completed}</span>
              <span className="text-lg text-[var(--text-secondary)]">/ {total}</span>
            </div>
          </div>
          <div className="flex-1 max-w-xs">
            <div className="h-2 rounded-full bg-white/5 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.8 }}
                className="h-full rounded-full bg-gradient-to-r from-[var(--accent)] to-[var(--accent-soft)]"
              />
            </div>
            <div className="mt-1 text-xs text-[var(--text-muted)]">{progress}% concluído</div>
          </div>
        </div>
        <button
          onClick={exportPDF}
          disabled={exporting}
          className="inline-flex items-center gap-2 rounded-full border border-white/10 hover:bg-white/[0.05] px-4 py-2 text-sm text-[var(--text-primary)] disabled:opacity-40"
        >
          <FileDown className="h-4 w-4 text-[var(--accent-soft)]" />
          {exporting ? 'Gerando…' : 'Exportar PDF'}
        </button>
      </div>

      <motion.div variants={containerStagger} initial="initial" animate="animate" className="space-y-4">
        {(Object.keys(grouped) as ChecklistCategory[]).map((cat) => {
          const cfg = categoryConfig[cat]
          const items = grouped[cat]
          const catDone = items.filter((i) => done[i.id]).length

          return (
            <motion.div key={cat} variants={cardEnter}>
              <GlassCard padded={false}>
                <div className="px-5 sm:px-6 py-4 border-b border-white/5 flex items-center justify-between">
                  <div className={`flex items-center gap-3 ${cfg.tone}`}>
                    <span className="text-2xl">{cfg.emoji}</span>
                    <div>
                      <h4 className="font-display text-lg text-[var(--text-primary)]">{cfg.label}</h4>
                      <div className="text-[10px] uppercase tracking-[0.3em] text-[var(--text-muted)]">
                        {catDone} / {items.length} concluídos
                      </div>
                    </div>
                  </div>
                </div>
                <ul className="divide-y divide-white/5">
                  {items.map((i) => {
                    const isDone = !!done[i.id]
                    return (
                      <li key={i.id}>
                        <button
                          onClick={() => toggle(i.id)}
                          className={`w-full flex items-start gap-3 px-5 sm:px-6 py-3 text-left hover:bg-white/[0.02] transition-colors ${
                            i.critical ? 'bg-red-500/[0.04]' : ''
                          }`}
                        >
                          <motion.div
                            initial={false}
                            animate={{
                              backgroundColor: isDone ? 'rgba(16,185,129,0.3)' : 'rgba(255,255,255,0.04)',
                              borderColor: isDone ? '#10b981' : 'rgba(255,255,255,0.15)',
                            }}
                            className="mt-0.5 h-5 w-5 rounded-md border flex items-center justify-center shrink-0"
                          >
                            <AnimatePresence>
                              {isDone && (
                                <motion.span
                                  key="check"
                                  initial={{ scale: 0, opacity: 0 }}
                                  animate={{ scale: 1, opacity: 1 }}
                                  exit={{ scale: 0, opacity: 0 }}
                                  transition={{ duration: 0.2 }}
                                >
                                  <Check className="h-3 w-3 text-emerald-300" strokeWidth={3} />
                                </motion.span>
                              )}
                            </AnimatePresence>
                          </motion.div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className={`text-sm ${isDone ? 'line-through text-[var(--text-muted)]' : 'text-[var(--text-primary)]'}`}>
                                {i.label}
                              </span>
                              {i.critical && (
                                <Badge tone="critical">
                                  <AlertTriangle className="h-3 w-3" /> crítico
                                </Badge>
                              )}
                            </div>
                            {i.detail && (
                              <div className="mt-0.5 text-xs text-[var(--text-secondary)]">{i.detail}</div>
                            )}
                          </div>
                        </button>
                      </li>
                    )
                  })}
                </ul>
              </GlassCard>
            </motion.div>
          )
        })}
      </motion.div>
    </PageTransition>
  )
}

// keep an unused-friendly export so any future direct usage doesn't break
export const _ft = FileText

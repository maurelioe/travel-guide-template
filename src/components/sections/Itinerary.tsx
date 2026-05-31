import { useEffect, useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { AlertTriangle, MapPin, Lightbulb, Utensils, Repeat, Sun, Sunset, Moon, Navigation, FileDown } from 'lucide-react'
import { itinerary } from '../../data/itinerary'
import { mapPoints } from '../../data/mapPoints'
import { GlassCard } from '../ui/GlassCard'
import { Badge } from '../ui/Badge'
import { PageTransition, cardEnter, containerStagger } from '../layout/PageTransition'
import { useAppStore } from '../../store/useAppStore'
import type { City, Period } from '../../types'

// Cities derived dynamically from itinerary data — no hardcoded city list.

export function Itinerary() {
  const storeSelectedDay = useAppStore((s) => s.selectedDay)
  const setStoreSelectedDay = useAppStore((s) => s.setSelectedDay)
  const initialDay = storeSelectedDay && itinerary.some((d) => d.id === storeSelectedDay)
    ? storeSelectedDay
    : itinerary[0].id
  const [selectedDay, setSelectedDayLocal] = useState(initialDay)
  const [cityFilter, setCityFilter] = useState<'All' | City>('All')
  const [exporting, setExporting] = useState(false)

  // Sincroniza local com store: quando o store muda (vindo do Dashboard), atualiza local
  useEffect(() => {
    if (storeSelectedDay && itinerary.some((d) => d.id === storeSelectedDay) && storeSelectedDay !== selectedDay) {
      setSelectedDayLocal(storeSelectedDay)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storeSelectedDay])

  // Limpa o store ao desmontar (próxima entrada usa default ou novo store value)
  useEffect(() => {
    return () => { setStoreSelectedDay(null) }
  }, [setStoreSelectedDay])

  const setSelectedDay = (id: string) => {
    setSelectedDayLocal(id)
  }

  const exportItineraryPDF = async () => {
    setExporting(true)
    try {
      const [{ default: jsPDF }, autoTableMod] = await Promise.all([
        import('jspdf'),
        import('jspdf-autotable'),
      ])
      type AutoTableFn = (doc: unknown, opts: object) => void
      const autoTable = (autoTableMod as { default: AutoTableFn }).default

      const doc = new jsPDF({ unit: 'pt', format: 'a4' })
      const pageW = doc.internal.pageSize.getWidth()
      const pageH = doc.internal.pageSize.getHeight()
      const margin = 40

      // ─── COVER ──────────────────────────────────────────────────────────
      doc.setFillColor(12, 12, 16)
      doc.rect(0, 0, pageW, pageH, 'F')

      // Gold band
      doc.setFillColor(201, 168, 76)
      doc.rect(margin, margin, 4, 80, 'F')

      doc.setTextColor(201, 168, 76)
      doc.setFontSize(9)
      doc.setFont('helvetica', 'normal')
      doc.text('PREMIUM TRAVEL ITINERARY', margin + 18, margin + 18, { charSpace: 4 })

      doc.setTextColor(240, 237, 232)
      doc.setFontSize(56)
      doc.setFont('times', 'normal')
      doc.text('{{DESTINATION_NAME}}', margin + 18, margin + 60)

      doc.setFontSize(14)
      doc.setTextColor(156, 163, 175)
      doc.text('{{DESTINATION_TAGLINE}}', margin + 18, margin + 86)

      doc.setFontSize(11)
      doc.setTextColor(120, 120, 130)
      doc.text('01 a 20 de Dezembro de 2027  ·  20 dias completos', margin + 18, margin + 104)

      // Decorative line
      doc.setDrawColor(201, 168, 76)
      doc.setLineWidth(0.5)
      doc.line(margin, pageH - margin - 120, pageW - margin, pageH - margin - 120)

      // Cover meta
      doc.setTextColor(180, 180, 190)
      doc.setFontSize(9)
      doc.text(`Detailed itinerary · ${itinerary.length} days · ${new Set(itinerary.map((d) => d.city)).size} cities`, margin, pageH - margin - 100)
      doc.text(`Generated on ${new Date().toLocaleDateString('en')} — full version with How to Get There, Meals and Plan B`, margin, pageH - margin - 85)

      // Cover index
      doc.setTextColor(201, 168, 76)
      doc.setFontSize(10)
      doc.text('SUMÁRIO', margin, pageH - margin - 60)
      doc.setFontSize(8)
      doc.setTextColor(200, 200, 200)
      const indexLines = itinerary.map((d) => `Day ${String(d.dayNumber).padStart(2, '0')}  ·  ${d.date}  ·  ${d.city}  —  ${d.highlight}`)
      indexLines.forEach((line, i) => {
        const col = i < 10 ? 0 : 1
        const row = i % 10
        doc.text(line, margin + col * ((pageW - margin * 2) / 2 + 12), pageH - margin - 40 + row * 10)
      })

      // ─── PAGES ──────────────────────────────────────────────────────────
      for (const d of itinerary) {
        doc.addPage()

        // Header band
        doc.setFillColor(18, 18, 26)
        doc.rect(0, 0, pageW, 90, 'F')
        doc.setFillColor(201, 168, 76)
        doc.rect(margin, 22, 3, 50, 'F')

        doc.setTextColor(201, 168, 76)
        doc.setFontSize(8)
        doc.setFont('helvetica', 'normal')
        doc.text(`DAY ${String(d.dayNumber).padStart(2, '0')}   ·   ${d.date.toUpperCase()}   ·   ${d.city.toUpperCase()}`, margin + 14, 36, { charSpace: 2 })

        doc.setTextColor(240, 237, 232)
        doc.setFont('times', 'normal')
        doc.setFontSize(22)
        doc.text(`${d.emoji}  ${d.highlight}`, margin + 14, 60)

        if (d.alert) {
          doc.setTextColor(248, 113, 113)
          doc.setFont('helvetica', 'normal')
          doc.setFontSize(8)
          const alertLines = doc.splitTextToSize(`⚠ ALERTA: ${d.alert}`, pageW - margin * 2 - 14)
          doc.text(alertLines, margin + 14, 80)
        }

        let cursorY = 110

        const periods = [
          { key: 'morning', label: 'MORNING', icon: '☀', tone: [253, 211, 77] as [number, number, number], data: d.morning },
          { key: 'afternoon', label: 'AFTERNOON', icon: '🌇', tone: [251, 146, 60] as [number, number, number], data: d.afternoon },
          { key: 'night', label: 'NIGHT', icon: '🌙', tone: [165, 180, 252] as [number, number, number], data: d.night },
        ]

        for (const p of periods) {
          // section header
          if (cursorY > pageH - 180) { doc.addPage(); cursorY = margin }
          doc.setFontSize(9)
          doc.setTextColor(p.tone[0], p.tone[1], p.tone[2])
          doc.setFont('helvetica', 'bold')
          doc.text(p.label, margin, cursorY, { charSpace: 3 })

          doc.setDrawColor(80, 80, 90)
          doc.setLineWidth(0.3)
          doc.line(margin + 50, cursorY - 3, pageW - margin, cursorY - 3)

          cursorY += 14

          // title
          doc.setFontSize(13)
          doc.setTextColor(240, 237, 232)
          doc.setFont('times', 'normal')
          doc.text(p.data.title, margin, cursorY)
          cursorY += 14

          // description
          doc.setFontSize(9.5)
          doc.setTextColor(190, 190, 200)
          doc.setFont('helvetica', 'normal')
          const descLines = doc.splitTextToSize(p.data.description, pageW - margin * 2)
          doc.text(descLines, margin, cursorY)
          cursorY += descLines.length * 11 + 6

          // structured rows via autoTable
          const rows: [string, string][] = []
          if (p.data.howToGet) rows.push(['COMO CHEGAR', p.data.howToGet])
          if (p.data.meal) rows.push(['REFEIÇÃO', p.data.meal])
          if (p.data.tip) rows.push(['DICA', p.data.tip])
          if (p.data.planB) rows.push(['PLANO B', p.data.planB])

          if (rows.length) {
            autoTable(doc, {
              startY: cursorY,
              body: rows,
              theme: 'plain',
              styles: { font: 'helvetica', fontSize: 8.5, cellPadding: { top: 3, right: 6, bottom: 3, left: 6 }, lineWidth: 0, textColor: [220, 220, 230] },
              columnStyles: {
                0: { cellWidth: 82, fontStyle: 'bold', textColor: [201, 168, 76], fontSize: 7.5 },
                1: { cellWidth: pageW - margin * 2 - 82, textColor: [220, 220, 230] },
              },
              didDrawCell: (data: { section: string; column: { index: number }; cell: { x: number; y: number; height: number } }) => {
                if (data.section === 'body' && data.column.index === 0) {
                  doc.setDrawColor(201, 168, 76)
                  doc.setLineWidth(0.4)
                  doc.line(data.cell.x, data.cell.y + 4, data.cell.x, data.cell.y + data.cell.height - 4)
                }
              },
              margin: { left: margin, right: margin },
            })
            const last = (doc as unknown as { lastAutoTable?: { finalY: number } }).lastAutoTable
            cursorY = (last?.finalY ?? cursorY) + 12
          }
        }

        // Daily tip box
        if (cursorY > pageH - 80) { doc.addPage(); cursorY = margin + 10 }
        doc.setFillColor(28, 24, 16)
        doc.roundedRect(margin, cursorY, pageW - margin * 2, 38, 4, 4, 'F')
        doc.setDrawColor(201, 168, 76)
        doc.setLineWidth(0.4)
        doc.roundedRect(margin, cursorY, pageW - margin * 2, 38, 4, 4, 'S')

        doc.setTextColor(201, 168, 76)
        doc.setFontSize(7.5)
        doc.setFont('helvetica', 'bold')
        doc.text('DAILY TIP', margin + 10, cursorY + 12, { charSpace: 2 })

        doc.setTextColor(230, 230, 240)
        doc.setFontSize(9)
        doc.setFont('helvetica', 'normal')
        const tipLines = doc.splitTextToSize(d.dailyTip, pageW - margin * 2 - 20)
        doc.text(tipLines, margin + 10, cursorY + 24)

        // Footer
        doc.setTextColor(80, 80, 90)
        doc.setFontSize(7)
        doc.text(`{{DESTINATION_NAME}} · Day ${d.dayNumber}/${itinerary.length}`, margin, pageH - 18)
        doc.text(`${d.city.toUpperCase()}`, pageW - margin, pageH - 18, { align: 'right' })
      }

      doc.save(`japan-2027-roteiro-completo.pdf`)
    } finally {
      setExporting(false)
    }
  }

  const filtered = useMemo(
    () => (cityFilter === 'All' ? itinerary : itinerary.filter((d) => d.city === cityFilter)),
    [cityFilter],
  )

  // Cities derived from itinerary data (unique, in itinerary order) + 'All' filter.
  const cities = useMemo<('All' | City)[]>(() => {
    const seen = new Set<string>()
    const list: ('All' | City)[] = ['All']
    for (const d of itinerary) {
      if (!seen.has(d.city)) { seen.add(d.city); list.push(d.city) }
    }
    return list
  }, [])

  const day = itinerary.find((d) => d.id === selectedDay) ?? itinerary[0]

  return (
    <PageTransition sectionKey="itinerary">
      <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-6">
        {/* Day picker column */}
        <aside className="lg:sticky lg:top-[80px] lg:self-start space-y-3">
          <button
            onClick={exportItineraryPDF}
            disabled={exporting}
            className="w-full inline-flex items-center justify-center gap-2 rounded-xl border border-[var(--border-accent)] bg-[var(--accent-dim)] hover:bg-[var(--accent)]/30 px-4 py-2.5 text-sm font-medium text-[var(--accent-soft)] transition-colors disabled:opacity-50"
          >
            <FileDown className="h-4 w-4" strokeWidth={1.8} />
            {exporting ? 'Generating PDF…' : 'Export Itinerary · PDF'}
          </button>

          <div className="flex flex-wrap gap-1.5">
            {cities.map((c) => (
              <button
                key={c}
                onClick={() => setCityFilter(c)}
                className={`text-[11px] px-2.5 py-1 rounded-full border uppercase tracking-wider ${
                  cityFilter === c
                    ? 'bg-[var(--accent-dim)] text-[var(--accent-soft)] border-[var(--border-accent)]'
                    : 'text-[var(--text-secondary)] border-white/10 hover:bg-white/[0.04]'
                }`}
              >
                {c === 'All' ? 'All' : c}
              </button>
            ))}
          </div>

          <div className="lg:max-h-[calc(100vh-200px)] lg:overflow-y-auto pr-1 space-y-1.5">
            {filtered.map((d) => {
              const active = selectedDay === d.id
              return (
                <button
                  key={d.id}
                  onClick={() => setSelectedDay(d.id)}
                  className={`w-full text-left rounded-xl border px-3 py-2.5 transition-all ${
                    active
                      ? 'border-[var(--border-accent)] bg-[var(--accent-dim)]'
                      : 'border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.05]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="text-2xl">{d.emoji}</div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-baseline gap-2">
                        <span className="text-[10px] uppercase tracking-wider text-[var(--text-muted)]">
                          Day {d.dayNumber}
                        </span>
                        <span className={`text-xs ${active ? 'text-[var(--accent-soft)]' : 'text-[var(--text-secondary)]'}`}>
                          {d.city}
                        </span>
                      </div>
                      <div className={`text-sm truncate ${active ? 'text-[var(--text-primary)]' : 'text-[var(--text-secondary)]'}`}>
                        {d.highlight}
                      </div>
                    </div>
                    {d.alert && <AlertTriangle className="h-3.5 w-3.5 text-red-400 shrink-0" strokeWidth={1.8} />}
                  </div>
                </button>
              )
            })}
          </div>
        </aside>

        {/* Day detail */}
        <AnimatePresence mode="wait">
          <motion.div
            key={day.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3 }}
            className="space-y-5"
          >
            <div className="relative h-[280px] sm:h-[340px] rounded-2xl overflow-hidden border border-white/[0.06]">
              <img
                src={day.heroImage}
                alt={day.highlight}
                className="absolute inset-0 h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[var(--bg-void)] via-[var(--bg-void)]/40 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-5 sm:p-7">
                <div className="flex items-center gap-2 mb-2">
                  <Badge tone="gold">Day {day.dayNumber}</Badge>
                  <Badge tone="muted">{day.city}</Badge>
                  {day.alert && (
                    <Badge tone="critical" pulse>
                      ⚠ Alert
                    </Badge>
                  )}
                </div>
                <h2 className="font-display text-3xl sm:text-4xl text-[var(--text-primary)]">
                  {day.emoji} {day.highlight}
                </h2>
                <div className="mt-1 text-xs text-[var(--text-secondary)]">{day.date}</div>
              </div>
            </div>

            {day.alert && (
              <GlassCard accent="red">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 text-red-400 shrink-0 mt-0.5" />
                  <div>
                    <div className="text-[10px] uppercase tracking-[0.3em] text-red-300 mb-1">Heads up</div>
                    <p className="text-sm text-[var(--text-primary)] leading-relaxed">{day.alert}</p>
                  </div>
                </div>
              </GlassCard>
            )}

            <motion.div
              variants={containerStagger}
              initial="initial"
              animate="animate"
              className="grid grid-cols-1 md:grid-cols-3 gap-4"
            >
              <motion.div variants={cardEnter}>
                <PeriodCard icon={<Sun className="h-4 w-4" />} title="Morning" tone="text-amber-200" period={day.morning} />
              </motion.div>
              <motion.div variants={cardEnter}>
                <PeriodCard icon={<Sunset className="h-4 w-4" />} title="Afternoon" tone="text-orange-300" period={day.afternoon} />
              </motion.div>
              <motion.div variants={cardEnter}>
                <PeriodCard icon={<Moon className="h-4 w-4" />} title="Night" tone="text-indigo-300" period={day.night} />
              </motion.div>
            </motion.div>

            <GlassCard accent="gold">
              <div className="flex items-start gap-3">
                <div className="text-2xl">💡</div>
                <div>
                  <div className="text-[10px] uppercase tracking-[0.3em] text-[var(--accent-soft)] mb-1">
                    Daily Tip
                  </div>
                  <p className="text-sm text-[var(--text-primary)] leading-relaxed">{day.dailyTip}</p>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        </AnimatePresence>
      </div>
    </PageTransition>
  )
}

function PeriodCard({
  icon, title, tone, period,
}: { icon: React.ReactNode; title: string; tone: string; period: Period }) {
  const setSection = useAppStore((s) => s.setSection)
  const setHighlight = useAppStore((s) => s.setHighlightedMapPoint)
  const point = period.mapPointId ? mapPoints.find((m) => m.id === period.mapPointId) : null

  const openMap = () => {
    if (!point) return
    setHighlight(point.id)
    setSection('maps')
  }

  return (
    <GlassCard className="h-full">
      <div className={`flex items-center gap-2 mb-3 ${tone}`}>
        {icon}
        <span className="text-[10px] uppercase tracking-[0.3em]">{title}</span>
      </div>
      <h4 className="font-display text-lg text-[var(--text-primary)] leading-tight">{period.title}</h4>
      <p className="mt-2 text-sm text-[var(--text-secondary)] leading-relaxed">{period.description}</p>

      <div className="mt-4 space-y-2 text-sm">
        {period.howToGet && (
          <Line icon={<Navigation className="h-3.5 w-3.5" />} label="How to Get" text={period.howToGet} color="text-fuchsia-300" />
        )}
        {period.meal && (
          <Line icon={<Utensils className="h-3.5 w-3.5" />} label="Meal" text={period.meal} color="text-[var(--accent-soft)]" />
        )}
        {period.tip && (
          <Line icon={<Lightbulb className="h-3.5 w-3.5" />} label="Tip" text={period.tip} color="text-sky-300" />
        )}
        {period.planB && (
          <Line icon={<Repeat className="h-3.5 w-3.5" />} label="Plan B" text={period.planB} color="text-emerald-300" />
        )}
      </div>

      {point && (
        <button
          onClick={openMap}
          className="mt-4 inline-flex items-center gap-1.5 rounded-full border border-white/10 hover:border-[var(--border-accent)] hover:bg-[var(--accent-dim)] px-3 py-1.5 text-[10px] uppercase tracking-wider text-[var(--text-secondary)] hover:text-[var(--accent-soft)] transition-colors"
        >
          <MapPin className="h-3 w-3" strokeWidth={1.8} />
          Ver no mapa · {point.name}
        </button>
      )}
    </GlassCard>
  )
}

function Line({ icon, label, text, color }: { icon: React.ReactNode; label: string; text: string; color: string }) {
  return (
    <div className="flex items-start gap-2 text-xs">
      <span className={`${color} mt-0.5 shrink-0`}>{icon}</span>
      <div className="min-w-0">
        <span className={`${color} font-medium uppercase tracking-wider text-[10px] mr-1.5`}>{label}</span>
        <span className="text-[var(--text-primary)]/90 leading-snug">{text}</span>
      </div>
    </div>
  )
}

// keep import warning happy (FileDown is used; MapPin now used in PeriodCard)
export const _fd = FileDown

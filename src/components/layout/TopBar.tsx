import { Clock } from 'lucide-react'
import { useAppStore } from '../../store/useAppStore'
import { useDestinationTime } from '../../api/useDestinationTime'
import type { Section } from '../../types'

const labels: Record<Section, { breadcrumb: string; subtitle: string }> = {
  dashboard:    { breadcrumb: 'Dashboard',     subtitle: 'Overview · trip status' },
  itinerary:    { breadcrumb: 'Itinerary',     subtitle: 'Day-by-day plan' },
  parks:        { breadcrumb: 'Parks',         subtitle: 'Theme park strategy' },
  reservations: { breadcrumb: 'Reservations',  subtitle: 'Vouchers and confirmations' },
  safety:       { breadcrumb: 'Safety',        subtitle: 'Protocols, etiquette, emergency' },
  'photo-spots':{ breadcrumb: 'Photo Spots',   subtitle: 'Locations and best times' },
  maps:         { breadcrumb: 'Maps',          subtitle: 'Points by city and category' },
  gastronomy:   { breadcrumb: 'Gastronomy',    subtitle: 'Dishes, snacks, drinks' },
  shopping:     { breadcrumb: 'Shopping',      subtitle: 'Category guide' },
  costs:        { breadcrumb: 'Costs',         subtitle: 'Estimate vs actual' },
  checklist:    { breadcrumb: 'Checklist',     subtitle: 'Documents and prep' },
}

export function TopBar() {
  const section = useAppStore((s) => s.currentSection)
  const time = useDestinationTime()
  const lbl = labels[section]

  return (
    <header className="sticky top-0 z-30 -mx-4 sm:-mx-6 lg:-mx-10 mb-6 border-b border-white/[0.05] bg-[var(--bg-void)]/80 backdrop-blur-xl">
      <div className="px-4 sm:px-6 lg:px-10 py-3 flex items-center justify-between gap-4">
        <div className="min-w-0">
          <div className="text-[10px] uppercase tracking-[0.4em] text-[var(--text-muted)]">{'{{DESTINATION_NAME}}'} {'{{TRIP_YEAR}}'}</div>
          <div className="flex items-baseline gap-2">
            <h2 className="font-display text-lg sm:text-xl text-[var(--text-primary)]">{lbl.breadcrumb}</h2>
            <span className="hidden sm:inline text-xs text-[var(--text-muted)] truncate">· {lbl.subtitle}</span>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs text-[var(--text-secondary)] whitespace-nowrap">
          <Clock className="h-3.5 w-3.5 text-[var(--accent-soft)]" strokeWidth={1.5} />
          <span className="font-mono">{time.destination}</span>
          <span className="text-[var(--text-muted)] hidden sm:inline">{'{{TZ_ABBR}}'}</span>
        </div>
      </div>
    </header>
  )
}

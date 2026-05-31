import {
  LayoutDashboard, CalendarDays, FolderOpen, Shield,
  Camera, Map, Utensils, ShoppingBag, Wallet, CheckSquare, Castle,
} from 'lucide-react'
import { motion } from 'framer-motion'
import { useAppStore } from '../../store/useAppStore'
import type { Section } from '../../types'

interface Item {
  id: Section
  label: string
  icon: typeof LayoutDashboard
  accent?: boolean
}

const items: Item[] = [
  { id: 'dashboard',    label: 'Dashboard',    icon: LayoutDashboard, accent: true },
  { id: 'itinerary',    label: 'Itinerary',    icon: CalendarDays },
  { id: 'parks',        label: 'Parks',        icon: Castle },
  { id: 'reservations', label: 'Reservations', icon: FolderOpen },
  { id: 'safety',       label: 'Safety',       icon: Shield },
  { id: 'photo-spots',  label: 'Photos',       icon: Camera },
  { id: 'maps',         label: 'Maps',         icon: Map },
  { id: 'gastronomy',   label: 'Gastronomy',   icon: Utensils },
  { id: 'shopping',     label: 'Shopping',     icon: ShoppingBag },
  { id: 'costs',        label: 'Costs',        icon: Wallet },
  { id: 'checklist',    label: 'Checklist',    icon: CheckSquare },
]

export function Sidebar() {
  const current = useAppStore((s) => s.currentSection)
  const setSection = useAppStore((s) => s.setSection)

  return (
    <aside
      className="hidden lg:flex fixed left-0 top-0 h-screen flex-col border-r border-white/[0.05] bg-[var(--bg-base)]/80 backdrop-blur-xl"
      style={{ width: 'var(--sidebar-w)' }}
    >
      <div className="px-6 pt-8 pb-6 border-b border-white/5">
        <div className="text-[10px] uppercase tracking-[0.4em] text-[var(--text-muted)] mb-1">Premium Itinerary</div>
        <h1 className="font-display text-2xl leading-tight gradient-text">{'{{DESTINATION_NAME}}'} <span className="font-light">{'{{TRIP_YEAR}}'}</span></h1>
        <div className="mt-3 text-xs text-[var(--text-secondary)]">{'{{TRIP_PERIOD}}'}</div>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4">
        {items.map((it) => {
          const Icon = it.icon
          const active = current === it.id
          return (
            <button
              key={it.id}
              onClick={() => setSection(it.id)}
              className={[
                'relative w-full flex items-center gap-3 rounded-xl px-3 py-2.5 my-0.5 text-left text-sm transition-colors',
                active
                  ? 'bg-[var(--accent-dim)] text-[var(--accent-soft)]'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-white/[0.04]',
              ].join(' ')}
            >
              {active && (
                <motion.div
                  layoutId="sidebar-active"
                  className="absolute left-0 top-1/2 -translate-y-1/2 h-6 w-[2px] rounded-r bg-[var(--accent)]"
                  transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                />
              )}
              <Icon className="h-4 w-4 shrink-0" strokeWidth={1.5} />
              <span className="truncate font-medium">{it.label}</span>
            </button>
          )
        })}
      </nav>

      <div className="px-5 py-4 border-t border-white/5 text-[10px] uppercase tracking-[0.3em] text-[var(--text-muted)]">
        Crafted with intent
      </div>
    </aside>
  )
}

export function MobileNav() {
  const current = useAppStore((s) => s.currentSection)
  const setSection = useAppStore((s) => s.setSection)

  const primary = items.slice(0, 4)
  const moreActive = !primary.find((p) => p.id === current)

  return (
    <>
      <nav className="lg:hidden fixed bottom-0 inset-x-0 z-40 border-t border-white/5 bg-[var(--bg-base)]/95 backdrop-blur-xl">
        <div className="grid grid-cols-5">
          {primary.map((it) => {
            const Icon = it.icon
            const active = current === it.id
            return (
              <button
                key={it.id}
                onClick={() => setSection(it.id)}
                className={`flex flex-col items-center justify-center gap-0.5 py-2.5 text-[10px] ${
                  active ? 'text-[var(--accent-soft)]' : 'text-[var(--text-muted)]'
                }`}
              >
                <Icon className="h-5 w-5" strokeWidth={1.5} />
                <span className="truncate">{it.label}</span>
              </button>
            )
          })}
          <MoreMenu active={moreActive} />
        </div>
      </nav>
    </>
  )
}

function MoreMenu({ active }: { active: boolean }) {
  const current = useAppStore((s) => s.currentSection)
  const setSection = useAppStore((s) => s.setSection)
  const moreItems = items.slice(4)

  return (
    <details className="relative group">
      <summary
        className={`list-none flex flex-col items-center justify-center gap-0.5 py-2.5 text-[10px] cursor-pointer ${
          active ? 'text-[var(--accent-soft)]' : 'text-[var(--text-muted)]'
        }`}
      >
        <Map className="h-5 w-5" strokeWidth={1.5} />
        <span>More</span>
      </summary>
      <div className="absolute bottom-full right-2 mb-2 w-52 rounded-xl border border-white/10 bg-[var(--bg-elevated)] p-2 shadow-2xl">
        {moreItems.map((it) => {
          const Icon = it.icon
          const isActive = current === it.id
          return (
            <button
              key={it.id}
              onClick={() => setSection(it.id)}
              className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm ${
                isActive ? 'bg-[var(--accent-dim)] text-[var(--accent-soft)]' : 'text-[var(--text-secondary)] hover:bg-white/[0.05]'
              }`}
            >
              <Icon className="h-4 w-4" strokeWidth={1.5} />
              <span>{it.label}</span>
            </button>
          )
        })}
      </div>
    </details>
  )
}

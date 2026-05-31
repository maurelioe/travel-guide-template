import { AnimatePresence } from 'framer-motion'
import { Sidebar, MobileNav } from './components/layout/Sidebar'
import { TopBar } from './components/layout/TopBar'
import { Dashboard } from './components/sections/Dashboard'
import { Itinerary } from './components/sections/Itinerary'
import { ParkStrategy } from './components/sections/ParkStrategy'
import { Reservations } from './components/sections/Reservations'
import { Safety } from './components/sections/Safety'
import { PhotoSpots } from './components/sections/PhotoSpots'
import { Maps } from './components/sections/Maps'
import { Gastronomy } from './components/sections/Gastronomy'
import { Shopping } from './components/sections/Shopping'
import { Costs } from './components/sections/Costs'
import { Checklist } from './components/sections/Checklist'
import { useAppStore } from './store/useAppStore'
import type { Section } from './types'

const sections: Record<Section, React.ComponentType> = {
  dashboard: Dashboard,
  itinerary: Itinerary,
  parks: ParkStrategy,
  reservations: Reservations,
  safety: Safety,
  'photo-spots': PhotoSpots,
  maps: Maps,
  gastronomy: Gastronomy,
  shopping: Shopping,
  costs: Costs,
  checklist: Checklist,
}

export default function App() {
  const section = useAppStore((s) => s.currentSection)
  const Current = sections[section]

  return (
    <div className="min-h-screen bg-[var(--bg-void)] text-[var(--text-primary)]">
      <Sidebar />
      <main
        className="min-h-screen pb-24 lg:pb-12 px-4 sm:px-6 lg:px-10 pt-6"
        style={{ paddingLeft: undefined }}
      >
        <div className="lg:ml-[var(--sidebar-w)]">
          <TopBar />
          <AnimatePresence mode="wait">
            <Current key={section} />
          </AnimatePresence>
        </div>
      </main>
      <MobileNav />
    </div>
  )
}

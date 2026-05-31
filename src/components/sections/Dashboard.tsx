import { useMemo } from 'react'
import { motion } from 'framer-motion'
import {
  Clock, Cloud, ArrowRightLeft, Plane, ListChecks, AlertTriangle, Wallet, ChevronRight,
  CalendarDays,
} from 'lucide-react'
import { GlassCard } from '../ui/GlassCard'
import { Badge } from '../ui/Badge'
import { Skeleton } from '../ui/Skeleton'
import { CountdownTimer } from '../ui/CountdownTimer'
import { PageTransition, containerStagger, cardEnter } from '../layout/PageTransition'
import { useWeather } from '../../api/useWeather'
import { useExchange, CURRENCIES } from '../../api/useExchange'
import { useDestinationTime } from '../../api/useDestinationTime'
import { useAppStore } from '../../store/useAppStore'
import { checklistData } from '../../data/checklist'
import { itinerary } from '../../data/itinerary'
import { costs } from '../../data/costs'
import { intercityRoutes } from '../../data/intercity'
import { mapPoints } from '../../data/mapPoints'
import { photoSpots } from '../../data/photoSpots'
import { parks } from '../../data/parks'

// {{TRIP_START_ISO}} — replace with destination-local ISO datetime (e.g. '2027-12-01T08:00:00+09:00').
// '2099-01-01T08:00:00Z' is a safe placeholder so countdown renders without crashing.
const TRIP_START = new Date('2099-01-01T08:00:00Z')

export function Dashboard() {
  const weather = useWeather('destination')
  const ex = useExchange()
  const time = useDestinationTime()
  const checklistDone = useAppStore((s) => s.checklistDone)
  const vouchers = useAppStore((s) => s.vouchers)
  const costsActual = useAppStore((s) => s.costsActual)
  const setSection = useAppStore((s) => s.setSection)
  const setSelectedDay = useAppStore((s) => s.setSelectedDay)

  const total = checklistData.length
  const done = checklistData.filter((c) => checklistDone[c.id]).length
  const progress = total > 0 ? Math.round((done / total) * 100) : 0

  const nextVoucher = vouchers
    .filter((v) => v.status !== 'cancelled')
    .sort((a, b) => (a.checkinDate ?? '').localeCompare(b.checkinDate ?? ''))[0]

  const budget = useMemo(() => {
    let est = 0, act = 0
    for (const c of costs) {
      est += c.estimatedHome
      act += costsActual[c.id] ?? c.actualHome ?? 0
    }
    return { est, act, pct: est > 0 ? Math.min(100, (act / est) * 100) : 0 }
  }, [costsActual])

  const todayActivity = useMemo(() => {
    if (itinerary.length === 0) return null
    const now = Date.now()
    const tripStartMs = TRIP_START.getTime()
    if (now < tripStartMs) {
      return { day: itinerary[0], status: 'upcoming' as const }
    }
    const dayIndex = Math.floor((now - tripStartMs) / 86_400_000)
    if (dayIndex >= itinerary.length) {
      return { day: itinerary[itinerary.length - 1], status: 'past' as const }
    }
    return { day: itinerary[dayIndex], status: 'today' as const }
  }, [])

  const activityLabel = todayActivity?.status === 'today'
    ? 'Today on Itinerary'
    : todayActivity?.status === 'past'
      ? 'Last day'
      : 'Next milestone'

  const tripStats = useMemo(() => {
    const distinctCities = new Set(itinerary.map((d) => d.city)).size
    const totalKm = intercityRoutes.reduce((sum, r) => {
      const km = parseInt(r.distance.replace(/[^\d]/g, ''), 10) || 0
      return sum + km
    }, 0)
    const temples = mapPoints.filter((m) => m.category === 'temple').length
    const parkAttractions = parks.reduce((sum, p) => sum + p.mustDoOrder.length, 0)
    return [
      { emoji: '📅', value: String(itinerary.length),      label: 'days' },
      { emoji: '🏙️', value: String(distinctCities),        label: 'cities' },
      { emoji: '🚄', value: totalKm.toLocaleString('en'),  label: 'intercity km' },
      { emoji: '🎒', value: '0',                            label: 'day-trips' },
      { emoji: '📸', value: String(photoSpots.length),     label: 'photo spots' },
      { emoji: '⛩️', value: String(temples),               label: 'temples' },
      { emoji: '🎢', value: String(parkAttractions),       label: 'park attractions' },
    ]
  }, [])

  const daysToTrip = Math.max(0, Math.floor((TRIP_START.getTime() - Date.now()) / 86_400_000))
  const showParkAlert = daysToTrip <= 70 && daysToTrip > 0

  const goItineraryDay = (id: string) => {
    setSelectedDay(id)
    setSection('itinerary')
  }

  return (
    <PageTransition sectionKey="dashboard">
      <div className="relative -mx-4 sm:-mx-6 lg:-mx-10 -mt-6">
        <div className="relative h-[420px] sm:h-[480px] overflow-hidden noise-overlay">
          {/* {{HERO_IMAGE_URL}} — replace src with destination hero image (1920px+). */}
          <img
            src=""
            alt="{{DESTINATION_NAME}} hero"
            className="absolute inset-0 h-full w-full object-cover"
            loading="eager"
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                'linear-gradient(to bottom, rgba(5,5,7,0.3) 0%, rgba(5,5,7,0.65) 60%, rgba(5,5,7,0.98) 100%)',
            }}
          />
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            className="relative z-10 h-full flex flex-col justify-end px-4 sm:px-6 lg:px-10 pb-14"
          >
            <div className="text-[10px] uppercase tracking-[0.45em] text-[var(--accent-soft)] mb-3">
              Premium Travel Plan · {time.destinationDate} · {time.destination}
            </div>
            <h1 className="font-display text-5xl sm:text-7xl lg:text-8xl font-light leading-[0.95] tracking-tight">
              <span className="gradient-text">{'{{DESTINATION_NAME}}'}</span>{' '}
              <span className="text-[var(--text-primary)] font-extralight">{'{{TRIP_YEAR}}'}</span>
            </h1>
            <p className="mt-4 max-w-xl text-sm sm:text-base text-[var(--text-secondary)] font-light leading-relaxed">
              {'{{DESTINATION_TAGLINE}}'}
            </p>
          </motion.div>
        </div>

        <div className="px-4 sm:px-6 lg:px-10 -mt-6">
          {showParkAlert && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 flex items-center gap-3 rounded-2xl border border-red-500/40 bg-red-500/[0.07] px-4 py-3 pulse-red"
            >
              <AlertTriangle className="h-5 w-5 text-red-400 shrink-0" />
              <div className="text-sm">
                <strong className="text-red-300">Critical purchase window · </strong>
                <span className="text-[var(--text-primary)]">
                  {'{{CRITICAL_ALERT_TEXT}}'}
                </span>
              </div>
            </motion.div>
          )}

          <motion.div
            variants={containerStagger}
            initial="initial"
            animate="animate"
            className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 auto-rows-fr gap-4 sm:gap-5"
          >
            {/* Countdown */}
            <motion.div variants={cardEnter} className="h-full">
              <GlassCard accent="gold" className="h-full">
                <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] text-[var(--accent-soft)] mb-3">
                  <span>⏳</span>
                  <span>Countdown</span>
                </div>
                <CountdownTimer target={TRIP_START} />
                <div className="mt-3 text-xs text-[var(--text-muted)]">
                  {'{{DEPARTURE_LABEL}}'}
                </div>
              </GlassCard>
            </motion.div>

            {/* Next activity — clickable → Itinerary (pre-selects the day) */}
            <motion.div variants={cardEnter} className="h-full">
              <GlassCard className="h-full" hover onClick={() => todayActivity && goItineraryDay(todayActivity.day.id)}>
                <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] text-[var(--accent-soft)] mb-3">
                  <CalendarDays className="h-3 w-3" strokeWidth={1.5} />
                  <span>{activityLabel}</span>
                  <ChevronRight className="h-3 w-3 ml-auto text-[var(--accent-soft)]/60" strokeWidth={1.5} />
                </div>
                {todayActivity ? (
                  <>
                    <div className="flex items-start gap-3">
                      <span className="text-4xl shrink-0">{todayActivity.day.emoji}</span>
                      <div className="min-w-0 flex-1">
                        <div className="text-[10px] uppercase tracking-wider text-[var(--text-muted)]">
                          Day {todayActivity.day.dayNumber} · {todayActivity.day.city}
                        </div>
                        <div className="font-display text-lg text-[var(--text-primary)] leading-tight mt-0.5 line-clamp-2">
                          {todayActivity.day.highlight}
                        </div>
                        <div className="text-xs text-[var(--text-secondary)] mt-2 line-clamp-2 italic">
                          {todayActivity.day.morning.title}
                        </div>
                      </div>
                    </div>
                    <div className="mt-3 pt-3 border-t border-white/5 flex items-center justify-between text-[10px]">
                      <span className="text-[var(--text-muted)] uppercase tracking-wider">{todayActivity.day.date}</span>
                      {todayActivity.status === 'upcoming' && (
                        <span className="text-[var(--accent-soft)]">in {daysToTrip} days</span>
                      )}
                      {todayActivity.status === 'today' && (
                        <span className="text-emerald-300">in progress</span>
                      )}
                      {todayActivity.status === 'past' && (
                        <span className="text-[var(--text-muted)]">finished</span>
                      )}
                    </div>
                  </>
                ) : (
                  <div className="py-2 text-sm text-[var(--text-secondary)]">
                    Add your first day to <em>Itinerary</em>.
                  </div>
                )}
              </GlassCard>
            </motion.div>

            {/* Destination Time */}
            <motion.div variants={cardEnter} className="h-full">
              <GlassCard className="h-full">
                <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] text-[var(--text-secondary)] mb-3">
                  <Clock className="h-3 w-3" strokeWidth={1.5} />
                  <span>Time Zones</span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <div className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider">Home</div>
                    <div className="font-mono text-2xl tabular-nums text-[var(--text-primary)]">{time.home}</div>
                    <div className="text-[10px] text-[var(--text-muted)] mt-1">{'{{HOME_TIMEZONE}}'}</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-[var(--accent-soft)] uppercase tracking-wider">Destination</div>
                    <div className="font-mono text-2xl tabular-nums text-[var(--accent-soft)]">{time.destination}</div>
                    <div className="text-[10px] text-[var(--text-muted)] mt-1">{'{{TIMEZONE}}'}</div>
                  </div>
                </div>
                <div className="mt-4 inline-flex items-center gap-1.5 text-xs text-[var(--text-secondary)]">
                  <ArrowRightLeft className="h-3 w-3" strokeWidth={1.5} />
                  <span className="font-medium text-[var(--accent-soft)]">
                    {time.diffHours >= 0 ? '+' : ''}{time.diffHours}h
                  </span>
                  <span>vs home</span>
                </div>
              </GlassCard>
            </motion.div>

            {/* Weather */}
            <motion.div variants={cardEnter} className="h-full">
              <GlassCard className="h-full">
                <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] text-[var(--text-secondary)] mb-3">
                  <Cloud className="h-3 w-3" strokeWidth={1.5} />
                  <span>Weather · {'{{DEFAULT_CITY}}'}</span>
                </div>
                {weather.loading || !weather.data ? (
                  <>
                    <Skeleton height={36} className="mb-2" />
                    <Skeleton height={14} width="50%" />
                  </>
                ) : (
                  <>
                    <div className="flex items-end gap-3">
                      <span className="text-4xl">{weather.data.emoji}</span>
                      <div>
                        <div className="font-display text-4xl text-[var(--text-primary)]">
                          {weather.data.tempC}°<span className="text-2xl text-[var(--text-secondary)]">C</span>
                        </div>
                        <div className="text-xs text-[var(--text-secondary)]">
                          Feels {weather.data.feelsLikeC}° · {weather.data.humidity}% humidity
                        </div>
                      </div>
                    </div>
                    <div className="mt-3 text-sm text-[var(--text-primary)]/90 capitalize">
                      {weather.data.condition}
                    </div>
                    <div className="mt-2 text-[10px] uppercase tracking-wider text-[var(--text-muted)]">
                      {weather.data.isFallback ? '· offline estimate' : `· live · ${weather.data.source}`}
                    </div>
                  </>
                )}
              </GlassCard>
            </motion.div>

            {/* Exchange — clickable → Costs */}
            <motion.div variants={cardEnter} className="h-full">
              <GlassCard className="h-full" hover onClick={() => setSection('costs')}>
                <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] text-[var(--text-secondary)] mb-3">
                  <ArrowRightLeft className="h-3 w-3" strokeWidth={1.5} />
                  <span>Exchange</span>
                  <ChevronRight className="h-3 w-3 ml-auto text-[var(--accent-soft)]/60" strokeWidth={1.5} />
                </div>
                {ex.loading || !ex.rates ? (
                  <>
                    <Skeleton height={28} className="mb-2" />
                    <Skeleton height={28} width="80%" />
                  </>
                ) : (
                  <div className="space-y-2.5">
                    <div className="flex items-baseline justify-between">
                      <span className="text-sm text-[var(--text-secondary)]">1 {CURRENCIES.home}</span>
                      <span className="font-mono text-xl text-[var(--accent-soft)]">
                        {ex.rates.dest.toFixed(2)} {CURRENCIES.dest}
                      </span>
                    </div>
                    <div className="flex items-baseline justify-between">
                      <span className="text-sm text-[var(--text-secondary)]">1 {CURRENCIES.home}</span>
                      <span className="font-mono text-xl text-[var(--text-primary)]">
                        {ex.rates.secondary.toFixed(2)} {CURRENCIES.secondary}
                      </span>
                    </div>
                    <div className="mt-3 pt-3 border-t border-white/5 flex items-baseline justify-between">
                      <span className="text-xs text-[var(--text-muted)] uppercase tracking-wider">Practical</span>
                      <span className="font-mono text-base text-[var(--accent-soft)]">
                        100 {CURRENCIES.home} = {(ex.rates.dest * 100).toLocaleString('en', { maximumFractionDigits: 0 })} {CURRENCIES.dest}
                      </span>
                    </div>
                    <div className="text-[10px] text-[var(--text-muted)]">
                      {ex.rates.isFallback ? '· offline estimate' : `· live · ${ex.rates.source} · ${ex.rates.date}`}
                    </div>
                  </div>
                )}
              </GlassCard>
            </motion.div>

            {/* Next reservation — clickable → Reservations */}
            <motion.div variants={cardEnter} className="h-full">
              <GlassCard className="h-full" hover onClick={() => setSection('reservations')}>
                <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] text-[var(--text-secondary)] mb-3">
                  <Plane className="h-3 w-3" strokeWidth={1.5} />
                  <span>Next Reservation</span>
                  <ChevronRight className="h-3 w-3 ml-auto text-[var(--accent-soft)]/60" strokeWidth={1.5} />
                </div>
                {nextVoucher ? (
                  <>
                    <div className="flex items-start gap-3">
                      <span className="text-3xl">{nextVoucher.emoji}</span>
                      <div className="min-w-0">
                        <div className="font-display text-lg text-[var(--text-primary)] leading-tight">
                          {nextVoucher.description}
                        </div>
                        <div className="text-xs text-[var(--text-secondary)] mt-0.5">
                          {nextVoucher.supplier}
                        </div>
                        <div className="mt-2 flex items-center gap-2 flex-wrap">
                          <Badge tone={nextVoucher.status as 'paid' | 'partial' | 'pending' | 'cancelled'}>
                            {nextVoucher.status}
                          </Badge>
                          {nextVoucher.checkinDate && (
                            <span className="text-xs text-[var(--text-muted)]">
                              · {nextVoucher.checkinDate}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="py-2 text-sm text-[var(--text-secondary)]">
                    No reservations yet. <br />
                    <span className="text-xs text-[var(--text-muted)]">
                      Add vouchers in <em>Reservations</em>.
                    </span>
                  </div>
                )}
              </GlassCard>
            </motion.div>

            {/* Checklist progress — clickable → Checklist */}
            <motion.div variants={cardEnter} className="h-full">
              <GlassCard className="h-full" hover onClick={() => setSection('checklist')}>
                <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] text-[var(--text-secondary)] mb-3">
                  <ListChecks className="h-3 w-3" strokeWidth={1.5} />
                  <span>Checklist</span>
                  <ChevronRight className="h-3 w-3 ml-auto text-[var(--accent-soft)]/60" strokeWidth={1.5} />
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="font-display text-4xl text-[var(--accent-soft)]">{done}</span>
                  <span className="text-lg text-[var(--text-secondary)]">/ {total}</span>
                </div>
                <div className="mt-3 h-2 rounded-full bg-white/5 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.9, ease: 'easeOut' }}
                    className="h-full rounded-full bg-gradient-to-r from-[var(--accent)] to-[var(--accent-soft)]"
                  />
                </div>
                <div className="mt-2 flex justify-between text-xs">
                  <span className="text-[var(--text-muted)]">Overall prep</span>
                  <span className="text-[var(--accent-soft)] font-medium">{progress}%</span>
                </div>
              </GlassCard>
            </motion.div>

            {/* Budget — clickable → Costs */}
            <motion.div variants={cardEnter} className="h-full">
              <GlassCard className="h-full" hover onClick={() => setSection('costs')} accent="gold">
                <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.3em] text-[var(--accent-soft)] mb-3">
                  <Wallet className="h-3 w-3" strokeWidth={1.5} />
                  <span>Budget</span>
                  <ChevronRight className="h-3 w-3 ml-auto text-[var(--accent-soft)]/60" strokeWidth={1.5} />
                </div>
                <div className="flex items-baseline justify-between">
                  <div>
                    <div className="text-[10px] uppercase tracking-wider text-[var(--text-muted)]">Planned</div>
                    <div className="font-mono text-xl text-[var(--accent-soft)]">
                      {CURRENCIES.home} {budget.est.toLocaleString('en', { maximumFractionDigits: 0 })}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-[10px] uppercase tracking-wider text-emerald-300/80">Actual</div>
                    <div className="font-mono text-xl text-emerald-300">
                      {CURRENCIES.home} {budget.act.toLocaleString('en', { maximumFractionDigits: 0 })}
                    </div>
                  </div>
                </div>
                <div className="mt-3 h-2 rounded-full bg-white/5 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${budget.pct}%` }}
                    transition={{ duration: 0.9, ease: 'easeOut' }}
                    className="h-full rounded-full bg-gradient-to-r from-emerald-500/70 to-emerald-300"
                  />
                </div>
                <div className="mt-2 flex justify-between text-xs">
                  <span className="text-[var(--text-muted)]">Consumed</span>
                  <span className="text-emerald-300 font-medium">{Math.round(budget.pct)}%</span>
                </div>
              </GlassCard>
            </motion.div>
          </motion.div>

          {/* 7-day Forecast — clickable band → Itinerary */}
          {weather.data && weather.data.forecast.length > 0 && (
            <motion.div
              variants={containerStagger}
              initial="initial"
              animate="animate"
              className="mt-10"
            >
              <button
                onClick={() => setSection('itinerary')}
                className="w-full text-left mb-4 flex items-end justify-between gap-3 group rounded-xl px-2 -mx-2 py-2 -my-2 hover:bg-white/[0.02] transition-colors"
                aria-label="Go to Itinerary"
              >
                <div>
                  <div className="text-[10px] uppercase tracking-[0.4em] text-[var(--accent-soft)] mb-1">Weather</div>
                  <h3 className="font-display text-2xl text-[var(--text-primary)] inline-flex items-center gap-1.5">
                    7-day Forecast · {'{{DEFAULT_CITY}}'}
                    <ChevronRight className="h-4 w-4 text-[var(--accent-soft)]/60 group-hover:text-[var(--accent-soft)] group-hover:translate-x-0.5 transition-all" strokeWidth={1.5} />
                  </h3>
                </div>
                <div className="text-xs text-[var(--text-muted)]">
                  source · {weather.data.source}
                </div>
              </button>
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
                {weather.data.forecast.map((d) => {
                  const dt = new Date(d.date)
                  const weekday = dt.toLocaleDateString('en', { weekday: 'short' })
                  const dayLabel = dt.toLocaleDateString('en', { day: '2-digit', month: 'short' })
                  return (
                    <motion.div
                      key={d.date}
                      variants={cardEnter}
                      className="rounded-xl border border-white/[0.06] bg-white/[0.03] p-3 backdrop-blur-md"
                    >
                      <div className="text-[10px] uppercase tracking-wider text-[var(--text-muted)] truncate">{weekday}</div>
                      <div className="text-[10px] text-[var(--text-secondary)] font-mono">{dayLabel}</div>
                      <div className="text-3xl my-1.5">{d.emoji}</div>
                      <div className="flex items-baseline gap-1.5 font-mono">
                        <span className="text-base text-[var(--text-primary)]">{d.tempMaxC}°</span>
                        <span className="text-xs text-[var(--text-muted)]">{d.tempMinC}°</span>
                      </div>
                      <div className="text-[10px] text-sky-300 mt-0.5">
                        💧 {d.precipitationProb}%
                      </div>
                      <div className="text-[10px] text-[var(--text-secondary)] line-clamp-1 mt-0.5">
                        {d.condition}
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            </motion.div>
          )}

          {/* Trip in Numbers — informational band */}
          <motion.div
            variants={containerStagger}
            initial="initial"
            animate="animate"
            className="mt-10"
          >
            <div className="flex items-end justify-between mb-4">
              <div>
                <div className="text-[10px] uppercase tracking-[0.4em] text-[var(--accent-soft)] mb-1">
                  Metrics
                </div>
                <h3 className="font-display text-2xl text-[var(--text-primary)]">Trip in Numbers</h3>
              </div>
              <div className="text-xs text-[var(--text-muted)]">
                {tripStats.length} indicators · computed live
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
              {tripStats.map((s) => (
                <motion.div
                  key={s.label}
                  variants={cardEnter}
                  className="rounded-xl border border-white/[0.06] bg-white/[0.03] p-3 backdrop-blur-md text-center"
                >
                  <div className="text-2xl mb-1">{s.emoji}</div>
                  <div className="font-display text-3xl text-[var(--accent-soft)] leading-none">
                    {s.value}
                  </div>
                  <div className="text-[10px] uppercase tracking-wider text-[var(--text-muted)] mt-1.5 leading-tight">
                    {s.label}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Trip overview band — header + each day clickable → Itinerary */}
          <motion.div
            variants={containerStagger}
            initial="initial"
            animate="animate"
            className="mt-10"
          >
            <button
              onClick={() => setSection('itinerary')}
              className="w-full text-left mb-4 flex items-end justify-between gap-3 group rounded-xl px-2 -mx-2 py-2 -my-2 hover:bg-white/[0.02] transition-colors"
              aria-label="Go to Itinerary"
            >
              <div>
                <div className="text-[10px] uppercase tracking-[0.4em] text-[var(--accent-soft)] mb-1">Itinerary</div>
                <h3 className="font-display text-2xl text-[var(--text-primary)] inline-flex items-center gap-1.5">
                  Timeline
                  <ChevronRight className="h-4 w-4 text-[var(--accent-soft)]/60 group-hover:text-[var(--accent-soft)] group-hover:translate-x-0.5 transition-all" strokeWidth={1.5} />
                </h3>
              </div>
              <div className="text-xs text-[var(--text-muted)]">
                {itinerary.length} days · {new Set(itinerary.map((d) => d.city)).size} cities
              </div>
            </button>
            <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4">
              {itinerary.map((d) => (
                <motion.button
                  key={d.id}
                  variants={cardEnter}
                  onClick={() => goItineraryDay(d.id)}
                  whileHover={{ y: -2 }}
                  className="shrink-0 w-32 text-left rounded-xl border border-white/[0.06] bg-white/[0.03] p-3 backdrop-blur-md transition-colors hover:bg-white/[0.06] hover:border-[var(--border-accent)] cursor-pointer"
                >
                  <div className="text-[10px] uppercase tracking-wider text-[var(--text-muted)]">Day {d.dayNumber}</div>
                  <div className="text-2xl my-1">{d.emoji}</div>
                  <div className="text-sm font-medium text-[var(--text-primary)] truncate">{d.city}</div>
                  <div className="text-[10px] text-[var(--text-secondary)] line-clamp-2 mt-1">
                    {d.highlight}
                  </div>
                </motion.button>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </PageTransition>
  )
}

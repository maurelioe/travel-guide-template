import type { FoodRating } from '../../types'

const map: Record<FoodRating, { icon: string; label: string; tone: string }> = {
  bom:         { icon: '🌟',     label: 'Bom',         tone: 'text-sky-300' },
  otimo:       { icon: '⭐⭐',   label: 'Ótimo',       tone: 'text-emerald-300' },
  imperdivel:  { icon: '🔥',     label: 'Imperdível',  tone: 'text-[var(--accent-soft)]' },
}

export function RatingStars({ rating, withLabel = false }: { rating: FoodRating; withLabel?: boolean }) {
  const cfg = map[rating]
  return (
    <span className={`inline-flex items-center gap-1.5 text-sm font-medium ${cfg.tone}`}>
      <span>{cfg.icon}</span>
      {withLabel && <span className="text-xs uppercase tracking-wider">{cfg.label}</span>}
    </span>
  )
}

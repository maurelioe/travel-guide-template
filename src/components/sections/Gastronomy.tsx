import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Flame } from 'lucide-react'
import { gastronomy } from '../../data/gastronomy'
import { GlassCard } from '../ui/GlassCard'
import { Badge } from '../ui/Badge'
import { RatingStars } from '../ui/RatingStars'
import { PageTransition, containerStagger, cardEnter } from '../layout/PageTransition'
import type { FoodCategory, FoodRating } from '../../types'

const categories: { id: 'all' | FoodCategory; label: string; emoji: string }[] = [
  { id: 'all',      label: 'Todos',    emoji: '🥢' },
  { id: 'prato',    label: 'Pratos',   emoji: '🍜' },
  { id: 'snack',    label: 'Snacks',   emoji: '🍡' },
  { id: 'doce',     label: 'Doces',    emoji: '🍮' },
  { id: 'bebida',   label: 'Bebidas',  emoji: '🍶' },
  { id: 'konbini',  label: 'Konbini',  emoji: '🏪' },
]

const ratings: ('all' | FoodRating)[] = ['all', 'bom', 'otimo', 'imperdivel']

export function Gastronomy() {
  const [cat, setCat] = useState<'all' | FoodCategory>('all')
  const [rating, setRating] = useState<'all' | FoodRating>('all')

  const items = useMemo(
    () =>
      gastronomy.filter(
        (g) =>
          (cat === 'all' || g.category === cat) &&
          (rating === 'all' || g.rating === rating),
      ),
    [cat, rating],
  )

  return (
    <PageTransition sectionKey="gastronomy">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
        <div className="flex flex-wrap gap-1.5">
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setCat(c.id)}
              className={`inline-flex items-center gap-1.5 text-[11px] px-3 py-1.5 rounded-full border uppercase tracking-wider ${
                cat === c.id
                  ? 'bg-[var(--accent-dim)] text-[var(--accent-soft)] border-[var(--border-accent)]'
                  : 'text-[var(--text-secondary)] border-white/10 hover:bg-white/[0.04]'
              }`}
            >
              <span>{c.emoji}</span>
              <span>{c.label}</span>
            </button>
          ))}
        </div>
        <div className="flex flex-wrap gap-1.5">
          {ratings.map((r) => (
            <button
              key={r}
              onClick={() => setRating(r)}
              className={`text-[11px] px-2.5 py-1 rounded-full border ${
                rating === r
                  ? 'bg-white/[0.08] text-[var(--text-primary)] border-white/20'
                  : 'text-[var(--text-muted)] border-white/[0.06] hover:bg-white/[0.04]'
              }`}
            >
              {r === 'all' ? 'todos' : r}
            </button>
          ))}
        </div>
      </div>

      <motion.div
        variants={containerStagger}
        initial="initial"
        animate="animate"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
      >
        {items.map((g) => (
          <motion.div key={g.id} variants={cardEnter}>
            <GlassCard accent={g.rating === 'imperdivel' ? 'gold' : 'none'} hover>
              <div className="flex items-start gap-3">
                <div className="text-4xl shrink-0">{g.emoji}</div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <h4 className="font-display text-lg text-[var(--text-primary)] leading-tight">{g.name}</h4>
                      <div className="text-xs text-[var(--text-secondary)] mt-0.5 italic">{g.nameJP}</div>
                    </div>
                    <RatingStars rating={g.rating} />
                  </div>

                  <p className="mt-2 text-sm text-[var(--text-secondary)] leading-snug line-clamp-3">{g.description}</p>

                  <div className="mt-3 flex items-center gap-2 flex-wrap">
                    <Badge tone="muted">{g.where}</Badge>
                    {g.mustTry && (
                      <Badge tone="gold">
                        <Flame className="h-2.5 w-2.5" /> must try
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        ))}
      </motion.div>

      <div className="mt-6 text-xs text-[var(--text-muted)] text-center">
        {items.length} de {gastronomy.length} itens
      </div>
    </PageTransition>
  )
}

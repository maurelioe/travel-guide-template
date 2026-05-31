import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Volume2, Copy, Check } from 'lucide-react'
import { phrases } from '../../data/phrases'
import type { PhraseCategory } from '../../data/phrases'
import { GlassCard } from '../ui/GlassCard'
import { Badge } from '../ui/Badge'
import { containerStagger, cardEnter } from '../layout/PageTransition'

const categories: { id: PhraseCategory; label: string; emoji: string }[] = [
  { id: 'greetings',   label: 'Saudações',     emoji: '👋' },
  { id: 'polite',      label: 'Cortesia',      emoji: '🙇' },
  { id: 'restaurant',  label: 'Restaurante',   emoji: '🍣' },
  { id: 'transport',   label: 'Transporte',    emoji: '🚆' },
  { id: 'shopping',    label: 'Compras',       emoji: '🛍️' },
  { id: 'hotel',       label: 'Hotel',         emoji: '🏨' },
  { id: 'directions',  label: 'Direções',      emoji: '🧭' },
  { id: 'emergency',   label: 'Emergência',    emoji: '🆘' },
]

export function PhrasesCard() {
  const [active, setActive] = useState<PhraseCategory>('polite')
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const items = useMemo(() => phrases.filter((p) => p.category === active), [active])

  const speak = (text: string) => {
    if (!('speechSynthesis' in window)) return
    const u = new SpeechSynthesisUtterance(text)
    u.lang = 'ja-JP'
    u.rate = 0.85
    speechSynthesis.cancel()
    speechSynthesis.speak(u)
  }

  const copy = (id: string, text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedId(id)
      setTimeout(() => setCopiedId(null), 1300)
    })
  }

  return (
    <div className="space-y-5">
      {/* Hero card */}
      <GlassCard accent="gold">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center gap-4">
            <div className="text-4xl">🗣️</div>
            <div>
              <div className="text-[10px] uppercase tracking-[0.3em] text-[var(--accent-soft)] mb-1">
                Frases Úteis · Pronúncia em PT-BR
              </div>
              <h3 className="font-display text-2xl text-[var(--text-primary)] leading-tight">
                Sobrevivência em Japonês
              </h3>
              <p className="text-xs text-[var(--text-secondary)] mt-1">
                Tap no <Volume2 className="inline h-3 w-3 mx-0.5 text-[var(--accent-soft)]" /> para ouvir · pronúncia aproximada usando fonemas brasileiros
              </p>
            </div>
          </div>
          <div className="text-right shrink-0">
            <div className="font-display text-3xl text-[var(--accent-soft)]">{phrases.length}</div>
            <div className="text-[10px] uppercase tracking-wider text-[var(--text-muted)]">frases</div>
          </div>
        </div>
      </GlassCard>

      {/* Category pills */}
      <div className="flex flex-wrap gap-2">
        {categories.map((c) => {
          const isActive = active === c.id
          const count = phrases.filter((p) => p.category === c.id).length
          return (
            <button
              key={c.id}
              onClick={() => setActive(c.id)}
              className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs transition-colors ${
                isActive
                  ? 'bg-[var(--accent-dim)] text-[var(--accent-soft)] border-[var(--border-accent)]'
                  : 'text-[var(--text-secondary)] border-white/10 hover:bg-white/[0.04]'
              }`}
            >
              <span>{c.emoji}</span>
              <span>{c.label}</span>
              <span className="text-[10px] text-[var(--text-muted)]">· {count}</span>
            </button>
          )
        })}
      </div>

      {/* Phrase grid */}
      <motion.div
        key={active}
        variants={containerStagger}
        initial="initial"
        animate="animate"
        className="grid grid-cols-1 md:grid-cols-2 gap-3"
      >
        {items.map((p) => (
          <motion.div key={p.id} variants={cardEnter}>
            <GlassCard hover className="h-full">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  {/* Japanese */}
                  <div className="font-display text-2xl text-[var(--text-primary)] leading-tight" lang="ja">
                    {p.jp}
                  </div>
                  <div className="mt-0.5 text-xs text-[var(--text-muted)] italic">{p.romaji}</div>

                  {/* Brazilian phonetic — featured */}
                  <div className="mt-3 inline-flex items-baseline gap-2 rounded-lg border border-[var(--border-accent)] bg-[var(--accent-dim)] px-3 py-1.5">
                    <span className="text-[9px] uppercase tracking-[0.25em] text-[var(--accent-soft)]/80">PT-BR</span>
                    <span className="font-mono text-base text-[var(--accent-soft)] tracking-wide">{p.ptBR}</span>
                  </div>

                  {/* Meaning */}
                  <div className="mt-3 text-sm text-[var(--text-primary)] leading-snug">
                    <span className="text-[var(--text-muted)] text-xs">›</span> {p.meaning}
                  </div>

                  {/* Context */}
                  {p.context && (
                    <div className="mt-2 text-xs text-[var(--text-secondary)] italic leading-snug">
                      {p.context}
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-1 shrink-0">
                  <button
                    onClick={() => speak(p.jp)}
                    title="Ouvir pronúncia"
                    className="p-2 rounded-lg border border-white/10 hover:border-[var(--border-accent)] hover:bg-[var(--accent-dim)] text-[var(--accent-soft)] transition-colors"
                  >
                    <Volume2 className="h-3.5 w-3.5" strokeWidth={1.8} />
                  </button>
                  <button
                    onClick={() => copy(p.id, p.jp)}
                    title="Copiar"
                    className="p-2 rounded-lg border border-white/10 hover:border-white/30 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
                  >
                    {copiedId === p.id ? (
                      <Check className="h-3.5 w-3.5 text-emerald-400" strokeWidth={2.2} />
                    ) : (
                      <Copy className="h-3.5 w-3.5" strokeWidth={1.6} />
                    )}
                  </button>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        ))}
      </motion.div>

      {/* Footer legenda */}
      <GlassCard padded={true}>
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 text-xs text-[var(--text-secondary)]">
          <Badge tone="gold">Legenda</Badge>
          <span>
            <span className="font-mono text-[var(--accent-soft)]">letras MAIÚSCULAS</span> indicam sílaba tônica ·{' '}
            <span className="font-mono text-[var(--accent-soft)]">â / ê / î / ô / û</span> = som longo ·{' '}
            <span className="font-mono text-[var(--accent-soft)]">RAI</span> = som de "rrai" forte (h aspirado) ·{' '}
            <span className="font-mono text-[var(--accent-soft)]">tch / dj</span> = como em "tchau" e "dia"
          </span>
        </div>
      </GlassCard>
    </div>
  )
}

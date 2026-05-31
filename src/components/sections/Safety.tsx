import { useState } from 'react'
import { motion } from 'framer-motion'
import { Phone, AlertTriangle } from 'lucide-react'
import { safety } from '../../data/safety'
import { GlassCard } from '../ui/GlassCard'
import { Badge } from '../ui/Badge'
import { PageTransition, containerStagger, cardEnter } from '../layout/PageTransition'
import { PhrasesCard } from './PhrasesCard'
import { IntercityCard } from './IntercityCard'
import { MedicalCard } from './MedicalCard'
import { IncidentsCard } from './IncidentsCard'
import type { SafetyTip } from '../../types'

type Cat = SafetyTip['category'] | 'phrases' | 'intercity' | 'medical' | 'incidents'
const tabs: { id: Cat; label: string; emoji: string }[] = [
  { id: 'phrases',    label: 'Frases Úteis',     emoji: '🗣️' },
  { id: 'intercity',  label: 'Deslocamentos',    emoji: '🚄' },
  { id: 'medical',    label: 'Saúde',            emoji: '🩺' },
  { id: 'incidents',  label: 'Sinistros',        emoji: '🚨' },
  { id: 'social',     label: 'Protocolo Social', emoji: '🤝' },
  { id: 'etiquette',  label: 'Etiqueta',         emoji: '🍵' },
  { id: 'transport',  label: 'Transporte',       emoji: '🚆' },
  { id: 'safety',     label: 'Segurança',        emoji: '🛡️' },
  { id: 'emergency',  label: 'Emergências',      emoji: '🆘' },
]

const SPECIAL_TABS: Cat[] = ['phrases', 'intercity', 'medical', 'incidents']

export function Safety() {
  const [tab, setTab] = useState<Cat>('phrases')
  const isSpecialTab = SPECIAL_TABS.includes(tab)
  const items = isSpecialTab ? [] : safety.filter((s) => s.category === tab)

  return (
    <PageTransition sectionKey="safety">
      <div className="flex flex-wrap gap-2 mb-6">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm transition-colors ${
              tab === t.id
                ? 'bg-[var(--accent-dim)] text-[var(--accent-soft)] border-[var(--border-accent)]'
                : 'text-[var(--text-secondary)] border-white/10 hover:bg-white/[0.04]'
            }`}
          >
            <span>{t.emoji}</span>
            <span>{t.label}</span>
          </button>
        ))}
      </div>

      {tab === 'phrases' && <PhrasesCard />}
      {tab === 'intercity' && <IntercityCard />}
      {tab === 'medical' && <MedicalCard />}
      {tab === 'incidents' && <IncidentsCard />}

      <motion.div
        variants={containerStagger}
        initial="initial"
        animate="animate"
        key={tab}
        className={`grid grid-cols-1 md:grid-cols-2 gap-4 ${isSpecialTab ? 'hidden' : ''}`}
      >
        {items.map((s) => (
          <motion.div key={s.id} variants={cardEnter}>
            <GlassCard accent={s.critical ? 'red' : 'none'}>
              <div className="flex items-start gap-3">
                <div className="text-3xl">{s.emoji}</div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="font-display text-lg text-[var(--text-primary)] leading-tight">{s.title}</h4>
                    {s.critical && (
                      <Badge tone="critical">
                        <AlertTriangle className="h-3 w-3" /> crítico
                      </Badge>
                    )}
                  </div>
                  <p className="mt-2 text-sm text-[var(--text-secondary)] leading-relaxed">{s.description}</p>

                  {extractPhone(s.description) && (
                    <a
                      href={`tel:${extractPhone(s.description)}`}
                      className="mt-3 inline-flex items-center gap-2 rounded-full bg-white/[0.05] hover:bg-white/[0.1] px-3 py-1.5 text-xs text-[var(--accent-soft)]"
                    >
                      <Phone className="h-3 w-3" />
                      Ligar agora · {extractPhone(s.description)}
                    </a>
                  )}
                </div>
              </div>
            </GlassCard>
          </motion.div>
        ))}
      </motion.div>
    </PageTransition>
  )
}

function extractPhone(text: string): string | null {
  const m = text.match(/(\+?\d[\d\-\s]{6,}\d)/)
  return m ? m[1].replace(/\s+/g, ' ') : null
}

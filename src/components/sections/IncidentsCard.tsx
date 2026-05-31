import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, AlertTriangle, FileText, Phone, ListOrdered } from 'lucide-react'
import { incidents } from '../../data/incidents'
import type { IncidentProtocol } from '../../types'
import { GlassCard } from '../ui/GlassCard'
import { Badge } from '../ui/Badge'
import { containerStagger, cardEnter } from '../layout/PageTransition'

export function IncidentsCard() {
  const [openId, setOpenId] = useState<string | null>(incidents[0]?.id ?? null)

  return (
    <div className="space-y-5">
      {/* Hero */}
      <GlassCard accent="red">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center gap-4">
            <div className="text-4xl">🚨</div>
            <div>
              <div className="text-[10px] uppercase tracking-[0.3em] text-red-300 mb-1">
                Protocolo de Sinistro · Passo-a-passo
              </div>
              <h3 className="font-display text-2xl text-[var(--text-primary)] leading-tight">
                Quando Algo Dá Errado
              </h3>
              <p className="text-xs text-[var(--text-secondary)] mt-1">
                Procedimentos estruturados para os {incidents.length} cenários mais comuns em viagem ao Japão
              </p>
            </div>
          </div>
          <div className="text-right shrink-0">
            <div className="font-display text-3xl text-red-300">{incidents.length}</div>
            <div className="text-[10px] uppercase tracking-wider text-[var(--text-muted)]">protocolos</div>
          </div>
        </div>
      </GlassCard>

      {/* Lista */}
      <motion.div
        variants={containerStagger}
        initial="initial"
        animate="animate"
        className="space-y-3"
      >
        {incidents.map((inc) => (
          <motion.div key={inc.id} variants={cardEnter}>
            <IncidentItem
              incident={inc}
              open={openId === inc.id}
              onToggle={() => setOpenId(openId === inc.id ? null : inc.id)}
            />
          </motion.div>
        ))}
      </motion.div>
    </div>
  )
}

function IncidentItem({
  incident, open, onToggle,
}: { incident: IncidentProtocol; open: boolean; onToggle: () => void }) {
  return (
    <GlassCard padded={false} accent={incident.severity === 'high' ? 'red' : open ? 'gold' : 'none'}>
      <button
        onClick={onToggle}
        className="w-full p-4 sm:p-5 text-left flex items-center gap-4"
      >
        <div className="text-3xl shrink-0">{incident.emoji}</div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <h4 className="font-display text-lg text-[var(--text-primary)] leading-tight">{incident.title}</h4>
            {incident.severity === 'high' && (
              <Badge tone="critical">
                <AlertTriangle className="h-3 w-3" /> alta gravidade
              </Badge>
            )}
          </div>
          <p className="text-xs text-[var(--text-secondary)] mt-0.5 leading-snug">{incident.scenario}</p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-[10px] uppercase tracking-wider text-[var(--text-muted)]">
            {incident.steps.length} passos
          </span>
          <ChevronDown
            className={`h-5 w-5 text-[var(--accent-soft)] transition-transform ${open ? 'rotate-180' : ''}`}
            strokeWidth={1.5}
          />
        </div>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="px-4 sm:px-5 pb-5 border-t border-white/5 pt-4 space-y-5">
              {/* Steps */}
              <div>
                <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-[0.3em] text-[var(--accent-soft)] mb-3">
                  <ListOrdered className="h-3 w-3" />
                  Passos do Protocolo
                </div>
                <ol className="space-y-3">
                  {incident.steps.map((s) => (
                    <li key={s.order} className="flex items-start gap-3">
                      <div className="shrink-0 h-6 w-6 rounded-full bg-[var(--accent-dim)] border border-[var(--border-accent)] flex items-center justify-center font-mono text-xs text-[var(--accent-soft)]">
                        {s.order}
                      </div>
                      <div className="min-w-0 flex-1 pt-0.5">
                        <div className="text-sm font-medium text-[var(--text-primary)] leading-snug">
                          {s.label}
                        </div>
                        {s.detail && (
                          <div className="text-xs text-[var(--text-secondary)] mt-1 leading-relaxed">
                            {s.detail}
                          </div>
                        )}
                      </div>
                    </li>
                  ))}
                </ol>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Required docs */}
                {incident.requiredDocs.length > 0 && (
                  <div>
                    <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-[0.3em] text-amber-300 mb-2">
                      <FileText className="h-3 w-3" />
                      Documentos Necessários
                    </div>
                    <ul className="space-y-1">
                      {incident.requiredDocs.map((d, i) => (
                        <li key={i} className="text-xs text-[var(--text-primary)] flex items-start gap-2">
                          <span className="text-amber-300 mt-0.5">▸</span>
                          <span>{d}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Contacts */}
                {incident.relatedContacts.length > 0 && (
                  <div>
                    <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-[0.3em] text-emerald-300 mb-2">
                      <Phone className="h-3 w-3" />
                      Contatos Relacionados
                    </div>
                    <ul className="space-y-1.5">
                      {incident.relatedContacts.map((c, i) => (
                        <li key={i} className="text-xs">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="text-[var(--text-primary)] font-medium">{c.label}</span>
                            {c.phone && (
                              <a
                                href={`tel:${c.phone}`}
                                className="font-mono text-emerald-300 hover:underline"
                              >
                                {c.phone}
                              </a>
                            )}
                          </div>
                          {c.note && (
                            <div className="text-[10px] text-[var(--text-muted)] italic">{c.note}</div>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </GlassCard>
  )
}

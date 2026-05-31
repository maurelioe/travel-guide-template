import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, X, Heart, Phone, Shield, AlertCircle, Trash2, QrCode, Pencil } from 'lucide-react'
import { GlassCard } from '../ui/GlassCard'
import { containerStagger, cardEnter } from '../layout/PageTransition'
import { useAppStore } from '../../store/useAppStore'
import { QREmergencyCard } from '../ui/QREmergencyCard'
import type { Traveler, BloodType } from '../../types'

const BLOOD_TYPES: BloodType[] = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', 'unknown']

export function MedicalCard() {
  const travelers = useAppStore((s) => s.travelers)
  const addTraveler = useAppStore((s) => s.addTraveler)
  const updateTraveler = useAppStore((s) => s.updateTraveler)
  const removeTraveler = useAppStore((s) => s.removeTraveler)
  const [modalState, setModalState] = useState<{ mode: 'new' | 'edit'; traveler?: Traveler } | null>(null)
  const [qrTraveler, setQRTraveler] = useState<Traveler | null>(null)

  return (
    <div className="space-y-5">
      {/* Hero */}
      <GlassCard accent="red">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="flex items-center gap-4">
            <div className="text-4xl">🩺</div>
            <div>
              <div className="text-[10px] uppercase tracking-[0.3em] text-red-300 mb-1">
                Fichas Médicas · Emergência
              </div>
              <h3 className="font-display text-2xl text-[var(--text-primary)] leading-tight">
                Saúde dos Viajantes
              </h3>
              <p className="text-xs text-[var(--text-secondary)] mt-1">
                Dados críticos para emergência médica · vital em hospitais japoneses (barreira linguística)
              </p>
            </div>
          </div>
          <button
            onClick={() => setModalState({ mode: 'new' })}
            className="inline-flex items-center gap-2 rounded-full bg-[var(--accent)] hover:bg-[var(--accent-soft)] text-black text-sm font-medium px-4 py-2 transition-colors"
          >
            <Plus className="h-4 w-4" strokeWidth={2} />
            Adicionar Viajante
          </button>
        </div>
      </GlassCard>

      {/* Privacy notice */}
      <div className="flex items-start gap-2 rounded-xl border border-amber-500/20 bg-amber-500/[0.05] px-4 py-3 text-xs text-amber-200/90">
        <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" strokeWidth={1.6} />
        <div>
          Dados armazenados apenas no <strong>localStorage</strong> deste navegador. Não há servidor.
          Recomenda-se gerar o cartão QR imprimível para carregar na carteira física.
        </div>
      </div>

      {/* List */}
      {travelers.length === 0 ? (
        <GlassCard className="text-center py-10">
          <Heart className="h-8 w-8 mx-auto text-[var(--text-muted)] mb-3" strokeWidth={1.2} />
          <div className="text-sm text-[var(--text-secondary)]">
            Nenhum viajante cadastrado.{' '}
            <button
              onClick={() => setModalState({ mode: 'new' })}
              className="text-[var(--accent-soft)] underline-offset-2 hover:underline"
            >
              Adicione o primeiro
            </button>
            .
          </div>
        </GlassCard>
      ) : (
        <motion.div
          variants={containerStagger}
          initial="initial"
          animate="animate"
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          {travelers.map((t) => (
            <motion.div key={t.id} variants={cardEnter}>
              <GlassCard accent="red">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="min-w-0 flex-1">
                    <h4 className="font-display text-xl text-[var(--text-primary)] leading-tight truncate">
                      {t.fullName || '—'}
                    </h4>
                    <div className="text-xs text-[var(--text-secondary)] mt-0.5 font-mono">
                      Passaporte · {t.passport || '—'}
                    </div>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => setQRTraveler(t)}
                      title="Gerar cartão QR de emergência"
                      className="p-2 rounded-lg border border-[var(--border-accent)] bg-[var(--accent-dim)] hover:bg-[var(--accent)]/30 text-[var(--accent-soft)]"
                    >
                      <QrCode className="h-3.5 w-3.5" strokeWidth={1.8} />
                    </button>
                    <button
                      onClick={() => setModalState({ mode: 'edit', traveler: t })}
                      title="Editar"
                      className="p-2 rounded-lg border border-white/10 hover:border-white/30 text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                    >
                      <Pencil className="h-3.5 w-3.5" strokeWidth={1.6} />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <Field label="Tipo Sanguíneo" tone="text-red-300">
                    <span className="font-mono text-base text-red-200">
                      {t.bloodType === 'unknown' ? '—' : t.bloodType}
                    </span>
                  </Field>
                  <Field label="Nascimento" tone="text-[var(--text-secondary)]">
                    <span className="text-[var(--text-primary)]">{t.birthDate || '—'}</span>
                  </Field>
                  <Field label="Alergias" tone="text-amber-300" className="col-span-2">
                    <span className="text-[var(--text-primary)] leading-snug">
                      {t.allergies || 'Nenhuma declarada'}
                    </span>
                  </Field>
                  <Field label="Medicamentos contínuos" tone="text-sky-300" className="col-span-2">
                    <span className="text-[var(--text-primary)] leading-snug">
                      {t.chronicMeds || 'Nenhum'}
                    </span>
                  </Field>
                  {t.conditions && (
                    <Field label="Condições" tone="text-fuchsia-300" className="col-span-2">
                      <span className="text-[var(--text-primary)] leading-snug">{t.conditions}</span>
                    </Field>
                  )}
                </div>

                <div className="mt-4 pt-4 border-t border-white/5 space-y-2.5">
                  <div className="flex items-start gap-2">
                    <Phone className="h-3 w-3 mt-1 text-emerald-300 shrink-0" />
                    <div className="text-xs">
                      <div className="text-[10px] uppercase tracking-wider text-emerald-300">
                        Contato Emergência BR
                      </div>
                      <div className="text-[var(--text-primary)]">
                        {t.emergencyContactBR.name || '—'}
                        {t.emergencyContactBR.relation && (
                          <span className="text-[var(--text-muted)]"> · {t.emergencyContactBR.relation}</span>
                        )}
                      </div>
                      {t.emergencyContactBR.phone && (
                        <a
                          href={`tel:${t.emergencyContactBR.phone}`}
                          className="font-mono text-[var(--accent-soft)] hover:underline"
                        >
                          {t.emergencyContactBR.phone}
                        </a>
                      )}
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <Shield className="h-3 w-3 mt-1 text-[var(--accent-soft)] shrink-0" />
                    <div className="text-xs">
                      <div className="text-[10px] uppercase tracking-wider text-[var(--accent-soft)]">
                        Seguro Viagem
                      </div>
                      <div className="text-[var(--text-primary)] font-mono">{t.insurancePolicy || '—'}</div>
                      <div className="text-[10px] text-[var(--text-secondary)] space-x-2">
                        {t.insurancePhoneLocal && (
                          <a href={`tel:${t.insurancePhoneLocal}`} className="hover:text-[var(--accent-soft)]">
                            Local: <span className="font-mono">{t.insurancePhoneLocal}</span>
                          </a>
                        )}
                        {t.insurancePhoneIntl && (
                          <a href={`tel:${t.insurancePhoneIntl}`} className="hover:text-[var(--accent-soft)]">
                            Intl: <span className="font-mono">{t.insurancePhoneIntl}</span>
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {t.notes && (
                  <div className="mt-3 text-xs text-[var(--text-secondary)] italic border-l-2 border-white/10 pl-3 leading-snug">
                    {t.notes}
                  </div>
                )}

                <button
                  onClick={() => {
                    if (confirm(`Remover ${t.fullName}?`)) removeTraveler(t.id)
                  }}
                  className="mt-3 inline-flex items-center gap-1 text-[10px] uppercase tracking-wider text-red-400/70 hover:text-red-300"
                >
                  <Trash2 className="h-3 w-3" /> remover
                </button>
              </GlassCard>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Modal de edição/criação */}
      <AnimatePresence>
        {modalState && (
          <TravelerModal
            initial={modalState.traveler}
            onClose={() => setModalState(null)}
            onSave={(t) => {
              if (modalState.mode === 'edit' && modalState.traveler) {
                updateTraveler(modalState.traveler.id, t)
              } else {
                addTraveler(t)
              }
              setModalState(null)
            }}
          />
        )}
      </AnimatePresence>

      {/* Modal QR */}
      <AnimatePresence>
        {qrTraveler && <QREmergencyCard traveler={qrTraveler} onClose={() => setQRTraveler(null)} />}
      </AnimatePresence>
    </div>
  )
}

function Field({
  label, tone, children, className = '',
}: { label: string; tone: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={className}>
      <div className={`text-[10px] uppercase tracking-wider ${tone}`}>{label}</div>
      <div className="text-xs mt-0.5">{children}</div>
    </div>
  )
}

function TravelerModal({
  initial, onClose, onSave,
}: { initial?: Traveler; onClose: () => void; onSave: (t: Traveler) => void }) {
  const [form, setForm] = useState<Traveler>(
    initial ?? {
      id: 'trv-' + Math.random().toString(36).slice(2, 9),
      fullName: '',
      passport: '',
      birthDate: '',
      bloodType: 'unknown',
      allergies: '',
      chronicMeds: '',
      conditions: '',
      emergencyContactBR: { name: '', phone: '', relation: '' },
      insurancePolicy: '',
      insurancePhoneLocal: '',
      insurancePhoneIntl: '',
      notes: '',
    },
  )

  const update = <K extends keyof Traveler>(k: K, v: Traveler[K]) =>
    setForm((f) => ({ ...f, [k]: v }))

  const updateContact = (k: keyof Traveler['emergencyContactBR'], v: string) =>
    setForm((f) => ({ ...f, emergencyContactBR: { ...f.emergencyContactBR, [k]: v } }))

  const submit = () => {
    if (!form.fullName.trim()) return
    onSave(form)
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-2xl rounded-2xl border border-white/10 bg-[var(--bg-elevated)] p-6 max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between mb-5">
          <div>
            <div className="text-[10px] uppercase tracking-[0.3em] text-red-300">
              {initial ? 'Editar' : 'Novo'}
            </div>
            <h3 className="font-display text-2xl">Ficha Médica</h3>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-white/10 rounded-lg">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-3">
          <ModalField label="Nome completo (como no passaporte)">
            <input value={form.fullName} onChange={(e) => update('fullName', e.target.value)} placeholder="Marcos Aurélio Eustáquio" className={inputCls} />
          </ModalField>

          <div className="grid grid-cols-2 gap-3">
            <ModalField label="Passaporte nº">
              <input value={form.passport} onChange={(e) => update('passport', e.target.value)} placeholder="XX-123456" className={inputCls} />
            </ModalField>
            <ModalField label="Data nascimento">
              <input type="date" value={form.birthDate} onChange={(e) => update('birthDate', e.target.value)} className={inputCls} />
            </ModalField>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <ModalField label="Tipo sanguíneo">
              <select value={form.bloodType} onChange={(e) => update('bloodType', e.target.value as BloodType)} className={inputCls}>
                {BLOOD_TYPES.map((b) => (
                  <option key={b} value={b}>{b === 'unknown' ? 'desconhecido' : b}</option>
                ))}
              </select>
            </ModalField>
            <ModalField label="Apólice de seguro">
              <input value={form.insurancePolicy} onChange={(e) => update('insurancePolicy', e.target.value)} placeholder="AIG-12345" className={inputCls} />
            </ModalField>
          </div>

          <ModalField label="Alergias (medicamentos, alimentos, contato)">
            <textarea value={form.allergies} onChange={(e) => update('allergies', e.target.value)} rows={2} placeholder="Penicilina; frutos do mar; látex" className={inputCls + ' resize-none'} />
          </ModalField>

          <ModalField label="Medicamentos contínuos">
            <textarea value={form.chronicMeds} onChange={(e) => update('chronicMeds', e.target.value)} rows={2} placeholder="Losartana 50mg manhã; AAS 100mg" className={inputCls + ' resize-none'} />
          </ModalField>

          <ModalField label="Condições médicas relevantes (opcional)">
            <input value={form.conditions ?? ''} onChange={(e) => update('conditions', e.target.value)} placeholder="HAS, diabetes tipo 2, asma" className={inputCls} />
          </ModalField>

          <div className="pt-4 mt-2 border-t border-white/10">
            <div className="text-[10px] uppercase tracking-[0.3em] text-emerald-300 mb-2">Contato Emergência BR</div>
            <div className="grid grid-cols-2 gap-3">
              <ModalField label="Nome">
                <input value={form.emergencyContactBR.name} onChange={(e) => updateContact('name', e.target.value)} placeholder="Maria Eustáquio" className={inputCls} />
              </ModalField>
              <ModalField label="Relação">
                <input value={form.emergencyContactBR.relation} onChange={(e) => updateContact('relation', e.target.value)} placeholder="Esposa" className={inputCls} />
              </ModalField>
            </div>
            <ModalField label="Telefone (com DDI +55)" className="mt-3">
              <input value={form.emergencyContactBR.phone} onChange={(e) => updateContact('phone', e.target.value)} placeholder="+55 31 99999-0000" className={inputCls} />
            </ModalField>
          </div>

          <div className="pt-4 mt-2 border-t border-white/10">
            <div className="text-[10px] uppercase tracking-[0.3em] text-[var(--accent-soft)] mb-2">Telefones do Seguro</div>
            <div className="grid grid-cols-2 gap-3">
              <ModalField label="Local Japão (24h)">
                <input value={form.insurancePhoneLocal} onChange={(e) => update('insurancePhoneLocal', e.target.value)} placeholder="0120-XXX-XXX" className={inputCls} />
              </ModalField>
              <ModalField label="Internacional (a cobrar)">
                <input value={form.insurancePhoneIntl} onChange={(e) => update('insurancePhoneIntl', e.target.value)} placeholder="+1-713-XXX-XXXX" className={inputCls} />
              </ModalField>
            </div>
          </div>

          <ModalField label="Notas (opcional)">
            <textarea value={form.notes ?? ''} onChange={(e) => update('notes', e.target.value)} rows={2} placeholder="Carteira de vacinação anexa; receita médica em inglês na bagagem de mão" className={inputCls + ' resize-none'} />
          </ModalField>
        </div>

        <div className="mt-5 flex gap-2">
          <button onClick={onClose} className="flex-1 rounded-lg border border-white/10 px-4 py-2.5 text-sm text-[var(--text-secondary)] hover:bg-white/5">Cancelar</button>
          <button onClick={submit} className="flex-1 rounded-lg bg-[var(--accent)] hover:bg-[var(--accent-soft)] text-black font-medium px-4 py-2.5 text-sm">Salvar</button>
        </div>
      </motion.div>
    </motion.div>
  )
}

const inputCls = 'w-full rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-[var(--border-accent)]'

function ModalField({ label, children, className = '' }: { label: string; children: React.ReactNode; className?: string }) {
  return (
    <label className={`block ${className}`}>
      <span className="block text-[10px] uppercase tracking-[0.25em] text-[var(--text-muted)] mb-1">{label}</span>
      {children}
    </label>
  )
}

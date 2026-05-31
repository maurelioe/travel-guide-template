import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, X, Copy, Check, Trash2 } from 'lucide-react'
import { GlassCard } from '../ui/GlassCard'
import { Badge } from '../ui/Badge'
import { PageTransition, containerStagger, cardEnter } from '../layout/PageTransition'
import { useAppStore } from '../../store/useAppStore'
import type { Voucher, VoucherStatus, VoucherCategory } from '../../types'

const statuses: ('all' | VoucherStatus)[] = ['all', 'paid', 'partial', 'pending', 'cancelled']
const categories: ('all' | VoucherCategory)[] = ['all', 'flight', 'hotel', 'park', 'transport', 'insurance', 'tour']
const categoryEmoji: Record<VoucherCategory, string> = {
  flight: '✈️', hotel: '🏨', park: '🎢', transport: '🚄', insurance: '🛡️', tour: '🗺️',
}

export function Reservations() {
  const vouchers = useAppStore((s) => s.vouchers)
  const addVoucher = useAppStore((s) => s.addVoucher)
  const removeVoucher = useAppStore((s) => s.removeVoucher)
  const [statusFilter, setStatus] = useState<'all' | VoucherStatus>('all')
  const [catFilter, setCat] = useState<'all' | VoucherCategory>('all')
  const [modalOpen, setModal] = useState(false)
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const filtered = useMemo(() => {
    return vouchers.filter(
      (v) =>
        (statusFilter === 'all' || v.status === statusFilter) &&
        (catFilter === 'all' || v.category === catFilter),
    )
  }, [vouchers, statusFilter, catFilter])

  const totals = useMemo(() => {
    const t: Record<string, { paid: number; pending: number }> = {}
    for (const v of vouchers) {
      const k = v.currency
      if (!t[k]) t[k] = { paid: 0, pending: 0 }
      if (v.status === 'paid') t[k].paid += v.amount
      else if (v.status === 'pending' || v.status === 'partial') t[k].pending += v.amount
    }
    return t
  }, [vouchers])

  const copy = (id: string, code: string) => {
    navigator.clipboard.writeText(code).then(() => {
      setCopiedId(id)
      setTimeout(() => setCopiedId(null), 1500)
    })
  }

  return (
    <PageTransition sectionKey="reservations">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div className="flex flex-wrap gap-1.5">
          {statuses.map((s) => (
            <button
              key={s}
              onClick={() => setStatus(s)}
              className={`text-[11px] px-2.5 py-1 rounded-full border uppercase tracking-wider ${
                statusFilter === s
                  ? 'bg-[var(--accent-dim)] text-[var(--accent-soft)] border-[var(--border-accent)]'
                  : 'text-[var(--text-secondary)] border-white/10 hover:bg-white/[0.04]'
              }`}
            >
              {s === 'all' ? 'todos' : s}
            </button>
          ))}
        </div>

        <button
          onClick={() => setModal(true)}
          className="inline-flex items-center gap-2 rounded-full bg-[var(--accent)] hover:bg-[var(--accent-soft)] text-black text-sm font-medium px-4 py-2 transition-colors"
        >
          <Plus className="h-4 w-4" strokeWidth={2} />
          Adicionar Voucher
        </button>
      </div>

      <div className="mb-6 flex flex-wrap gap-1.5">
        {categories.map((c) => (
          <button
            key={c}
            onClick={() => setCat(c)}
            className={`text-[11px] px-2.5 py-1 rounded-full border ${
              catFilter === c
                ? 'bg-white/[0.08] text-[var(--text-primary)] border-white/20'
                : 'text-[var(--text-muted)] border-white/[0.06] hover:bg-white/[0.04]'
            }`}
          >
            {c === 'all' ? 'todas categorias' : `${categoryEmoji[c]} ${c}`}
          </button>
        ))}
      </div>

      {/* totals */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {Object.entries(totals).map(([cur, t]) => (
          <GlassCard key={cur} padded={true}>
            <div className="text-[10px] uppercase tracking-[0.3em] text-[var(--text-muted)] mb-1">Total {cur}</div>
            <div className="text-xl font-mono text-emerald-300">
              {cur === 'BRL' ? 'R$ ' : cur === 'USD' ? '$ ' : '¥ '}
              {t.paid.toLocaleString('pt-BR')}
            </div>
            <div className="text-xs text-[var(--text-muted)] mt-0.5">
              + {t.pending.toLocaleString('pt-BR')} {cur} pendente
            </div>
          </GlassCard>
        ))}
        {Object.keys(totals).length === 0 && (
          <GlassCard className="md:col-span-4 text-center">
            <div className="text-sm text-[var(--text-secondary)]">
              Nenhum voucher cadastrado. Clique em <strong className="text-[var(--accent-soft)]">+ Adicionar Voucher</strong>.
            </div>
          </GlassCard>
        )}
      </div>

      <motion.div
        variants={containerStagger}
        initial="initial"
        animate="animate"
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        {filtered.map((v) => (
          <motion.div key={v.id} variants={cardEnter}>
            <GlassCard hover>
              <div className="flex items-start gap-3">
                <div className="text-3xl">{v.emoji || categoryEmoji[v.category]}</div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <h4 className="font-display text-lg text-[var(--text-primary)] leading-tight">{v.description}</h4>
                      <div className="text-xs text-[var(--text-secondary)] mt-0.5">{v.supplier}</div>
                    </div>
                    <Badge tone={v.status as VoucherStatus}>{v.status}</Badge>
                  </div>

                  <div className="mt-3 grid grid-cols-2 gap-x-3 gap-y-2 text-xs">
                    {v.checkinDate && (
                      <div>
                        <span className="text-[var(--text-muted)] uppercase tracking-wider text-[10px]">Check-in</span>
                        <div className="text-[var(--text-primary)]">{v.checkinDate}</div>
                      </div>
                    )}
                    {v.checkoutDate && (
                      <div>
                        <span className="text-[var(--text-muted)] uppercase tracking-wider text-[10px]">Check-out</span>
                        <div className="text-[var(--text-primary)]">{v.checkoutDate}</div>
                      </div>
                    )}
                    <div>
                      <span className="text-[var(--text-muted)] uppercase tracking-wider text-[10px]">Valor</span>
                      <div className="text-[var(--accent-soft)] font-mono">
                        {v.currency === 'BRL' ? 'R$ ' : v.currency === 'USD' ? '$ ' : '¥ '}
                        {v.amount.toLocaleString('pt-BR')}
                      </div>
                    </div>
                    {v.confirmationCode && (
                      <div>
                        <span className="text-[var(--text-muted)] uppercase tracking-wider text-[10px]">Código</span>
                        <button
                          onClick={() => copy(v.id, v.confirmationCode!)}
                          className="flex items-center gap-1 text-[var(--text-primary)] font-mono hover:text-[var(--accent-soft)]"
                        >
                          <span className="truncate">{v.confirmationCode}</span>
                          {copiedId === v.id ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                        </button>
                      </div>
                    )}
                  </div>

                  {v.notes && (
                    <div className="mt-3 text-xs text-[var(--text-secondary)] italic border-l-2 border-white/10 pl-3">
                      {v.notes}
                    </div>
                  )}

                  <button
                    onClick={() => removeVoucher(v.id)}
                    className="mt-3 inline-flex items-center gap-1 text-[10px] uppercase tracking-wider text-red-400/70 hover:text-red-300"
                  >
                    <Trash2 className="h-3 w-3" /> remover
                  </button>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        ))}
      </motion.div>

      <AnimatePresence>
        {modalOpen && <VoucherModal onClose={() => setModal(false)} onSave={(v) => { addVoucher(v); setModal(false) }} />}
      </AnimatePresence>
    </PageTransition>
  )
}

function VoucherModal({ onClose, onSave }: { onClose: () => void; onSave: (v: Voucher) => void }) {
  const [form, setForm] = useState<Voucher>({
    id: 'vch-' + Math.random().toString(36).slice(2, 9),
    category: 'hotel',
    emoji: '🏨',
    description: '',
    supplier: '',
    confirmationCode: '',
    checkinDate: '',
    checkoutDate: '',
    amount: 0,
    currency: 'BRL',
    status: 'pending',
    notes: '',
  })

  const update = <K extends keyof Voucher>(k: K, v: Voucher[K]) =>
    setForm((f) => ({ ...f, [k]: v }))

  const submit = () => {
    if (!form.description.trim() || !form.supplier.trim()) return
    onSave({ ...form, emoji: categoryEmoji[form.category] })
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
        className="w-full max-w-lg rounded-2xl border border-white/10 bg-[var(--bg-elevated)] p-6 max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between mb-5">
          <div>
            <div className="text-[10px] uppercase tracking-[0.3em] text-[var(--accent-soft)]">Novo</div>
            <h3 className="font-display text-2xl">Adicionar Voucher</h3>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-white/10 rounded-lg">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-3">
          <Field label="Descrição">
            <input value={form.description} onChange={(e) => update('description', e.target.value)} placeholder="Hotel Tokyo Shinjuku" className={inputCls} />
          </Field>
          <Field label="Fornecedor">
            <input value={form.supplier} onChange={(e) => update('supplier', e.target.value)} placeholder="Booking.com / Hotel direto" className={inputCls} />
          </Field>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Categoria">
              <select value={form.category} onChange={(e) => update('category', e.target.value as VoucherCategory)} className={inputCls}>
                {categories.filter((c) => c !== 'all').map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </Field>
            <Field label="Status">
              <select value={form.status} onChange={(e) => update('status', e.target.value as VoucherStatus)} className={inputCls}>
                {statuses.filter((s) => s !== 'all').map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </Field>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Field label="Check-in">
              <input type="date" value={form.checkinDate} onChange={(e) => update('checkinDate', e.target.value)} className={inputCls} />
            </Field>
            <Field label="Check-out">
              <input type="date" value={form.checkoutDate} onChange={(e) => update('checkoutDate', e.target.value)} className={inputCls} />
            </Field>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <Field label="Valor" className="col-span-2">
              <input type="number" value={form.amount} onChange={(e) => update('amount', Number(e.target.value))} className={inputCls} />
            </Field>
            <Field label="Moeda">
              <select value={form.currency} onChange={(e) => update('currency', e.target.value as 'BRL' | 'JPY' | 'USD')} className={inputCls}>
                <option value="BRL">BRL</option>
                <option value="JPY">JPY</option>
                <option value="USD">USD</option>
              </select>
            </Field>
          </div>

          <Field label="Código de confirmação">
            <input value={form.confirmationCode} onChange={(e) => update('confirmationCode', e.target.value)} placeholder="ABC-12345" className={inputCls} />
          </Field>
          <Field label="Notas">
            <textarea value={form.notes} onChange={(e) => update('notes', e.target.value)} rows={2} className={inputCls + ' resize-none'} />
          </Field>
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

function Field({ label, children, className = '' }: { label: string; children: React.ReactNode; className?: string }) {
  return (
    <label className={`block ${className}`}>
      <span className="block text-[10px] uppercase tracking-[0.25em] text-[var(--text-muted)] mb-1">{label}</span>
      {children}
    </label>
  )
}

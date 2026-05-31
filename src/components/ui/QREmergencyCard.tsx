import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { X, Printer, Heart, Phone, Shield } from 'lucide-react'
import QRCode from 'qrcode'
import type { Traveler } from '../../types'

interface Props {
  traveler: Traveler
  onClose: () => void
}

// Build MECARD-style payload — universally parseable by phone cameras
function buildPayload(t: Traveler): string {
  const lines = [
    `EMERGENCY MEDICAL ID`,
    `Name: ${t.fullName}`,
    `Passport: ${t.passport}`,
    `DOB: ${t.birthDate}`,
    `Blood: ${t.bloodType === 'unknown' ? 'unknown' : t.bloodType}`,
    `Allergies: ${t.allergies || 'none declared'}`,
    `Medications: ${t.chronicMeds || 'none'}`,
    t.conditions ? `Conditions: ${t.conditions}` : '',
    `--- EMERGENCY CONTACT (BR) ---`,
    `${t.emergencyContactBR.name} (${t.emergencyContactBR.relation})`,
    `Tel: ${t.emergencyContactBR.phone}`,
    `--- INSURANCE ---`,
    `Policy: ${t.insurancePolicy}`,
    t.insurancePhoneLocal ? `Local JP: ${t.insurancePhoneLocal}` : '',
    t.insurancePhoneIntl ? `Intl: ${t.insurancePhoneIntl}` : '',
    `--- EMBASSY BRAZIL TOKYO ---`,
    `+81-3-3404-5211`,
  ]
    .filter(Boolean)
    .join('\n')
  return lines
}

export function QREmergencyCard({ traveler, onClose }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!canvasRef.current) return
    QRCode.toCanvas(canvasRef.current, buildPayload(traveler), {
      width: 220,
      margin: 1,
      errorCorrectionLevel: 'M',
      color: { dark: '#0c0c10', light: '#ffffff' },
    }).catch(() => {})
  }, [traveler])

  const print = () => window.print()

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 print:bg-white print:p-0 print:items-start"
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-3xl rounded-2xl border border-white/10 bg-[var(--bg-elevated)] p-6 max-h-[95vh] overflow-y-auto print:border-0 print:bg-white print:max-h-none print:p-0 print:max-w-full"
      >
        {/* Controls — escondidos na impressão */}
        <div className="flex items-center justify-between mb-5 print:hidden">
          <div>
            <div className="text-[10px] uppercase tracking-[0.3em] text-red-300">Cartão de Emergência</div>
            <h3 className="font-display text-2xl">QR + Dados Críticos</h3>
            <p className="text-xs text-[var(--text-secondary)] mt-1">
              Imprima em A6 (105×148 mm) e carregue na carteira. Funciona com qualquer leitor de QR.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={print}
              className="inline-flex items-center gap-2 rounded-full bg-[var(--accent)] hover:bg-[var(--accent-soft)] text-black text-sm font-medium px-4 py-2"
            >
              <Printer className="h-4 w-4" />
              Imprimir
            </button>
            <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-lg">
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Cartão — visível tanto na tela quanto na impressão */}
        <div className="emergency-card mx-auto rounded-2xl border-2 border-red-600 bg-white text-black p-5 grid grid-cols-[1fr_auto] gap-5 print:border print:rounded-none print:p-4">
          {/* Coluna esquerda — dados estruturados */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Heart className="h-4 w-4 text-red-600" fill="currentColor" strokeWidth={0} />
              <div className="text-[10px] uppercase tracking-[0.2em] text-red-700 font-bold">
                Emergency Medical · Japan 2027
              </div>
            </div>

            <div className="font-bold text-lg leading-tight mb-1">{traveler.fullName}</div>
            <div className="text-xs text-gray-700 font-mono mb-3">
              Passport {traveler.passport} · DOB {traveler.birthDate || '—'}
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs mb-3">
              <div className="rounded border border-red-600 bg-red-50 px-2 py-1">
                <div className="text-[9px] uppercase text-red-700 font-bold">Blood Type</div>
                <div className="text-base font-bold text-red-700 leading-tight">
                  {traveler.bloodType === 'unknown' ? '—' : traveler.bloodType}
                </div>
              </div>
              <div className="rounded border border-amber-500 bg-amber-50 px-2 py-1">
                <div className="text-[9px] uppercase text-amber-700 font-bold">Allergies</div>
                <div className="text-[11px] leading-tight">{traveler.allergies || 'none declared'}</div>
              </div>
              {traveler.chronicMeds && (
                <div className="col-span-2 rounded border border-sky-500 bg-sky-50 px-2 py-1">
                  <div className="text-[9px] uppercase text-sky-700 font-bold">Chronic Medications</div>
                  <div className="text-[11px] leading-tight">{traveler.chronicMeds}</div>
                </div>
              )}
              {traveler.conditions && (
                <div className="col-span-2 rounded border border-fuchsia-500 bg-fuchsia-50 px-2 py-1">
                  <div className="text-[9px] uppercase text-fuchsia-700 font-bold">Conditions</div>
                  <div className="text-[11px] leading-tight">{traveler.conditions}</div>
                </div>
              )}
            </div>

            <div className="space-y-2 text-[11px]">
              <div className="flex items-start gap-1.5">
                <Phone className="h-3 w-3 mt-0.5 text-emerald-700 shrink-0" />
                <div>
                  <div className="text-[9px] uppercase text-emerald-700 font-bold">Contact BR</div>
                  <div className="leading-tight">
                    {traveler.emergencyContactBR.name} ({traveler.emergencyContactBR.relation})
                  </div>
                  <div className="font-mono">{traveler.emergencyContactBR.phone}</div>
                </div>
              </div>
              <div className="flex items-start gap-1.5">
                <Shield className="h-3 w-3 mt-0.5 text-blue-700 shrink-0" />
                <div>
                  <div className="text-[9px] uppercase text-blue-700 font-bold">Insurance</div>
                  <div className="font-mono">{traveler.insurancePolicy}</div>
                  {traveler.insurancePhoneLocal && (
                    <div className="font-mono">JP: {traveler.insurancePhoneLocal}</div>
                  )}
                  {traveler.insurancePhoneIntl && (
                    <div className="font-mono">Intl: {traveler.insurancePhoneIntl}</div>
                  )}
                </div>
              </div>
              <div className="pt-1 border-t border-gray-300 text-gray-600">
                <span className="text-[9px] uppercase font-bold">Embassy BR Tokyo</span>{' '}
                <span className="font-mono">+81-3-3404-5211</span>
              </div>
            </div>
          </div>

          {/* Coluna direita — QR */}
          <div className="flex flex-col items-center justify-start">
            <canvas ref={canvasRef} className="border border-gray-200 rounded" />
            <div className="text-[9px] uppercase text-gray-600 mt-2 text-center leading-tight">
              Scan para dados<br />completos
            </div>
          </div>
        </div>

        {/* Print stylesheet inline */}
        <style>{`
          @media print {
            body { background: white !important; }
            body * { visibility: hidden; }
            .emergency-card, .emergency-card * { visibility: visible; }
            .emergency-card {
              position: absolute;
              left: 0; top: 0;
              width: 148mm; max-width: 148mm;
              page-break-inside: avoid;
            }
            @page { size: A6 landscape; margin: 4mm; }
          }
        `}</style>
      </motion.div>
    </motion.div>
  )
}

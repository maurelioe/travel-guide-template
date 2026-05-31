import { useEffect, useState } from 'react'

// {{HOME_CURRENCY}} — ISO 4217 code of traveler's home currency (e.g. 'BRL', 'USD').
const HOME_CURRENCY: string = 'USD'

// {{DEST_CURRENCY}} — ISO 4217 code of destination currency (e.g. 'JPY', 'EUR', 'TRY').
const DEST_CURRENCY: string = 'USD'

// {{SECONDARY_CURRENCY}} — optional second reference (e.g. 'USD' when destination is BRL).
const SECONDARY_CURRENCY: string = 'EUR'

export interface ExchangeRates {
  dest: number          // 1 HOME = N DEST
  secondary: number     // 1 HOME = N SECONDARY
  date: string
  source: 'frankfurter' | 'open.er-api' | 'fallback'
  isFallback: boolean
}

const FALLBACK: ExchangeRates = {
  dest: 1,
  secondary: 1,
  date: 'fallback',
  source: 'fallback',
  isFallback: true,
}

async function tryFrankfurter(signal: AbortSignal): Promise<ExchangeRates> {
  const url = `https://api.frankfurter.app/latest?from=${HOME_CURRENCY}&to=${DEST_CURRENCY},${SECONDARY_CURRENCY}`
  const r = await fetch(url, { signal })
  if (!r.ok) throw new Error('fr-http')
  const json = await r.json()
  const dest = json?.rates?.[DEST_CURRENCY] ?? (HOME_CURRENCY === DEST_CURRENCY ? 1 : undefined)
  const secondary = json?.rates?.[SECONDARY_CURRENCY] ?? (HOME_CURRENCY === SECONDARY_CURRENCY ? 1 : undefined)
  if (typeof dest !== 'number' || typeof secondary !== 'number') throw new Error('fr-shape')
  return { dest, secondary, date: json.date ?? '—', source: 'frankfurter', isFallback: false }
}

async function tryOpenER(signal: AbortSignal): Promise<ExchangeRates> {
  const r = await fetch(`https://open.er-api.com/v6/latest/${HOME_CURRENCY}`, { signal })
  if (!r.ok) throw new Error('oer-http')
  const json = await r.json()
  const dest = json?.rates?.[DEST_CURRENCY]
  const secondary = json?.rates?.[SECONDARY_CURRENCY]
  const date = json?.time_last_update_utc?.slice(0, 16) ?? '—'
  if (typeof dest !== 'number' || typeof secondary !== 'number') throw new Error('oer-shape')
  return { dest, secondary, date, source: 'open.er-api', isFallback: false }
}

export function useExchange(): { rates: ExchangeRates | null; loading: boolean } {
  const [rates, setRates] = useState<ExchangeRates | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    const ctrl = new AbortController()
    const t = setTimeout(() => ctrl.abort(), 8000)

    ;(async () => {
      try {
        const r = await tryFrankfurter(ctrl.signal)
        if (!cancelled) setRates(r)
      } catch {
        try {
          const r = await tryOpenER(ctrl.signal)
          if (!cancelled) setRates(r)
        } catch {
          if (!cancelled) setRates(FALLBACK)
        }
      } finally {
        clearTimeout(t)
        if (!cancelled) setLoading(false)
      }
    })()

    return () => {
      cancelled = true
      ctrl.abort()
      clearTimeout(t)
    }
  }, [])

  return { rates, loading }
}

// Currency codes exposed for label rendering. Replace via placeholders above.
export const CURRENCIES = {
  home: HOME_CURRENCY,
  dest: DEST_CURRENCY,
  secondary: SECONDARY_CURRENCY,
}

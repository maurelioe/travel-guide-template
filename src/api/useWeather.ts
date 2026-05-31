import { useEffect, useState } from 'react'
import type { ForecastDay } from '../types'

export interface WeatherSnapshot {
  tempC: number
  feelsLikeC: number
  condition: string
  emoji: string
  humidity: number
  source: 'wttr.in' | 'open-meteo' | 'fallback'
  isFallback: boolean
  forecast: ForecastDay[]
}

const FALLBACK: WeatherSnapshot = {
  tempC: 20,
  feelsLikeC: 20,
  condition: '{{WEATHER_FALLBACK_CONDITION}}',
  emoji: '🌡️',
  humidity: 50,
  source: 'fallback',
  isFallback: true,
  forecast: [],
}

// {{DESTINATION_COORDS}} — replace with destination cities and lat/lon.
// Keys are referenced by useWeather(cityKey) — default is 'destination'.
const COORDS: Record<string, { lat: number; lon: number }> = {
  destination: { lat: 0, lon: 0 },
}

function emojiFromCondition(text: string): string {
  const t = text.toLowerCase()
  if (t.includes('snow')) return '🌨️'
  if (t.includes('rain') || t.includes('shower')) return '🌧️'
  if (t.includes('thunder')) return '⛈️'
  if (t.includes('overcast') || t.includes('cloud')) return '☁️'
  if (t.includes('mist') || t.includes('fog') || t.includes('haze')) return '🌫️'
  if (t.includes('clear') || t.includes('sun')) return '☀️'
  if (t.includes('partly')) return '⛅'
  return '🌡️'
}

// Open-Meteo WMO weather codes → readable text
const wmoMap: Record<number, { text: string; emoji: string }> = {
  0:  { text: 'Céu limpo',          emoji: '☀️' },
  1:  { text: 'Parcialmente claro',  emoji: '🌤️' },
  2:  { text: 'Parcialmente nublado', emoji: '⛅' },
  3:  { text: 'Encoberto',           emoji: '☁️' },
  45: { text: 'Nevoeiro',            emoji: '🌫️' },
  48: { text: 'Nevoeiro com geada',  emoji: '🌫️' },
  51: { text: 'Chuvisco leve',       emoji: '🌦️' },
  53: { text: 'Chuvisco moderado',   emoji: '🌦️' },
  55: { text: 'Chuvisco intenso',    emoji: '🌧️' },
  61: { text: 'Chuva leve',          emoji: '🌧️' },
  63: { text: 'Chuva moderada',      emoji: '🌧️' },
  65: { text: 'Chuva forte',         emoji: '🌧️' },
  71: { text: 'Neve leve',           emoji: '🌨️' },
  73: { text: 'Neve moderada',       emoji: '🌨️' },
  75: { text: 'Neve forte',          emoji: '❄️' },
  77: { text: 'Granizo',             emoji: '🌨️' },
  80: { text: 'Pancadas leves',      emoji: '🌦️' },
  81: { text: 'Pancadas moderadas',  emoji: '🌧️' },
  82: { text: 'Pancadas violentas',  emoji: '⛈️' },
  95: { text: 'Trovoada',            emoji: '⛈️' },
}

async function tryWttr(city: string, signal: AbortSignal): Promise<WeatherSnapshot> {
  const r = await fetch(`https://wttr.in/${encodeURIComponent(city)}?format=j1`, { signal })
  if (!r.ok) throw new Error('wttr-http')
  const json = await r.json()
  const cur = json?.current_condition?.[0]
  if (!cur) throw new Error('wttr-shape')
  const condition = cur.lang_pt?.[0]?.value ?? cur.weatherDesc?.[0]?.value ?? 'Indefinido'

  // wttr.in retorna até 3 dias de forecast em json.weather[]
  const forecast: ForecastDay[] = []
  if (Array.isArray(json?.weather)) {
    for (const d of json.weather.slice(0, 7)) {
      const desc = d.hourly?.[4]?.weatherDesc?.[0]?.value ?? d.hourly?.[0]?.weatherDesc?.[0]?.value ?? 'Indefinido'
      forecast.push({
        date: d.date,
        tempMaxC: Number(d.maxtempC),
        tempMinC: Number(d.mintempC),
        precipitationProb: Number(d.hourly?.[4]?.chanceofrain ?? d.hourly?.[0]?.chanceofrain ?? 0),
        condition: desc,
        emoji: emojiFromCondition(desc),
      })
    }
  }

  return {
    tempC: Number(cur.temp_C),
    feelsLikeC: Number(cur.FeelsLikeC),
    condition,
    emoji: emojiFromCondition(cur.weatherDesc?.[0]?.value ?? ''),
    humidity: Number(cur.humidity),
    source: 'wttr.in',
    isFallback: false,
    forecast,
  }
}

async function tryOpenMeteo(city: string, signal: AbortSignal): Promise<WeatherSnapshot> {
  const c = COORDS[city] ?? COORDS.destination
  const url =
    `https://api.open-meteo.com/v1/forecast?latitude=${c.lat}&longitude=${c.lon}` +
    `&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code` +
    `&daily=temperature_2m_max,temperature_2m_min,weather_code,precipitation_probability_max` +
    `&forecast_days=7&timezone=UTC` // {{TIMEZONE}} — match destination IANA tz, URL-encoded
  const r = await fetch(url, { signal })
  if (!r.ok) throw new Error('om-http')
  const json = await r.json()
  const cur = json?.current
  if (!cur) throw new Error('om-shape')
  const wmo = wmoMap[Number(cur.weather_code)] ?? { text: 'Indefinido', emoji: '🌡️' }

  const forecast: ForecastDay[] = []
  const daily = json?.daily
  if (daily?.time && Array.isArray(daily.time)) {
    for (let i = 0; i < daily.time.length && i < 7; i++) {
      const code = Number(daily.weather_code[i])
      const w = wmoMap[code] ?? { text: 'Indefinido', emoji: '🌡️' }
      forecast.push({
        date: String(daily.time[i]),
        tempMaxC: Math.round(Number(daily.temperature_2m_max[i])),
        tempMinC: Math.round(Number(daily.temperature_2m_min[i])),
        precipitationProb: Math.round(Number(daily.precipitation_probability_max?.[i] ?? 0)),
        condition: w.text,
        emoji: w.emoji,
      })
    }
  }

  return {
    tempC: Math.round(Number(cur.temperature_2m)),
    feelsLikeC: Math.round(Number(cur.apparent_temperature)),
    condition: wmo.text,
    emoji: wmo.emoji,
    humidity: Math.round(Number(cur.relative_humidity_2m)),
    source: 'open-meteo',
    isFallback: false,
    forecast,
  }
}

export function useWeather(city = 'destination'): { data: WeatherSnapshot | null; loading: boolean } {
  const [data, setData] = useState<WeatherSnapshot | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    const ctrl = new AbortController()
    const t = setTimeout(() => ctrl.abort(), 8000)

    ;(async () => {
      try {
        const w = await tryOpenMeteo(city, ctrl.signal)
        if (!cancelled) setData(w)
      } catch {
        try {
          const w = await tryWttr(city, ctrl.signal)
          if (!cancelled) setData(w)
        } catch {
          if (!cancelled) setData(FALLBACK)
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
  }, [city])

  return { data, loading }
}

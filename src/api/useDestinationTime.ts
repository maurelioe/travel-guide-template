import { useEffect, useState } from 'react'

// {{TIMEZONE}} — replace with destination's IANA tz (e.g. 'Asia/Tokyo', 'Europe/Istanbul').
// 'UTC' is a safe default that won't throw at runtime.
const DESTINATION_TZ = 'UTC'

// {{HOME_TIMEZONE}} — replace with traveler's home tz (e.g. 'America/Sao_Paulo').
const HOME_TZ = 'UTC'

export interface TimeSnapshot {
  home: string
  destination: string
  diffHours: number
  destinationDate: string
  isWeekendHome: boolean
}

function format(date: Date, tz: string): string {
  return new Intl.DateTimeFormat('en', {
    timeZone: tz,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  }).format(date)
}

function formatDate(date: Date, tz: string): string {
  return new Intl.DateTimeFormat('en', {
    timeZone: tz,
    weekday: 'short',
    day: '2-digit',
    month: 'short',
  }).format(date)
}

function getOffsetHours(date: Date, tz: string): number {
  const dtf = new Intl.DateTimeFormat('en-US', {
    timeZone: tz,
    hour12: false,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  })
  const parts = dtf.formatToParts(date).reduce<Record<string, string>>((acc, p) => {
    if (p.type !== 'literal') acc[p.type] = p.value
    return acc
  }, {})
  const asUtc = Date.UTC(
    Number(parts.year),
    Number(parts.month) - 1,
    Number(parts.day),
    Number(parts.hour),
    Number(parts.minute),
    Number(parts.second),
  )
  return Math.round((asUtc - date.getTime()) / (1000 * 60 * 60))
}

export function useDestinationTime(): TimeSnapshot {
  const [, force] = useState(0)

  useEffect(() => {
    const i = setInterval(() => force((x) => x + 1), 1000)
    return () => clearInterval(i)
  }, [])

  const now = new Date()
  const destOffset = getOffsetHours(now, DESTINATION_TZ)
  const homeOffset = getOffsetHours(now, HOME_TZ)
  const diffHours = destOffset - homeOffset
  const day = now.getDay()

  return {
    home: format(now, HOME_TZ),
    destination: format(now, DESTINATION_TZ),
    diffHours,
    destinationDate: formatDate(now, DESTINATION_TZ),
    isWeekendHome: day === 0 || day === 6,
  }
}

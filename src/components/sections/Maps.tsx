import { useEffect, useMemo, useRef, useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import L from 'leaflet'
import { mapPoints } from '../../data/mapPoints'
import { Badge } from '../ui/Badge'
import { PageTransition } from '../layout/PageTransition'
import { useAppStore } from '../../store/useAppStore'
import type { City, MapPoint } from '../../types'

// City centers derived dynamically from mapPoints — first POI per city seeds its center.
// Template users only need to populate mapPoints with real coordinates.

function emojiIcon(emoji: string, highlighted = false) {
  const scale = highlighted ? 1.6 : 1
  const glow = highlighted
    ? `filter: drop-shadow(0 0 8px rgba(201,168,76,0.9)) drop-shadow(0 2px 4px rgba(0,0,0,0.6));`
    : `filter: drop-shadow(0 2px 4px rgba(0,0,0,0.6));`
  return L.divIcon({
    className: 'jp-marker',
    html: `<div style="font-size: ${22 * scale}px; line-height: 1; transform: translate(-50%, -100%); display: inline-block; ${glow}">${emoji}</div>`,
    iconSize: [28 * scale, 28 * scale],
    iconAnchor: [14 * scale, 28 * scale],
  })
}

const categories: ('all' | MapPoint['category'])[] = [
  'all', 'temple', 'food', 'park', 'shopping', 'hotel', 'transport', 'attraction',
]

const categoryLabel: Record<MapPoint['category'], string> = {
  temple: '⛩️ Temples',
  food: '🍣 Food',
  park: '🌳 Parks',
  shopping: '🛍️ Shopping',
  hotel: '🏨 Hotels',
  transport: '🚆 Transport',
  attraction: '🏙️ Attractions',
}

function Recenter({ center, zoom }: { center: [number, number]; zoom: number }) {
  const map = useMap()
  useEffect(() => {
    map.flyTo(center, zoom, { duration: 1 })
  }, [map, center, zoom])
  return null
}

export function Maps() {
  const highlightId = useAppStore((s) => s.highlightedMapPoint)
  const setHighlight = useAppStore((s) => s.setHighlightedMapPoint)
  const highlighted = useMemo(
    () => (highlightId ? mapPoints.find((m) => m.id === highlightId) : null),
    [highlightId],
  )

  // Derive cityCenter dynamically from mapPoints — first POI per city seeds its coords.
  const cityCenter = useMemo(() => {
    const m: Record<string, [number, number]> = {}
    for (const p of mapPoints) if (!m[p.city]) m[p.city] = p.coordinates
    return m
  }, [])
  const cities = useMemo(() => Object.keys(cityCenter), [cityCenter])
  const defaultCity = cities[0] ?? ''

  const [city, setCity] = useState<City>(highlighted?.city ?? defaultCity)
  const [cat, setCat] = useState<'all' | MapPoint['category']>('all')
  const popupRefs = useRef<Map<string, L.Popup>>(new Map())

  // When user changes city manually, clear highlight to avoid refly
  const onCityClick = (c: City) => {
    if (highlightId) setHighlight(null)
    setCity(c)
  }

  const visible = useMemo(
    () => mapPoints.filter((p) => (cat === 'all' || p.category === cat || p.id === highlightId)),
    [cat, highlightId],
  )

  // Após render, se houver highlight, abrir o popup correspondente
  useEffect(() => {
    if (!highlightId) return
    const t = setTimeout(() => {
      const popup = popupRefs.current.get(highlightId)
      // _map é protected, mas leaflet tipa popup como tendo método openOn(map)
      // Como o popup já está associado, podemos chamar open() (alias) ou usar (popup as any)._map
      const internalMap = (popup as unknown as { _map?: L.Map })?._map
      if (popup && internalMap) popup.openOn(internalMap)
    }, 1100) // espera o flyTo terminar
    return () => clearTimeout(t)
  }, [highlightId])

  // Limpa o highlight quando o usuário sair da tela
  useEffect(() => {
    return () => {
      if (useAppStore.getState().highlightedMapPoint) {
        useAppStore.getState().setHighlightedMapPoint(null)
      }
    }
  }, [])

  const center: [number, number] = highlighted ? highlighted.coordinates : (cityCenter[city] ?? [0, 0])
  const zoom = highlighted ? 14 : 12

  return (
    <PageTransition sectionKey="maps">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div className="flex flex-wrap gap-1.5">
          {(cities as City[]).map((c) => (
            <button
              key={c}
              onClick={() => onCityClick(c)}
              className={`text-[11px] px-2.5 py-1 rounded-full border uppercase tracking-wider ${
                !highlightId && city === c
                  ? 'bg-[var(--accent-dim)] text-[var(--accent-soft)] border-[var(--border-accent)]'
                  : 'text-[var(--text-secondary)] border-white/10 hover:bg-white/[0.04]'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap gap-1.5">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setCat(c)}
              className={`text-[11px] px-2.5 py-1 rounded-full border ${
                cat === c
                  ? 'bg-white/[0.08] text-[var(--text-primary)] border-white/20'
                  : 'text-[var(--text-muted)] border-white/[0.06] hover:bg-white/[0.04]'
              }`}
            >
              {c === 'all' ? 'todas' : categoryLabel[c]}
            </button>
          ))}
        </div>
      </div>

      {highlighted && (
        <div className="mb-3 flex items-center gap-2 rounded-xl border border-[var(--border-accent)] bg-[var(--accent-dim)] px-3 py-2 text-xs">
          <span className="text-lg">{highlighted.emoji}</span>
          <div className="flex-1 min-w-0">
            <span className="text-[var(--accent-soft)] font-medium">{highlighted.name}</span>
            <span className="text-[var(--text-muted)]"> · vindo do Roteiro</span>
          </div>
          <button
            onClick={() => setHighlight(null)}
            className="text-[10px] uppercase tracking-wider text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
          >
            limpar
          </button>
        </div>
      )}

      <div className="rounded-2xl overflow-hidden border border-white/[0.06] bg-[var(--bg-surface)]">
        <MapContainer
          center={center}
          zoom={zoom}
          style={{ height: 'min(72vh, 720px)', width: '100%' }}
          scrollWheelZoom
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Recenter center={center} zoom={zoom} />
          {visible.map((p) => {
            const isH = p.id === highlightId
            return (
              <Marker
                key={p.id}
                position={p.coordinates}
                icon={emojiIcon(p.emoji, isH)}
                zIndexOffset={isH ? 1000 : 0}
              >
                <Popup
                  ref={(ref) => {
                    if (ref) popupRefs.current.set(p.id, ref)
                    else popupRefs.current.delete(p.id)
                  }}
                >
                  <div style={{ minWidth: 200 }}>
                    <div style={{ display: 'flex', gap: 6, alignItems: 'center', marginBottom: 4 }}>
                      <span style={{ fontSize: 18 }}>{p.emoji}</span>
                      <strong style={{ color: 'var(--text-primary)' }}>{p.name}</strong>
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                      {p.city} · {p.category}
                    </div>
                    <div style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.45 }}>
                      {p.description}
                    </div>
                  </div>
                </Popup>
              </Marker>
            )
          })}
        </MapContainer>
      </div>

      <div className="mt-4 text-xs text-[var(--text-muted)] flex items-center gap-2">
        <Badge tone="gold">{visible.length}</Badge>
        <span>pontos visíveis · centro: {highlighted?.city ?? city}</span>
      </div>
    </PageTransition>
  )
}

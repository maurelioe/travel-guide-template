# Travel Guide Template

Premium-feel single-page travel-guide template. Fork it, replace the placeholders, and you have a private travel app for any destination.

Originally extracted from a 20-day Japan trip planner — all destination-specific content has been stripped and replaced with `{{PLACEHOLDER}}` tokens.

## Stack

- **Vite + React 18 + TypeScript**
- **TailwindCSS v4** (CSS-first via `@tailwindcss/vite`)
- **Zustand** (state + localStorage persistence)
- **Framer Motion** (page transitions, animated cards)
- **React-Leaflet** (interactive maps over OpenStreetMap tiles)
- **Lucide React** (icons)
- **jsPDF + autotable** (itinerary export to PDF)
- **qrcode** (printable A6 emergency card)

Free third-party APIs (no keys):
- **Open-Meteo** — current weather + 7-day forecast
- **wttr.in** — fallback weather
- **frankfurter.app** / **open.er-api.com** — currency exchange rates

## Quick start

```bash
git clone https://github.com/maurelioe/travel-guide-template my-trip
cd my-trip
npm install
npm run dev
```

App boots on `http://localhost:5173` — you'll see `{{DESTINATION_NAME}}` literals everywhere. That's expected: search-and-replace them per the table below.

## Project structure

```
src/
├── App.tsx                    # Shell + section routing via Zustand
├── main.tsx
├── index.css                  # Design tokens (CSS variables)
├── types/index.ts             # All TS interfaces
├── store/useAppStore.ts       # Zustand store (persist key: 'travel-guide-v1')
├── api/
│   ├── useWeather.ts          # Open-Meteo + wttr.in fallback (current + 7d forecast)
│   ├── useExchange.ts         # frankfurter + open.er-api fallback
│   └── useDestinationTime.ts  # IANA tz, home vs destination, live clock
├── data/                      # 12 files — destination-specific content
│   ├── itinerary.ts           # Day-by-day plan (morning / afternoon / night)
│   ├── checklist.ts           # Pre-trip checklist by category
│   ├── gastronomy.ts          # Dishes, snacks, drinks
│   ├── shopping.ts            # Shopping guide by category
│   ├── photoSpots.ts          # Photo locations with bestTime + tips
│   ├── mapPoints.ts           # POIs (the Maps section reads city centers from here)
│   ├── costs.ts               # Budget lines (estimated vs actual in home currency)
│   ├── safety.ts              # Etiquette / safety / emergency tips
│   ├── phrases.ts             # Phrases with phonetic spelling
│   ├── intercity.ts           # Intercity routes + passes
│   ├── incidents.ts           # Incident protocols (lost passport, sick, etc.)
│   └── parks.ts               # Theme park strategy (or [] if N/A)
└── components/
    ├── layout/                # Sidebar, TopBar, PageTransition
    ├── ui/                    # GlassCard, Badge, Skeleton, CountdownTimer, RatingStars, QREmergencyCard
    └── sections/              # 12 main sections (Dashboard, Itinerary, Parks, ...)
```

## Placeholder reference

Search-and-replace these tokens. Some are **string literals** in the rendered UI (visible as text), others are inside `// {{...}}` comments next to safe default values.

| Token | Where | Replace with |
|---|---|---|
| `{{DESTINATION_NAME}}` | Sidebar, TopBar, Dashboard hero, `<title>` | e.g. `Tokyo`, `Istanbul`, `Lisbon` |
| `{{TRIP_YEAR}}` | Sidebar header, Dashboard hero, TopBar | e.g. `2027` |
| `{{TRIP_PERIOD}}` | Sidebar subtitle | e.g. `Dec 01–20 · 20 days` |
| `{{DESTINATION_TAGLINE}}` | Dashboard hero subtitle | e.g. `Tokyo · Kyoto · Osaka — 20 days of contrasts...` |
| `{{TRIP_START_ISO}}` | `Dashboard.tsx` `TRIP_START` constant | e.g. `'2027-12-01T08:00:00+09:00'` (replace the Date arg) |
| `{{DEPARTURE_LABEL}}` | Dashboard Countdown footer | e.g. `Boarding · 01 Dec 2027 · 08:00 JST` |
| `{{TIMEZONE}}` | `useDestinationTime.ts`, `useWeather.ts` `&timezone=`, Dashboard time card | IANA tz, e.g. `Asia/Tokyo` |
| `{{HOME_TIMEZONE}}` | `useDestinationTime.ts`, Dashboard time card | IANA tz, e.g. `America/Sao_Paulo` |
| `{{TZ_ABBR}}` | TopBar clock label | e.g. `JST`, `BST`, `EST` |
| `{{HOME_CURRENCY}}` | `useExchange.ts` `HOME_CURRENCY` | ISO 4217 code, e.g. `BRL`, `USD`, `EUR` |
| `{{DEST_CURRENCY}}` | `useExchange.ts` `DEST_CURRENCY` | e.g. `JPY`, `TRY` |
| `{{SECONDARY_CURRENCY}}` | `useExchange.ts` `SECONDARY_CURRENCY` | optional second ref, e.g. `USD` |
| `{{HOME_SYMBOL}}` | Costs, IntercityCard | e.g. `R$`, `$`, `€` |
| `{{DEST_SYMBOL}}` | Costs, IntercityCard, ParkStrategy | e.g. `¥`, `₺`, `€` |
| `{{DEFAULT_CITY}}` | Dashboard weather labels | name shown next to weather widget |
| `{{DESTINATION_COORDS}}` | `useWeather.ts` `COORDS` | replace `destination: { lat, lon }` with real values |
| `{{HERO_IMAGE_URL}}` | `Dashboard.tsx` `<img src="">` | hero image URL (1920px+) |
| `{{CRITICAL_ALERT_TEXT}}` | Dashboard alert banner | text shown when trip is < 70 days away |
| `{{WEATHER_FALLBACK_CONDITION}}` | `useWeather.ts` FALLBACK | e.g. `Mild` |
| `{{CITY_A}}`, `{{CITY_B}}`, … | All `src/data/*.ts` | actual city names |
| `{{D1_*}}`, `{{D2_*}}`, … | `itinerary.ts` | per-day content (morning/afternoon/night) |
| `{{POI_*}}`, `{{SPOT_*}}`, `{{INCIDENT_*}}`, etc. | matching data files | content per item |

Coordinates in `mapPoints.ts` and `photoSpots.ts` are `[0, 0]` — replace with real lat/lon. The Maps section derives city centers from the first POI per city.

## Defaults that won't crash (but should be replaced)

These literals are **safe defaults** so the app boots without runtime errors. Replace anyway for a real trip:

- `TRIP_START = new Date('2099-01-01T08:00:00Z')` — far-future placeholder
- `DESTINATION_TZ = 'UTC'`, `HOME_TZ = 'UTC'` — valid IANA tz
- `HOME_CURRENCY = 'USD'`, `DEST_CURRENCY = 'USD'`, `SECONDARY_CURRENCY = 'EUR'` — valid ISO 4217
- `COORDS.destination = { lat: 0, lon: 0 }` — null island

## Persistence

User data (vouchers, checklist progress, costs actuals, traveler medical records, selected day) is persisted to `localStorage` under the key `'travel-guide-v1'`. Bump the key if you ship breaking schema changes.

## License

MIT (or whatever you choose) — this is a template for personal use.

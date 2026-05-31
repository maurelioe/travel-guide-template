import type { MapPoint } from '../types'

// Placeholder — replace with destination POIs. Use real coordinates so the map centers correctly.
// `id` values are referenced from itinerary.ts (mapPointId).
export const mapPoints: MapPoint[] = [
  { id: 'm01', name: '{{POI_1_NAME}}', city: '{{CITY_A}}', category: 'attraction', emoji: '📍', coordinates: [0, 0], description: '{{POI_1_DESC}}' },
  { id: 'm02', name: '{{POI_2_NAME}}', city: '{{CITY_A}}', category: 'food',       emoji: '🍴', coordinates: [0, 0], description: '{{POI_2_DESC}}' },
  { id: 'm03', name: '{{POI_3_NAME}}', city: '{{CITY_B}}', category: 'attraction', emoji: '📍', coordinates: [0, 0], description: '{{POI_3_DESC}}' },
]

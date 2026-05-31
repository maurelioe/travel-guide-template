import type { City } from '../types'

export interface IntercityRoute {
  id: string
  from: City
  to: City
  trainType: string
  operator: 'JR' | 'Tobu' | 'Kintetsu' | 'Hanshin' | 'Nankai' | string
  duration: string
  distance: string
  // Cost in destination currency (numeric — render with {{DEST_SYMBOL}} in UI).
  costDest: number
  // Cost in home currency (numeric — render with {{HOME_SYMBOL}} in UI).
  costHome: number
  recommendedPass?: string
  alternativeCost?: string
  whereToBuy: string[]
  howToBuy: string[]
  platformTip: string
  baggageRule?: string
  tips: string[]
  emoji: string
}

// Placeholder — replace with destination intercity routes.
export const intercityRoutes: IntercityRoute[] = [
  {
    id: 'r01',
    from: '{{CITY_A}}',
    to: '{{CITY_B}}',
    trainType: '{{TRAIN_TYPE_1}}',
    operator: 'JR',
    duration: '{{DURATION_1}}',
    distance: '0 km',
    costDest: 0,
    costHome: 0,
    whereToBuy: ['{{WHERE_TO_BUY_1}}'],
    howToBuy: ['{{HOW_TO_BUY_1}}'],
    platformTip: '{{PLATFORM_TIP_1}}',
    tips: ['{{INTERCITY_TIP_1}}'],
    emoji: '🚄',
  },
  {
    id: 'r02',
    from: '{{CITY_B}}',
    to: '{{CITY_A}}',
    trainType: '{{TRAIN_TYPE_2}}',
    operator: 'JR',
    duration: '{{DURATION_2}}',
    distance: '0 km',
    costDest: 0,
    costHome: 0,
    whereToBuy: ['{{WHERE_TO_BUY_2}}'],
    howToBuy: ['{{HOW_TO_BUY_2}}'],
    platformTip: '{{PLATFORM_TIP_2}}',
    tips: ['{{INTERCITY_TIP_2}}'],
    emoji: '🚆',
  },
]

export interface PassOption {
  id: string
  name: string
  validity: string
  // Price in destination currency.
  priceDest: number
  // Price in home currency.
  priceHome: number
  coverage: string[]
  worthIt: 'sim' | 'parcial' | 'não'
  recommendation: string
}

export const passOptions: PassOption[] = [
  {
    id: 'pass-01',
    name: '{{PASS_1_NAME}}',
    validity: '{{PASS_1_VALIDITY}}',
    priceDest: 0,
    priceHome: 0,
    coverage: ['{{PASS_1_COVERAGE}}'],
    worthIt: 'sim',
    recommendation: '{{PASS_1_RECOMMENDATION}}',
  },
]

import type { ParkGuide } from '../types'

// Placeholder — replace or set to [] if destination has no theme parks.
export const parks: ParkGuide[] = [
  {
    id: 'park-01',
    name: '{{PARK_1_NAME}}',
    shortName: '{{PARK_1_SHORT}}',
    emoji: '🎢',
    heroImage: '',
    city: '{{CITY_A}}',
    openingHour: '{{PARK_1_OPEN}}',
    closingHour: '{{PARK_1_CLOSE}}',
    ticketWindow: {
      when: '{{PARK_1_TICKET_WHEN}}',
      where: '{{PARK_1_TICKET_WHERE}}',
      costDest: '{{PARK_1_COST_DEST}}',
      costHome: '{{PARK_1_COST_HOME}}',
      tip: '{{PARK_1_TICKET_TIP}}',
    },
    mustDoOrder: [
      { priority: 1, attraction: '{{PARK_1_ATTRACTION_1}}', why: '{{PARK_1_WHY_1}}', expressPass: true },
      { priority: 2, attraction: '{{PARK_1_ATTRACTION_2}}', why: '{{PARK_1_WHY_2}}' },
    ],
    expressPassTier: ['{{PARK_1_EP_1}}'],
    requiredApps: [
      { name: '{{PARK_1_APP_NAME}}', purpose: '{{PARK_1_APP_PURPOSE}}', platform: 'iOS/Android' },
    ],
    ropeDropTactic: '{{PARK_1_ROPE_DROP}}',
    foodStrategy: ['{{PARK_1_FOOD_1}}'],
    exitStrategy: '{{PARK_1_EXIT}}',
    criticalAlerts: ['{{PARK_1_ALERT}}'],
  },
]

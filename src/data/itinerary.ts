import type { DayActivity } from '../types'

// Placeholder days — 3 minimum-viable entries.
// Replace each field with destination-specific content. Keep the shape.
export const itinerary: DayActivity[] = [
  {
    id: 'd01',
    dayNumber: 1,
    date: '{{DATE_D1}}',
    city: '{{CITY_A}}',
    highlight: '{{HIGHLIGHT_D1}}',
    emoji: '✈️',
    heroImage: '',
    morning: {
      mapPointId: 'm01',
      title: '{{D1_MORNING_TITLE}}',
      description: '{{D1_MORNING_DESC}}',
      howToGet: '{{D1_MORNING_HOW}}',
      meal: '{{D1_MORNING_MEAL}}',
      tip: '{{D1_MORNING_TIP}}',
      planB: '{{D1_MORNING_PLAN_B}}',
    },
    afternoon: {
      title: '{{D1_AFTERNOON_TITLE}}',
      description: '{{D1_AFTERNOON_DESC}}',
      howToGet: '{{D1_AFTERNOON_HOW}}',
      meal: '{{D1_AFTERNOON_MEAL}}',
      tip: '{{D1_AFTERNOON_TIP}}',
    },
    night: {
      title: '{{D1_NIGHT_TITLE}}',
      description: '{{D1_NIGHT_DESC}}',
      howToGet: '{{D1_NIGHT_HOW}}',
      meal: '{{D1_NIGHT_MEAL}}',
    },
    dailyTip: '{{D1_DAILY_TIP}}',
  },
  {
    id: 'd02',
    dayNumber: 2,
    date: '{{DATE_D2}}',
    city: '{{CITY_A}}',
    highlight: '{{HIGHLIGHT_D2}}',
    emoji: '🗺️',
    heroImage: '',
    morning: {
      mapPointId: 'm02',
      title: '{{D2_MORNING_TITLE}}',
      description: '{{D2_MORNING_DESC}}',
      howToGet: '{{D2_MORNING_HOW}}',
      meal: '{{D2_MORNING_MEAL}}',
    },
    afternoon: {
      title: '{{D2_AFTERNOON_TITLE}}',
      description: '{{D2_AFTERNOON_DESC}}',
    },
    night: {
      title: '{{D2_NIGHT_TITLE}}',
      description: '{{D2_NIGHT_DESC}}',
    },
    dailyTip: '{{D2_DAILY_TIP}}',
  },
  {
    id: 'd03',
    dayNumber: 3,
    date: '{{DATE_D3}}',
    city: '{{CITY_B}}',
    highlight: '{{HIGHLIGHT_D3}}',
    emoji: '🛫',
    heroImage: '',
    morning: {
      mapPointId: 'm03',
      title: '{{D3_MORNING_TITLE}}',
      description: '{{D3_MORNING_DESC}}',
      howToGet: '{{D3_MORNING_HOW}}',
    },
    afternoon: {
      title: '{{D3_AFTERNOON_TITLE}}',
      description: '{{D3_AFTERNOON_DESC}}',
    },
    night: {
      title: '{{D3_NIGHT_TITLE}}',
      description: '{{D3_NIGHT_DESC}}',
    },
    dailyTip: '{{D3_DAILY_TIP}}',
  },
]

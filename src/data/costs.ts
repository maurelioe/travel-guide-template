import type { CostItem } from '../types'

// Placeholder — replace with destination cost lines (amounts in home currency).
export const costs: CostItem[] = [
  { id: 'c01', category: 'flight',        description: '{{COST_FLIGHT_DESC}}',   estimatedHome: 0, paid: false },
  { id: 'c02', category: 'accommodation', description: '{{COST_HOTEL_DESC}}',    estimatedHome: 0, paid: false },
  { id: 'c03', category: 'food',          description: '{{COST_FOOD_DESC}}',     estimatedHome: 0, paid: false },
  { id: 'c04', category: 'transport',     description: '{{COST_TRANSPORT_DESC}}', estimatedHome: 0, paid: false },
  { id: 'c05', category: 'misc',          description: '{{COST_MISC_DESC}}',     estimatedHome: 0, paid: false },
]

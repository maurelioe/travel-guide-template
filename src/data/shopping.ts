import type { ShopGuide } from '../types'

// Placeholder — replace with destination shopping categories.
export const shopping: ShopGuide[] = [
  { id: 's01', category: 'electronics', emoji: '⚡', title: '{{SHOP_ELECTRONICS}}', where: ['{{STORE_1}}', '{{STORE_2}}'], tips: ['{{SHOP_TIP_1}}'], budget: '{{BUDGET_RANGE}}', taxFree: true },
  { id: 's02', category: 'fashion',     emoji: '👕', title: '{{SHOP_FASHION}}',     where: ['{{STORE_3}}'],               tips: ['{{SHOP_TIP_2}}'], budget: '{{BUDGET_RANGE}}', taxFree: true },
  { id: 's03', category: 'souvenirs',   emoji: '🎁', title: '{{SHOP_SOUVENIRS}}',   where: ['{{STORE_4}}'],               tips: ['{{SHOP_TIP_3}}'], budget: '{{BUDGET_RANGE}}', taxFree: false },
]

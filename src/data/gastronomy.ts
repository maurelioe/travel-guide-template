import type { FoodItem } from '../types'

// Placeholder — replace with destination dishes / snacks / drinks.
export const gastronomy: FoodItem[] = [
  { id: 'f01', name: '{{DISH_1_NAME}}',  nameJP: '{{DISH_1_NATIVE}}',  category: 'prato',  rating: 'imperdivel', where: '{{DISH_1_WHERE}}',  description: '{{DISH_1_DESC}}',  emoji: '🍽️', mustTry: true },
  { id: 'f02', name: '{{SNACK_1_NAME}}', nameJP: '{{SNACK_1_NATIVE}}', category: 'snack',  rating: 'otimo',      where: '{{SNACK_1_WHERE}}', description: '{{SNACK_1_DESC}}', emoji: '🥨', mustTry: false },
  { id: 'f03', name: '{{DRINK_1_NAME}}', nameJP: '{{DRINK_1_NATIVE}}', category: 'bebida', rating: 'bom',        where: '{{DRINK_1_WHERE}}', description: '{{DRINK_1_DESC}}', emoji: '🥤', mustTry: false },
]

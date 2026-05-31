import type { SafetyTip } from '../types'

// Placeholder — replace with destination-specific safety / etiquette tips.
export const safety: SafetyTip[] = [
  { id: 'sf01', category: 'social',    emoji: '🤝', title: '{{SAFETY_SOCIAL_TITLE}}',    description: '{{SAFETY_SOCIAL_DESC}}' },
  { id: 'sf02', category: 'etiquette', emoji: '🍽️', title: '{{SAFETY_ETIQUETTE_TITLE}}', description: '{{SAFETY_ETIQUETTE_DESC}}' },
  { id: 'sf03', category: 'emergency', emoji: '🆘', title: '{{SAFETY_EMERGENCY_TITLE}}', description: '{{SAFETY_EMERGENCY_DESC}}', critical: true },
]

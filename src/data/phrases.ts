export type PhraseCategory =
  | 'greetings'
  | 'polite'
  | 'restaurant'
  | 'transport'
  | 'shopping'
  | 'hotel'
  | 'directions'
  | 'emergency'

export interface PhraseItem {
  id: string
  category: PhraseCategory
  // Text in destination's native script.
  jp: string
  // Standard romanization (or empty if same script as native English).
  romaji: string
  // Phonetic spelling using home-language phonemes.
  ptBR: string
  meaning: string
  context?: string
}

// Placeholder — replace with destination-language essentials.
export const phrases: PhraseItem[] = [
  { id: 'g01', category: 'greetings', jp: '{{HELLO_NATIVE}}',  romaji: '{{HELLO_ROMANIZED}}',  ptBR: '{{HELLO_PHONETIC}}',  meaning: 'Hello',     context: 'Universal greeting' },
  { id: 'p01', category: 'polite',    jp: '{{THANKS_NATIVE}}', romaji: '{{THANKS_ROMANIZED}}', ptBR: '{{THANKS_PHONETIC}}', meaning: 'Thank you', context: 'Default thanks' },
  { id: 'p02', category: 'polite',    jp: '{{PLEASE_NATIVE}}', romaji: '{{PLEASE_ROMANIZED}}', ptBR: '{{PLEASE_PHONETIC}}', meaning: 'Please',    context: 'Used when asking' },
  { id: 'p03', category: 'polite',    jp: '{{SORRY_NATIVE}}',  romaji: '{{SORRY_ROMANIZED}}',  ptBR: '{{SORRY_PHONETIC}}',  meaning: 'Sorry / Excuse me', context: 'Apology or attention' },
  { id: 'e01', category: 'emergency', jp: '{{HELP_NATIVE}}',   romaji: '{{HELP_ROMANIZED}}',   ptBR: '{{HELP_PHONETIC}}',   meaning: 'Help me',   context: 'Call for help' },
]

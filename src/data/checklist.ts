import type { ChecklistItem } from '../types'

// Placeholder — replace with destination-specific prep items.
export const checklistData: ChecklistItem[] = [
  { id: 'doc-01', category: 'documents', label: '{{CHECK_DOC_LABEL}}',     detail: '{{CHECK_DOC_DETAIL}}',     critical: true },
  { id: 'tic-01', category: 'tickets',   label: '{{CHECK_TICKET_LABEL}}',  detail: '{{CHECK_TICKET_DETAIL}}',  critical: true },
  { id: 'trn-01', category: 'transport', label: '{{CHECK_TRANSPORT}}',     critical: false },
  { id: 'clo-01', category: 'clothes',   label: '{{CHECK_CLOTHES}}',       critical: false },
  { id: 'phr-01', category: 'pharmacy',  label: '{{CHECK_PHARMACY}}',      critical: false },
  { id: 'fin-01', category: 'financial', label: '{{CHECK_FINANCIAL}}',     critical: true },
]

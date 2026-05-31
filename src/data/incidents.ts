import type { IncidentProtocol } from '../types'

// Placeholder — replace with destination-specific incident protocols.
export const incidents: IncidentProtocol[] = [
  {
    id: 'inc-01',
    severity: 'high',
    emoji: '🚨',
    title: '{{INCIDENT_1_TITLE}}',
    scenario: '{{INCIDENT_1_SCENARIO}}',
    steps: [
      { order: 1, label: '{{INCIDENT_1_STEP_1}}', detail: '{{INCIDENT_1_STEP_1_DETAIL}}' },
      { order: 2, label: '{{INCIDENT_1_STEP_2}}' },
      { order: 3, label: '{{INCIDENT_1_STEP_3}}' },
    ],
    requiredDocs: ['{{INCIDENT_1_DOC_1}}', '{{INCIDENT_1_DOC_2}}'],
    relatedContacts: [
      { label: '{{INCIDENT_1_CONTACT_LABEL}}', phone: '{{INCIDENT_1_CONTACT_PHONE}}', note: '{{INCIDENT_1_CONTACT_NOTE}}' },
    ],
  },
  {
    id: 'inc-02',
    severity: 'medium',
    emoji: '⚠️',
    title: '{{INCIDENT_2_TITLE}}',
    scenario: '{{INCIDENT_2_SCENARIO}}',
    steps: [
      { order: 1, label: '{{INCIDENT_2_STEP_1}}' },
      { order: 2, label: '{{INCIDENT_2_STEP_2}}' },
    ],
    requiredDocs: ['{{INCIDENT_2_DOC_1}}'],
    relatedContacts: [
      { label: '{{INCIDENT_2_CONTACT_LABEL}}', phone: '{{INCIDENT_2_CONTACT_PHONE}}' },
    ],
  },
]

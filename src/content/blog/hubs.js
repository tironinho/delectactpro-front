/**
 * Pillar / hub page definitions for topic clusters.
 * Each hub has slug, title, description, category, and linked article slugs.
 */

export const HUB_SLUGS = [
  'california-delete-act-compliance',
  'drop-api-hub',
  'data-broker-risk-center',
  'delete-act-audit-prep',
  'dsar-automation-roi-hub',
  'shadow-broker-compliance-hub'
]

export const HUB_META = {
  'california-delete-act-compliance': {
    title: 'California Delete Act Compliance Hub',
    description: 'Central resource for SB 362, DROP registry, 45-day deadlines, and mandatory enforcement.',
    category: 'A'
  },
  'drop-api-hub': {
    title: 'DROP API Integration Hub',
    description: 'Technical guides for integrating with the California DROP API: idempotency, retries, evidence.',
    category: 'B'
  },
  'data-broker-risk-center': {
    title: 'Data Broker Risk Center',
    description: 'Shadow brokers, lead gen risk, and scope assessment for data broker classification.',
    category: 'E'
  },
  'delete-act-audit-prep': {
    title: 'Delete Act Audit Readiness Hub',
    description: '2028 audits, evidence, logs, and audit packet export. Prepare for triennial audits.',
    category: 'D'
  },
  'dsar-automation-roi-hub': {
    title: 'DSAR Automation & ROI Hub',
    description: 'Manual vs automated cost, penalty exposure, and ROI of deletion automation.',
    category: 'F'
  },
  'shadow-broker-compliance-hub': {
    title: 'Shadow Broker Compliance Hub',
    description: 'Lead gen, martech, and enrichment vendors: when you are in scope for SB 362.',
    category: 'E'
  }
}

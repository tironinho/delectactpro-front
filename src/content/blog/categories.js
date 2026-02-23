/**
 * Blog category labels and taxonomy slugs.
 * Single source for category keys and URL mapping.
 */

export const BLOG_CATEGORIES = {
  A: 'SB 362 / DROP / 45 days / enforcement',
  B: 'Implementation: idempotency, retries, workflow',
  C: 'Cascading deletions & downstream partners',
  D: 'Audit 2028 & immutable logs',
  E: 'Shadow brokers & lead gen risk',
  F: 'ROI / cost & penalty scenarios',
  G: 'Procurement / vendor evaluation',
  H: 'Security / zero-knowledge / architecture'
}

/** URL slug -> category key for /blog/category/:slug */
export const BLOG_TAXONOMY_SLUGS = {
  'sb362': 'A',
  'drop-api': 'B',
  'dsar-automation': 'F',
  'audits': 'D',
  'data-broker-compliance': 'E',
  'procurement': 'G',
  'security': 'H'
}

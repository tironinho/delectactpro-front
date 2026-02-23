/**
 * Marketing attribution: UTM params + referrer.
 * Persist in sessionStorage (session) and localStorage (for checkout/backend).
 * Reuse in createCheckoutSession and lead submit.
 */

const STORAGE_KEY_UTM = 'drop_utm'
const STORAGE_KEY_LEAD = 'drop_lead'

/**
 * Read UTM and referrer from current URL, persist, return object.
 * Call on app init or before checkout.
 */
export function getMarketingAttribution() {
  if (typeof window === 'undefined') return {}
  const params = new URLSearchParams(window.location.search)
  const utm_source = params.get('utm_source') || undefined
  const utm_medium = params.get('utm_medium') || undefined
  const utm_campaign = params.get('utm_campaign') || undefined
  const utm_term = params.get('utm_term') || undefined
  const utm_content = params.get('utm_content') || undefined
  const referrer = document.referrer || undefined

  const hasUtm = utm_source || utm_medium || utm_campaign || utm_term || utm_content
  const att = {
    utm_source,
    utm_medium,
    utm_campaign,
    utm_term,
    utm_content,
    referrer
  }

  if (hasUtm || referrer) {
    try {
      sessionStorage.setItem(STORAGE_KEY_UTM, JSON.stringify(att))
      localStorage.setItem(STORAGE_KEY_UTM, JSON.stringify(att))
    } catch (_) {}
  }

  const stored = getStoredAttribution()
  return { ...stored, ...att }
}

/** Read persisted UTM from storage (for checkout when no current query). */
export function getStoredAttribution() {
  if (typeof window === 'undefined') return {}
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY_UTM) || localStorage.getItem(STORAGE_KEY_UTM)
    if (raw) return JSON.parse(raw)
  } catch (_) {}
  return {}
}

/** Get lead data (leadId, email, company) from localStorage for checkout metadata. */
export function getStoredLead() {
  if (typeof window === 'undefined') return null
  try {
    const raw = localStorage.getItem(STORAGE_KEY_LEAD)
    if (raw) return JSON.parse(raw)
  } catch (_) {}
  return null
}

/** Persist lead after Early Access submit. */
export function setStoredLead({ leadId, email, company, role }) {
  if (typeof window === 'undefined') return
  try {
    const payload = { leadId, email, company, role }
    localStorage.setItem(STORAGE_KEY_LEAD, JSON.stringify(payload))
  } catch (_) {}
}

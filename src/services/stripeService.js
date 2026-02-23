import { loadStripe } from '@stripe/stripe-js'
import { normalizeApiPath } from './apiClient.js'
import { getMarketingAttribution, getStoredLead } from '../utils/attribution.js'

const STRIPE_PK = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY

let stripePromise

export function getStripe() {
  if (!STRIPE_PK) throw new Error('Missing VITE_STRIPE_PUBLISHABLE_KEY in .env')
  if (!stripePromise) stripePromise = loadStripe(STRIPE_PK)
  return stripePromise
}

export function hasStripeKey() {
  return !!STRIPE_PK
}

/**
 * Create Stripe Checkout session. Sends planId, sourcePage, referrer, UTM, leadId, email.
 * success_url / cancel_url should be set by backend using VITE_SITE_URL or request origin.
 */
export async function createCheckoutSession({
  planId = 'setup_fee_999',
  sourcePage,
  referrer,
  utm_source,
  utm_medium,
  utm_campaign,
  utm_term,
  utm_content,
  leadId,
  email
} = {}) {
  const attribution = getMarketingAttribution()
  const lead = getStoredLead()

  const body = {
    planId,
    sourcePage: sourcePage ?? (typeof window !== 'undefined' ? window.location.pathname : undefined),
    referrer: referrer ?? attribution.referrer,
    utm_source: utm_source ?? attribution.utm_source,
    utm_medium: utm_medium ?? attribution.utm_medium,
    utm_campaign: utm_campaign ?? attribution.utm_campaign,
    utm_term: utm_term ?? attribution.utm_term,
    utm_content: utm_content ?? attribution.utm_content,
    leadId: leadId ?? lead?.leadId,
    email: email ?? lead?.email
  }

  const url = normalizeApiPath('/api/create-checkout-session')
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  })

  if (!res.ok) {
    const text = await res.text().catch(() => '')
    if (res.status === 503 || res.status === 502) throw new Error('Checkout is temporarily unavailable. Please try again in a few minutes.')
    if (res.status === 400) throw new Error(text || 'Invalid request. Check your session.')
    throw new Error(`Checkout failed: ${res.status} ${text}`)
  }

  return res.json()
}

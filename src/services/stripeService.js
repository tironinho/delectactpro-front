import { loadStripe } from '@stripe/stripe-js'

const STRIPE_PK = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY
const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4242'

let stripePromise

export function getStripe() {
  if (!STRIPE_PK) throw new Error('Missing VITE_STRIPE_PUBLISHABLE_KEY in .env')
  if (!stripePromise) stripePromise = loadStripe(STRIPE_PK)
  return stripePromise
}

export async function createCheckoutSession({ planId = 'setup_fee_999' } = {}) {
  const res = await fetch(`${API_BASE}/api/create-checkout-session`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ planId })
  })
  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(`Checkout session failed: ${res.status} ${text}`)
  }
  return res.json()
}

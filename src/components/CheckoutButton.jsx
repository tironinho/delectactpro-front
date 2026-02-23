import { useState } from 'react'
import { useLocation } from 'react-router-dom'
import Button from './ui/Button.jsx'
import { createCheckoutSession, getStripe, hasStripeKey } from '../services/stripeService.js'
import { CreditCard, AlertCircle } from 'lucide-react'

const MESSAGES = {
  no_key: 'Stripe is not configured. Add VITE_STRIPE_PUBLISHABLE_KEY to enable checkout.',
  offline: 'Checkout is temporarily unavailable. Please try again in a few minutes.',
  invalid_session: 'Session invalid or expired. Refresh the page and try again.',
  stripe_redirect: 'Stripe redirect failed. Please try again or use another payment method.',
  generic: 'Checkout failed. Please try again.'
}

function normalizeError(err) {
  const msg = err?.message || ''
  if (msg.includes('temporarily unavailable') || msg.includes('503') || msg.includes('502')) return 'offline'
  if (msg.includes('Invalid request') || msg.includes('400') || msg.includes('session')) return 'invalid_session'
  if (msg.includes('Stripe') && msg.toLowerCase().includes('redirect')) return 'stripe_redirect'
  return 'generic'
}

export default function CheckoutButton({
  label = 'Checkout',
  planId = 'setup_fee_999',
  className = '',
  variant = 'primary',
  onCheckoutStarted,
  onCheckoutError
}) {
  const location = useLocation()
  const [state, setState] = useState('idle') // idle | loading | error
  const [errKey, setErrKey] = useState('generic')

  async function onCheckout() {
    if (!hasStripeKey()) {
      setErrKey('no_key')
      setState('error')
      onCheckoutError?.(new Error(MESSAGES.no_key))
      return
    }

    setState('loading')
    setErrKey('generic')
    onCheckoutStarted?.()

    try {
      const session = await createCheckoutSession({
        planId,
        sourcePage: location.pathname
      })
      if (!session?.id) {
        setErrKey('invalid_session')
        setState('error')
        onCheckoutError?.(new Error(MESSAGES.invalid_session))
        return
      }
      const stripe = await getStripe()
      const { error } = await stripe.redirectToCheckout({ sessionId: session.id })
      if (error) {
        setErrKey('stripe_redirect')
        setState('error')
        onCheckoutError?.(error)
        return
      }
    } catch (e) {
      const key = normalizeError(e)
      setErrKey(key)
      setState('error')
      onCheckoutError?.(e)
    }
  }

  const message = MESSAGES[errKey] || MESSAGES.generic

  return (
    <div className={className}>
      <Button
        type="button"
        variant={variant}
        onClick={onCheckout}
        disabled={state === 'loading'}
        aria-busy={state === 'loading'}
        className="w-full focus:ring-2 focus:ring-regulatory-500/40 focus:ring-offset-2 focus:ring-offset-slate-950"
      >
        <CreditCard className="h-4 w-4" />
        {state === 'loading' ? 'Redirecting to checkout…' : label}
      </Button>
      {state === 'error' && (
        <div className="mt-2 flex items-start gap-2 rounded-xl border border-danger-500/30 bg-danger-500/10 px-3 py-2 text-xs text-danger-200">
          <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
          <span>{message}</span>
        </div>
      )}
      {state === 'idle' && (
        <p className="mt-2 text-[11px] text-slate-500">Stripe hosted checkout. Invoice/receipt available after payment.</p>
      )}
    </div>
  )
}

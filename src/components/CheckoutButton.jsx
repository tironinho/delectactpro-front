import { useState } from 'react'
import Button from './ui/Button.jsx'
import { createCheckoutSession, getStripe } from '../services/stripeService.js'
import { CreditCard } from 'lucide-react'

export default function CheckoutButton({ label = 'Checkout', planId = 'setup_fee_999', className = '', variant = 'primary' }) {
  const [loading, setLoading] = useState(false)
  const [err, setErr] = useState('')

  async function onCheckout() {
    setErr('')
    setLoading(true)
    try {
      const session = await createCheckoutSession({ planId })
      const stripe = await getStripe()
      const { error } = await stripe.redirectToCheckout({ sessionId: session.id })
      if (error) setErr(error.message || 'Stripe redirect failed.')
    } catch (e) {
      setErr(e?.message || 'Checkout failed.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={className}>
      <Button type="button" variant={variant} onClick={onCheckout} disabled={loading} className="w-full">
        <CreditCard className="h-4 w-4" />
        {loading ? 'Redirecting…' : label}
      </Button>
      {err ? <div className="mt-2 text-xs text-danger-200">{err}</div> : null}
      <div className="mt-2 text-[11px] text-slate-500">Uses Stripe Checkout. Configure keys in <span className="font-mono">.env</span>.</div>
    </div>
  )
}

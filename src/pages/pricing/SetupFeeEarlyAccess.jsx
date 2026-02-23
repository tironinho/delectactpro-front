import { Link } from 'react-router-dom'
import Container from '../../components/Container.jsx'
import Seo from '../../components/Seo.jsx'
import Button from '../../components/ui/Button.jsx'
import CheckoutButton from '../../components/CheckoutButton.jsx'

export default function SetupFeeEarlyAccess() {
  return (
    <main className="min-h-screen bg-slate-950">
      <Seo
        title="Setup Fee & Early Access — DROP Compliance Gateway"
        description="One-time setup fee for priority onboarding: DROP sandbox readiness, evidence blueprint, cascade templates. Limited to first 100 clients."
        canonicalPath="/pricing/setup-fee-early-access"
      />
      <Container className="py-16 md:py-24">
        <h1 className="text-4xl font-extrabold tracking-tight text-slate-50">Setup Fee & Early Access</h1>
        <p className="mt-4 max-w-2xl text-lg text-slate-300">
          Secure one of the first 100 priority onboarding slots. Spring 2026 API sandbox readiness.
        </p>
        <ul className="mt-6 space-y-2 text-slate-300">
          <li>• Early Access onboarding + architecture review</li>
          <li>• DROP sandbox readiness plan</li>
          <li>• Evidence & logging blueprint for audits</li>
          <li>• Downstream cascade templates</li>
        </ul>
        <div className="mt-10">
          <CheckoutButton planId="setup_fee_999" label="Pay $999 setup fee (Stripe)" variant="primary" />
        </div>
        <p className="mt-6">
          <Link to="/#pricing" className="text-sm text-regulatory-300 hover:text-regulatory-200">← Back to pricing</Link>
        </p>
      </Container>
    </main>
  )
}

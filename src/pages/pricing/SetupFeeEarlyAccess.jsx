import { Link } from 'react-router-dom'
import Container from '../../components/Container.jsx'
import Seo from '../../components/Seo.jsx'
import Button from '../../components/ui/Button.jsx'

const SALES_EMAIL = 'ceo@deleteactpro.com'
const MAILTO_SUBJECT = 'DeleteActPro%20-%20Talk%20to%20Sales'

export default function SetupFeeEarlyAccess() {
  return (
    <main className="min-h-screen bg-slate-950">
      <Seo
        title="Early Access — DROP Compliance Gateway"
        description="Request custom pricing for priority onboarding: DROP sandbox readiness, evidence blueprint, cascade templates. Limited to first 100 clients."
        canonicalPath="/pricing/setup-fee-early-access"
      />
      <Container className="py-16 md:py-24">
        <h1 className="text-4xl font-extrabold tracking-tight text-slate-50">Early Access</h1>
        <p className="mt-4 max-w-2xl text-lg text-slate-300">
          Secure one of the first 100 priority onboarding slots. Spring 2026 API sandbox readiness. Request custom pricing.
        </p>
        <ul className="mt-6 space-y-2 text-slate-300">
          <li>• Early Access onboarding + architecture review</li>
          <li>• DROP sandbox readiness plan</li>
          <li>• Evidence & logging blueprint for audits</li>
          <li>• Downstream cascade templates</li>
        </ul>
        <div className="mt-10 flex flex-col items-start gap-4">
          <Button
            as="a"
            href={`mailto:${SALES_EMAIL}?subject=${MAILTO_SUBJECT}`}
            variant="primary"
            aria-label={`Contact sales at ${SALES_EMAIL}`}
          >
            Talk to Sales
          </Button>
          <p className="text-sm text-slate-500">
            <a href={`mailto:${SALES_EMAIL}`} className="text-slate-400 hover:text-slate-300 underline" aria-label={`Email ${SALES_EMAIL}`}>
              Email: {SALES_EMAIL}
            </a>
          </p>
        </div>
        <p className="mt-8">
          <Link to="/#pricing" className="text-sm text-regulatory-300 hover:text-regulatory-200">← Back to pricing</Link>
        </p>
      </Container>
    </main>
  )
}

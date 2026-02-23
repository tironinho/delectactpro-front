import { Link } from 'react-router-dom'
import Container from '../../components/Container.jsx'
import SEOHead from '../../components/SEOHead.jsx'
import Button from '../../components/ui/Button.jsx'
import { XCircle, CreditCard, HelpCircle } from 'lucide-react'

const FAQ = [
  { q: 'Will I be charged if I cancelled?', a: 'No. If you left before completing payment, no charge was made.' },
  { q: 'Can I get an invoice before paying?', a: 'We can send a quote or pro forma invoice. Contact sales@deleteactpro.com.' },
  { q: 'What payment methods are accepted?', a: 'Stripe Checkout accepts major credit cards and other methods Stripe supports in your region.' }
]

export default function BillingCancel() {
  return (
    <main className="min-h-screen bg-slate-950">
      <SEOHead
        title="Checkout cancelled — DROP Compliance Gateway"
        description="You left checkout. No charge was made. Try again or contact sales."
        canonicalPath="/billing/cancel"
        noindex={true}
      />
      <Container className="py-16 md:py-24">
        <div className="mx-auto max-w-2xl text-center">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-slate-800 ring-2 ring-slate-700">
            <XCircle className="h-9 w-9 text-slate-400" />
          </div>
          <h1 className="mt-6 text-3xl font-extrabold tracking-tight text-slate-50">
            Checkout cancelled
          </h1>
          <p className="mt-3 text-slate-300">
            You left before completing payment. No charge was made.
          </p>

          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <a href="/#pricing">
              <Button variant="primary" className="inline-flex items-center gap-2">
                <CreditCard className="h-4 w-4" /> Try again
              </Button>
            </a>
            <a href="mailto:sales@deleteactpro.com?subject=Setup%20Fee%20Inquiry">
              <Button variant="ghost">Contact sales</Button>
            </a>
            <Link to="/">
              <Button variant="ghost">Back to home</Button>
            </Link>
          </div>
        </div>

        <div className="mt-16 border-t border-slate-800 pt-12">
          <h2 className="flex items-center gap-2 text-lg font-semibold text-slate-50">
            <HelpCircle className="h-5 w-5 text-slate-400" /> Billing FAQ
          </h2>
          <dl className="mt-4 space-y-4">
            {FAQ.map(({ q, a }) => (
              <div key={q} className="rounded-xl border border-slate-800 bg-slate-950/40 px-4 py-3">
                <dt className="font-medium text-slate-200">{q}</dt>
                <dd className="mt-1 text-sm text-slate-500">{a}</dd>
              </div>
            ))}
          </dl>
        </div>
      </Container>
    </main>
  )
}

import { Check, Star, ArrowRight } from 'lucide-react'
import Section from './Section.jsx'
import Container from './Container.jsx'
import { Card, CardContent, CardFooter, CardHeader } from './ui/Card.jsx'
import Badge from './ui/Badge.jsx'
import CheckoutButton from './CheckoutButton.jsx'
import Button from './ui/Button.jsx'
import { useMemo } from 'react'

const PLANS = [
  {
    id: 'setup_fee_999',
    name: 'Setup Fee',
    price: '$999',
    cadence: 'one-time',
    badge: 'Secure one of the first 100 priority onboarding slots',
    highlight: true,
    features: [
      'Early Access onboarding + architecture review',
      'Spring 2026 API sandbox readiness',
      'Evidence & logging blueprint for audits',
      'Downstream cascade templates',
      'Operational runbook (SLOs, retries, exceptions)'
    ],
    cta: 'Pay Setup Fee (Stripe)',
    trustCopy: ['Stripe hosted checkout', 'Invoice/receipt available'],
    talkToSales: true
  },
  {
    id: 'startup_499',
    name: 'Startup',
    price: '$499',
    cadence: '/mo',
    badge: 'Up to 1,000 requests/mo',
    features: [
      'Automated request ingestion',
      'Cascading deletions',
      'Immutable audit logs (exportable)',
      'Alerts + exception handling',
      'Basic dashboards'
    ],
    cta: 'Talk to sales'
  },
  {
    id: 'growth_999',
    name: 'Growth',
    price: '$999',
    cadence: '/mo',
    badge: 'Up to 5,000 requests/mo',
    features: [
      'Everything in Startup',
      'Higher throughput policies',
      'Partner attestations dashboard',
      'Retention controls for audit windows',
      'Priority support'
    ],
    cta: 'Talk to sales'
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 'Custom',
    cadence: '',
    badge: 'API-first integration',
    features: [
      'High-volume & multi-tenant controls',
      'SAML/SCIM, RBAC, custom roles',
      'VPC / region options',
      'Custom evidence exports',
      'Security review package'
    ],
    cta: 'Contact Sales'
  }
]

export default function Pricing() {
  const slotsLeft = useMemo(() => {
    const seed = new Date().toISOString().slice(0, 10)
    let hash = 0
    for (let i = 0; i < seed.length; i++) hash = (hash * 31 + seed.charCodeAt(i)) >>> 0
    const pseudo = hash % 17
    return 100 - (40 + pseudo)
  }, [])

  return (
    <Section id="pricing">
      <Container>
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
          <div>
            <div className="text-xs font-semibold tracking-wide text-regulatory-300">PRICING</div>
            <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-50">
              Early Access pricing that beats emergency compliance spend
            </h2>
            <p className="mt-4 max-w-3xl text-slate-300">
              Setup Fee is wired to Stripe Checkout. Subscription tiers are laid out for sales-led conversion (upgrade later to Stripe Prices).
            </p>
          </div>

          <div id="early-access" className="w-full md:w-auto">
            <div className="rounded-2xl border border-slate-800 bg-slate-950/40 p-5">
              <div className="text-xs font-semibold tracking-wide text-slate-400">EARLY ACCESS</div>
              <div className="mt-2 text-sm text-slate-200">
                Slots remaining (demo counter): <span className="font-extrabold text-danger-200">{slotsLeft}</span> / 100
              </div>
              <div className="mt-3 text-xs text-slate-500">Replace with real inventory once live.</div>
            </div>
          </div>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {PLANS.map((p) => (
            <Card key={p.id} className={`relative ${p.highlight ? 'ring-1 ring-regulatory-500/40 shadow-glow-blue' : ''}`}>
              {p.highlight ? (
                <div className="absolute -top-3 left-6">
                  <Badge tone="blue"><Star className="mr-1 h-3.5 w-3.5" />Recommended</Badge>
                </div>
              ) : null}

              <CardHeader>
                <div className="text-lg font-semibold text-slate-50">{p.name}</div>
                <div className="mt-1 text-xs text-slate-400">{p.badge}</div>
                <div className="mt-4 flex items-end gap-2">
                  <div className="text-3xl font-extrabold text-slate-50">{p.price}</div>
                  {p.cadence ? <div className="pb-1 text-sm font-semibold text-slate-400">{p.cadence}</div> : null}
                </div>
              </CardHeader>

              <CardContent className="pt-3">
                <ul className="space-y-3 text-sm text-slate-300">
                  {p.features.map((f) => (
                    <li key={f} className="flex items-start gap-2">
                      <Check className="mt-0.5 h-4 w-4 text-regulatory-300" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>

              <CardFooter className="space-y-3">
                {p.id === 'setup_fee_999' ? (
                  <>
                    <CheckoutButton planId="setup_fee_999" label={p.cta} variant="primary" />
                    {p.trustCopy?.length > 0 && (
                      <p className="text-center text-[11px] text-slate-500">
                        {p.trustCopy.join(' · ')}
                      </p>
                    )}
                    {p.talkToSales && (
                      <Button as="a" href="mailto:sales@deleteactpro.com?subject=Setup%20Fee%20%2F%20Procurement%20Inquiry" variant="ghost" size="sm" className="w-full">
                        Talk to Sales (procurement)
                      </Button>
                    )}
                  </>
                ) : (
                  <Button as="a" href="mailto:sales@deleteactpro.com?subject=Pricing%20Inquiry%20-%20DROP%20Compliance%20Gateway" variant="ghost" className="w-full">
                    {p.cta} <ArrowRight className="h-4 w-4" />
                  </Button>
                )}
                <div className="text-center text-[11px] text-slate-500">Prices in USD. Taxes may apply.</div>
              </CardFooter>
            </Card>
          ))}
        </div>
      </Container>
    </Section>
  )
}

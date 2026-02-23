import { Check, Star, ArrowRight } from 'lucide-react'
import Section from './Section.jsx'
import Container from './Container.jsx'
import { Card, CardContent, CardFooter, CardHeader } from './ui/Card.jsx'
import Badge from './ui/Badge.jsx'
import Button from './ui/Button.jsx'
import { useMemo } from 'react'

const SALES_EMAIL = 'ceo@deleteactpro.com'
const MAILTO_SUBJECT = 'DeleteActPro%20-%20Talk%20to%20Sales'

const PLANS = [
  {
    id: 'early_access',
    name: 'Early Access',
    badge: 'Secure one of the first 100 priority onboarding slots',
    highlight: true,
    features: [
      'Early Access onboarding + architecture review',
      'Spring 2026 API sandbox readiness',
      'Evidence & logging blueprint for audits',
      'Downstream cascade templates',
      'Operational runbook (SLOs, retries, exceptions)'
    ],
    cta: 'Talk to Sales'
  },
  {
    id: 'startup',
    name: 'Startup',
    badge: 'Up to 1,000 requests/mo',
    features: [
      'Automated request ingestion',
      'Cascading deletions',
      'Immutable audit logs (exportable)',
      'Alerts + exception handling',
      'Basic dashboards'
    ],
    cta: 'Talk to Sales'
  },
  {
    id: 'growth',
    name: 'Growth',
    badge: 'Up to 5,000 requests/mo',
    features: [
      'Everything in Startup',
      'Higher throughput policies',
      'Partner attestations dashboard',
      'Retention controls for audit windows',
      'Priority support'
    ],
    cta: 'Talk to Sales'
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    badge: 'API-first integration',
    features: [
      'High-volume & multi-tenant controls',
      'SAML/SCIM, RBAC, custom roles',
      'VPC / region options',
      'Custom evidence exports',
      'Security review package'
    ],
    cta: 'Contact Sales',
    enterpriseCopy: 'Custom scoping for data brokers, lead gen agencies, and high-volume environments.'
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
            <div className="text-xs font-semibold tracking-wide text-regulatory-300">PLANS</div>
            <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-50">
              Plans tailored to your compliance architecture, request volume, and integration model.
            </h2>
            <p className="mt-4 max-w-3xl text-slate-300">
              Contact sales for implementation scope, onboarding timeline, and pricing. Early access onboarding slots are limited.
            </p>
          </div>

          <div id="early-access" className="w-full md:w-auto">
            <div className="rounded-2xl border border-slate-800 bg-slate-950/40 p-5">
              <div className="text-xs font-semibold tracking-wide text-slate-400">EARLY ACCESS</div>
              <div className="mt-2 text-sm text-slate-200">
                Slots remaining (demo counter): <span className="font-extrabold text-danger-200">{slotsLeft}</span> / 100
              </div>
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
              </CardHeader>

              <CardContent className="pt-3">
                <ul className="space-y-3 text-sm text-slate-300">
                  {p.features.map((f) => (
                    <li key={f} className="flex items-start gap-2">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-regulatory-300" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>

              <CardFooter className="space-y-3">
                <Button
                  as="a"
                  href={`mailto:${SALES_EMAIL}?subject=${MAILTO_SUBJECT}`}
                  className="w-full"
                  aria-label={`Contact sales at ${SALES_EMAIL}`}
                >
                  {p.cta} <ArrowRight className="h-4 w-4" />
                </Button>
                {p.enterpriseCopy && (
                  <p className="text-center text-xs text-slate-500">{p.enterpriseCopy}</p>
                )}
                <p className="text-center text-[11px] text-slate-500">
                  <a href={`mailto:${SALES_EMAIL}`} className="text-slate-400 hover:text-slate-300 underline" aria-label={`Email ${SALES_EMAIL}`}>
                    Email: {SALES_EMAIL}
                  </a>
                </p>
              </CardFooter>
            </Card>
          ))}
        </div>

        <p className="mt-6 text-center text-sm text-slate-500">
          <a href={`mailto:${SALES_EMAIL}?subject=${MAILTO_SUBJECT}`} className="text-regulatory-300 hover:text-regulatory-200 underline" aria-label={`Contact sales at ${SALES_EMAIL}`}>
            Email: {SALES_EMAIL}
          </a>
        </p>
      </Container>
    </Section>
  )
}

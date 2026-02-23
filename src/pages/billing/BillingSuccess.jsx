import { Link } from 'react-router-dom'
import Container from '../../components/Container.jsx'
import SEOHead from '../../components/SEOHead.jsx'
import Button from '../../components/ui/Button.jsx'
import { CheckCircle, ArrowRight, Rocket, FileCheck, Users, GitBranch, Calendar, Shield } from 'lucide-react'

const NEXT_STEPS = [
  { icon: Rocket, title: 'Complete onboarding', desc: 'Choose integration mode (Agent or Customer APIs) and configure your first data source.', link: '/app/onboarding' },
  { icon: FileCheck, title: 'Configure hash recipe', desc: 'Set up p_hash / subject_hash for zero-knowledge matching.', link: '/app/hash-recipes' },
  { icon: Users, title: 'Register partners', desc: 'Add downstream systems that receive deletion requests.', link: '/app/partners' },
  { icon: GitBranch, title: 'Define cascade policies', desc: 'Map partners to targets and set retries, SLA, and mode.', link: '/app/cascade-policies' },
  { icon: Calendar, title: 'Schedule runs', desc: 'Run at least every 45 days for DROP compliance.', link: '/app/runs' }
]

export default function BillingSuccess() {
  return (
    <main className="min-h-screen bg-slate-950">
      <SEOHead
        title="Payment successful — DROP Compliance Gateway"
        description="Your setup fee was received. Next steps for onboarding."
        canonicalPath="/billing/success"
        noindex={true}
      />
      <Container className="py-16 md:py-24">
        <div className="mx-auto max-w-2xl text-center">
          <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-regulatory-500/20 ring-2 ring-regulatory-500/40">
            <CheckCircle className="h-9 w-9 text-regulatory-400" />
          </div>
          <h1 className="mt-6 text-3xl font-extrabold tracking-tight text-slate-50">
            Payment successful
          </h1>
          <p className="mt-3 text-slate-300">
            Setup fee received. You’re in.
          </p>
          <p className="mt-2 text-sm text-slate-500">
            We’ll send a receipt to your email. Check your inbox for next steps.
          </p>

          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Link to="/app/onboarding">
              <Button variant="primary" className="inline-flex items-center gap-2">
                Start onboarding <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link to="/login">
              <Button variant="ghost">Sign in to your account</Button>
            </Link>
          </div>
        </div>

        <div className="mt-16 border-t border-slate-800 pt-12">
          <h2 className="text-lg font-semibold text-slate-50">Next steps</h2>
          <p className="mt-1 text-sm text-slate-400">Follow these to get DROP-ready before Spring 2026.</p>
          <ul className="mt-6 space-y-4">
            {NEXT_STEPS.map((step, i) => (
              <li key={step.link}>
                <Link
                  to={step.link}
                  className="flex items-start gap-4 rounded-2xl border border-slate-800 bg-slate-950/40 p-4 transition hover:border-slate-700 hover:bg-slate-900/40"
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-800 text-slate-300">
                    <step.icon className="h-5 w-5" />
                  </span>
                  <div className="flex-1 text-left">
                    <span className="font-medium text-slate-200">{step.title}</span>
                    <p className="mt-0.5 text-sm text-slate-500">{step.desc}</p>
                  </div>
                  <ArrowRight className="h-4 w-4 shrink-0 text-slate-500" />
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <p className="mt-10 flex items-center justify-center gap-2 text-xs text-slate-500">
          <Shield className="h-3.5 w-3.5" /> Secure payment via Stripe. Invoice available in your email.
        </p>
      </Container>
    </main>
  )
}

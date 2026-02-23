import Seo from '../components/Seo.jsx'
import Container from '../components/Container.jsx'
import Section from '../components/Section.jsx'
import Button from '../components/ui/Button.jsx'
import Badge from '../components/ui/Badge.jsx'
import RiskCalculator from '../components/RiskCalculator.jsx'
import Timeline from '../components/Timeline.jsx'
import ValueProps from '../components/ValueProps.jsx'
import Pricing from '../components/Pricing.jsx'
import EarlyAccessForm from '../components/EarlyAccessForm.jsx'
import { ArrowRight, ShieldCheck } from 'lucide-react'

export default function Home() {
  return (
    <>
      <Seo
        title="DROP Compliance Gateway — SB 362 Automation"
        description="Avoid the $200/day per request penalty by automating California DROP sync, cascading deletions, and audit-ready logs."
        canonicalPath="/"
      />

      <main>
        <section className="relative overflow-hidden bg-slate-950 bg-hero">
          <Container className="py-20">
            <div className="grid gap-10 md:grid-cols-12">
              <div className="md:col-span-7">
                <Badge tone="blue">Built for registered data brokers</Badge>

                <h1 className="mt-5 text-4xl font-extrabold tracking-tight text-slate-50 md:text-5xl">
                  Avoid the $200/Day Per Request Penalty.
                </h1>
                <p className="mt-5 max-w-2xl text-lg text-slate-300">
                  Automate your California DROP system sync before the <span className="text-slate-100 font-semibold">August 1st mandatory enforcement</span>.
                  Build once. Execute fast. Retain evidence for audits.
                </p>

                <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
                  <Button as="a" href="#early-access" size="lg">
                    Secure Early Access — Only 100 slots <ArrowRight className="h-4 w-4" />
                  </Button>
                  <Button as="a" href="#risk" variant="ghost" size="lg">
                    Calculate exposure
                  </Button>
                </div>

                <div className="mt-10 grid gap-4 sm:grid-cols-3">
                  <div className="rounded-2xl border border-slate-800 bg-slate-950/40 p-5">
                    <div className="text-xs text-slate-500">Positioning</div>
                    <div className="mt-1 text-sm font-semibold text-slate-100">B2B compliance automation</div>
                  </div>
                  <div className="rounded-2xl border border-slate-800 bg-slate-950/40 p-5">
                    <div className="text-xs text-slate-500">Outcome</div>
                    <div className="mt-1 text-sm font-semibold text-slate-100">Deletion + proof generation</div>
                  </div>
                  <div className="rounded-2xl border border-slate-800 bg-slate-950/40 p-5">
                    <div className="text-xs text-slate-500">Buyer</div>
                    <div className="mt-1 text-sm font-semibold text-slate-100">Legal + engineering</div>
                  </div>
                </div>
              </div>

              <div className="md:col-span-5">
                <div className="grid gap-6">
                  <div className="rounded-3xl border border-slate-800 bg-slate-950/40 p-6 shadow-soft">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-regulatory-500/15 ring-1 ring-regulatory-500/25">
                          <ShieldCheck className="h-5 w-5 text-regulatory-200" />
                        </span>
                        <div>
                          <div className="text-sm font-semibold text-slate-50">Executive Summary</div>
                          <div className="text-xs text-slate-500">What you’re buying</div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 space-y-4 text-sm text-slate-300">
                      <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-5">
                        <div className="text-xs font-semibold tracking-wide text-slate-400">1) Ingest</div>
                        <div className="mt-1 font-semibold text-slate-100">Normalize deletion requests</div>
                        <p className="mt-2 text-slate-300">API-first ingestion with retries, idempotency, and partner routing.</p>
                      </div>

                      <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-5">
                        <div className="text-xs font-semibold tracking-wide text-slate-400">2) Execute</div>
                        <div className="mt-1 font-semibold text-slate-100">Automate cascades</div>
                        <p className="mt-2 text-slate-300">Downstream deletions, attestations, and exception controls.</p>
                      </div>

                      <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-5">
                        <div className="text-xs font-semibold tracking-wide text-slate-400">3) Prove</div>
                        <div className="mt-1 font-semibold text-slate-100">Generate audit evidence</div>
                        <p className="mt-2 text-slate-300">Immutable logs designed for audit workflows and defensible reporting.</p>
                      </div>

                      <a href="#pricing" className="block rounded-2xl border border-slate-800 bg-slate-950/60 px-5 py-4 text-center font-semibold text-slate-100 hover:bg-slate-900">
                        View pricing & secure Early Access
                      </a>
                    </div>
                  </div>

                  <EarlyAccessForm />
                </div>
              </div>
            </div>
          </Container>
        </section>

        <RiskCalculator />
        <Timeline />
        <ValueProps />

        <Section className="bg-slate-950">
          <Container>
            <div className="rounded-3xl border border-slate-800 bg-slate-950/40 p-8 md:p-10">
              <div className="text-xs font-semibold tracking-wide text-regulatory-300">GROWTH NOTE</div>
              <h3 className="mt-2 text-2xl font-extrabold tracking-tight text-slate-50">
                The fastest way to sell compliance is to sell certainty
              </h3>
              <p className="mt-4 max-w-3xl text-slate-300">
                Deals close when legal risk and engineering execution align: timeline, controls, and evidence artifacts.
                Use the Risk Calculator to anchor urgency with a number.
              </p>
            </div>
          </Container>
        </Section>

        <Pricing />
      </main>
    </>
  )
}

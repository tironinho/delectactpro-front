import { CalendarClock, Rocket, ShieldAlert } from 'lucide-react'
import Section from './Section.jsx'
import Container from './Container.jsx'
import { Card, CardContent } from './ui/Card.jsx'

const steps = [
  { date: 'Jan 1, 2026', title: 'DROP Live', icon: Rocket, body: 'Operational milestone. Validate ingestion + deletion workflows early.' },
  { date: 'Spring 2026', title: 'API Sandbox Open', icon: CalendarClock, body: 'Integration window to harden idempotency, retries, and evidence output.' },
  { date: 'Aug 1, 2026', title: 'Enforcement Starts', icon: ShieldAlert, body: 'Mandatory enforcement. Execute deletions on time and retain defensible logs.' }
]

export default function Timeline() {
  return (
    <Section id="timeline">
      <Container>
        <div className="text-xs font-semibold tracking-wide text-regulatory-300">REGULATORY TIMELINE</div>
        <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-50">
          Build before enforcement. Prove it after.
        </h2>
        <p className="mt-4 max-w-3xl text-slate-300">
          Early implementation reduces emergency engineering spend and makes audit readiness a reporting task, not a fire drill.
        </p>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {steps.map((s) => {
            const Icon = s.icon
            return (
              <Card key={s.title} className="bg-slate-950/40">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-regulatory-500/15 ring-1 ring-regulatory-500/25">
                      <Icon className="h-5 w-5 text-regulatory-200" />
                    </div>
                    <div>
                      <div className="text-xs font-semibold tracking-wide text-slate-400">{s.date}</div>
                      <div className="mt-1 text-lg font-semibold text-slate-50">{s.title}</div>
                      <p className="mt-2 text-sm text-slate-300">{s.body}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </Container>
    </Section>
  )
}

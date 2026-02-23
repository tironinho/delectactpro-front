import { useMemo, useState } from 'react'
import { AlertTriangle, Gauge } from 'lucide-react'
import Section from './Section.jsx'
import Container from './Container.jsx'
import { Card, CardContent, CardHeader } from './ui/Card.jsx'
import Badge from './ui/Badge.jsx'

const money = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })

export default function RiskCalculator() {
  const [requests, setRequests] = useState(1200)
  const [days, setDays] = useState(10)

  const exposure = useMemo(() => (Number(requests) || 0) * (Number(days) || 0) * 200, [requests, days])

  const severity = useMemo(() => {
    if (exposure <= 0) return { label: 'No exposure', tone: 'slate' }
    if (exposure < 250_000) return { label: 'Elevated', tone: 'blue' }
    if (exposure < 5_000_000) return { label: 'High', tone: 'red' }
    return { label: 'Critical', tone: 'red' }
  }, [exposure])

  return (
    <Section id="risk">
      <Container>
        <div className="grid gap-8 md:grid-cols-12">
          <div className="md:col-span-5">
            <div className="text-xs font-semibold tracking-wide text-regulatory-300">INTERACTIVE RISK</div>
            <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-50">
              Model the backlog penalty in real time
            </h2>
            <p className="mt-4 text-slate-300">
              Move the sliders to estimate exposure:
              <span className="ml-2 font-mono text-slate-200">requests × days × 200</span>.
            </p>

            <div className="mt-6 rounded-2xl border border-slate-800 bg-slate-950/40 p-5">
              <div className="flex items-start gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-danger-500/15 ring-1 ring-danger-500/25">
                  <AlertTriangle className="h-5 w-5 text-danger-200" />
                </div>
                <div>
                  <div className="text-xs font-semibold tracking-wide text-slate-400">Potential Exposure</div>
                  <div className="mt-2 text-4xl font-extrabold tracking-tight text-danger-300">
                    {money.format(exposure)}
                  </div>
                  <div className="mt-2">
                    <Badge tone={severity.tone}>{severity.label} severity</Badge>
                  </div>
                </div>
              </div>
              <p className="mt-4 text-sm text-slate-400">
                Anchor urgency with a number. This is how budget approvals happen.
              </p>
            </div>
          </div>

          <div className="md:col-span-7">
            <Card>
              <CardHeader className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm font-semibold text-slate-100">
                  <Gauge className="h-4 w-4 text-regulatory-200" />
                  Risk Calculator
                </div>
                <div className="text-xs text-slate-500">Dynamic</div>
              </CardHeader>

              <CardContent className="space-y-6">
                <div>
                  <div className="flex items-center justify-between text-sm">
                    <div className="text-slate-300">Requests Received</div>
                    <div className="font-semibold text-slate-100">{Number(requests).toLocaleString('en-US')}</div>
                  </div>
                  <input className="mt-3 w-full accent-regulatory-500" type="range" min={0} max={50000} step={25} value={requests}
                    onChange={(e) => setRequests(Number(e.target.value))} />
                  <div className="mt-2 flex justify-between text-xs text-slate-500"><span>0</span><span>50,000</span></div>
                </div>

                <div>
                  <div className="flex items-center justify-between text-sm">
                    <div className="text-slate-300">Days of Delay</div>
                    <div className="font-semibold text-slate-100">{days} days</div>
                  </div>
                  <input className="mt-3 w-full accent-danger-500" type="range" min={0} max={90} step={1} value={days}
                    onChange={(e) => setDays(Number(e.target.value))} />
                  <div className="mt-2 flex justify-between text-xs text-slate-500"><span>0</span><span>90</span></div>
                </div>

                <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-5">
                  <div className="text-xs font-semibold tracking-wide text-slate-400">Live output</div>
                  <div className="mt-1 font-mono text-sm text-slate-200">
                    Potential Exposure = {Number(requests).toLocaleString('en-US')} × {days} × 200 = {money.format(exposure)}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </Container>
    </Section>
  )
}

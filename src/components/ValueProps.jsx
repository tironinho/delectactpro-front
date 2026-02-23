import { LockKeyhole, Layers, ClipboardCheck } from 'lucide-react'
import Section from './Section.jsx'
import Container from './Container.jsx'
import { Card, CardContent } from './ui/Card.jsx'

const items = [
  { title: 'Zero-Knowledge Hashing', icon: LockKeyhole, body: 'Local SHA-256 hashing so workflows operate on irreversible identifiers instead of raw PII.' },
  { title: 'Cascading Deletions', icon: Layers, body: 'Automated forwarding to downstream partners with attestations, retries, and exception controls.' },
  { title: 'Audit-Ready', icon: ClipboardCheck, body: 'Immutable logs engineered for triennial audits: lifecycle, scope, and partner proofs.' }
]

export default function ValueProps() {
  return (
    <Section id="value">
      <Container>
        <div className="text-xs font-semibold tracking-wide text-regulatory-300">VALUE PROPOSITION</div>
        <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-50">
          Compliance automation that produces evidence
        </h2>
        <p className="mt-4 max-w-3xl text-slate-300">
          Deletion is table stakes. The real outcome is provable execution across your systems and partners.
        </p>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {items.map((it) => {
            const Icon = it.icon
            return (
              <Card key={it.title} className="bg-slate-950/40">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-regulatory-500/15 ring-1 ring-regulatory-500/25">
                      <Icon className="h-5 w-5 text-regulatory-200" />
                    </div>
                    <div>
                      <div className="text-lg font-semibold text-slate-50">{it.title}</div>
                      <p className="mt-2 text-sm text-slate-300">{it.body}</p>
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

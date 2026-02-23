import Container from '../../components/Container.jsx'
import Seo from '../../components/Seo.jsx'
import JsonLd from '../../components/seo/JsonLd.jsx'
import { Link } from 'react-router-dom'
import { Check } from 'lucide-react'

const CHECKLIST = [
  'Registered (or determined need to register) as a data broker under applicable law',
  'DROP API or deletion request ingestion implemented with idempotency',
  'Request lifecycle (RECEIVED → VALIDATED → EXECUTING → CASCADING → CLOSED) defined and logged',
  'Downstream partners identified and mapped to requests',
  'Partner SLAs and retry/backoff policy defined',
  'Attestation or confirmation flow for partners where required',
  'Immutable audit logs with request_id correlation',
  'Audit packet export (per request) available',
  'Run schedule within 45-day window (e.g. every 30–45 days)',
  'Escalation path for failed cascades or timeouts'
]

const FAQS = [
  { question: 'What is DROP readiness?', answer: 'Readiness to receive and process deletion requests from the California Data Broker Registry (DROP) and to maintain evidence for audits.' },
  { question: 'Why 45 days?', answer: 'The statutory timeline for processing deletion requests is typically 45 days. Your pipeline and partner SLAs must complete within this window.' },
  { question: 'Is this a legal checklist?', answer: 'No. This is a technical and operational checklist. Consult legal counsel for your obligations.' }
]

export default function ToolDropReadinessChecklist() {
  const origin = typeof window !== 'undefined' ? window.location.origin : ''
  const url = `${origin}/tools/drop-readiness-checklist`

  return (
    <main className="min-h-screen bg-slate-950">
      <Seo
        title="DROP Readiness Checklist — Compliance Tools"
        description="A technical checklist for DROP and deletion request readiness: ingestion, cascade, logs, and schedule."
        canonicalPath="/tools/drop-readiness-checklist"
      />
      <JsonLd
        title="DROP Readiness Checklist"
        description="Technical checklist for DROP and deletion request readiness."
        publishedAt="2025-02-20"
        updatedAt="2025-02-20"
        url={url}
        faqs={FAQS}
      />
      <Container className="py-16">
        <Link to="/" className="text-sm font-semibold text-slate-400 hover:text-slate-50">← Home</Link>
        <h1 className="mt-6 text-3xl font-extrabold tracking-tight text-slate-50">DROP Readiness Checklist</h1>
        <p className="mt-2 max-w-2xl text-slate-400">
          Use this checklist to assess technical and operational readiness for DROP and deletion request compliance. Not legal advice.
        </p>
        <ul className="mt-10 space-y-3">
          {CHECKLIST.map((item, i) => (
            <li key={i} className="flex items-start gap-3 rounded-xl border border-slate-800 bg-slate-950/40 p-4">
              <Check className="mt-0.5 h-5 w-5 shrink-0 text-regulatory-400" />
              <span className="text-slate-200">{item}</span>
            </li>
          ))}
        </ul>
        <div className="mt-12 rounded-2xl border border-slate-800 bg-slate-950/40 p-6">
          <div className="text-sm font-semibold text-slate-50">FAQ</div>
          <dl className="mt-4 space-y-3">
            {FAQS.map((faq, i) => (
              <div key={i}>
                <dt className="font-medium text-slate-200">{faq.question}</dt>
                <dd className="mt-1 text-sm text-slate-400">{faq.answer}</dd>
              </div>
            ))}
          </dl>
        </div>
        <div className="mt-8 flex gap-4">
          <a href="/#pricing" className="text-sm font-semibold text-regulatory-200 hover:text-regulatory-100">View pricing →</a>
          <Link to="/app/onboarding" className="text-sm font-semibold text-regulatory-200 hover:text-regulatory-100">Onboarding →</Link>
        </div>
      </Container>
    </main>
  )
}

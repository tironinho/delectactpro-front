import { useState } from 'react'
import Container from '../../components/Container.jsx'
import Seo from '../../components/Seo.jsx'
import Section from '../../components/Section.jsx'
import RiskCalculator from '../../components/RiskCalculator.jsx'
import JsonLd from '../../components/seo/JsonLd.jsx'
import { Link } from 'react-router-dom'

const FAQS = [
  { question: 'What is the $200 per day penalty?', answer: 'Under California data broker laws, certain violations can result in statutory penalties that may be calculated on a per-request, per-day basis. Consult legal counsel for applicability.' },
  { question: 'How is penalty exposure calculated?', answer: 'Exposure depends on request volume, processing delay, and applicable statutory or contractual terms. This tool provides an illustrative estimate only.' },
  { question: 'Does this tool constitute legal advice?', answer: 'No. This tool is for informational and illustrative purposes only. It does not constitute legal advice.' }
]

export default function ToolPenaltyCalculator() {
  const origin = typeof window !== 'undefined' ? window.location.origin : ''
  const url = `${origin}/tools/penalty-calculator`

  return (
    <main className="min-h-screen bg-slate-950">
      <Seo
        title="Penalty Calculator — DROP Compliance Tools"
        description="Estimate penalty exposure for delayed deletion requests. Illustrative calculator for SB 362 / DROP compliance planning."
        canonicalPath="/tools/penalty-calculator"
      />
      <JsonLd
        title="Penalty Calculator"
        description="Estimate penalty exposure for delayed deletion requests. Illustrative only."
        publishedAt="2025-02-20"
        updatedAt="2025-02-20"
        url={url}
        faqs={FAQS}
      />
      <Container className="py-16">
        <Link to="/" className="text-sm font-semibold text-slate-400 hover:text-slate-50">← Home</Link>
        <h1 className="mt-6 text-3xl font-extrabold tracking-tight text-slate-50">Penalty Calculator</h1>
        <p className="mt-2 max-w-2xl text-slate-400">
          Estimate potential exposure from delayed or incomplete deletion request processing. This is an illustrative tool for planning only; it does not constitute legal or compliance advice. Penalties depend on jurisdiction, facts, and applicable law.
        </p>
        <Section>
          <RiskCalculator />
        </Section>
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

import Container from '../../components/Container.jsx'
import Seo from '../../components/Seo.jsx'
import JsonLd from '../../components/seo/JsonLd.jsx'
import { Link } from 'react-router-dom'

const QUESTIONS = [
  'Do you sell, license, or exchange personal information (including derived signals or segments)?',
  'Do you maintain identity graphs, matching services, or enrichment pipelines that third parties use?',
  'Do you distribute personal data via downstream partners, resellers, or APIs?',
  'Do you operate a people-search or identity-lookup product?',
  'Do you collect or process personal data primarily to make it available to others (e.g. lead gen, marketing data)?',
  'Would a deletion request require actions across multiple internal systems and external partners?'
]

const FAQS = [
  { question: 'Who is a data broker under California law?', answer: 'Definitions vary by statute. Generally, a business that knowingly collects and sells or shares California consumers\' personal information, with certain exceptions.' },
  { question: 'What if I am not sure?', answer: 'Self-assessment tools are indicative only. Consult qualified legal counsel to determine whether you are a data broker or have deletion obligations.' },
  { question: 'Is this legal advice?', answer: 'No. This is for informational and self-assessment purposes only. It does not constitute legal advice.' }
]

export default function ToolDataBrokerSelfAssessment() {
  const origin = typeof window !== 'undefined' ? window.location.origin : ''
  const url = `${origin}/tools/data-broker-self-assessment`

  return (
    <main className="min-h-screen bg-slate-950">
      <Seo
        title="Data Broker Self-Assessment — Compliance Tools"
        description="Answer a few questions to gauge whether your activities may fall under data broker definitions. Not legal advice."
        canonicalPath="/tools/data-broker-self-assessment"
      />
      <JsonLd
        title="Data Broker Self-Assessment"
        description="Self-assessment questions to gauge possible data broker scope. Not legal advice."
        publishedAt="2025-02-20"
        updatedAt="2025-02-20"
        url={url}
        faqs={FAQS}
      />
      <Container className="py-16">
        <Link to="/" className="text-sm font-semibold text-slate-400 hover:text-slate-50">← Home</Link>
        <h1 className="mt-6 text-3xl font-extrabold tracking-tight text-slate-50">Data Broker Self-Assessment</h1>
        <p className="mt-2 max-w-2xl text-slate-400">
          These questions help you consider whether your data flows and business model may fall under data broker definitions. This is not legal advice; consult counsel for your situation.
        </p>
        <ul className="mt-10 space-y-4">
          {QUESTIONS.map((q, i) => (
            <li key={i} className="rounded-xl border border-slate-800 bg-slate-950/40 p-4 text-slate-200">
              {i + 1}. {q}
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
          <Link to="/blog/data-broker-definition-sb362" className="text-sm font-semibold text-regulatory-200 hover:text-regulatory-100">Who is a data broker? →</Link>
          <a href="/#pricing" className="text-sm font-semibold text-regulatory-200 hover:text-regulatory-100">View pricing →</a>
          <Link to="/app/onboarding" className="text-sm font-semibold text-regulatory-200 hover:text-regulatory-100">Onboarding →</Link>
        </div>
      </Container>
    </main>
  )
}

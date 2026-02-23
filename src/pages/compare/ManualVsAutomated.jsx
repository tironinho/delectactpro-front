import { Link } from 'react-router-dom'
import Container from '../../components/Container.jsx'
import Seo from '../../components/Seo.jsx'
import Button from '../../components/ui/Button.jsx'

export default function ManualVsAutomated() {
  return (
    <main className="min-h-screen bg-slate-950">
      <Seo
        title="Manual vs Automated Delete Act Compliance — Cost & Risk"
        description="Compare manual DSAR processing to automated DROP compliance: cost per request, penalty exposure, and audit readiness."
        canonicalPath="/compare/manual-vs-automated-delete-act-compliance"
      />
      <Container className="py-16 md:py-24">
        <h1 className="text-4xl font-extrabold tracking-tight text-slate-50">Manual vs. automated Delete Act compliance</h1>
        <p className="mt-4 max-w-2xl text-lg text-slate-300">
          Manual processing costs $1,500+ per request and multiplies penalty risk. Automation compresses cost and delivers evidence.
        </p>
        <div className="mt-12 grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl border border-slate-800 bg-slate-950/40 p-6">
            <h2 className="text-lg font-semibold text-slate-50">Manual</h2>
            <ul className="mt-3 space-y-2 text-sm text-slate-400">
              <li>High cost per request</li>
              <li>Backlog and penalty exposure</li>
              <li>Brittle evidence for audits</li>
            </ul>
          </div>
          <div className="rounded-2xl border border-regulatory-500/20 bg-regulatory-500/5 p-6">
            <h2 className="text-lg font-semibold text-slate-50">Automated</h2>
            <ul className="mt-3 space-y-2 text-sm text-slate-300">
              <li>Lower cost, repeatable pipeline</li>
              <li>45-day window and SLA tracking</li>
              <li>Immutable logs and audit packets</li>
            </ul>
          </div>
        </div>
        <div className="mt-12 flex flex-wrap gap-4">
          <a href="/#pricing">
            <Button>Get Early Access</Button>
          </a>
          <Link to="/tools/penalty-calculator">
            <Button variant="ghost">Penalty calculator</Button>
          </Link>
        </div>
      </Container>
    </main>
  )
}

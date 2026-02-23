import { Link } from 'react-router-dom'
import Container from '../../components/Container.jsx'
import Seo from '../../components/Seo.jsx'
import Button from '../../components/ui/Button.jsx'
import { Check, AlertTriangle } from 'lucide-react'

export default function DataBrokers() {
  const pains = [
    { risk: 'Unclear broker classification', outcome: 'Scope assessment and DROP readiness plan' },
    { risk: '$200/day per request penalty', outcome: 'Automated ingestion and evidence chain' },
    { risk: 'Cascading deletions across partners', outcome: 'Orchestration and partner attestations' },
    { risk: '2028 audit evidence gaps', outcome: 'Immutable logs and audit packet export' }
  ]

  return (
    <main className="min-h-screen bg-slate-950">
      <Seo
        title="Solutions for Data Brokers — California Delete Act Compliance"
        description="Compliance automation for registered data brokers: DROP sync, cascading deletions, audit-ready logs. Avoid the $200/day penalty."
        canonicalPath="/solutions/data-brokers"
      />
      <Container className="py-16 md:py-24">
        <h1 className="text-4xl font-extrabold tracking-tight text-slate-50">Solutions for Data Brokers</h1>
        <p className="mt-4 max-w-2xl text-lg text-slate-300">
          If you are a registered data broker under SB 362, you need ingestion, execution, and evidence — not spreadsheets.
        </p>

        <div className="mt-12 rounded-2xl border border-slate-800 bg-slate-950/40 overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-800">
                <th className="px-4 py-3 font-semibold text-slate-400">Risk / Pain</th>
                <th className="px-4 py-3 font-semibold text-slate-400">Outcome with DROP Gateway</th>
              </tr>
            </thead>
            <tbody>
              {pains.map((row, i) => (
                <tr key={i} className="border-b border-slate-800/80">
                  <td className="px-4 py-3 text-slate-300 flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-amber-400 shrink-0" />
                    {row.risk}
                  </td>
                  <td className="px-4 py-3 text-slate-200 flex items-center gap-2">
                    <Check className="h-4 w-4 text-regulatory-400 shrink-0" />
                    {row.outcome}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-12 flex flex-wrap gap-4">
          <Button as="a" href="mailto:ceo@deleteactpro.com?subject=DeleteActPro%20-%20Talk%20to%20Sales" aria-label="Contact sales at ceo@deleteactpro.com">
            Talk to Sales
          </Button>
          <Link to="/blog/data-broker-definition-sb362">
            <Button variant="ghost">Is my company a data broker?</Button>
          </Link>
        </div>
      </Container>
    </main>
  )
}

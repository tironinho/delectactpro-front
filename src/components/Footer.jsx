import { Link } from 'react-router-dom'
import Container from './Container.jsx'

export default function Footer() {
  return (
    <footer className="border-t border-slate-900/70 bg-slate-950">
      <Container className="py-12">
        <div className="grid gap-10 md:grid-cols-12">
          <div className="md:col-span-5">
            <div className="text-sm font-extrabold text-slate-50">DROP Compliance Gateway</div>
            <p className="mt-3 max-w-md text-sm text-slate-400">
              Automation-first compliance tooling for California DROP / SB 362:
              ingestion, evidence, cascading deletions, and audit-ready logs.
            </p>
            <p className="mt-4 text-xs text-slate-500">
              © {new Date().getFullYear()} DROP Compliance Gateway. All rights reserved.
            </p>
            <p className="mt-2 text-xs text-slate-500 italic">
              Not legal advice. Consult qualified counsel for your situation.
            </p>
          </div>

          <div className="md:col-span-2">
            <div className="text-xs font-semibold tracking-wide text-slate-500">SOLUTIONS</div>
            <ul className="mt-3 space-y-2 text-sm">
              <li><Link className="text-slate-300 hover:text-slate-50" to="/solutions/data-brokers">Data brokers</Link></li>
              <li><a className="text-slate-300 hover:text-slate-50" href="mailto:sales@deleteactpro.com?subject=Lead%20gen%20inquiry">Lead gen agencies</a></li>
              <li><a className="text-slate-300 hover:text-slate-50" href="mailto:sales@deleteactpro.com?subject=List%20broker%20inquiry">List brokers</a></li>
            </ul>
          </div>

          <div className="md:col-span-2">
            <div className="text-xs font-semibold tracking-wide text-slate-500">USE CASES</div>
            <ul className="mt-3 space-y-2 text-sm">
              <li><Link className="text-slate-300 hover:text-slate-50" to="/use-cases/drop-api-readiness">DROP API readiness</Link></li>
              <li><Link className="text-slate-300 hover:text-slate-50" to="/blog/delete-act-audit-prep">Audit-ready logs</Link></li>
              <li><Link className="text-slate-300 hover:text-slate-50" to="/compare/manual-vs-automated-delete-act-compliance">Manual vs automated</Link></li>
            </ul>
          </div>

          <div className="md:col-span-3">
            <div className="text-xs font-semibold tracking-wide text-slate-500">PRODUCT &amp; PRICING</div>
            <ul className="mt-3 space-y-2 text-sm">
              <li><a className="text-slate-300 hover:text-slate-50" href="/#pricing">Pricing</a></li>
              <li><Link className="text-slate-300 hover:text-slate-50" to="/pricing/setup-fee-early-access">Setup fee &amp; Early Access</Link></li>
              <li><Link className="text-slate-300 hover:text-slate-50" to="/blog">Blog</Link></li>
            </ul>
          </div>

          <div className="md:col-span-12 lg:col-span-0" aria-hidden="true" />

          <div className="md:col-span-3">
            <div className="text-xs font-semibold tracking-wide text-slate-500">COMPLIANCE RESOURCES</div>
            <ul className="mt-3 space-y-2 text-sm">
              <li><Link className="text-slate-300 hover:text-slate-50" to="/blog">Blog index</Link></li>
              <li><Link className="text-slate-300 hover:text-slate-50" to="/blog/california-delete-act-compliance">California Delete Act hub</Link></li>
              <li><Link className="text-slate-300 hover:text-slate-50" to="/blog/drop-api-hub">DROP API hub</Link></li>
              <li><Link className="text-slate-300 hover:text-slate-50" to="/blog/delete-act-audit-prep">Audit prep hub</Link></li>
            </ul>
          </div>

          <div className="md:col-span-3">
            <div className="text-xs font-semibold tracking-wide text-slate-500">TOOLS</div>
            <ul className="mt-3 space-y-2 text-sm">
              <li><Link className="text-slate-300 hover:text-slate-50" to="/tools/penalty-calculator">Penalty Calculator</Link></li>
              <li><Link className="text-slate-300 hover:text-slate-50" to="/tools/drop-readiness-checklist">DROP Readiness Checklist</Link></li>
              <li><Link className="text-slate-300 hover:text-slate-50" to="/tools/data-broker-self-assessment">Data Broker Self-Assessment</Link></li>
            </ul>
          </div>
        </div>
      </Container>
    </footer>
  )
}

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

          <div className="md:col-span-3">
            <div className="text-xs font-semibold tracking-wide text-slate-500">PRODUCT</div>
            <ul className="mt-3 space-y-2 text-sm">
              <li><a className="text-slate-300 hover:text-slate-50" href="#pricing">Pricing</a></li>
              <li><a className="text-slate-300 hover:text-slate-50" href="#risk">Risk Calculator</a></li>
              <li><a className="text-slate-300 hover:text-slate-50" href="#timeline">Regulatory Timeline</a></li>
              <li><Link className="text-slate-300 hover:text-slate-50" to="/blog">Blog</Link></li>
            </ul>
          </div>

          <div className="md:col-span-4">
            <div className="text-xs font-semibold tracking-wide text-slate-500">TOOLS & BLOG</div>
            <ul className="mt-3 space-y-2 text-sm">
              <li><Link className="text-slate-300 hover:text-slate-50" to="/tools/penalty-calculator">Penalty Calculator</Link></li>
              <li><Link className="text-slate-300 hover:text-slate-50" to="/tools/drop-readiness-checklist">DROP Readiness Checklist</Link></li>
              <li><Link className="text-slate-300 hover:text-slate-50" to="/tools/data-broker-self-assessment">Data Broker Self-Assessment</Link></li>
              <li><Link className="text-slate-300 hover:text-slate-50" to="/blog">Blog index</Link></li>
            </ul>
          </div>
        </div>
      </Container>
    </footer>
  )
}

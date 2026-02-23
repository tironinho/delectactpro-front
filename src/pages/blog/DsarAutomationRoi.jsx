import ArticleLayout from './ArticleLayout.jsx'

export default function DsarAutomationRoi() {
  return (
    <ArticleLayout
      title="Manual vs. Automated DSARs: A Cost-Benefit Analysis"
      description="Cost per request, latency risk, and the hidden bill of evidence production."
      canonicalPath="/blog/dsar-automation-roi"
    >
      <p>
        DSAR-style work isn’t a support ticket. It’s a pipeline: identity mapping, deletion execution,
        downstream partner coordination, and proof artifacts.
      </p>

      <h2 className="text-xl font-bold text-slate-50">Modeling manual cost</h2>
      <p>
        To quantify ROI, we model a manual processing cost of <span className="font-semibold text-slate-100">$1,524 per request</span>.
        Replace this with your internal baseline. Manual cost typically includes labor, coordination overhead, tooling, and rework.
      </p>

      <div className="rounded-2xl border border-slate-800 bg-slate-950/40 p-6">
        <div className="text-sm font-semibold text-slate-50">Manual cost drivers</div>
        <ul className="mt-3 list-disc pl-6 space-y-2 text-sm text-slate-300">
          <li>Locating records across systems</li>
          <li>Partner confirmations (email/tickets)</li>
          <li>Evidence compilation</li>
          <li>Rework from partial deletions or missing logs</li>
        </ul>
      </div>

      <h2 className="text-xl font-bold text-slate-50">Automation wins twice</h2>
      <p>
        Automation reduces cost per request and compresses response times — which also reduces penalty exposure when backlogs form.
      </p>

      <h2 className="text-xl font-bold text-slate-50">What buyers purchase</h2>
      <p>
        Buyers purchase certainty: a repeatable process and evidence outputs that stand up to scrutiny. Logs are part of the product.
      </p>
    </ArticleLayout>
  )
}

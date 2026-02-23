import ArticleLayout from './ArticleLayout.jsx'

export default function CaliforniaDeleteActAudits2028() {
  return (
    <ArticleLayout
      title="The 2028 Audit Requirement: Why you need logs today"
      description="Triennial audits require proof, timelines, and system evidence — not 'we think we complied'."
      canonicalPath="/blog/california-delete-act-audits-2028"
    >
      <p>
        Audits are an engineering evidence exercise. If your workflow is manual, your artifacts will be brittle and expensive.
      </p>

      <h2 className="text-xl font-bold text-slate-50">Auditors typically ask for</h2>
      <ul className="list-disc pl-6 space-y-2">
        <li>Lifecycle timestamps: received → validated → executed → closed</li>
        <li>Scope completeness: systems and partners targeted</li>
        <li>Exceptions: failures, retries, escalations</li>
        <li>Integrity: controls preventing evidence tampering</li>
      </ul>

      <h2 className="text-xl font-bold text-slate-50">Design logs like a product</h2>
      <p>
        Treat logs as a first-class output: append-only storage, structured schemas, and exportable reports.
        Bolting logging on later forces you to reconstruct history from scattered systems.
      </p>

      <h2 className="text-xl font-bold text-slate-50">Blueprint</h2>
      <ul className="list-disc pl-6 space-y-2">
        <li>Deterministic IDs for requests and subjects (hashed identifiers).</li>
        <li>State transitions with actor/system metadata.</li>
        <li>Partner attestation + retry history.</li>
        <li>On-demand “audit packets”: a single export per request.</li>
      </ul>
    </ArticleLayout>
  )
}

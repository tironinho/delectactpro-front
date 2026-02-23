import ArticleLayout from './ArticleLayout.jsx'

export default function DropApiIntegrationGuide() {
  return (
    <ArticleLayout
      title="Technical Guide: Integrating with the California DROP API in 2026"
      description="A practical integration model: ingestion, idempotency, retries, evidence logs, and partner cascades."
      canonicalPath="/blog/drop-api-integration-guide"
    >
      <p>
        Treat DROP as a high-stakes event stream. Your architecture should assume duplicates, partial failures,
        downstream partner latency, and strict evidence requirements. Your deliverable is a deletion execution proof chain.
      </p>

      <h2 className="text-xl font-bold text-slate-50">1) Ingestion: normalize and dedupe</h2>
      <ul className="list-disc pl-6 space-y-2">
        <li>Normalize payloads into a canonical <span className="font-mono">DeletionRequest</span>.</li>
        <li>Derive a deterministic idempotency key (request ID + subject identity key).</li>
        <li>Store raw payload + normalized form for traceability.</li>
      </ul>

      <h2 className="text-xl font-bold text-slate-50">2) Orchestrator: a workflow state machine</h2>
      <p>
        Model a request lifecycle: <span className="font-mono">RECEIVED → VALIDATED → EXECUTING → CASCADING → ATTESTED → CLOSED</span>.
        Every transition is logged with timestamps and system context.
      </p>

      <h2 className="text-xl font-bold text-slate-50">3) Cascades: partners multiply risk</h2>
      <p>
        Use a queue + retry policy per partner. Track partner attestations and define escalation rules for failures.
      </p>

      <h2 className="text-xl font-bold text-slate-50">4) Evidence: engineer logs for auditors</h2>
      <ul className="list-disc pl-6 space-y-2">
        <li>Append-only storage (WORM-like semantics where possible).</li>
        <li>Exportable lifecycle reports and attestation proofs.</li>
        <li>Optional hash-chaining for tamper detection.</li>
      </ul>

      <h2 className="text-xl font-bold text-slate-50">5) Security posture: minimize raw PII</h2>
      <p>
        Use local SHA-256 hashing for identity keys and operate on irreversible identifiers.
      </p>
    </ArticleLayout>
  )
}

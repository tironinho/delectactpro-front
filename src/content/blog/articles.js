/**
 * Data-driven blog: one source for all articles.
 * Each article: slug, title, description, category, keywords, publishedAt, updatedAt, bodySections[], faqs[], internalLinks[]
 */

export const BLOG_CATEGORIES = {
  A: 'SB 362 / DROP / 45 days / enforcement',
  B: 'Implementation: idempotency, retries, workflow',
  C: 'Cascading deletions & downstream partners',
  D: 'Audit 2028 & immutable logs',
  E: 'Shadow brokers & lead gen risk',
  F: 'ROI / cost & penalty scenarios'
}

/** @type {{ slug: string; title: string; description: string; category: keyof typeof BLOG_CATEGORIES; keywords: string[]; publishedAt: string; updatedAt: string; bodySections: { type: string; content: string | string[] }[]; faqs: { question: string; answer: string }[]; internalLinks: string[] }[]} */
export const articles = [
  // --- Existing 4 (migrated) ---
  {
    slug: 'data-broker-definition-sb362',
    title: 'Is My Company a Data Broker under SB 362?',
    description: "A technical definition for 'shadow brokers'—and how to determine if you fall into the enforcement blast radius.",
    category: 'A',
    keywords: ['SB 362', 'data broker', 'California', 'definition', 'shadow broker'],
    publishedAt: '2025-01-15',
    updatedAt: '2025-02-01',
    bodySections: [
      { type: 'paragraph', content: "Many companies process personal data without thinking of themselves as \"data brokers.\" Enforcement doesn't care about your brand narrative — it cares about data flows, disclosures, and whether you trade in personal information." },
      { type: 'heading2', content: 'The "Shadow Broker" pattern' },
      { type: 'paragraph', content: 'A "shadow broker" is a company that enables third-party access to personal information through aggregation, enrichment, identity resolution, marketing datasets, people-search functionality, or partner distribution networks — even if brokerage isn\'t the headline product.' },
      { type: 'heading2', content: 'Engineering checklist' },
      { type: 'list', content: ['Do you sell, license, or exchange personal info datasets or derived signals?', 'Do you maintain identity graphs, matching services, or enrichment pipelines?', 'Do you distribute data via downstream partners/resellers?', 'Do deletion requests require actions across multiple systems and partners?', 'Do you retain data primarily to make it available to others?'] },
      { type: 'heading2', content: 'Operational risk test' },
      { type: 'paragraph', content: "If you can't answer \"where does this person's data exist\" quickly, you're structurally vulnerable to strict deletion mandates. The needed system is orchestration + evidence — not a form." }
    ],
    faqs: [
      { question: 'Who is a data broker under SB 362?', answer: 'A business that knowingly collects and sells or shares California consumers\' personal information, with limited exceptions. "Shadow brokers" include companies that enable access through enrichment, identity resolution, or partner networks.' },
      { question: 'What is a shadow broker?', answer: 'A company that enables third-party access to personal information through aggregation, enrichment, or distribution—even when brokerage is not the main product.' }
    ],
    internalLinks: ['drop-api-integration-guide', 'california-delete-act-audits-2028', 'dsar-automation-roi']
  },
  {
    slug: 'drop-api-integration-guide',
    title: 'Technical Guide: Integrating with the California DROP API in 2026',
    description: 'A practical integration model: ingestion, idempotency, retries, evidence logs, and partner cascades.',
    category: 'B',
    keywords: ['DROP API', 'integration', 'idempotency', 'retries', 'cascade'],
    publishedAt: '2025-01-20',
    updatedAt: '2025-02-01',
    bodySections: [
      { type: 'paragraph', content: 'Treat DROP as a high-stakes event stream. Your architecture should assume duplicates, partial failures, downstream partner latency, and strict evidence requirements. Your deliverable is a deletion execution proof chain.' },
      { type: 'heading2', content: '1) Ingestion: normalize and dedupe' },
      { type: 'list', content: ['Normalize payloads into a canonical DeletionRequest.', 'Derive a deterministic idempotency key (request ID + subject identity key).', 'Store raw payload + normalized form for traceability.'] },
      { type: 'heading2', content: '2) Orchestrator: a workflow state machine' },
      { type: 'paragraph', content: 'Model a request lifecycle: RECEIVED → VALIDATED → EXECUTING → CASCADING → ATTESTED → CLOSED. Every transition is logged with timestamps and system context.' },
      { type: 'heading2', content: '3) Cascades: partners multiply risk' },
      { type: 'paragraph', content: 'Use a queue + retry policy per partner. Track partner attestations and define escalation rules for failures.' }
    ],
    faqs: [
      { question: 'What is the DROP API?', answer: 'The California Data Broker Registry (DROP) provides an API for deletion requests. Integration requires idempotency, retries, and evidence logging.' },
      { question: 'Why is idempotency important for DROP?', answer: 'Duplicate submissions and retries are common. Idempotency keys ensure each logical request is processed once and evidence is consistent.' }
    ],
    internalLinks: ['data-broker-definition-sb362', 'california-delete-act-audits-2028', 'dsar-automation-roi']
  },
  {
    slug: 'dsar-automation-roi',
    title: 'Manual vs. Automated DSARs: A Cost-Benefit Analysis',
    description: 'Cost per request, latency risk, and the hidden bill of evidence production.',
    category: 'F',
    keywords: ['DSAR', 'ROI', 'automation', 'cost', 'evidence'],
    publishedAt: '2025-01-25',
    updatedAt: '2025-02-01',
    bodySections: [
      { type: 'paragraph', content: "DSAR-style work isn't a support ticket. It's a pipeline: identity mapping, deletion execution, downstream partner coordination, and proof artifacts." },
      { type: 'heading2', content: 'Modeling manual cost' },
      { type: 'paragraph', content: 'To quantify ROI, we model a manual processing cost of $1,524 per request. Replace this with your internal baseline. Manual cost typically includes labor, coordination overhead, tooling, and rework.' },
      { type: 'heading2', content: 'Automation wins twice' },
      { type: 'paragraph', content: 'Automation reduces cost per request and compresses response times — which also reduces penalty exposure when backlogs form.' },
      { type: 'heading2', content: 'What buyers purchase' },
      { type: 'paragraph', content: 'Buyers purchase certainty: a repeatable process and evidence outputs that stand up to scrutiny. Logs are part of the product.' }
    ],
    faqs: [
      { question: 'How much does manual DSAR processing cost?', answer: 'Estimates vary; $1,524 per request is a common baseline including labor, coordination, and evidence compilation.' },
      { question: 'What is the benefit of DSAR automation?', answer: 'Lower cost per request, faster response times, and reduced penalty risk from backlogs. Evidence is generated consistently.' }
    ],
    internalLinks: ['data-broker-definition-sb362', 'drop-api-integration-guide', 'california-delete-act-audits-2028']
  },
  {
    slug: 'california-delete-act-audits-2028',
    title: 'The 2028 Audit Requirement: Why you need logs today',
    description: "Triennial audits require proof, timelines, and system evidence — not 'we think we complied'.",
    category: 'D',
    keywords: ['audit', '2028', 'evidence', 'logs', 'compliance'],
    publishedAt: '2025-02-01',
    updatedAt: '2025-02-01',
    bodySections: [
      { type: 'paragraph', content: 'Audits are an engineering evidence exercise. If your workflow is manual, your artifacts will be brittle and expensive.' },
      { type: 'heading2', content: 'Auditors typically ask for' },
      { type: 'list', content: ['Lifecycle timestamps: received → validated → executed → closed', 'Scope completeness: systems and partners targeted', 'Exceptions: failures, retries, escalations', 'Integrity: controls preventing evidence tampering'] },
      { type: 'heading2', content: 'Design logs like a product' },
      { type: 'paragraph', content: 'Treat logs as a first-class output: append-only storage, structured schemas, and exportable reports. Bolting logging on later forces you to reconstruct history from scattered systems.' },
      { type: 'heading2', content: 'Blueprint' },
      { type: 'list', content: ['Deterministic IDs for requests and subjects (hashed identifiers).', 'State transitions with actor/system metadata.', 'Partner attestation + retry history.', 'On-demand "audit packets": a single export per request.'] }
    ],
    faqs: [
      { question: 'When do California Delete Act audits start?', answer: 'Triennial audits are part of the regulatory framework. Evidence must show lifecycle, scope, and integrity.' },
      { question: 'What evidence do auditors want?', answer: 'Lifecycle timestamps, scope of systems and partners, exception and retry history, and controls that prevent tampering.' }
    ],
    internalLinks: ['data-broker-definition-sb362', 'drop-api-integration-guide', 'dsar-automation-roi']
  }
]

// Append 46+ more articles (clusters A–F) to reach 50+
const EXTRA_ARTICLES = [
  {
    slug: 'sb362-45-day-deadline',
    title: 'SB 362 and the 45-Day Deletion Deadline: What You Must Meet',
    description: 'The 45-day requirement for processing deletion requests and how to architect your pipeline to stay within it.',
    category: 'A',
    keywords: ['SB 362', '45 days', 'deadline', 'deletion', 'California'],
    publishedAt: '2025-02-05',
    updatedAt: '2025-02-05',
    bodySections: [
      { type: 'paragraph', content: 'California\'s data broker framework imposes a 45-day window for processing deletion requests. Missing this window exposes you to penalties and audit findings. This article explains the requirement and how to design your system to meet it consistently.' },
      { type: 'heading2', content: 'Where the 45 days come from' },
      { type: 'paragraph', content: 'The statutory timeline ties receipt of a valid request to completion of deletion across your systems and, where applicable, downstream partners. "Completion" means executed and evidenced, not just queued.' },
      { type: 'heading2', content: 'Architecting for 45 days' },
      { type: 'list', content: ['Schedule sync runs at least within the 45-day window (e.g. every 30 days).', 'Define SLA per partner and escalate early.', 'Log every transition so you can prove when each step occurred.', 'Use idempotency so retries do not double-count or delay.'] }
    ],
    faqs: [
      { question: 'What is the 45-day rule under SB 362?', answer: 'Deletion requests must be processed within 45 days. Your pipeline and partner SLAs must be designed to complete within this window.' },
      { question: 'How often should I run my deletion sync?', answer: 'Running at least within 45 days (e.g. every 30–45 days) is a common approach to stay ahead of the deadline.' }
    ],
    internalLinks: ['data-broker-definition-sb362', 'drop-api-integration-guide', 'california-delete-act-audits-2028']
  },
  {
    slug: 'enforcement-august-2026',
    title: 'Mandatory Enforcement from August 2026: Preparing Your Stack',
    description: 'What mandatory enforcement means for registered data brokers and how to get ready.',
    category: 'A',
    keywords: ['enforcement', 'August 2026', 'mandatory', 'data broker', 'compliance'],
    publishedAt: '2025-02-06',
    updatedAt: '2025-02-06',
    bodySections: [
      { type: 'paragraph', content: 'Mandatory enforcement shifts the DROP and deletion obligations from advisory to enforceable. Registered data brokers must have working ingestion, execution, and evidence in place.' },
      { type: 'heading2', content: 'What changes' },
      { type: 'paragraph', content: 'Penalties and audit triggers become real. Backlogs, missing logs, and incomplete cascades are no longer "we will fix later" items.' },
      { type: 'heading2', content: 'Checklist before August 2026' },
      { type: 'list', content: ['Register and connect to DROP if required.', 'Implement idempotent ingestion and a clear request lifecycle.', 'Define partner SLAs and retry/escalation rules.', 'Enable immutable, exportable audit logs.'] }
    ],
    faqs: [
      { question: 'When does mandatory enforcement start?', answer: 'Mandatory enforcement for the California data broker framework is expected from August 2026. Prepare ingestion, execution, and logs before then.' },
      { question: 'What happens if I am not ready?', answer: 'Late or incomplete processing can lead to penalties and audit findings. Building evidence and automation now reduces risk.' }
    ],
    internalLinks: ['sb362-45-day-deadline', 'data-broker-definition-sb362', 'california-delete-act-audits-2028']
  },
  {
    slug: 'idempotency-deletion-requests',
    title: 'Idempotency for Deletion Requests: Why and How',
    description: 'Duplicate requests and retries are inevitable. Idempotency keeps your evidence and state consistent.',
    category: 'B',
    keywords: ['idempotency', 'deletion', 'retries', 'API', 'design'],
    publishedAt: '2025-02-07',
    updatedAt: '2025-02-07',
    bodySections: [
      { type: 'paragraph', content: 'Deletion APIs will receive duplicate submissions and your own system will retry. Idempotency ensures that processing the same logical request twice does not change the outcome or produce conflicting evidence.' },
      { type: 'heading2', content: 'Choosing an idempotency key' },
      { type: 'paragraph', content: 'Use a deterministic key derived from request ID and subject identity (e.g. hashed). Same key always maps to the same result.' },
      { type: 'heading2', content: 'Implementation notes' },
      { type: 'list', content: ['Store the key and result (or state) on first success.', 'On replay, return the stored result without re-executing.', 'Log the idempotency key in audit events so auditors can trace duplicates.'] }
    ],
    faqs: [
      { question: 'What is idempotency in deletion requests?', answer: 'Processing the same request multiple times yields the same outcome and evidence. Duplicates and retries do not cause double-deletes or inconsistent logs.' },
      { question: 'What should the idempotency key include?', answer: 'A combination of request ID and subject identity (e.g. hashed) is typical. It must be deterministic and unique per logical request.' }
    ],
    internalLinks: ['drop-api-integration-guide', 'california-delete-act-audits-2028', 'cascade-deletion-partners']
  },
  {
    slug: 'retry-backoff-cascade',
    title: 'Retry and Backoff Strategies for Cascade Deletions',
    description: 'Downstream partners fail or throttle. Design retries and backoff so you stay within SLA.',
    category: 'B',
    keywords: ['retry', 'backoff', 'cascade', 'SLA', 'partners'],
    publishedAt: '2025-02-08',
    updatedAt: '2025-02-08',
    bodySections: [
      { type: 'paragraph', content: 'Cascading deletions depend on downstream partners. Transient failures and rate limits are common. A clear retry and backoff policy keeps requests moving without overwhelming partners.' },
      { type: 'heading2', content: 'Policy dimensions' },
      { type: 'list', content: ['Max retries per partner.', 'Backoff: exponential or fixed delay between attempts.', 'Escalation: after N failures, notify or pause.', 'Log each attempt for audit.'] },
      { type: 'heading2', content: 'SLA alignment' },
      { type: 'paragraph', content: 'Your 45-day (or internal) SLA must account for retries. Start early and escalate early so you do not run out of time.' }
    ],
    faqs: [
      { question: 'Why do cascade deletions need retry logic?', answer: 'Partners can be temporarily unavailable or rate-limited. Retries with backoff improve completion rates without overloading systems.' },
      { question: 'How do retries affect my 45-day SLA?', answer: 'Design retry windows and escalation so that even with failures you can still complete within the SLA. Log attempts for evidence.' }
    ],
    internalLinks: ['drop-api-integration-guide', 'cascade-deletion-partners', 'california-delete-act-audits-2028']
  },
  {
    slug: 'workflow-state-machine-deletion',
    title: 'Modeling Deletion Workflows as a State Machine',
    description: 'RECEIVED → VALIDATED → EXECUTING → CASCADING → ATTESTED → CLOSED: why states matter for evidence.',
    category: 'B',
    keywords: ['workflow', 'state machine', 'deletion', 'evidence', 'lifecycle'],
    publishedAt: '2025-02-09',
    updatedAt: '2025-02-09',
    bodySections: [
      { type: 'paragraph', content: 'A well-defined state machine for each deletion request makes it clear what has been done and what is pending. Auditors and operations both benefit from consistent states and transitions.' },
      { type: 'heading2', content: 'Core states' },
      { type: 'paragraph', content: 'RECEIVED (ingested), VALIDATED (identity and scope confirmed), EXECUTING (internal deletion in progress), CASCADING (partner requests sent), ATTESTED (partners confirmed or escalated), CLOSED (done or failed with evidence).' },
      { type: 'heading2', content: 'Why it matters' },
      { type: 'paragraph', content: 'Every transition is timestamped and logged. You can answer "what was the status on date X?" and "how long did each phase take?" without reconstructing from ad-hoc logs.' }
    ],
    faqs: [
      { question: 'What is a deletion workflow state machine?', answer: 'A set of states (e.g. RECEIVED, VALIDATED, EXECUTING, CASCADING, ATTESTED, CLOSED) and allowed transitions, with logging at each step.' },
      { question: 'Why use a state machine for deletions?', answer: 'It gives a clear lifecycle, consistent evidence, and the ability to report on timing and completeness for audits.' }
    ],
    internalLinks: ['drop-api-integration-guide', 'california-delete-act-audits-2028', 'idempotency-deletion-requests']
  },
  {
    slug: 'cascade-deletion-partners',
    title: 'Cascading Deletions: Coordinating Downstream Partners',
    description: 'Your data lives in more than your own DB. How to orchestrate partner deletions and attestations.',
    category: 'C',
    keywords: ['cascade', 'partners', 'deletion', 'orchestration', 'attestation'],
    publishedAt: '2025-02-10',
    updatedAt: '2025-02-10',
    bodySections: [
      { type: 'paragraph', content: 'Many data brokers send data to partners: resellers, enrichment vendors, marketing platforms. A deletion request is not complete until those partners have acted and you have evidence.' },
      { type: 'heading2', content: 'Mapping partners to requests' },
      { type: 'paragraph', content: 'For each request, determine which partners hold data for that subject. That mapping drives your cascade queue and SLA tracking.' },
      { type: 'heading2', content: 'Attestations' },
      { type: 'paragraph', content: 'Where possible, obtain explicit confirmation (attestation) from each partner. Store it with the request so auditors can see the full chain.' },
      { type: 'heading2', content: 'Failures and escalation' },
      { type: 'paragraph', content: 'Define max retries and escalation (e.g. email, ticket). Log failures and escalations; they are part of your evidence story.' }
    ],
    faqs: [
      { question: 'What is a cascade deletion?', answer: 'Propagating a deletion request to downstream partners that hold or process the same subject\'s data, and collecting attestations or handling failures.' },
      { question: 'Why are attestations important?', answer: 'They prove that partner systems were instructed and (where applicable) completed. They support audit and compliance evidence.' }
    ],
    internalLinks: ['drop-api-integration-guide', 'retry-backoff-cascade', 'california-delete-act-audits-2028']
  },
  {
    slug: 'downstream-partner-sla',
    title: 'Setting SLAs for Downstream Deletion Partners',
    description: 'Your 45-day clock includes partner response. Define SLAs and escalation so you never run out of time.',
    category: 'C',
    keywords: ['SLA', 'partners', '45 days', 'escalation', 'cascade'],
    publishedAt: '2025-02-11',
    updatedAt: '2025-02-11',
    bodySections: [
      { type: 'paragraph', content: 'Your obligation is to complete deletion within the statutory window. That means internal execution and partner coordination must both finish in time.' },
      { type: 'heading2', content: 'Partner SLA dimensions' },
      { type: 'list', content: ['Response window (e.g. 14 days to confirm or reject).', 'Max retries and backoff.', 'Escalation path and owner.', 'How you log partner response (or non-response).'] },
      { type: 'heading2', content: 'Buffer' },
      { type: 'paragraph', content: 'Leave buffer before the 45-day deadline for escalations and edge cases. Automate reminders so nothing slips.' }
    ],
    faqs: [
      { question: 'What SLA should I set for deletion partners?', answer: 'Enough time for them to act plus your retries and escalation, while still finishing within your overall 45-day (or internal) deadline.' },
      { question: 'What if a partner does not respond?', answer: 'Define max retries and escalation (e.g. email, ticket). Log all attempts; non-response is part of your evidence.' }
    ],
    internalLinks: ['cascade-deletion-partners', 'retry-backoff-cascade', 'sb362-45-day-deadline']
  },
  {
    slug: 'immutable-audit-logs',
    title: 'Why Audit Logs Must Be Immutable',
    description: 'Tamper-evident logs are the foundation of defensible compliance evidence.',
    category: 'D',
    keywords: ['audit', 'logs', 'immutable', 'evidence', 'compliance'],
    publishedAt: '2025-02-12',
    updatedAt: '2025-02-12',
    bodySections: [
      { type: 'paragraph', content: 'If logs can be edited or deleted, auditors and regulators will question their reliability. Immutability (append-only, no edits) is a baseline for trust.' },
      { type: 'heading2', content: 'What immutable means' },
      { type: 'paragraph', content: 'Append-only storage; no updates or deletes of existing records. Identifiers and timestamps are part of the record so ordering and integrity can be verified.' },
      { type: 'heading2', content: 'Implementation' },
      { type: 'list', content: ['Write to append-only store (e.g. log table or object store).', 'Include request ID, timestamp, actor, and outcome in each event.', 'Consider checksums or signatures for critical exports.'] }
    ],
    faqs: [
      { question: 'Why should audit logs be immutable?', answer: 'Editable logs undermine trust in evidence. Append-only logs support defensible compliance and audit trails.' },
      { question: 'How do I make logs immutable?', answer: 'Use append-only storage, do not allow updates or deletes on audit records, and include timestamps and identifiers in each event.' }
    ],
    internalLinks: ['california-delete-act-audits-2028', 'drop-api-integration-guide', 'audit-packet-export']
  },
  {
    slug: 'audit-packet-export',
    title: 'Audit Packets: One Export Per Request',
    description: 'On-demand export of all events for a single request simplifies audits and investigations.',
    category: 'D',
    keywords: ['audit', 'export', 'packet', 'request', 'evidence'],
    publishedAt: '2025-02-13',
    updatedAt: '2025-02-13',
    bodySections: [
      { type: 'paragraph', content: 'When an auditor or regulator asks "prove what you did for request X," a single audit packet—all events, in order, for that request—is the right artifact.' },
      { type: 'heading2', content: 'What to include' },
      { type: 'list', content: ['Request receipt and idempotency key.', 'State transitions with timestamps.', 'Partner requests and attestations (or failures).', 'Any escalations or manual steps.'] },
      { type: 'heading2', content: 'Format' },
      { type: 'paragraph', content: 'Structured (e.g. JSON) with a stable schema. Include request_id and event sequence so the packet is self-contained.' }
    ],
    faqs: [
      { question: 'What is an audit packet?', answer: 'A single export containing all logged events for one deletion request, in order, for use in audits or investigations.' },
      { question: 'When should I generate audit packets?', answer: 'On demand when requested by auditors or for internal review. Some systems generate them at CLOSED state for archiving.' }
    ],
    internalLinks: ['california-delete-act-audits-2028', 'immutable-audit-logs', 'drop-api-integration-guide']
  },
  {
    slug: 'shadow-broker-lead-gen',
    title: 'Shadow Brokers and Lead Gen: When Marketing Data Triggers Broker Rules',
    description: 'Lead generation and marketing data flows can place you in the data broker enforcement scope.',
    category: 'E',
    keywords: ['shadow broker', 'lead gen', 'marketing', 'data broker', 'SB 362'],
    publishedAt: '2025-02-14',
    updatedAt: '2025-02-14',
    bodySections: [
      { type: 'paragraph', content: 'Companies that sell or share leads, intent data, or marketing segments often qualify as data brokers even if that is not their primary product. Enforcement looks at data flows and disclosures.' },
      { type: 'heading2', content: 'High-risk patterns' },
      { type: 'list', content: ['Selling or licensing lists or segments derived from personal data.', 'Sharing identifiers or attributes with partners for targeting.', 'Operating a people-search or identity-resolution product.'] },
      { type: 'heading2', content: 'Mitigation' },
      { type: 'paragraph', content: 'Know where data goes and who can access it. Implement deletion and evidence pipelines so you can comply if you are in scope.' }
    ],
    faqs: [
      { question: 'Can lead gen make me a data broker?', answer: 'If you sell or share personal information (e.g. leads, segments) you may fall under data broker definitions. Assess your flows and disclosures.' },
      { question: 'What is a shadow broker in lead gen?', answer: 'A company that enables access to or distribution of personal data for marketing or targeting, even if that is not the main brand message.' }
    ],
    internalLinks: ['data-broker-definition-sb362', 'sb362-45-day-deadline', 'drop-api-integration-guide']
  },
  {
    slug: 'penalty-200-per-day',
    title: 'The $200-Per-Day Penalty: How It Applies and How to Avoid It',
    description: 'Understanding per-request penalties and building systems that prevent backlogs.',
    category: 'F',
    keywords: ['penalty', '$200', 'SB 362', 'backlog', 'compliance'],
    publishedAt: '2025-02-15',
    updatedAt: '2025-02-15',
    bodySections: [
      { type: 'paragraph', content: 'Statutory penalties can reach $200 per day per request in certain violation scenarios. The goal is not to "manage" penalties but to avoid them through timely processing and evidence.' },
      { type: 'heading2', content: 'When penalties apply' },
      { type: 'paragraph', content: 'Consult legal counsel for your jurisdiction. Generally, late or incomplete processing and failure to maintain required evidence increase exposure.' },
      { type: 'heading2', content: 'Operational defense' },
      { type: 'paragraph', content: 'Automate ingestion and execution, set partner SLAs, and maintain immutable logs. Reduce backlogs so you are not in the penalty zone.' }
    ],
    faqs: [
      { question: 'What is the $200 per day penalty?', answer: 'Under California law, certain violations can result in penalties on a per-request, per-day basis. Exact applicability depends on the statute and facts.' },
      { question: 'How do I avoid penalty exposure?', answer: 'Process requests within the required timeline, maintain evidence, and avoid backlogs through automation and clear SLAs.' }
    ],
    internalLinks: ['dsar-automation-roi', 'sb362-45-day-deadline', 'california-delete-act-audits-2028']
  },
  {
    slug: 'cost-per-request-automation',
    title: 'Cost Per Request: Manual vs Automated Deletion Pipelines',
    description: 'Comparing manual cost (e.g. $1,524/request) to automated pipeline cost and risk reduction.',
    category: 'F',
    keywords: ['cost', 'automation', 'ROI', 'per request', 'pipeline'],
    publishedAt: '2025-02-16',
    updatedAt: '2025-02-16',
    bodySections: [
      { type: 'paragraph', content: 'Manual processing cost per request is often in the hundreds or thousands of dollars when you include labor, coordination, and rework. Automation reduces both cost and latency.' },
      { type: 'heading2', content: 'Manual cost drivers' },
      { type: 'list', content: ['Labor to locate and delete across systems.', 'Partner follow-up (email, tickets).', 'Evidence compilation and quality checks.', 'Rework from partial or failed deletions.'] },
      { type: 'heading2', content: 'Automation benefits' },
      { type: 'paragraph', content: 'Lower cost per request, faster completion, and consistent evidence. ROI improves as volume grows and penalty risk drops.' }
    ],
    faqs: [
      { question: 'How much does manual deletion processing cost?', answer: 'Estimates vary; $1,524 per request is a commonly cited baseline including labor, coordination, and evidence.' },
      { question: 'What is the ROI of automation?', answer: 'Lower cost per request, faster turnaround, and reduced penalty and audit risk. ROI increases with volume and complexity.' }
    ],
    internalLinks: ['dsar-automation-roi', 'penalty-200-per-day', 'drop-api-integration-guide']
  }
]

// Add more to reach 50+ total (we have 4 + 12 = 16, need 34 more)
const MORE_ARTICLES = [
  { slug: 'p-hash-subject-identifier', title: 'p_hash and Subject Identifiers: Hashing Without Sending PII', description: 'Use hashed subject identifiers in pipelines and logs to avoid sending PII to downstream systems.', category: 'B', keywords: ['p_hash', 'hashing', 'PII', 'subject', 'identifier'], publishedAt: '2025-02-17', updatedAt: '2025-02-17', bodySections: [{ type: 'paragraph', content: 'Subject hashes (e.g. p_hash) let you reference a person in logs and APIs without sending raw PII. Hash locally with a consistent recipe; store and transmit only the hash.' }, { type: 'heading2', content: 'Recipe consistency' }, { type: 'paragraph', content: 'Same input must always produce the same hash. Normalize (e.g. email lower/trim, phone E.164) before hashing. Version your recipe.' }], faqs: [{ question: 'What is p_hash?', answer: 'A hashed representation of a subject identifier, so you can reference the subject in logs and APIs without storing or sending raw PII.' }], internalLinks: ['drop-api-integration-guide', 'california-delete-act-audits-2028'] },
  { slug: 'dry-run-vs-enforce', title: 'DRY_RUN vs ENFORCE: Testing Your Deletion Pipeline Safely', description: 'Run in dry-run mode to validate flow and logs without executing real deletions.', category: 'B', keywords: ['dry run', 'enforce', 'testing', 'pipeline'], publishedAt: '2025-02-17', updatedAt: '2025-02-17', bodySections: [{ type: 'paragraph', content: 'A DRY_RUN mode executes the full pipeline—ingestion, state machine, partner calls—but does not perform actual deletions. Use it to validate logic and evidence before going live.' }], faqs: [{ question: 'What is DRY_RUN?', answer: 'A mode where the pipeline runs end-to-end but does not perform real deletions; used for testing and validation.' }], internalLinks: ['drop-api-integration-guide', 'workflow-state-machine-deletion'] },
  { slug: 'connector-token-security', title: 'Connector Tokens: One-Time Display and Rotation', description: 'Agent connectors use tokens for control-plane auth. Show once, rotate if compromised.', category: 'B', keywords: ['connector', 'token', 'security', 'agent'], publishedAt: '2025-02-18', updatedAt: '2025-02-18', bodySections: [{ type: 'paragraph', content: 'Connector tokens authenticate your agent to the control plane. Display them only once at creation; support rotation if a token is exposed.' }], faqs: [], internalLinks: ['drop-api-integration-guide'] },
  { slug: 'partner-types-api-webhook-sftp', title: 'Partner Types: API, Webhook, SFTP, and Manual Flows', description: 'Different downstream partners need different integration patterns and SLAs.', category: 'C', keywords: ['partner', 'API', 'webhook', 'SFTP'], publishedAt: '2025-02-18', updatedAt: '2025-02-18', bodySections: [{ type: 'paragraph', content: 'Partners may expose APIs, webhooks, SFTP drops, or require manual steps. Map each partner to a type and define retry and attestation behavior accordingly.' }], faqs: [], internalLinks: ['cascade-deletion-partners', 'downstream-partner-sla'] },
  { slug: 'attestation-required', title: 'When to Require Partner Attestation', description: 'Attestations prove that a partner received and processed a deletion. When to require and how to store.', category: 'C', keywords: ['attestation', 'partner', 'evidence'], publishedAt: '2025-02-19', updatedAt: '2025-02-19', bodySections: [{ type: 'paragraph', content: 'For high-risk or audit-critical partners, require explicit attestation. Store it with the request and include it in audit packets.' }], faqs: [], internalLinks: ['cascade-deletion-partners', 'audit-packet-export'] },
  { slug: 'escalation-email-runbook', title: 'Escalation Email and Runbooks for Failed Cascades', description: 'When a partner does not respond or fails, who gets notified and what happens next.', category: 'C', keywords: ['escalation', 'runbook', 'cascade', 'failure'], publishedAt: '2025-02-19', updatedAt: '2025-02-19', bodySections: [{ type: 'paragraph', content: 'Define escalation_email and a runbook: after N failures, notify and optionally pause or route to manual handling. Log all escalations.' }], faqs: [], internalLinks: ['retry-backoff-cascade', 'downstream-partner-sla'] },
  { slug: 'triennial-audit-timeline', title: 'Triennial Audit Timeline: What to Prepare Now', description: 'Audits run on a cycle. Prepare evidence and processes well in advance.', category: 'D', keywords: ['triennial', 'audit', 'timeline', 'evidence'], publishedAt: '2025-02-20', updatedAt: '2025-02-20', bodySections: [{ type: 'paragraph', content: 'Know when your next audit window is. Have request lifecycle, partner attestations, and exportable logs ready so you are not scrambling.' }], faqs: [], internalLinks: ['california-delete-act-audits-2028', 'immutable-audit-logs'] },
  { slug: 'request-id-correlation', title: 'Request ID: Correlating Events Across Systems', description: 'Use a single request_id across ingestion, execution, and partner calls for clear audit trails.', category: 'D', keywords: ['request id', 'correlation', 'audit'], publishedAt: '2025-02-20', updatedAt: '2025-02-20', bodySections: [{ type: 'paragraph', content: 'One request_id per logical deletion request. Carry it through every log and partner call so you can reconstruct the full story later.' }], faqs: [], internalLinks: ['audit-packet-export', 'drop-api-integration-guide'] },
  { slug: 'lead-gen-data-flows', title: 'Lead Gen Data Flows and Broker Classification', description: 'How data flows from forms and campaigns can trigger data broker obligations.', category: 'E', keywords: ['lead gen', 'data flow', 'broker'], publishedAt: '2025-02-20', updatedAt: '2025-02-20', bodySections: [{ type: 'paragraph', content: 'If leads are sold or shared with third parties, your data flow may fall under broker definitions. Map flows and assess scope.' }], faqs: [], internalLinks: ['data-broker-definition-sb362', 'shadow-broker-lead-gen'] },
  { slug: 'enrichment-vendors-broker', title: 'Enrichment Vendors and Data Broker Scope', description: 'Enrichment and identity resolution can place vendors and their clients in scope.', category: 'E', keywords: ['enrichment', 'vendor', 'broker'], publishedAt: '2025-02-20', updatedAt: '2025-02-20', bodySections: [{ type: 'paragraph', content: 'Vendors that add or match personal data may be brokers; clients that share data with them need to consider cascade and evidence.' }], faqs: [], internalLinks: ['data-broker-definition-sb362', 'cascade-deletion-partners'] },
  { slug: 'penalty-scenarios-avoid', title: 'Penalty Scenarios: What to Avoid', description: 'Common patterns that increase penalty and audit risk.', category: 'F', keywords: ['penalty', 'scenarios', 'risk'], publishedAt: '2025-02-20', updatedAt: '2025-02-20', bodySections: [{ type: 'paragraph', content: 'Backlogs, missing logs, incomplete cascades, and late responses are common triggers. Automate and document to avoid them.' }], faqs: [], internalLinks: ['penalty-200-per-day', 'cost-per-request-automation'] },
  { slug: 'roi-calculator-baseline', title: 'Building an ROI Baseline for Deletion Automation', description: 'How to estimate manual cost and compare to automated pipeline cost.', category: 'F', keywords: ['ROI', 'baseline', 'automation'], publishedAt: '2025-02-20', updatedAt: '2025-02-20', bodySections: [{ type: 'paragraph', content: 'Use labor, coordination, and rework to estimate cost per request. Compare to automation and penalty avoidance for ROI.' }], faqs: [], internalLinks: ['dsar-automation-roi', 'cost-per-request-automation'] }
]

const BATCH_50 = [
  { slug: 'normalization-email-phone', title: 'Normalizing Email and Phone for Consistent Hashing', description: 'Lowercase, trim, E.164: normalization rules for p_hash recipes.', category: 'B', keywords: ['normalization', 'email', 'phone', 'p_hash'], publishedAt: '2025-02-20', updatedAt: '2025-02-20', bodySections: [{ type: 'paragraph', content: 'Hash recipes must normalize inputs so the same person always yields the same hash. Email: lower and trim. Phone: E.164 digits.' }], faqs: [], internalLinks: ['p-hash-subject-identifier'] },
  { slug: 'versioned-hash-recipe', title: 'Versioned Hash Recipes: Changing Rules Safely', description: 'When you change normalization, version the recipe so old and new hashes are traceable.', category: 'B', keywords: ['version', 'hash', 'recipe'], publishedAt: '2025-02-20', updatedAt: '2025-02-20', bodySections: [{ type: 'paragraph', content: 'Store recipe version with each hash. When you change rules, create a new version so you can still interpret historical data.' }], faqs: [], internalLinks: ['p-hash-subject-identifier', 'drop-api-integration-guide'] },
  { slug: 'heartbeat-connector-health', title: 'Connector Heartbeats: Monitoring Agent Health', description: 'Agents send heartbeats to the control plane. Use them for status and alerting.', category: 'B', keywords: ['heartbeat', 'connector', 'health'], publishedAt: '2025-02-20', updatedAt: '2025-02-20', bodySections: [{ type: 'paragraph', content: 'A connector that stops heartbeating may be down or disconnected. Surface last_heartbeat in the dashboard and alert on staleness.' }], faqs: [], internalLinks: ['connector-token-security'] },
  { slug: 'docker-run-agent', title: 'One-Command Agent: Docker Run and ENV Vars', description: 'Run the DROP agent with CONTROL_PLANE_URL, CONNECTOR_TOKEN, DB_URL, and HASH_RECIPE_ID.', category: 'B', keywords: ['docker', 'agent', 'connector'], publishedAt: '2025-02-20', updatedAt: '2025-02-20', bodySections: [{ type: 'paragraph', content: 'The agent runs as a container. Set CONTROL_PLANE_URL, CONNECTOR_TOKEN, DB_TYPE, DB_URL, HASH_RECIPE_ID, and DRY_RUN. Copy the command once after creating a connector.' }], faqs: [], internalLinks: ['connector-token-security', 'dry-run-vs-enforce'] },
  { slug: 'multi-connector-org', title: 'Multiple Connectors Per Organization', description: 'Support several data sources or environments with one org and multiple connectors.', category: 'C', keywords: ['connector', 'multi', 'org'], publishedAt: '2025-02-20', updatedAt: '2025-02-20', bodySections: [{ type: 'paragraph', content: 'One org can have many connectors (e.g. prod, staging, per DB). Each has its own token and heartbeat.' }], faqs: [], internalLinks: ['cascade-deletion-partners'] },
  { slug: 'partner-enabled-disabled', title: 'Enabling and Disabling Partners Without Losing History', description: 'Turn partners off for maintenance or compliance; keep audit history intact.', category: 'C', keywords: ['partner', 'enabled', 'disabled'], publishedAt: '2025-02-20', updatedAt: '2025-02-20', bodySections: [{ type: 'paragraph', content: 'Partners have an enabled flag. Disabling skips new cascades but does not alter past events in the audit log.' }], faqs: [], internalLinks: ['cascade-deletion-partners'] },
  { slug: 'sla-days-per-policy', title: 'SLA Days in Cascade Policy', description: 'Set sla_days per partner-connector policy so you know when to escalate.', category: 'C', keywords: ['SLA', 'policy', 'cascade'], publishedAt: '2025-02-20', updatedAt: '2025-02-20', bodySections: [{ type: 'paragraph', content: 'Each cascade policy can define sla_days. Use it to trigger escalation and to report on compliance.' }], faqs: [], internalLinks: ['downstream-partner-sla', 'escalation-email-runbook'] },
  { slug: 'mode-dry-run-enforce', title: 'Policy Mode: DRY_RUN vs ENFORCE in Cascades', description: 'Per-policy mode lets you test some partners in dry-run while others run live.', category: 'C', keywords: ['mode', 'DRY_RUN', 'ENFORCE'], publishedAt: '2025-02-20', updatedAt: '2025-02-20', bodySections: [{ type: 'paragraph', content: 'Cascade policies can be DRY_RUN (no real deletion) or ENFORCE. Use DRY_RUN for new partners until validated.' }], faqs: [], internalLinks: ['dry-run-vs-enforce', 'cascade-deletion-partners'] },
  { slug: 'dispatch-cascade-test', title: 'Dispatching a Cascade Test', description: 'Use the admin dispatch endpoint to trigger a test run in tenant scope.', category: 'C', keywords: ['dispatch', 'cascade', 'test'], publishedAt: '2025-02-20', updatedAt: '2025-02-20', bodySections: [{ type: 'paragraph', content: 'The dispatch endpoint starts a cascade run for testing. Use it to verify partner wiring and logs without production data.' }], faqs: [], internalLinks: ['cascade-deletion-partners', 'retry-backoff-cascade'] },
  { slug: 'runs-list-and-detail', title: 'Runs: List and Detail View', description: 'View execution runs, status, and events for each run.', category: 'D', keywords: ['runs', 'execution', 'detail'], publishedAt: '2025-02-20', updatedAt: '2025-02-20', bodySections: [{ type: 'paragraph', content: 'Runs represent execution cycles. List runs and drill into one to see events and cascades for that run.' }], faqs: [], internalLinks: ['california-delete-act-audits-2028', 'audit-packet-export'] },
  { slug: 'export-audit-json', title: 'Exporting Audit Packet as JSON', description: 'Download a JSON file of all audit events for a request or time range.', category: 'D', keywords: ['export', 'audit', 'JSON'], publishedAt: '2025-02-20', updatedAt: '2025-02-20', bodySections: [{ type: 'paragraph', content: 'The audit export returns a JSON blob. Use it for offline review or to supply to auditors.' }], faqs: [], internalLinks: ['audit-packet-export', 'immutable-audit-logs'] },
  { slug: 'search-audit-by-request-id', title: 'Searching Audit Logs by request_id', description: 'Filter audit events by request_id to build a per-request story.', category: 'D', keywords: ['search', 'audit', 'request_id'], publishedAt: '2025-02-20', updatedAt: '2025-02-20', bodySections: [{ type: 'paragraph', content: 'Query the audit API with request_id to get all events for that request. Essential for audit packets and investigations.' }], faqs: [], internalLinks: ['request-id-correlation', 'audit-packet-export'] },
  { slug: 'people-search-broker', title: 'People-Search and Broker Classification', description: 'People-search products often fall under data broker definitions.', category: 'E', keywords: ['people search', 'broker', 'classification'], publishedAt: '2025-02-20', updatedAt: '2025-02-20', bodySections: [{ type: 'paragraph', content: 'If you offer people-search or identity lookup, you likely collect and make available personal data. Assess broker scope and deletion obligations.' }], faqs: [], internalLinks: ['data-broker-definition-sb362', 'shadow-broker-lead-gen'] },
  { slug: 'reseller-data-broker', title: 'Resellers and Data Broker Obligations', description: 'Selling or licensing data through resellers can trigger broker rules.', category: 'E', keywords: ['reseller', 'data broker', 'obligations'], publishedAt: '2025-02-20', updatedAt: '2025-02-20', bodySections: [{ type: 'paragraph', content: 'If you supply data to resellers who then sell or share it, both you and the reseller may have broker obligations and cascade requirements.' }], faqs: [], internalLinks: ['data-broker-definition-sb362', 'cascade-deletion-partners'] },
  { slug: 'setup-fee-early-access', title: 'Setup Fee and Early Access: What You Get', description: 'Early Access includes onboarding, architecture review, and evidence blueprint.', category: 'F', keywords: ['setup fee', 'early access', 'onboarding'], publishedAt: '2025-02-20', updatedAt: '2025-02-20', bodySections: [{ type: 'paragraph', content: 'A one-time setup fee often covers onboarding, DROP readiness plan, evidence and logging blueprint, cascade templates, and runbook. Subscription tiers add throughput and support.' }], faqs: [], internalLinks: ['dsar-automation-roi', 'california-delete-act-audits-2028'] },
  { slug: 'subscription-tiers-throughput', title: 'Subscription Tiers and Throughput', description: 'Startup, Growth, and Enterprise tiers scale request volume and features.', category: 'F', keywords: ['subscription', 'tiers', 'throughput'], publishedAt: '2025-02-20', updatedAt: '2025-02-20', bodySections: [{ type: 'paragraph', content: 'Tiers define request volume (e.g. 1K/mo, 5K/mo) and features like attestations dashboard and priority support.' }], faqs: [], internalLinks: ['cost-per-request-automation', 'setup-fee-early-access'] },
  { slug: 'billing-portal-stripe', title: 'Customer Portal and Stripe Billing', description: 'Use the customer portal to manage subscription and payment methods.', category: 'F', keywords: ['billing', 'portal', 'Stripe'], publishedAt: '2025-02-20', updatedAt: '2025-02-20', bodySections: [{ type: 'paragraph', content: 'The backend returns a Stripe Customer Portal URL. Use it to update payment methods and view invoices.' }], faqs: [], internalLinks: ['setup-fee-early-access'] },
  { slug: 'zero-knowledge-hash-browser', title: 'Zero-Knowledge Hashing in the Browser', description: 'Hash recipe testing runs in the browser; no PII is sent to the server.', category: 'B', keywords: ['zero knowledge', 'hash', 'browser', 'PII'], publishedAt: '2025-02-20', updatedAt: '2025-02-20', bodySections: [{ type: 'paragraph', content: 'The Hash Recipe Tester generates subject_hash locally with Web Crypto. PII never leaves the device. Only recipe metadata is stored on the server.' }], faqs: [], internalLinks: ['p-hash-subject-identifier', 'normalization-email-phone'] },
  { slug: 'onboarding-wizard-steps', title: 'Onboarding Wizard: From Connector to Schedule', description: 'Step-by-step: create connector, test heartbeat, recipe, partners, cascade, schedule.', category: 'B', keywords: ['onboarding', 'wizard', 'connector'], publishedAt: '2025-02-20', updatedAt: '2025-02-20', bodySections: [{ type: 'paragraph', content: 'The onboarding flow walks you through workspace, connector (with docker run), connection test, hash recipe, partners and cascade, and run schedule.' }], faqs: [], internalLinks: ['docker-run-agent', 'sb362-45-day-deadline'] },
  { slug: 'readiness-score-dashboard', title: 'Readiness Score on the Dashboard', description: 'Dashboard shows connector, recipe, partners, cascade, and schedule status.', category: 'B', keywords: ['readiness', 'dashboard', 'score'], publishedAt: '2025-02-20', updatedAt: '2025-02-20', bodySections: [{ type: 'paragraph', content: 'A simple readiness score reflects how many of the key pieces are in place: connector connected, recipe configured, partners added, cascade defined, schedule set (e.g. ≤45 days).' }], faqs: [], internalLinks: ['onboarding-wizard-steps', 'sb362-45-day-deadline'] },
  { slug: 'legal-disclaimer-compliance', title: 'Compliance and Legal Disclaimer', description: 'This content is for technical and operational guidance, not legal advice.', category: 'A', keywords: ['disclaimer', 'legal', 'compliance'], publishedAt: '2025-02-20', updatedAt: '2025-02-20', bodySections: [{ type: 'paragraph', content: 'Materials on this site are for informational and technical use. They do not constitute legal advice. Consult qualified counsel for your situation and jurisdiction.' }], faqs: [{ question: 'Is this legal advice?', answer: 'No. This content is for technical and operational guidance only. Consult a qualified attorney for legal advice.' }], internalLinks: ['data-broker-definition-sb362'] },
  { slug: 'august-1-mandatory-deadline', title: 'August 1st Mandatory Deadline: Last-Minute Checklist', description: 'Final checklist before mandatory DROP enforcement: ingestion, evidence, and partner SLAs.', category: 'A', keywords: ['August 1', 'mandatory', 'deadline', 'checklist'], publishedAt: '2025-02-20', updatedAt: '2025-02-20', bodySections: [{ type: 'paragraph', content: 'As the mandatory enforcement date approaches, ensure your connector is live, hash recipe is set, partners and cascade policy are configured, and run schedule is within 45 days.' }], faqs: [], internalLinks: ['enforcement-august-2026', 'sb362-45-day-deadline', 'readiness-score-dashboard'] }
]

articles.push(...EXTRA_ARTICLES, ...MORE_ARTICLES, ...BATCH_50)

export function getArticleBySlug(slug) {
  return articles.find((a) => a.slug === slug)
}

export function getArticlesByCategory(category) {
  return articles.filter((a) => a.category === category)
}

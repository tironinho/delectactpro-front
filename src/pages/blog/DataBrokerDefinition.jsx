import ArticleLayout from './ArticleLayout.jsx'

export default function DataBrokerDefinition() {
  return (
    <ArticleLayout
      title="Is My Company a Data Broker under SB 362?"
      description="A technical definition for 'shadow brokers'—and how to determine if you fall into the enforcement blast radius."
      canonicalPath="/blog/data-broker-definition-sb362"
    >
      <p>
        Many companies process personal data without thinking of themselves as “data brokers.”
        Enforcement doesn’t care about your brand narrative — it cares about data flows, disclosures, and whether you trade in personal information.
      </p>

      <h2 className="text-xl font-bold text-slate-50">The “Shadow Broker” pattern</h2>
      <p>
        A “shadow broker” is a company that enables third-party access to personal information through aggregation,
        enrichment, identity resolution, marketing datasets, people-search functionality, or partner distribution networks — even if brokerage isn't the headline product.
      </p>

      <h2 className="text-xl font-bold text-slate-50">Engineering checklist</h2>
      <ul className="list-disc pl-6 space-y-2">
        <li>Do you sell, license, or exchange personal info datasets or derived signals?</li>
        <li>Do you maintain identity graphs, matching services, or enrichment pipelines?</li>
        <li>Do you distribute data via downstream partners/resellers?</li>
        <li>Do deletion requests require actions across multiple systems and partners?</li>
        <li>Do you retain data primarily to make it available to others?</li>
      </ul>

      <h2 className="text-xl font-bold text-slate-50">Operational risk test</h2>
      <p>
        If you can’t answer “where does this person’s data exist” quickly, you're structurally vulnerable to strict deletion mandates.
        The needed system is orchestration + evidence — not a form.
      </p>
    </ArticleLayout>
  )
}

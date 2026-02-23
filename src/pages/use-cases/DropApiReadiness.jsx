import { Link } from 'react-router-dom'
import Container from '../../components/Container.jsx'
import Seo from '../../components/Seo.jsx'
import Button from '../../components/ui/Button.jsx'

export default function DropApiReadiness() {
  return (
    <main className="min-h-screen bg-slate-950">
      <Seo
        title="DROP API Readiness — California Data Broker Registry Integration"
        description="Get ready for the California DROP API: idempotency, retries, evidence logs, and cascading deletions. Spring 2026 sandbox."
        canonicalPath="/use-cases/drop-api-readiness"
      />
      <Container className="py-16 md:py-24">
        <h1 className="text-4xl font-extrabold tracking-tight text-slate-50">Use case: DROP API readiness</h1>
        <p className="mt-4 max-w-2xl text-lg text-slate-300">
          Integrate with the California Data Broker Registry (DROP) API: ingestion, idempotency, retries, and evidence.
        </p>
        <ul className="mt-8 space-y-2 text-slate-300">
          <li>• Normalized request lifecycle and idempotency keys</li>
          <li>• Partner cascade with retries and attestations</li>
          <li>• Immutable audit logs and exportable packets</li>
          <li>• Spring 2026 API sandbox readiness</li>
        </ul>
        <div className="mt-12 flex flex-wrap gap-4">
          <a href="/#pricing">
            <Button>Get Early Access</Button>
          </a>
          <Link to="/blog/drop-api-integration-guide">
            <Button variant="ghost">Technical integration guide</Button>
          </Link>
        </div>
      </Container>
    </main>
  )
}

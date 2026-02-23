import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Card, CardContent, CardHeader } from '../../components/ui/Card.jsx'
import Button from '../../components/ui/Button.jsx'
import { listConnectors, listCustomerApis } from '../../services/appService.js'
import { Plug, Globe, Circle, Plus } from 'lucide-react'

export default function Integrations() {
  const [connectors, setConnectors] = useState([])
  const [customerApis, setCustomerApis] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      listConnectors().then((d) => (Array.isArray(d) ? d : d?.connectors || [])).catch(() => []),
      listCustomerApis().then((d) => (Array.isArray(d) ? d : d?.integrations || d || [])).catch(() => [])
    ]).then(([c, a]) => {
      setConnectors(c)
      setCustomerApis(a)
    }).finally(() => setLoading(false))
  }, [])

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-slate-50">Integrations</h1>
        <p className="mt-1 text-slate-400">Connect via Docker Agent or your own Customer APIs</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="flex flex-col">
          <CardHeader className="flex flex-row items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-regulatory-500/15 ring-1 ring-regulatory-500/25">
                <Plug className="h-6 w-6 text-regulatory-200" />
              </span>
              <div>
                <div className="text-lg font-semibold text-slate-50">Agent Connector</div>
                <p className="text-xs text-slate-400">Zero-knowledge agent in your environment</p>
              </div>
            </div>
            <Link to="/app/connectors">
              <Button size="sm">Manage</Button>
            </Link>
          </CardHeader>
          <CardContent className="flex-1 space-y-3">
            {loading ? (
              <p className="text-sm text-slate-500">Loading…</p>
            ) : connectors.length === 0 ? (
              <p className="text-sm text-slate-500">No connectors. Create one to run the agent with a single docker run.</p>
            ) : (
              <ul className="space-y-2">
                {connectors.slice(0, 5).map((c) => (
                  <li key={c.id} className="flex items-center gap-2 rounded-xl border border-slate-800 px-3 py-2 text-sm">
                    <Circle className={c.last_heartbeat ? 'h-2 w-2 fill-regulatory-400 text-regulatory-400' : 'h-2 w-2 text-slate-500'} />
                    <span className="text-slate-200">{c.name || c.id}</span>
                    <span className="text-xs text-slate-500">{c.db_type}</span>
                  </li>
                ))}
                {connectors.length > 5 && <p className="text-xs text-slate-500">+{connectors.length - 5} more</p>}
              </ul>
            )}
            <Link to="/app/connectors" className="inline-flex items-center gap-1 text-sm font-medium text-regulatory-300 hover:text-regulatory-200">
              <Plus className="h-4 w-4" /> Create connector
            </Link>
          </CardContent>
        </Card>

        <Card className="flex flex-col">
          <CardHeader className="flex flex-row items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-700/50 ring-1 ring-slate-600">
                <Globe className="h-6 w-6 text-slate-300" />
              </span>
              <div>
                <div className="text-lg font-semibold text-slate-50">Customer APIs</div>
                <p className="text-xs text-slate-400">Your endpoints: health, delete, status</p>
              </div>
            </div>
            <Link to="/app/customer-apis">
              <Button variant="ghost" size="sm">Manage</Button>
            </Link>
          </CardHeader>
          <CardContent className="flex-1 space-y-3">
            {loading ? (
              <p className="text-sm text-slate-500">Loading…</p>
            ) : customerApis.length === 0 ? (
              <p className="text-sm text-slate-500">No Customer API integrations. Add one to use your own infrastructure.</p>
            ) : (
              <ul className="space-y-2">
                {customerApis.slice(0, 5).map((api) => (
                  <li key={api.id} className="flex items-center gap-2 rounded-xl border border-slate-800 px-3 py-2 text-sm">
                    <Circle className={api.last_healthcheck ? 'h-2 w-2 fill-regulatory-400 text-regulatory-400' : 'h-2 w-2 text-slate-500'} />
                    <span className="text-slate-200">{api.name || api.id}</span>
                    <span className="truncate text-xs text-slate-500 max-w-[120px]">{api.baseUrl}</span>
                  </li>
                ))}
                {customerApis.length > 5 && <p className="text-xs text-slate-500">+{customerApis.length - 5} more</p>}
              </ul>
            )}
            <Link to="/app/customer-apis" className="inline-flex items-center gap-1 text-sm font-medium text-regulatory-300 hover:text-regulatory-200">
              <Plus className="h-4 w-4" /> Add Customer API
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

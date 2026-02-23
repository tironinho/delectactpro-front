import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader } from '../../components/ui/Card.jsx'
import Button from '../../components/ui/Button.jsx'
import { listConnectors, createConnector, rotateConnectorToken } from '../../services/appService.js'
import { Copy, Check, RefreshCw, Circle } from 'lucide-react'

const CONTROL_PLANE_URL = import.meta.env.VITE_API_BASE_URL || 'https://api.deleteactpro.com'

export default function Connectors() {
  const [connectors, setConnectors] = useState([])
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)
  const [newName, setNewName] = useState('')
  const [newDbType, setNewDbType] = useState('postgres')
  const [rotated, setRotated] = useState(null) // { id, token, dockerRun }
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState('')

  function load() {
    setLoading(true)
    listConnectors()
      .then((data) => setConnectors(Array.isArray(data) ? data : data?.connectors || []))
      .catch(() => setConnectors([]))
      .finally(() => setLoading(false))
  }

  useEffect(() => load(), [])

  function buildDockerRun(token, connectorId, dbType = 'postgres') {
    const control = CONTROL_PLANE_URL
    const cId = connectorId || '${CONNECTOR_ID}'
    return `docker run --rm \\
  -e CONTROL_PLANE_URL=${control} \\
  -e CONNECTOR_TOKEN=${token} \\
  -e CONNECTOR_ID=${cId} \\
  -e DB_TYPE=${dbType} \\
  -e DB_URL=your_db_url \\
  -e HASH_RECIPE_ID=your_recipe_id \\
  -e DRY_RUN=1 \\
  -e POLL_INTERVAL_HOURS=24 \\
  deleteactpro/agent:latest`
  }

  async function handleCreate(e) {
    e.preventDefault()
    setError('')
    setCreating(true)
    try {
      await createConnector({ name: newName || 'Connector', db_type: newDbType })
      setNewName('')
      load()
    } catch (e) {
      setError(e?.message || 'Create failed')
    } finally {
      setCreating(false)
    }
  }

  async function handleRotate(id) {
    setError('')
    try {
      const data = await rotateConnectorToken(id)
      const token = data?.token || data?.connector_token
      const conn = connectors.find((c) => c.id === id)
      setRotated({ id, token, dockerRun: buildDockerRun(token, conn?.id, conn?.db_type || 'postgres') })
    } catch (e) {
      setError(e?.message || 'Rotate failed')
    }
  }

  function copy(str) {
    navigator.clipboard.writeText(str)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-slate-50">Connectors</h1>
        <p className="mt-1 text-slate-400">Manage data source connectors and agent tokens</p>
      </div>

      {error ? (
        <div className="rounded-xl border border-danger-500/30 bg-danger-500/10 px-4 py-3 text-sm text-danger-200">{error}</div>
      ) : null}

      <Card>
        <CardHeader>
          <div className="text-sm font-semibold text-slate-50">Create connector</div>
          <p className="text-xs text-slate-400">Name and DB type; you'll get a one-time token and docker command.</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleCreate} className="flex flex-wrap items-end gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-400">Name</label>
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="My Connector"
                className="mt-1 w-48 rounded-xl border border-slate-800 bg-slate-950/60 px-3 py-2 text-sm text-slate-100"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400">DB type</label>
              <select
                value={newDbType}
                onChange={(e) => setNewDbType(e.target.value)}
                className="mt-1 w-40 rounded-xl border border-slate-800 bg-slate-950/60 px-3 py-2 text-sm text-slate-100"
              >
                <option value="postgres">PostgreSQL</option>
                <option value="mysql">MySQL</option>
                <option value="sqlite">SQLite</option>
              </select>
            </div>
            <Button type="submit" disabled={creating}>{creating ? 'Creating…' : 'Create'}</Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="text-sm font-semibold text-slate-50">Connectors</div>
          <p className="text-xs text-slate-400">Status and last heartbeat</p>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-sm text-slate-500">Loading…</p>
          ) : connectors.length === 0 ? (
            <p className="text-sm text-slate-500">No connectors yet.</p>
          ) : (
            <ul className="space-y-4">
              {connectors.map((c) => (
                <li key={c.id} className="rounded-xl border border-slate-800 p-4">
                  <div className="flex flex-wrap items-center gap-3">
                    <Circle className={c.last_heartbeat ? 'h-3 w-3 fill-regulatory-400 text-regulatory-400' : 'h-3 w-3 text-slate-500'} />
                    <span className="font-medium text-slate-200">{c.name || c.id}</span>
                    <span className="text-xs text-slate-500">{c.db_type}</span>
                    {c.version ? <span className="text-xs text-slate-500">v{c.version}</span> : null}
                    {c.last_heartbeat ? (
                      <span className="text-xs text-slate-400">Last heartbeat: {new Date(c.last_heartbeat).toLocaleString()}</span>
                    ) : (
                      <span className="text-xs text-slate-500">No heartbeat</span>
                    )}
                    <Button variant="ghost" size="sm" onClick={() => handleRotate(c.id)} className="ml-auto">
                      <RefreshCw className="h-4 w-4" /> Rotate token
                    </Button>
                  </div>
                  {rotated?.id === c.id && (
                    <div className="mt-4 rounded-lg border border-regulatory-500/30 bg-regulatory-500/10 p-3">
                      <p className="mb-2 text-xs font-semibold text-regulatory-200">New token (shown once)</p>
                      <pre className="mb-2 overflow-x-auto text-xs text-slate-300">{rotated.dockerRun}</pre>
                      <button
                        type="button"
                        onClick={() => copy(rotated.dockerRun)}
                        className="inline-flex items-center gap-1 rounded-lg border border-slate-700 bg-slate-800 px-2 py-1 text-xs text-slate-200 hover:bg-slate-700"
                      >
                        {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />} Copy
                      </button>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="text-sm font-semibold text-slate-50">ENV vars</div>
        </CardHeader>
        <CardContent className="text-sm text-slate-400">
          <ul className="list-inside list-disc space-y-1">
            <li><span className="font-mono text-slate-300">CONTROL_PLANE_URL</span> — API base (e.g. {CONTROL_PLANE_URL})</li>
            <li><span className="font-mono text-slate-300">CONNECTOR_TOKEN</span> — One-time token from create/rotate</li>
            <li><span className="font-mono text-slate-300">CONNECTOR_ID</span> — Connector ID (from this page)</li>
            <li><span className="font-mono text-slate-300">DB_TYPE</span> — postgres | mysql | sqlite</li>
            <li><span className="font-mono text-slate-300">DB_URL</span> — Connection string</li>
            <li><span className="font-mono text-slate-300">HASH_RECIPE_ID</span> — Active recipe ID from Hash Recipes</li>
            <li><span className="font-mono text-slate-300">DRY_RUN</span> — 1 for test, 0 for live</li>
            <li><span className="font-mono text-slate-300">POLL_INTERVAL_HOURS</span> — How often to poll (default 24)</li>
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="text-sm font-semibold text-slate-50">How to</div>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-slate-300">
          <p>1. Create a connector above and copy the full <span className="font-mono text-slate-200">docker run</span> command.</p>
          <p>2. Replace <span className="font-mono text-slate-200">DB_URL</span> with your database connection string and <span className="font-mono text-slate-200">HASH_RECIPE_ID</span> with the active recipe from Hash Recipes.</p>
          <p>3. Run the command in your environment (server, VM, or container host). For local dev use <span className="font-mono text-slate-200">CONTROL_PLANE_URL=http://localhost:4242</span>.</p>
          <p>4. The agent will register and send heartbeats. Check &quot;Last heartbeat&quot; here to confirm it is running.</p>
        </CardContent>
      </Card>
    </div>
  )
}

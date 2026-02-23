import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent, CardHeader } from '../../components/ui/Card.jsx'
import Button from '../../components/ui/Button.jsx'
import {
  createConnector,
  listConnectors,
  createCustomerApi,
  listCustomerApis,
  testCustomerApiHealth
} from '../../services/appService.js'
import { Copy, Check, ChevronRight, Plug, Globe } from 'lucide-react'
import clsx from 'clsx'

const CONTROL_PLANE_URL = import.meta.env.VITE_API_BASE_URL || 'https://api.deleteactpro.com'
const DEFAULT_HEALTH = '/deleteactpro/health'
const DEFAULT_DELETE = '/deleteactpro/delete'
const DEFAULT_STATUS = '/deleteactpro/status'

const INTEGRATION_MODES = [
  { id: 'agent', label: 'Docker Agent (recommended)', desc: 'Zero-knowledge agent in your environment', icon: Plug },
  { id: 'customer_apis', label: 'Customer APIs', desc: 'Your endpoints: health, delete, status', icon: Globe },
  { id: 'csv', label: 'CSV / Batch fallback', desc: 'Optional bulk import path', icon: null }
]

export default function Onboarding() {
  const navigate = useNavigate()
  const [stepIndex, setStepIndex] = useState(0)
  const [integrationMode, setIntegrationMode] = useState(null) // 'agent' | 'customer_apis' | 'csv'

  // Agent path
  const [connectorName, setConnectorName] = useState('')
  const [dbType, setDbType] = useState('postgres')
  const [connectorToken, setConnectorToken] = useState(null)
  const [connectorId, setConnectorId] = useState(null)
  const [dockerRun, setDockerRun] = useState('')
  const [heartbeat, setHeartbeat] = useState(null)

  // Customer API path
  const [apiName, setApiName] = useState('')
  const [apiBaseUrl, setApiBaseUrl] = useState('')
  const [apiHealthPath, setApiHealthPath] = useState(DEFAULT_HEALTH)
  const [apiDeletePath, setApiDeletePath] = useState(DEFAULT_DELETE)
  const [apiStatusPath, setApiStatusPath] = useState(DEFAULT_STATUS)
  const [apiSharedSecret, setApiSharedSecret] = useState('')
  const [apiCreated, setApiCreated] = useState(false)
  const [apiHealthOk, setApiHealthOk] = useState(false)
  const [testApiLoading, setTestApiLoading] = useState(false)
  const [testApiMsg, setTestApiMsg] = useState('')

  const [copied, setCopied] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const steps = integrationMode === 'agent'
    ? ['mode', 'connector', 'test', 'recipe', 'partners', 'schedule']
    : integrationMode === 'customer_apis'
    ? ['mode', 'customer_api', 'test_api', 'recipe', 'partners', 'schedule']
    : integrationMode === 'csv'
    ? ['mode', 'recipe', 'partners', 'schedule']
    : ['mode']

  const stepId = steps[stepIndex]

  function buildDockerRun(token, cId, dbUrl = '${DB_URL}', recipeId = '${HASH_RECIPE_ID}') {
    const control = CONTROL_PLANE_URL
    return `docker run --rm \\
  -e CONTROL_PLANE_URL=${control} \\
  -e CONNECTOR_TOKEN=${token} \\
  -e CONNECTOR_ID=${cId || '${CONNECTOR_ID}'} \\
  -e DB_TYPE=${dbType} \\
  -e DB_URL=${dbUrl} \\
  -e HASH_RECIPE_ID=${recipeId} \\
  -e DRY_RUN=1 \\
  -e POLL_INTERVAL_HOURS=24 \\
  deleteactpro/agent:latest`
  }

  function copyToClipboard(str) {
    navigator.clipboard.writeText(str)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // —— Step: Choose mode ——
  if (stepId === 'mode') {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-50">Onboarding</h1>
          <p className="mt-1 text-slate-400">Choose how you want to integrate</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {INTEGRATION_MODES.map((m) => (
            <button
              key={m.id}
              type="button"
              onClick={() => {
                setIntegrationMode(m.id)
                setStepIndex(1)
                setError('')
              }}
              className={clsx(
                'rounded-2xl border p-6 text-left transition',
                integrationMode === m.id
                  ? 'border-regulatory-500/50 bg-regulatory-500/10'
                  : 'border-slate-800 bg-slate-950/40 hover:border-slate-700'
              )}
            >
              {m.icon && <m.icon className="h-8 w-8 text-slate-300 mb-3" />}
              <div className="font-semibold text-slate-50">{m.label}</div>
              <p className="mt-1 text-sm text-slate-400">{m.desc}</p>
            </button>
          ))}
        </div>
        {error ? <div className="rounded-xl border border-danger-500/30 bg-danger-500/10 px-4 py-3 text-sm text-danger-200">{error}</div> : null}
      </div>
    )
  }

  // —— Agent: Create Connector ——
  if (stepId === 'connector' && integrationMode === 'agent') {
    const handleCreate = async () => {
      setError('')
      setLoading(true)
      try {
        const data = await createConnector({ name: connectorName || 'My Connector', db_type: dbType })
        const token = data?.token || data?.connector_token || 'YOUR_TOKEN_ONCE_SHOWN'
        const cId = data?.id || data?.connector_id
        setConnectorToken(token)
        setConnectorId(cId)
        setDockerRun(buildDockerRun(token, cId))
      } catch (e) {
        setError(e?.message || 'Failed to create connector')
      } finally {
        setLoading(false)
      }
    }

    return (
      <div className="space-y-8">
        <div className="flex items-center gap-2 text-sm text-slate-400">
          <button type="button" onClick={() => setStepIndex(0)}>Onboarding</button>
          <span>/</span>
          <span className="text-slate-200">Create Connector</span>
        </div>
        <Card>
          <CardHeader>
            <div className="text-sm font-semibold text-slate-50">Create Connector (Agent)</div>
            <p className="text-xs text-slate-400">One-time token and docker run. Copy and run in your environment.</p>
          </CardHeader>
          <CardContent className="space-y-4">
            {error ? <div className="rounded-xl border border-danger-500/30 bg-danger-500/10 px-4 py-3 text-sm text-danger-200">{error}</div> : null}
            {!connectorToken ? (
              <>
                <div>
                  <label className="block text-xs font-medium text-slate-400">Name</label>
                  <input type="text" value={connectorName} onChange={(e) => setConnectorName(e.target.value)} placeholder="My Connector" className="mt-1 w-full max-w-sm rounded-xl border border-slate-800 bg-slate-950/60 px-4 py-2.5 text-slate-100" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400">DB type</label>
                  <select value={dbType} onChange={(e) => setDbType(e.target.value)} className="mt-1 w-full max-w-sm rounded-xl border border-slate-800 bg-slate-950/60 px-4 py-2.5 text-slate-100">
                    <option value="postgres">PostgreSQL</option>
                    <option value="mysql">MySQL</option>
                    <option value="sqlite">SQLite</option>
                  </select>
                </div>
                <Button onClick={handleCreate} disabled={loading}>{loading ? 'Creating…' : 'Create connector'}</Button>
              </>
            ) : (
              <>
                <div className="rounded-xl border border-regulatory-500/30 bg-regulatory-500/10 px-4 py-3 text-sm text-regulatory-200">Connector created. Copy the command below (token shown only once).</div>
                <div className="relative">
                  <pre className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-900 p-4 text-xs text-slate-300">{dockerRun}</pre>
                  <button type="button" onClick={() => copyToClipboard(dockerRun)} className="absolute right-2 top-2 flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs text-slate-200 hover:bg-slate-700">
                    {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />} {copied ? 'Copied' : 'Copy'}
                  </button>
                </div>
                <p className="text-xs text-slate-500">Local dev: CONTROL_PLANE_URL=http://localhost:4242</p>
                <Button onClick={() => setStepIndex(2)}>Next: Test connection <ChevronRight className="h-4 w-4" /></Button>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    )
  }

  // —— Agent: Test connection ——
  if (stepId === 'test' && integrationMode === 'agent') {
    const handleTest = async () => {
      setError('')
      try {
        const list = await listConnectors()
        const conns = Array.isArray(list) ? list : list?.connectors || []
        const c = connectorId ? conns.find((x) => x.id === connectorId) : conns[0]
        setHeartbeat(c?.last_heartbeat ? new Date(c.last_heartbeat).toISOString() : null)
      } catch (e) {
        setError(e?.message || 'Could not verify')
      }
    }
    return (
      <div className="space-y-8">
        <div className="flex items-center gap-2 text-sm text-slate-400">
          <button type="button" onClick={() => setStepIndex(1)}>Connector</button>
          <span>/</span>
          <span className="text-slate-200">Test connection</span>
        </div>
        <Card>
          <CardHeader>
            <div className="text-sm font-semibold text-slate-50">Test connection</div>
            <p className="text-xs text-slate-400">After running the agent, check last heartbeat.</p>
          </CardHeader>
          <CardContent className="space-y-4">
            {error ? <div className="rounded-xl border border-danger-500/30 bg-danger-500/10 px-4 py-3 text-sm text-danger-200">{error}</div> : null}
            <Button onClick={handleTest}>Test connection</Button>
            {heartbeat ? <p className="text-sm text-regulatory-300">Last heartbeat: {heartbeat}</p> : <p className="text-sm text-slate-500">No heartbeat yet. Run the docker command first.</p>}
            <Button onClick={() => setStepIndex(3)}>Next: Hash recipe <ChevronRight className="h-4 w-4" /></Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  // —— Customer API: Create + Validate ——
  if (stepId === 'customer_api' && integrationMode === 'customer_apis') {
    const handleCreate = async () => {
      setError('')
      setLoading(true)
      try {
        await createCustomerApi({
          name: apiName || 'My API',
          mode: 'CUSTOMER_APIS',
          baseUrl: apiBaseUrl.replace(/\/$/, ''),
          endpoints: { healthPath: apiHealthPath || DEFAULT_HEALTH, deletePath: apiDeletePath || DEFAULT_DELETE, statusPath: apiStatusPath || DEFAULT_STATUS },
          authType: 'HMAC',
          sharedSecret: apiSharedSecret || undefined,
          timeoutMs: 10000,
          retries: 3
        })
        setApiCreated(true)
      } catch (e) {
        setError(e?.message || 'Create failed')
      } finally {
        setLoading(false)
      }
    }

    return (
      <div className="space-y-8">
        <div className="flex items-center gap-2 text-sm text-slate-400">
          <button type="button" onClick={() => setStepIndex(0)}>Onboarding</button>
          <span>/</span>
          <span className="text-slate-200">Customer API</span>
        </div>
        <Card>
          <CardHeader>
            <div className="text-sm font-semibold text-slate-50">Create Customer API integration</div>
            <p className="text-xs text-slate-400">Endpoints + HMAC secret. Validate in next step.</p>
          </CardHeader>
          <CardContent className="space-y-4">
            {error ? <div className="rounded-xl border border-danger-500/30 bg-danger-500/10 px-4 py-3 text-sm text-danger-200">{error}</div> : null}
            {!apiCreated ? (
              <>
                <div><label className="block text-xs font-medium text-slate-400">Name</label><input type="text" value={apiName} onChange={(e) => setApiName(e.target.value)} placeholder="My API" className="mt-1 w-full max-w-sm rounded-xl border border-slate-800 bg-slate-950/60 px-4 py-2.5 text-slate-100" /></div>
                <div><label className="block text-xs font-medium text-slate-400">Base URL</label><input type="url" value={apiBaseUrl} onChange={(e) => setApiBaseUrl(e.target.value)} placeholder="https://api.example.com" className="mt-1 w-full max-w-md rounded-xl border border-slate-800 bg-slate-950/60 px-4 py-2.5 text-slate-100" /></div>
                <div><label className="block text-xs font-medium text-slate-400">Health path</label><input type="text" value={apiHealthPath} onChange={(e) => setApiHealthPath(e.target.value)} className="mt-1 w-full max-w-sm rounded-xl border border-slate-800 bg-slate-950/60 px-4 py-2.5 text-slate-100" /></div>
                <div><label className="block text-xs font-medium text-slate-400">HMAC shared secret (optional now; rotate later)</label><input type="password" value={apiSharedSecret} onChange={(e) => setApiSharedSecret(e.target.value)} className="mt-1 w-full max-w-sm rounded-xl border border-slate-800 bg-slate-950/60 px-4 py-2.5 text-slate-100" /></div>
                <Button onClick={handleCreate} disabled={loading}>{loading ? 'Creating…' : 'Create'}</Button>
              </>
            ) : (
              <>
                <div className="rounded-xl border border-regulatory-500/30 bg-regulatory-500/10 px-4 py-3 text-sm text-regulatory-200">Customer API integration created.</div>
                <Button onClick={() => setStepIndex(2)}>Next: Test health & dry-run <ChevronRight className="h-4 w-4" /></Button>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    )
  }

  // —— Customer API: Test health / delete / status ——
  if (stepId === 'test_api' && integrationMode === 'customer_apis') {
    const runTest = async () => {
      setTestApiLoading(true)
      setTestApiMsg('')
      try {
        const apis = await listCustomerApis()
        const list = Array.isArray(apis) ? apis : apis?.integrations || []
        const first = list[0]
        if (first) {
          await testCustomerApiHealth(first.id)
          setApiHealthOk(true)
          setTestApiMsg('Health OK')
        } else setTestApiMsg('No integration found')
      } catch (e) {
        setTestApiMsg(e?.message || 'Test failed')
      } finally {
        setTestApiLoading(false)
      }
    }
    return (
      <div className="space-y-8">
        <div className="flex items-center gap-2 text-sm text-slate-400">
          <button type="button" onClick={() => setStepIndex(1)}>Customer API</button>
          <span>/</span>
          <span className="text-slate-200">Test</span>
        </div>
        <Card>
          <CardHeader>
            <div className="text-sm font-semibold text-slate-50">Test health & dry-run delete</div>
            <p className="text-xs text-slate-400">Backend calls your health endpoint; optional dry-run delete.</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button onClick={runTest} disabled={testApiLoading}>{testApiLoading ? 'Testing…' : 'Test health'}</Button>
            {testApiMsg && <p className={apiHealthOk ? 'text-sm text-regulatory-300' : 'text-sm text-slate-400'}>{testApiMsg}</p>}
            <Button onClick={() => setStepIndex(3)}>Next: Hash recipe <ChevronRight className="h-4 w-4" /></Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  // —— Recipe / Partners / Schedule (shared) ——
  const recipeStepIndex = integrationMode === 'agent' ? 3 : integrationMode === 'customer_apis' ? 3 : 1
  const partnersStepIndex = integrationMode === 'agent' ? 4 : integrationMode === 'customer_apis' ? 4 : 2
  const scheduleStepIndex = integrationMode === 'agent' ? 5 : integrationMode === 'customer_apis' ? 5 : 3

  if (stepId === 'recipe') {
    return (
      <div className="space-y-8">
        <div className="flex items-center gap-2 text-sm text-slate-400">
          <button type="button" onClick={() => setStepIndex(stepIndex - 1)}>Back</button>
          <span>/</span>
          <span className="text-slate-200">Hash recipe</span>
        </div>
        <Card>
          <CardHeader>
            <div className="text-sm font-semibold text-slate-50">Hash recipe (p_hash)</div>
            <p className="text-xs text-slate-400">Select or create a recipe; test locally in Hash Recipes (zero-knowledge).</p>
          </CardHeader>
          <CardContent>
            <Button as="a" href="/app/hash-recipes">Open Hash Recipes</Button>
            <Button variant="ghost" className="mt-3" onClick={() => setStepIndex(partnersStepIndex)}>Next: Partners & cascade <ChevronRight className="h-4 w-4" /></Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (stepId === 'partners') {
    return (
      <div className="space-y-8">
        <div className="flex items-center gap-2 text-sm text-slate-400">
          <button type="button" onClick={() => setStepIndex(recipeStepIndex)}>Back</button>
          <span>/</span>
          <span className="text-slate-200">Partners & cascade</span>
        </div>
        <Card>
          <CardHeader>
            <div className="text-sm font-semibold text-slate-50">Partners & cascade policies</div>
            <p className="text-xs text-slate-400">Add partners and map to connector or Customer API. Define policy (retries, SLA, mode).</p>
          </CardHeader>
          <CardContent>
            <div className="flex gap-3">
              <Button as="a" href="/app/partners">Partners</Button>
              <Button as="a" href="/app/cascade-policies" variant="ghost">Cascade policies</Button>
            </div>
            <Button variant="ghost" className="mt-3" onClick={() => setStepIndex(scheduleStepIndex)}>Next: Schedule <ChevronRight className="h-4 w-4" /></Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (stepId === 'schedule') {
    return (
      <div className="space-y-8">
        <div className="flex items-center gap-2 text-sm text-slate-400">
          <button type="button" onClick={() => setStepIndex(partnersStepIndex)}>Back</button>
          <span>/</span>
          <span className="text-slate-200">Schedule</span>
        </div>
        <Card>
          <CardHeader>
            <div className="text-sm font-semibold text-slate-50">Activate schedule</div>
            <p className="text-xs text-slate-400">Recommended: run at least every 45 days for DROP compliance.</p>
          </CardHeader>
          <CardContent>
            <Button as="a" href="/app/runs">Configure runs</Button>
            <Button variant="primary" className="mt-4" onClick={() => navigate('/app')}>Go to Dashboard</Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return null
}

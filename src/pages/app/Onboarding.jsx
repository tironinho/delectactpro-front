import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent, CardHeader } from '../../components/ui/Card.jsx'
import Button from '../../components/ui/Button.jsx'
import ReadinessChecklist from '../../components/onboarding/ReadinessChecklist.jsx'
import {
  createConnector,
  listConnectors,
  createCustomerApi,
  listCustomerApis,
  testCustomerApiHealth,
  listPartners,
  listCascadePolicies,
  listHashRecipes,
  getIntegrationSummary
} from '../../services/appService.js'
import { toList } from '../../services/appService.js'
import { Copy, Check, ChevronRight, Plug, Globe, Building2 } from 'lucide-react'
import clsx from 'clsx'

const STORAGE_KEY = 'drop_onboarding'
const CONTROL_PLANE_URL = import.meta.env.VITE_API_BASE_URL || 'https://api.deleteactpro.com'
const DEFAULT_HEALTH = '/deleteactpro/health'
const DEFAULT_DELETE = '/deleteactpro/delete'
const DEFAULT_STATUS = '/deleteactpro/status'

const STEP_IDS = ['company', 'mode', 'primary', 'recipe', 'partners', 'cascade', 'dryrun', 'golive']
const STEP_LABELS = [
  'Company basics',
  'Integration mode',
  'Primary data source',
  'Hash recipe',
  'Partners',
  'Cascade mapping',
  'Dry-run validation',
  'Go-live checklist'
]

const INTEGRATION_MODES = [
  { id: 'agent', label: 'Docker Agent', desc: 'Zero-knowledge agent in your environment', icon: Plug },
  { id: 'customer_apis', label: 'Customer APIs', desc: 'Your endpoints: health, delete, status', icon: Globe },
  { id: 'hybrid', label: 'Hybrid', desc: 'Agent + Customer APIs', icon: Globe }
]

function loadProgress() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return { stepIndex: 0, stepStatus: {} }
    const p = JSON.parse(raw)
    return { stepIndex: Math.min(p.stepIndex ?? 0, STEP_IDS.length - 1), stepStatus: p.stepStatus || {} }
  } catch {
    return { stepIndex: 0, stepStatus: {} }
  }
}

function saveProgress(stepIndex, stepStatus) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ stepIndex, stepStatus }))
  } catch (_) {}
}

export default function Onboarding() {
  const navigate = useNavigate()
  const [progress, setProgress] = useState(loadProgress)
  const [integrationMode, setIntegrationMode] = useState(null)
  const [companyName, setCompanyName] = useState('')
  const [tenantId, setTenantId] = useState('')

  const [connectorName, setConnectorName] = useState('')
  const [dbType, setDbType] = useState('postgres')
  const [connectorToken, setConnectorToken] = useState(null)
  const [connectorId, setConnectorId] = useState(null)
  const [dockerRun, setDockerRun] = useState('')
  const [heartbeat, setHeartbeat] = useState(null)

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

  const [readinessItems, setReadinessItems] = useState([])
  const [dropReady, setDropReady] = useState(false)
  const [copied, setCopied] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const stepIndex = Math.min(progress.stepIndex, STEP_IDS.length - 1)
  const stepStatus = progress.stepStatus
  const stepId = STEP_IDS[stepIndex]

  const setStepIndex = useCallback((i) => {
    const next = Math.max(0, Math.min(i, STEP_IDS.length - 1))
    setProgress((p) => {
      const nextStatus = { ...p.stepStatus }
      nextStatus[STEP_IDS[p.stepIndex]] = 'complete'
      const out = { stepIndex: next, stepStatus: nextStatus }
      saveProgress(out.stepIndex, out.stepStatus)
      return out
    })
  }, [])

  const markStep = useCallback((id, status) => {
    setProgress((p) => {
      const next = { ...p.stepStatus, [id]: status }
      saveProgress(p.stepIndex, next)
      return { ...p, stepStatus: next }
    })
  }, [])

  useEffect(() => {
    const stored = loadProgress()
    if (stored.stepStatus?.mode) {
      const mode = localStorage.getItem(STORAGE_KEY + '_mode')
      if (mode) setIntegrationMode(mode)
    }
  }, [])

  function buildDockerRun(token, cId, dbUrl = '${DB_URL}', recipeId = '${HASH_RECIPE_ID}') {
    return `docker run --rm \\
  -e CONTROL_PLANE_URL=${CONTROL_PLANE_URL} \\
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

  function getStepStatus(idx) {
    const id = STEP_IDS[idx]
    if (idx < stepIndex) return stepStatus[id] || 'complete'
    if (idx === stepIndex) return stepStatus[id] || 'in_progress'
    return 'not_started'
  }

  // —— Stepper ——
  const stepper = (
    <nav className="flex flex-wrap items-center gap-2 border-b border-slate-800 pb-4 mb-6">
      {STEP_IDS.map((id, idx) => (
        <button
          key={id}
          type="button"
          onClick={() => setStepIndex(idx)}
          className={clsx(
            'rounded-lg px-3 py-1.5 text-xs font-medium transition',
            idx === stepIndex
              ? 'bg-regulatory-500/20 text-regulatory-200'
              : idx < stepIndex
              ? 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              : 'text-slate-500 hover:text-slate-400'
          )}
        >
          {idx + 1}. {STEP_LABELS[idx]}
          <span className={clsx('ml-1.5', idx === stepIndex ? 'text-regulatory-400' : idx < stepIndex ? 'text-slate-500' : '')}>
            {getStepStatus(idx) === 'complete' ? '✓' : getStepStatus(idx) === 'in_progress' ? '…' : ''}
          </span>
        </button>
      ))}
    </nav>
  )

  // —— Step 0: Company basics ——
  if (stepId === 'company') {
    const handleNext = () => {
      markStep('company', 'complete')
      setStepIndex(1)
    }
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-50">Onboarding</h1>
          <p className="mt-1 text-slate-400">Company and tenant basics</p>
        </div>
        {stepper}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-50">
              <Building2 className="h-4 w-4 text-slate-400" />
              Company / Tenant basics
            </div>
            <p className="text-xs text-slate-400">Optional. Used for display and multi-tenant contexts.</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-400">Company name</label>
              <input
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="Acme Inc."
                className="mt-1 w-full max-w-sm rounded-xl border border-slate-800 bg-slate-950/60 px-4 py-2.5 text-slate-100"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400">Tenant ID (optional)</label>
              <input
                type="text"
                value={tenantId}
                onChange={(e) => setTenantId(e.target.value)}
                placeholder="tenant-1"
                className="mt-1 w-full max-w-sm rounded-xl border border-slate-800 bg-slate-950/60 px-4 py-2.5 text-slate-100"
              />
            </div>
            <Button onClick={handleNext}>Next: Choose integration mode <ChevronRight className="h-4 w-4" /></Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  // —— Step 1: Mode ——
  if (stepId === 'mode') {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-50">Onboarding</h1>
          <p className="mt-1 text-slate-400">Choose how you want to integrate</p>
        </div>
        {stepper}
        <div className="grid gap-4 sm:grid-cols-2">
          {INTEGRATION_MODES.map((m) => (
            <button
              key={m.id}
              type="button"
              onClick={() => {
                setIntegrationMode(m.id)
                localStorage.setItem(STORAGE_KEY + '_mode', m.id)
                markStep('mode', 'complete')
                setStepIndex(2)
                setError('')
              }}
              className={clsx(
                'rounded-2xl border p-6 text-left transition',
                integrationMode === m.id ? 'border-regulatory-500/50 bg-regulatory-500/10' : 'border-slate-800 bg-slate-950/40 hover:border-slate-700'
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

  // —— Step 2: Primary data source (Connector or Customer API) ——
  if (stepId === 'primary' && (integrationMode === 'agent' || integrationMode === 'hybrid')) {
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
        {stepper}
        <Card>
          <CardHeader>
            <div className="text-sm font-semibold text-slate-50">Configure primary data source — Connector (Agent)</div>
            <p className="text-xs text-slate-400">Create a connector and copy the docker run command.</p>
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
                {integrationMode === 'hybrid' ? (
                  <>
                    <p className="text-xs text-slate-400">Optionally add a Customer API, or skip to next step.</p>
                    <div className="grid gap-2 max-w-md">
                      <input type="text" value={apiName} onChange={(e) => setApiName(e.target.value)} placeholder="API name" className="rounded-xl border border-slate-800 bg-slate-950/60 px-3 py-2 text-sm text-slate-100" />
                      <input type="url" value={apiBaseUrl} onChange={(e) => setApiBaseUrl(e.target.value)} placeholder="Base URL" className="rounded-xl border border-slate-800 bg-slate-950/60 px-3 py-2 text-sm text-slate-100" />
                      <div className="flex gap-2">
                        <Button size="sm" onClick={async () => { setError(''); setLoading(true); try { await createCustomerApi({ name: apiName || 'My API', mode: 'CUSTOMER_APIS', baseUrl: apiBaseUrl.replace(/\/$/, ''), endpoints: { healthPath: apiHealthPath, deletePath: apiDeletePath, statusPath: apiStatusPath }, authType: 'HMAC', timeoutMs: 10000, retries: 3 }); setApiCreated(true); } catch (e) { setError(e?.message || 'Create failed'); } finally { setLoading(false); } }} disabled={loading}>Add Customer API</Button>
                        <Button size="sm" variant="ghost" onClick={() => { markStep('primary', 'complete'); setStepIndex(3); }}>Skip — Next: Hash recipe</Button>
                      </div>
                    </div>
                  </>
                ) : (
                  <Button onClick={() => { markStep('primary', 'complete'); setStepIndex(3); }}>Next: Hash recipe <ChevronRight className="h-4 w-4" /></Button>
                )}
              </>
            )}
          </CardContent>
        </Card>
      </div>
    )
  }

  if (stepId === 'primary' && (integrationMode === 'customer_apis' || (integrationMode === 'hybrid' && apiCreated))) {
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
        {stepper}
        <Card>
          <CardHeader>
            <div className="text-sm font-semibold text-slate-50">Configure primary data source — Customer API</div>
            <p className="text-xs text-slate-400">Add your endpoints; validate in next step.</p>
          </CardHeader>
          <CardContent className="space-y-4">
            {error ? <div className="rounded-xl border border-danger-500/30 bg-danger-500/10 px-4 py-3 text-sm text-danger-200">{error}</div> : null}
            {!apiCreated ? (
              <>
                <div><label className="block text-xs font-medium text-slate-400">Name</label><input type="text" value={apiName} onChange={(e) => setApiName(e.target.value)} placeholder="My API" className="mt-1 w-full max-w-sm rounded-xl border border-slate-800 bg-slate-950/60 px-4 py-2.5 text-slate-100" /></div>
                <div><label className="block text-xs font-medium text-slate-400">Base URL</label><input type="url" value={apiBaseUrl} onChange={(e) => setApiBaseUrl(e.target.value)} placeholder="https://api.example.com" className="mt-1 w-full max-w-md rounded-xl border border-slate-800 bg-slate-950/60 px-4 py-2.5 text-slate-100" /></div>
                <div><label className="block text-xs font-medium text-slate-400">Health path</label><input type="text" value={apiHealthPath} onChange={(e) => setApiHealthPath(e.target.value)} className="mt-1 w-full max-w-sm rounded-xl border border-slate-800 bg-slate-950/60 px-4 py-2.5 text-slate-100" /></div>
                <div><label className="block text-xs font-medium text-slate-400">HMAC shared secret (optional)</label><input type="password" value={apiSharedSecret} onChange={(e) => setApiSharedSecret(e.target.value)} className="mt-1 w-full max-w-sm rounded-xl border border-slate-800 bg-slate-950/60 px-4 py-2.5 text-slate-100" /></div>
                <Button onClick={handleCreate} disabled={loading}>{loading ? 'Creating…' : 'Create'}</Button>
              </>
            ) : (
              <>
                <div className="rounded-xl border border-regulatory-500/30 bg-regulatory-500/10 px-4 py-3 text-sm text-regulatory-200">Customer API created.</div>
                <Button onClick={() => { markStep('primary', 'complete'); setStepIndex(3); }}>Next: Hash recipe <ChevronRight className="h-4 w-4" /></Button>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    )
  }

  // —— Step 3: Hash recipe ——
  if (stepId === 'recipe') {
    return (
      <div className="space-y-8">
        {stepper}
        <Card>
          <CardHeader>
            <div className="text-sm font-semibold text-slate-50">Configure hash recipe (p_hash / subject_hash)</div>
            <p className="text-xs text-slate-400">Select or create a recipe; test locally in Hash Recipes.</p>
          </CardHeader>
          <CardContent>
            <Button as="a" href="/app/hash-recipes">Open Hash Recipes</Button>
            <Button variant="ghost" className="mt-3" onClick={() => { markStep('recipe', 'complete'); setStepIndex(4); }}>Next: Partners <ChevronRight className="h-4 w-4" /></Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  // —— Step 4: Partners ——
  if (stepId === 'partners') {
    return (
      <div className="space-y-8">
        {stepper}
        <Card>
          <CardHeader>
            <div className="text-sm font-semibold text-slate-50">Register downstream partners</div>
            <p className="text-xs text-slate-400">Third parties that receive deletion requests. Add partners and link to connector or Customer API.</p>
          </CardHeader>
          <CardContent>
            <div className="flex gap-3">
              <Button as="a" href="/app/partners">Partners</Button>
              <Button as="a" href="/app/cascade-policies" variant="ghost">Cascade policies</Button>
            </div>
            <Button variant="ghost" className="mt-3" onClick={() => { markStep('partners', 'complete'); setStepIndex(5); }}>Next: Cascade mapping <ChevronRight className="h-4 w-4" /></Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  // —— Step 5: Cascade mapping ——
  if (stepId === 'cascade') {
    return (
      <div className="space-y-8">
        {stepper}
        <Card>
          <CardHeader>
            <div className="text-sm font-semibold text-slate-50">Map cascade targets</div>
            <p className="text-xs text-slate-400">Partner → connector or Customer API. Define policy (retries, SLA, mode).</p>
          </CardHeader>
          <CardContent>
            <Button as="a" href="/app/cascade-policies">Cascade policies</Button>
            <Button variant="ghost" className="mt-3" onClick={() => { markStep('cascade', 'complete'); setStepIndex(6); }}>Next: Dry-run validation <ChevronRight className="h-4 w-4" /></Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  // —— Step 6: Dry-run ——
  if (stepId === 'dryrun') {
    return (
      <div className="space-y-8">
        {stepper}
        <Card>
          <CardHeader>
            <div className="text-sm font-semibold text-slate-50">Dry-run validation</div>
            <p className="text-xs text-slate-400">Run a dry-run to validate the pipeline. Recommended at least once before go-live.</p>
          </CardHeader>
          <CardContent>
            <Button as="a" href="/app/runs">View runs</Button>
            <Button variant="ghost" className="mt-3" onClick={() => { markStep('dryrun', 'complete'); setStepIndex(7); }}>Next: Go-live checklist <ChevronRight className="h-4 w-4" /></Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  // —— Step 7: Go-live ——
  if (stepId === 'golive') {
    const loadReadiness = () => {
      Promise.all([
        getIntegrationSummary(),
        listConnectors().then((d) => toList(d, ['connectors', 'items'])),
        listCustomerApis().then((d) => toList(d, ['integrations', 'items'])),
        listHashRecipes().then((d) => toList(d, ['recipes', 'items'])),
        listPartners().then((d) => toList(d, ['partners', 'items'])),
        listCascadePolicies().then((d) => toList(d, ['policies', 'items']))
      ]).then(([summary, connectors, apis, recipes, partners, policies]) => {
        const hasIntegration = (summary?.connectorsCount ?? connectors?.length ?? 0) > 0 || (summary?.customerApisCount ?? apis?.length ?? 0) > 0
        const hasRecipe = (recipes?.length ?? 0) > 0 && recipes.some((r) => r.active)
        const hasPartners = (partners?.length ?? 0) > 0
        const hasCascade = (policies?.length ?? 0) > 0
        setReadinessItems([
          { id: 'integration', label: 'At least one integration configured', ok: hasIntegration, link: '/app/integrations' },
          { id: 'recipe', label: 'Hash recipe active', ok: hasRecipe, link: '/app/hash-recipes' },
          { id: 'partners', label: 'At least one partner registered', ok: hasPartners, link: '/app/partners' },
          { id: 'cascade', label: 'Cascade policy configured', ok: hasCascade, link: '/app/cascade-policies' },
          { id: 'dryrun', label: 'Dry-run completed successfully in last 45 days', ok: false, link: '/app/runs' },
          { id: 'billing', label: 'Billing setup fee paid', ok: !!summary?.billingSetupPaid, link: '/app/billing' }
        ])
      })
    }
    if (readinessItems.length === 0) loadReadiness()

    const allComplete = readinessItems.length > 0 && readinessItems.every((i) => i.ok)
    return (
      <div className="space-y-8">
        {stepper}
        <Card>
          <CardHeader>
            <div className="text-sm font-semibold text-slate-50">Go-live readiness checklist</div>
            <p className="text-xs text-slate-400">Ensure all items are complete before marking environment as DROP-ready.</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <ReadinessChecklist items={readinessItems} />
            <div className="flex flex-wrap gap-3 pt-4">
              <Button variant="primary" disabled={!allComplete} onClick={() => setDropReady(true)}>
                Mark environment as DROP-ready
              </Button>
              <Button variant="ghost" as="a" href="/app/runs">
                Run validation again
              </Button>
              <Button variant="ghost" onClick={() => navigate('/app/dashboard')}>
                Go to Dashboard
              </Button>
            </div>
            {dropReady && (
              <div className="rounded-xl border border-regulatory-500/30 bg-regulatory-500/10 px-4 py-3 text-sm text-regulatory-200">
                Environment marked as DROP-ready. You can run validation again anytime from Runs.
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    )
  }

  return null
}

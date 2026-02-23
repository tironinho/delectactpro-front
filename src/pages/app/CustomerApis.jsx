import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader } from '../../components/ui/Card.jsx'
import Button from '../../components/ui/Button.jsx'
import {
  listCustomerApis,
  createCustomerApi,
  updateCustomerApi,
  deleteCustomerApi,
  testCustomerApiHealth,
  testCustomerApiDelete,
  testCustomerApiStatus,
  rotateCustomerApiSecret
} from '../../services/appService.js'
import { Copy, Check, RefreshCw, Circle, Play } from 'lucide-react'

const AUTH_TYPES = ['HMAC', 'Bearer']
const DEFAULT_HEALTH = '/deleteactpro/health'
const DEFAULT_DELETE = '/deleteactpro/delete'
const DEFAULT_STATUS = '/deleteactpro/status'

export default function CustomerApis() {
  const [list, setList] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [creating, setCreating] = useState(false)
  const [testResult, setTestResult] = useState(null) // { id, type: 'health'|'delete'|'status', ok, latencyMs, message }
  const [rotatedSecret, setRotatedSecret] = useState(null) // { id, secret } show once
  const [copied, setCopied] = useState(false)
  const [form, setForm] = useState({
    name: '',
    baseUrl: '',
    healthPath: DEFAULT_HEALTH,
    deletePath: DEFAULT_DELETE,
    statusPath: DEFAULT_STATUS,
    authType: 'HMAC',
    sharedSecret: '',
    headersJson: '',
    timeoutMs: 10000,
    retries: 3
  })

  function load() {
    setLoading(true)
    listCustomerApis()
      .then((d) => setList(Array.isArray(d) ? d : d?.integrations || []))
      .catch(() => setList([]))
      .finally(() => setLoading(false))
  }

  useEffect(() => load(), [])

  async function handleCreate(e) {
    e.preventDefault()
    setError('')
    setCreating(true)
    setTestResult(null)
    try {
      await createCustomerApi({
        name: form.name,
        mode: 'CUSTOMER_APIS',
        baseUrl: form.baseUrl.replace(/\/$/, ''),
        endpoints: {
          healthPath: form.healthPath || DEFAULT_HEALTH,
          deletePath: form.deletePath || DEFAULT_DELETE,
          statusPath: form.statusPath || DEFAULT_STATUS
        },
        authType: form.authType,
        sharedSecret: form.authType === 'HMAC' ? form.sharedSecret : undefined,
        headersJson: form.headersJson ? (() => { try { return JSON.parse(form.headersJson); } catch { return undefined; } })() : undefined,
        timeoutMs: form.timeoutMs,
        retries: form.retries
      })
      setForm((p) => ({ ...p, name: '', baseUrl: '', sharedSecret: '' }))
      load()
    } catch (err) {
      setError(err?.message || 'Create failed')
    } finally {
      setCreating(false)
    }
  }

  async function handleTestHealth(id) {
    setError('')
    setTestResult(null)
    const start = Date.now()
    try {
      await testCustomerApiHealth(id)
      setTestResult({ id, type: 'health', ok: true, latencyMs: Date.now() - start })
    } catch (err) {
      setTestResult({ id, type: 'health', ok: false, latencyMs: Date.now() - start, message: err?.message })
    }
  }

  async function handleTestDelete(id) {
    setError('')
    setTestResult(null)
    const start = Date.now()
    try {
      await testCustomerApiDelete(id)
      setTestResult({ id, type: 'delete', ok: true, latencyMs: Date.now() - start })
    } catch (err) {
      setTestResult({ id, type: 'delete', ok: false, latencyMs: Date.now() - start, message: err?.message })
    }
  }

  async function handleTestStatus(id) {
    setError('')
    setTestResult(null)
    const start = Date.now()
    try {
      await testCustomerApiStatus(id)
      setTestResult({ id, type: 'status', ok: true, latencyMs: Date.now() - start })
    } catch (err) {
      setTestResult({ id, type: 'status', ok: false, latencyMs: Date.now() - start, message: err?.message })
    }
  }

  async function handleRotateSecret(id) {
    setError('')
    try {
      const data = await rotateCustomerApiSecret(id)
      setRotatedSecret({ id, secret: data?.secret || data?.sharedSecret || '—' })
    } catch (err) {
      setError(err?.message || 'Rotate failed')
    }
  }

  function copyText(str) {
    navigator.clipboard.writeText(str)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const baseUrl = form.baseUrl.replace(/\/$/, '')
  const healthUrl = baseUrl ? `${baseUrl}${(form.healthPath || DEFAULT_HEALTH).startsWith('/') ? '' : '/'}${form.healthPath || DEFAULT_HEALTH}` : ''
  const curlHealth = healthUrl ? `curl -X GET "${healthUrl}"` : ''

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-slate-50">Customer APIs</h1>
        <p className="mt-1 text-slate-400">Configure your endpoints (health, delete, status). HMAC or Bearer auth. Copy/paste-friendly.</p>
      </div>

      {error ? (
        <div className="rounded-xl border border-danger-500/30 bg-danger-500/10 px-4 py-3 text-sm text-danger-200">{error}</div>
      ) : null}

      <Card>
        <CardHeader>
          <div className="text-sm font-semibold text-slate-50">Add Customer API integration</div>
          <p className="text-xs text-slate-400">baseUrl + paths; sharedSecret shown only once. Use &quot;Rotate secret&quot; if needed.</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleCreate} className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-medium text-slate-400">Name</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                required
                placeholder="My API"
                className="mt-1 w-full rounded-xl border border-slate-800 bg-slate-950/60 px-3 py-2 text-sm text-slate-100"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-slate-400">Base URL</label>
              <input
                type="url"
                value={form.baseUrl}
                onChange={(e) => setForm((p) => ({ ...p, baseUrl: e.target.value }))}
                required
                placeholder="https://api.yourcompany.com"
                className="mt-1 w-full rounded-xl border border-slate-800 bg-slate-950/60 px-3 py-2 text-sm text-slate-100"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400">Health path</label>
              <input
                type="text"
                value={form.healthPath}
                onChange={(e) => setForm((p) => ({ ...p, healthPath: e.target.value }))}
                placeholder={DEFAULT_HEALTH}
                className="mt-1 w-full rounded-xl border border-slate-800 bg-slate-950/60 px-3 py-2 text-sm text-slate-100"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400">Delete path</label>
              <input
                type="text"
                value={form.deletePath}
                onChange={(e) => setForm((p) => ({ ...p, deletePath: e.target.value }))}
                placeholder={DEFAULT_DELETE}
                className="mt-1 w-full rounded-xl border border-slate-800 bg-slate-950/60 px-3 py-2 text-sm text-slate-100"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400">Status path</label>
              <input
                type="text"
                value={form.statusPath}
                onChange={(e) => setForm((p) => ({ ...p, statusPath: e.target.value }))}
                placeholder={DEFAULT_STATUS}
                className="mt-1 w-full rounded-xl border border-slate-800 bg-slate-950/60 px-3 py-2 text-sm text-slate-100"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400">Auth type</label>
              <select
                value={form.authType}
                onChange={(e) => setForm((p) => ({ ...p, authType: e.target.value }))}
                className="mt-1 w-full rounded-xl border border-slate-800 bg-slate-950/60 px-3 py-2 text-sm text-slate-100"
              >
                {AUTH_TYPES.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
            {form.authType === 'HMAC' && (
              <div>
                <label className="block text-xs font-medium text-slate-400">Shared secret (shown once)</label>
                <input
                  type="password"
                  value={form.sharedSecret}
                  onChange={(e) => setForm((p) => ({ ...p, sharedSecret: e.target.value }))}
                  placeholder="Optional on create; use Rotate later"
                  className="mt-1 w-full rounded-xl border border-slate-800 bg-slate-950/60 px-3 py-2 text-sm text-slate-100"
                />
              </div>
            )}
            <div>
              <label className="block text-xs font-medium text-slate-400">Timeout (ms)</label>
              <input
                type="number"
                min={1000}
                value={form.timeoutMs}
                onChange={(e) => setForm((p) => ({ ...p, timeoutMs: +e.target.value }))}
                className="mt-1 w-full rounded-xl border border-slate-800 bg-slate-950/60 px-3 py-2 text-sm text-slate-100"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400">Retries</label>
              <input
                type="number"
                min={0}
                value={form.retries}
                onChange={(e) => setForm((p) => ({ ...p, retries: +e.target.value }))}
                className="mt-1 w-full rounded-xl border border-slate-800 bg-slate-950/60 px-3 py-2 text-sm text-slate-100"
              />
            </div>
            <div className="sm:col-span-2">
              <label className="block text-xs font-medium text-slate-400">Headers JSON (optional, for Bearer/custom)</label>
              <input
                type="text"
                value={form.headersJson}
                onChange={(e) => setForm((p) => ({ ...p, headersJson: e.target.value }))}
                placeholder='{"Authorization":"Bearer ..."}'
                className="mt-1 w-full rounded-xl border border-slate-800 bg-slate-950/60 px-3 py-2 text-sm text-slate-100 font-mono"
              />
            </div>
            <div className="sm:col-span-2">
              <Button type="submit" disabled={creating}>{creating ? 'Creating…' : 'Add Customer API'}</Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {curlHealth && (
        <Card>
          <CardHeader>
            <div className="text-sm font-semibold text-slate-50">Example: Test health (curl)</div>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <pre className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-900 p-4 text-xs text-slate-300">
                {curlHealth}
              </pre>
              <button
                type="button"
                onClick={() => copyText(curlHealth)}
                className="absolute right-2 top-2 rounded-lg border border-slate-700 bg-slate-800 px-2 py-1 text-xs text-slate-200 hover:bg-slate-700"
              >
                {copied ? <Check className="h-3 w-3 inline" /> : <Copy className="h-3 w-3 inline" />} Copy
              </button>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <div className="text-sm font-semibold text-slate-50">Integrations</div>
          <p className="text-xs text-slate-400">Test health, dry-run delete, status. Rotate secret if needed.</p>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-sm text-slate-500">Loading…</p>
          ) : list.length === 0 ? (
            <p className="text-sm text-slate-500">No Customer API integrations yet.</p>
          ) : (
            <ul className="space-y-4">
              {list.map((api) => (
                <li key={api.id} className="rounded-xl border border-slate-800 p-4">
                  <div className="flex flex-wrap items-center gap-3">
                    <Circle className={api.last_healthcheck ? 'h-3 w-3 fill-regulatory-400 text-regulatory-400' : 'h-3 w-3 text-slate-500'} />
                    <span className="font-medium text-slate-200">{api.name || api.id}</span>
                    <span className="text-xs text-slate-500 truncate max-w-xs">{api.baseUrl}</span>
                    <div className="ml-auto flex flex-wrap gap-2">
                      <Button size="sm" variant="ghost" onClick={() => handleTestHealth(api.id)}>
                        <Play className="h-3 w-3" /> Test health
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => handleTestDelete(api.id)}>
                        Test dry-run delete
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => handleTestStatus(api.id)}>
                        Test status
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => handleRotateSecret(api.id)}>
                        <RefreshCw className="h-3 w-3" /> Rotate secret
                      </Button>
                    </div>
                  </div>
                  {testResult?.id === api.id && (
                    <div className="mt-3 rounded-lg border border-slate-700 bg-slate-900/60 px-3 py-2 text-xs">
                      {testResult.ok ? (
                        <span className="text-regulatory-300">OK — {testResult.latencyMs}ms</span>
                      ) : (
                        <span className="text-danger-300">{testResult.message || 'Failed'} — {testResult.latencyMs}ms</span>
                      )}
                    </div>
                  )}
                  {rotatedSecret?.id === api.id && (
                    <div className="mt-3 rounded-lg border border-regulatory-500/30 bg-regulatory-500/10 p-3 text-xs text-regulatory-200">
                      New secret (shown once): <code className="break-all">{rotatedSecret.secret}</code>
                      <button type="button" onClick={() => copyText(rotatedSecret.secret)} className="ml-2 underline">Copy</button>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

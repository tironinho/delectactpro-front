import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader } from '../../components/ui/Card.jsx'
import Button from '../../components/ui/Button.jsx'
import SecretShowOnceModal from '../../components/SecretShowOnceModal.jsx'
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
import { normalizeCustomerApiList, normalizeCustomerApiIntegration } from '../../utils/customerApiNormalize.js'
import { Copy, Check, RefreshCw, Circle, Play, ChevronDown, ChevronUp } from 'lucide-react'

const AUTH_TYPES = ['HMAC', 'Bearer', 'None']
const DEFAULT_HEALTH = '/deleteactpro/health'
const DEFAULT_DELETE = '/deleteactpro/delete'
const DEFAULT_STATUS = '/deleteactpro/status'
const DEFAULT_HMAC_SIGNATURE_HEADER = 'X-DAP-Signature'
const DEFAULT_HMAC_TIMESTAMP_HEADER = 'X-DAP-Timestamp'
const DEFAULT_REPLAY_WINDOW_SECONDS = 300

function parseHeadersJson(value) {
  if (!value || !String(value).trim()) return null
  try {
    const parsed = JSON.parse(value)
    return typeof parsed === 'object' && parsed !== null ? parsed : null
  } catch {
    return undefined
  }
}

function parseExpectedStatusCodes(value) {
  if (!value || !String(value).trim()) return null
  const s = String(value).trim()
  const parts = s.split(/[\s,]+/).map((n) => parseInt(n, 10)).filter((n) => !Number.isNaN(n))
  return parts.length ? parts : null
}

export default function CustomerApis() {
  const [list, setList] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [creating, setCreating] = useState(false)
  const [testResult, setTestResult] = useState(null)
  const [rotatedSecret, setRotatedSecret] = useState(null)
  const [copied, setCopied] = useState(false)
  const [advancedOpen, setAdvancedOpen] = useState(false)
  const [form, setForm] = useState({
    name: '',
    baseUrl: '',
    healthPath: DEFAULT_HEALTH,
    deletePath: DEFAULT_DELETE,
    statusPath: DEFAULT_STATUS,
    webhookPath: '',
    authType: 'HMAC',
    sharedSecret: '',
    bearerToken: '',
    hmacSignatureHeader: DEFAULT_HMAC_SIGNATURE_HEADER,
    hmacTimestampHeader: DEFAULT_HMAC_TIMESTAMP_HEADER,
    replayWindowSeconds: DEFAULT_REPLAY_WINDOW_SECONDS,
    headersJson: '',
    timeoutMs: 10000,
    retries: 3,
    expectedSuccessStatusCodes: ''
  })
  const [headersJsonError, setHeadersJsonError] = useState('')

  function load() {
    setLoading(true)
    listCustomerApis()
      .then((d) => setList(normalizeCustomerApiList(d)))
      .catch(() => setList([]))
      .finally(() => setLoading(false))
  }

  useEffect(() => load(), [])

  function validateHeadersJson() {
    const v = form.headersJson
    if (!v || !String(v).trim()) {
      setHeadersJsonError('')
      return true
    }
    try {
      JSON.parse(v)
      setHeadersJsonError('')
      return true
    } catch (e) {
      setHeadersJsonError(e?.message || 'Invalid JSON')
      return false
    }
  }

  async function handleCreate(e) {
    e.preventDefault()
    setError('')
    if (!validateHeadersJson()) return
    setCreating(true)
    setTestResult(null)
    try {
      const payload = {
        name: form.name,
        mode: 'CUSTOMER_APIS',
        baseUrl: form.baseUrl.replace(/\/$/, ''),
        endpoints: {
          healthPath: form.healthPath || DEFAULT_HEALTH,
          deletePath: form.deletePath || DEFAULT_DELETE,
          statusPath: form.statusPath || DEFAULT_STATUS,
          ...(form.webhookPath ? { webhookPath: form.webhookPath } : {})
        },
        authType: form.authType === 'None' ? undefined : form.authType,
        sharedSecret: form.authType === 'HMAC' ? form.sharedSecret || undefined : undefined,
        bearerToken: form.authType === 'Bearer' ? form.bearerToken || undefined : undefined,
        hmacSignatureHeader: form.authType === 'HMAC' ? (form.hmacSignatureHeader || DEFAULT_HMAC_SIGNATURE_HEADER) : undefined,
        hmacTimestampHeader: form.authType === 'HMAC' ? (form.hmacTimestampHeader || DEFAULT_HMAC_TIMESTAMP_HEADER) : undefined,
        replayWindowSeconds: form.authType === 'HMAC' ? (form.replayWindowSeconds ?? DEFAULT_REPLAY_WINDOW_SECONDS) : undefined,
        timeoutMs: form.timeoutMs,
        retries: form.retries,
        headersJson: parseHeadersJson(form.headersJson) ?? undefined,
        expectedSuccessStatusCodes: parseExpectedStatusCodes(form.expectedSuccessStatusCodes) ?? undefined
      }
      await createCustomerApi(payload)
      setForm((p) => ({ ...p, name: '', baseUrl: '', sharedSecret: '', bearerToken: '' }))
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
      await testCustomerApiDelete(id, 'sample_subject_hash_hex')
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
      setRotatedSecret({ id, secret: data?.secret ?? data?.sharedSecret ?? '—' })
    } catch (err) {
      setError(err?.message || 'Rotate failed')
    }
  }

  function copyText(str) {
    navigator.clipboard.writeText(str)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const baseUrl = (form.baseUrl || '').replace(/\/$/, '')
  const healthPath = (form.healthPath || DEFAULT_HEALTH).startsWith('/') ? form.healthPath || DEFAULT_HEALTH : `/${form.healthPath || DEFAULT_HEALTH}`
  const deletePath = (form.deletePath || DEFAULT_DELETE).startsWith('/') ? form.deletePath || DEFAULT_DELETE : `/${form.deletePath || DEFAULT_DELETE}`
  const statusPath = (form.statusPath || DEFAULT_STATUS).startsWith('/') ? form.statusPath || DEFAULT_STATUS : `/${form.statusPath || DEFAULT_STATUS}`
  const healthUrl = baseUrl ? `${baseUrl}${healthPath}` : ''
  const deleteUrl = baseUrl ? `${baseUrl}${deletePath}` : ''
  const statusUrl = baseUrl ? `${baseUrl}${statusPath}` : ''
  const sampleSubjectHash = 'a1b2c3d4e5f6...'
  const curlHealth = healthUrl ? `curl -X GET "${healthUrl}"` : ''
  const curlDelete = deleteUrl
    ? `curl -X POST "${deleteUrl}" \\
  -H "Content-Type: application/json" \\
  -d '{"subject_hash":"${sampleSubjectHash}"}'`
    : ''
  const curlStatus = statusUrl ? `curl -X GET "${statusUrl}"` : ''

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
              <label className="block text-xs font-medium text-slate-400">Webhook path (optional)</label>
              <input
                type="text"
                value={form.webhookPath}
                onChange={(e) => setForm((p) => ({ ...p, webhookPath: e.target.value }))}
                placeholder="/deleteactpro/webhook"
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
              <>
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
                <div>
                  <label className="block text-xs font-medium text-slate-400">HMAC signature header</label>
                  <input
                    type="text"
                    value={form.hmacSignatureHeader}
                    onChange={(e) => setForm((p) => ({ ...p, hmacSignatureHeader: e.target.value }))}
                    placeholder={DEFAULT_HMAC_SIGNATURE_HEADER}
                    className="mt-1 w-full rounded-xl border border-slate-800 bg-slate-950/60 px-3 py-2 text-sm text-slate-100"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400">HMAC timestamp header</label>
                  <input
                    type="text"
                    value={form.hmacTimestampHeader}
                    onChange={(e) => setForm((p) => ({ ...p, hmacTimestampHeader: e.target.value }))}
                    placeholder={DEFAULT_HMAC_TIMESTAMP_HEADER}
                    className="mt-1 w-full rounded-xl border border-slate-800 bg-slate-950/60 px-3 py-2 text-sm text-slate-100"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400">Replay window (seconds)</label>
                  <input
                    type="number"
                    min={60}
                    value={form.replayWindowSeconds}
                    onChange={(e) => setForm((p) => ({ ...p, replayWindowSeconds: +e.target.value || DEFAULT_REPLAY_WINDOW_SECONDS }))}
                    className="mt-1 w-full rounded-xl border border-slate-800 bg-slate-950/60 px-3 py-2 text-sm text-slate-100"
                  />
                </div>
              </>
            )}
            {form.authType === 'Bearer' && (
              <div>
                <label className="block text-xs font-medium text-slate-400">Bearer token</label>
                <input
                  type="password"
                  value={form.bearerToken}
                  onChange={(e) => setForm((p) => ({ ...p, bearerToken: e.target.value }))}
                  placeholder="Optional on create; rotate later"
                  className="mt-1 w-full rounded-xl border border-slate-800 bg-slate-950/60 px-3 py-2 text-sm text-slate-100"
                />
              </div>
            )}

            <div className="sm:col-span-2">
              <button
                type="button"
                onClick={() => setAdvancedOpen((o) => !o)}
                className="flex items-center gap-2 text-xs font-medium text-slate-400 hover:text-slate-200"
              >
                {advancedOpen ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
                Advanced settings
              </button>
              {advancedOpen && (
                <div className="mt-3 grid gap-4 sm:grid-cols-2 rounded-xl border border-slate-800 bg-slate-950/40 p-4">
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
                    <label className="block text-xs font-medium text-slate-400">Custom headers (JSON)</label>
                    <input
                      type="text"
                      value={form.headersJson}
                      onChange={(e) => {
                        setForm((p) => ({ ...p, headersJson: e.target.value }))
                        setHeadersJsonError('')
                      }}
                      onBlur={validateHeadersJson}
                      placeholder='{"Authorization":"Bearer ..."}'
                      className={`mt-1 w-full rounded-xl border px-3 py-2 text-sm font-mono text-slate-100 bg-slate-950/60 ${headersJsonError ? 'border-danger-500/50' : 'border-slate-800'}`}
                    />
                    {headersJsonError ? <p className="mt-1 text-xs text-danger-400">{headersJsonError}</p> : null}
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-400">Expected success status codes</label>
                    <input
                      type="text"
                      value={form.expectedSuccessStatusCodes}
                      onChange={(e) => setForm((p) => ({ ...p, expectedSuccessStatusCodes: e.target.value }))}
                      placeholder="200, 201, 204"
                      className="mt-1 w-full rounded-xl border border-slate-800 bg-slate-950/60 px-3 py-2 text-sm text-slate-100"
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="sm:col-span-2">
              <Button type="submit" disabled={creating}>{creating ? 'Creating…' : 'Add Customer API'}</Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {(curlHealth || curlDelete || curlStatus) && (
        <Card>
          <CardHeader>
            <div className="text-sm font-semibold text-slate-50">Example cURL commands</div>
            <p className="text-xs text-slate-400">Test health, delete (with sample subject_hash), and status.</p>
          </CardHeader>
          <CardContent className="space-y-4">
            {curlHealth && (
              <div className="relative">
                <p className="text-xs font-medium text-slate-500 mb-1">Health</p>
                <pre className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-900 p-4 text-xs text-slate-300">{curlHealth}</pre>
                <button type="button" onClick={() => copyText(curlHealth)} className="absolute right-2 top-8 rounded-lg border border-slate-700 bg-slate-800 px-2 py-1 text-xs text-slate-200 hover:bg-slate-700">
                  {copied ? <Check className="h-3 w-3 inline" /> : <Copy className="h-3 w-3 inline" />} Copy
                </button>
              </div>
            )}
            {curlDelete && (
              <div className="relative">
                <p className="text-xs font-medium text-slate-500 mb-1">Delete (sample subject_hash)</p>
                <pre className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-900 p-4 text-xs text-slate-300 whitespace-pre">{curlDelete}</pre>
                <button type="button" onClick={() => copyText(curlDelete)} className="absolute right-2 top-8 rounded-lg border border-slate-700 bg-slate-800 px-2 py-1 text-xs text-slate-200 hover:bg-slate-700">
                  {copied ? <Check className="h-3 w-3 inline" /> : <Copy className="h-3 w-3 inline" />} Copy
                </button>
              </div>
            )}
            {curlStatus && (
              <div className="relative">
                <p className="text-xs font-medium text-slate-500 mb-1">Status</p>
                <pre className="overflow-x-auto rounded-xl border border-slate-800 bg-slate-900 p-4 text-xs text-slate-300">{curlStatus}</pre>
                <button type="button" onClick={() => copyText(curlStatus)} className="absolute right-2 top-8 rounded-lg border border-slate-700 bg-slate-800 px-2 py-1 text-xs text-slate-200 hover:bg-slate-700">
                  {copied ? <Check className="h-3 w-3 inline" /> : <Copy className="h-3 w-3 inline" />} Copy
                </button>
              </div>
            )}
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
              {list.map((api) => {
                const norm = normalizeCustomerApiIntegration(api) || api
                const lastCheck = norm.last_healthcheck ?? norm.lastHealthcheck
                const baseUrlDisplay = norm.baseUrl || norm.base_url || api.baseUrl || api.base_url
                return (
                  <li key={api.id} className="rounded-xl border border-slate-800 p-4">
                    <div className="flex flex-wrap items-center gap-3">
                      <Circle className={lastCheck ? 'h-3 w-3 fill-regulatory-400 text-regulatory-400' : 'h-3 w-3 text-slate-500'} />
                      <span className="font-medium text-slate-200">{norm.name || api.id}</span>
                      <span className="text-xs text-slate-500 truncate max-w-xs">{baseUrlDisplay}</span>
                      <div className="ml-auto flex flex-wrap gap-2">
                        <Button size="sm" variant="ghost" onClick={() => handleTestHealth(api.id)}>
                          <Play className="h-3 w-3" /> Test health
                        </Button>
                        <Button size="sm" variant="ghost" onClick={() => handleTestDelete(api.id)}>Test dry-run delete</Button>
                        <Button size="sm" variant="ghost" onClick={() => handleTestStatus(api.id)}>Test status</Button>
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
                  </li>
                )
              })}
            </ul>
          )}
        </CardContent>
      </Card>

      <SecretShowOnceModal
        secret={rotatedSecret?.secret}
        title="New secret (shown once)"
        onDismiss={() => setRotatedSecret(null)}
      />
    </div>
  )
}

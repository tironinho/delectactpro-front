import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Card, CardContent, CardHeader } from '../../components/ui/Card.jsx'
import Button from '../../components/ui/Button.jsx'
import { listPartners, createPartner, updatePartner, listConnectors, listCustomerApis } from '../../services/appService.js'
import { toList } from '../../services/appService.js'
import { Plus, Link2, Shield } from 'lucide-react'
import clsx from 'clsx'

const TYPES = ['API', 'WEBHOOK', 'SFTP', 'EMAIL', 'MANUAL']
const TABS = [
  { id: 'partners', label: 'Partners', icon: null },
  { id: 'links', label: 'Links / Targets', icon: Link2 },
  { id: 'policies', label: 'Policies', icon: Shield }
]

function targetStatus(target, targetType) {
  if (targetType === 'connector') {
    const h = target?.last_heartbeat ?? target?.lastHeartbeat
    return h ? 'ONLINE' : 'OFFLINE'
  }
  if (targetType === 'customer_api') {
    const h = target?.last_healthcheck ?? target?.lastHealthcheck
    return h ? 'ONLINE' : 'OFFLINE'
  }
  return 'UNKNOWN'
}

export default function Partners() {
  const [partners, setPartners] = useState([])
  const [connectors, setConnectors] = useState([])
  const [customerApis, setCustomerApis] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [activeTab, setActiveTab] = useState('partners')
  const [form, setForm] = useState({ name: '', type: 'API', endpoint_url: '', endpointUrl: '', enabled: true })
  const [linkForm, setLinkForm] = useState({ partnerId: '', target_type: 'connector', target_id: '' })

  function load() {
    setLoading(true)
    Promise.all([
      listPartners().then((d) => toList(d, ['partners', 'items'])).catch(() => []),
      listConnectors().then((d) => toList(d, ['connectors', 'items'])).catch(() => []),
      listCustomerApis().then((d) => toList(d, ['integrations', 'items'])).catch(() => [])
    ]).then(([p, c, a]) => {
      setPartners(p)
      setConnectors(c)
      setCustomerApis(a)
    }).finally(() => setLoading(false))
  }

  useEffect(() => load(), [])

  async function handleCreate(e) {
    e.preventDefault()
    setError('')
    try {
      await createPartner({
        name: form.name,
        type: form.type,
        endpoint_url: form.endpoint_url || form.endpointUrl,
        enabled: form.enabled
      })
      setForm({ name: '', type: 'API', endpoint_url: '', endpointUrl: '', enabled: true })
      load()
    } catch (e) {
      setError(e?.message || 'Create failed')
    }
  }

  async function handleSaveLink(e) {
    e.preventDefault()
    setError('')
    try {
      const partnerId = linkForm.partnerId || linkForm.partner_id
      await updatePartner(partnerId, {
        target_type: linkForm.target_type,
        target_id: linkForm.target_id
      })
      setLinkForm({ partnerId: '', target_type: 'connector', target_id: '' })
      load()
    } catch (e) {
      setError(e?.message || 'Save link failed. Customer API targets may not be supported by the backend yet.')
    }
  }

  const getTargetById = (type, id) => {
    if (type === 'connector') return connectors.find((c) => c.id === id)
    return customerApis.find((a) => a.id === id)
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-slate-50">Partners</h1>
        <p className="mt-1 text-slate-400">Third parties that receive deletions. Link them to connectors or Customer APIs (targets).</p>
      </div>

      {error ? (
        <div className="rounded-xl border border-danger-500/30 bg-danger-500/10 px-4 py-3 text-sm text-danger-200">{error}</div>
      ) : null}

      <Card>
        <CardHeader className="flex flex-row items-center gap-4">
          <div className="text-sm font-semibold text-slate-50">Partners &amp; targets</div>
          <div className="flex gap-2">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={clsx(
                  'rounded-lg px-3 py-1.5 text-xs font-medium flex items-center gap-1 transition',
                  activeTab === tab.id ? 'bg-slate-800 text-slate-100' : 'text-slate-400 hover:text-slate-200'
                )}
              >
                {tab.icon && <tab.icon className="h-3 w-3" />}
                {tab.label}
              </button>
            ))}
          </div>
        </CardHeader>
        <CardContent>
          {activeTab === 'partners' && (
            <>
              <div className="mb-4">
                <div className="text-xs font-medium text-slate-400 mb-2">Add partner</div>
                <form onSubmit={handleCreate} className="flex flex-wrap gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-400">Name</label>
                    <input
                      type="text"
                      value={form.name}
                      onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                      required
                      className="mt-1 w-48 rounded-xl border border-slate-800 bg-slate-950/60 px-3 py-2 text-sm text-slate-100"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-400">Type</label>
                    <select
                      value={form.type}
                      onChange={(e) => setForm((p) => ({ ...p, type: e.target.value }))}
                      className="mt-1 w-36 rounded-xl border border-slate-800 bg-slate-950/60 px-3 py-2 text-sm text-slate-100"
                    >
                      {TYPES.map((t) => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-400">Endpoint URL</label>
                    <input
                      type="url"
                      value={form.endpoint_url || form.endpointUrl}
                      onChange={(e) => setForm((p) => ({ ...p, endpoint_url: e.target.value, endpointUrl: e.target.value }))}
                      placeholder="https://..."
                      className="mt-1 w-64 rounded-xl border border-slate-800 bg-slate-950/60 px-3 py-2 text-sm text-slate-100"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="enabled"
                      checked={form.enabled}
                      onChange={(e) => setForm((p) => ({ ...p, enabled: e.target.checked }))}
                      className="rounded border-slate-700"
                    />
                    <label htmlFor="enabled" className="text-sm text-slate-400">Enabled</label>
                  </div>
                  <Button type="submit"><Plus className="h-4 w-4" /> Add</Button>
                </form>
              </div>
              {loading ? (
                <p className="text-sm text-slate-500">Loading…</p>
              ) : partners.length === 0 ? (
                <p className="text-sm text-slate-500">No partners yet.</p>
              ) : (
                <ul className="space-y-2">
                  {partners.map((p) => (
                    <li key={p.id} className="flex items-center justify-between rounded-xl border border-slate-800 px-4 py-3">
                      <div>
                        <span className="font-medium text-slate-200">{p.name}</span>
                        <span className="ml-2 text-xs text-slate-500">{p.type}</span>
                        {(p.endpoint_url || p.endpointUrl) && (
                          <span className="ml-2 text-xs text-slate-400 truncate max-w-xs inline-block">{p.endpoint_url || p.endpointUrl}</span>
                        )}
                        {(p.connector_ids?.length || p.customer_api_integration_ids?.length) ? (
                          <span className="ml-2 text-xs text-slate-500">→ linked</span>
                        ) : null}
                      </div>
                      <span className={p.enabled ? 'text-xs text-regulatory-400' : 'text-xs text-slate-500'}>{p.enabled ? 'Enabled' : 'Disabled'}</span>
                    </li>
                  ))}
                </ul>
              )}
            </>
          )}

          {activeTab === 'links' && (
            <div className="space-y-4">
              <p className="text-xs text-slate-400">Link a partner to a target: Connector (Agent) or Customer API.</p>
              {linkForm.target_type === 'customer_api' && (
                <p className="text-xs text-amber-200/90 rounded-lg border border-amber-500/30 bg-amber-500/10 px-3 py-2">
                  Customer API targets: backend support may be pending. If save fails, use Connector only for now.
                </p>
              )}
              <form onSubmit={handleSaveLink} className="flex flex-wrap items-end gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-400">Partner</label>
                  <select
                    value={linkForm.partnerId || linkForm.partner_id}
                    onChange={(e) => setLinkForm((p) => ({ ...p, partnerId: e.target.value }))}
                    className="mt-1 w-48 rounded-xl border border-slate-800 bg-slate-950/60 px-3 py-2 text-sm text-slate-100"
                  >
                    <option value="">Select</option>
                    {partners.map((p) => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400">Target type</label>
                  <select
                    value={linkForm.target_type}
                    onChange={(e) => setLinkForm((p) => ({ ...p, target_type: e.target.value, target_id: '' }))}
                    className="mt-1 w-40 rounded-xl border border-slate-800 bg-slate-950/60 px-3 py-2 text-sm text-slate-100"
                  >
                    <option value="connector">Connector (Agent)</option>
                    <option value="customer_api">Customer API</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400">Target</label>
                  <select
                    value={linkForm.target_id}
                    onChange={(e) => setLinkForm((p) => ({ ...p, target_id: e.target.value }))}
                    className="mt-1 w-56 rounded-xl border border-slate-800 bg-slate-950/60 px-3 py-2 text-sm text-slate-100"
                  >
                    <option value="">Select</option>
                    {linkForm.target_type === 'connector'
                      ? connectors.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.name || c.id}
                          </option>
                        ))
                      : customerApis.map((a) => (
                          <option key={a.id} value={a.id}>
                            {a.name || a.id}
                          </option>
                        ))}
                  </select>
                </div>
                <Button type="submit" disabled={!(linkForm.partnerId || linkForm.partner_id) || !linkForm.target_id}>
                  Save link
                </Button>
              </form>
              {partners.some((p) => p.target_type || p.target_id) && (
                <div className="mt-4">
                  <div className="text-xs font-medium text-slate-500 mb-2">Current links</div>
                  <ul className="space-y-1">
                    {partners.map((p) => {
                      const tt = p.target_type || 'connector'
                      const tid = p.target_id || p.targetId
                      const target = getTargetById(tt, tid)
                      const status = tid ? targetStatus(target, tt) : 'UNKNOWN'
                      if (!tid) return null
                      return (
                        <li key={p.id} className="flex items-center gap-2 text-sm text-slate-300">
                          <span className="font-medium text-slate-200">{p.name}</span>
                          <span className="text-slate-500">→</span>
                          <span className={clsx('rounded px-1.5 py-0.5 text-xs', tt === 'connector' ? 'bg-slate-700' : 'bg-slate-700')}>
                            {tt === 'connector' ? 'Connector' : 'Customer API'}
                          </span>
                          <span className="text-slate-500">{target?.name || tid}</span>
                          <span
                            className={clsx(
                              'rounded px-1.5 py-0.5 text-xs',
                              status === 'ONLINE' ? 'bg-regulatory-500/20 text-regulatory-300' : status === 'OFFLINE' ? 'bg-slate-700 text-slate-400' : 'bg-slate-700 text-slate-500'
                            )}
                          >
                            {status}
                          </span>
                        </li>
                      )
                    })}
                  </ul>
                </div>
              )}
            </div>
          )}

          {activeTab === 'policies' && (
            <div className="space-y-4">
              <p className="text-xs text-slate-400">Define cascade policies (partner → target, retries, SLA, mode) on the Cascade Policies page.</p>
              <Link to="/app/cascade-policies">
                <Button>Open Cascade Policies</Button>
              </Link>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

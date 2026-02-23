import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader } from '../../components/ui/Card.jsx'
import Button from '../../components/ui/Button.jsx'
import { listCascadePolicies, upsertCascadePolicy, dispatchCascadeTest, listPartners, listConnectors, listCustomerApis } from '../../services/appService.js'
import { Play } from 'lucide-react'

const MODES = ['DRY_RUN', 'ENFORCE']

export default function CascadePolicies() {
  const [policies, setPolicies] = useState([])
  const [partners, setPartners] = useState([])
  const [connectors, setConnectors] = useState([])
  const [customerApis, setCustomerApis] = useState([])
  const [loading, setLoading] = useState(true)
  const [dispatching, setDispatching] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    partner_id: '',
    target_type: 'connector',
    target_id: '',
    retries_max: 3,
    backoff_minutes: 5,
    sla_days: 45,
    attestation_required: false,
    escalation_email: '',
    mode: 'DRY_RUN'
  })

  function load() {
    setLoading(true)
    Promise.all([
      listCascadePolicies().then((d) => (Array.isArray(d) ? d : d?.policies || [])).catch(() => []),
      listPartners().then((d) => (Array.isArray(d) ? d : d?.partners || [])).catch(() => []),
      listConnectors().then((d) => (Array.isArray(d) ? d : d?.connectors || [])).catch(() => []),
      listCustomerApis().then((d) => (Array.isArray(d) ? d : d?.integrations || d || [])).catch(() => [])
    ]).then(([pol, p, c, a]) => {
      setPolicies(pol)
      setPartners(p)
      setConnectors(c)
      setCustomerApis(a)
    }).finally(() => setLoading(false))
  }

  useEffect(() => load(), [])

  async function handleSave(e) {
    e.preventDefault()
    setError('')
    try {
      const payload = {
        partner_id: form.partner_id,
        target_type: form.target_type,
        target_id: form.target_id,
        retries_max: form.retries_max,
        retry_backoff_minutes: form.backoff_minutes,
        backoff_minutes: form.backoff_minutes,
        sla_days: form.sla_days,
        attestation_required: form.attestation_required,
        escalation_email: form.escalation_email,
        mode: form.mode
      }
      await upsertCascadePolicy(payload)
      load()
    } catch (e) {
      setError(e?.message || 'Save failed')
    }
  }

  async function handleDispatch() {
    setError('')
    setDispatching(true)
    try {
      await dispatchCascadeTest()
      load()
    } catch (e) {
      setError(e?.message || 'Dispatch failed')
    } finally {
      setDispatching(false)
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-slate-50">Cascade Policies</h1>
        <p className="mt-1 text-slate-400">Partner → connector → policy: retries, SLA, attestation, mode.</p>
      </div>

      {error ? (
        <div className="rounded-xl border border-danger-500/30 bg-danger-500/10 px-4 py-3 text-sm text-danger-200">{error}</div>
      ) : null}

      <Card>
        <CardHeader>
          <div className="text-sm font-semibold text-slate-50">Mapping</div>
          <p className="text-xs text-slate-400">partner → target (connector OR customer API) → policy</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <form onSubmit={handleSave} className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-medium text-slate-400">Partner</label>
              <select
                value={form.partner_id}
                onChange={(e) => setForm((p) => ({ ...p, partner_id: e.target.value }))}
                className="mt-1 w-full rounded-xl border border-slate-800 bg-slate-950/60 px-3 py-2 text-sm text-slate-100"
              >
                <option value="">Select partner</option>
                {partners.map((p) => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400">Target type</label>
              <select
                value={form.target_type}
                onChange={(e) => setForm((p) => ({ ...p, target_type: e.target.value, target_id: '' }))}
                className="mt-1 w-full rounded-xl border border-slate-800 bg-slate-950/60 px-3 py-2 text-sm text-slate-100"
              >
                <option value="connector">Connector (Agent)</option>
                <option value="customer_api">Customer API</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400">Target</label>
              <select
                value={form.target_id}
                onChange={(e) => setForm((p) => ({ ...p, target_id: e.target.value }))}
                className="mt-1 w-full rounded-xl border border-slate-800 bg-slate-950/60 px-3 py-2 text-sm text-slate-100"
              >
                <option value="">Select</option>
                {form.target_type === 'connector'
                  ? connectors.map((c) => <option key={c.id} value={c.id}>{c.name || c.id}</option>)
                  : customerApis.map((a) => <option key={a.id} value={a.id}>{a.name || a.id}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400">Retries max</label>
              <input
                type="number"
                min={0}
                value={form.retries_max}
                onChange={(e) => setForm((p) => ({ ...p, retries_max: +e.target.value }))}
                className="mt-1 w-full rounded-xl border border-slate-800 bg-slate-950/60 px-3 py-2 text-sm text-slate-100"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400">Backoff (min)</label>
              <input
                type="number"
                min={0}
                value={form.backoff_minutes}
                onChange={(e) => setForm((p) => ({ ...p, backoff_minutes: +e.target.value }))}
                className="mt-1 w-full rounded-xl border border-slate-800 bg-slate-950/60 px-3 py-2 text-sm text-slate-100"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400">SLA (days)</label>
              <input
                type="number"
                min={1}
                value={form.sla_days}
                onChange={(e) => setForm((p) => ({ ...p, sla_days: +e.target.value }))}
                className="mt-1 w-full rounded-xl border border-slate-800 bg-slate-950/60 px-3 py-2 text-sm text-slate-100"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400">Escalation email</label>
              <input
                type="email"
                value={form.escalation_email}
                onChange={(e) => setForm((p) => ({ ...p, escalation_email: e.target.value }))}
                className="mt-1 w-full rounded-xl border border-slate-800 bg-slate-950/60 px-3 py-2 text-sm text-slate-100"
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="attestation"
                checked={form.attestation_required}
                onChange={(e) => setForm((p) => ({ ...p, attestation_required: e.target.checked }))}
                className="rounded border-slate-700"
              />
              <label htmlFor="attestation" className="text-sm text-slate-400">Attestation required</label>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400">Mode</label>
              <select
                value={form.mode}
                onChange={(e) => setForm((p) => ({ ...p, mode: e.target.value }))}
                className="mt-1 w-full rounded-xl border border-slate-800 bg-slate-950/60 px-3 py-2 text-sm text-slate-100"
              >
                {MODES.map((m) => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </div>
            <div className="sm:col-span-2">
              <Button type="submit">Save policy</Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="text-sm font-semibold text-slate-50">Dispatch cascade test</div>
          <p className="text-xs text-slate-400">Calls admin/dispatch in tenant scope.</p>
        </CardHeader>
        <CardContent>
          <Button onClick={handleDispatch} disabled={dispatching}>
            <Play className="h-4 w-4" /> {dispatching ? 'Dispatching…' : 'Dispatch cascade test'}
          </Button>
        </CardContent>
      </Card>

      {policies.length > 0 && (
        <Card>
          <CardHeader>
            <div className="text-sm font-semibold text-slate-50">Current policies</div>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {policies.map((p) => (
                <li key={p.id || p.partner_id} className="rounded-xl border border-slate-800 px-4 py-3 text-sm text-slate-300">
                  Partner {p.partner_id} → {p.target_type === 'customer_api' ? 'Customer API' : 'Connector'} {p.target_id} · retries={p.retries_max} · SLA {p.sla_days}d · {p.mode}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

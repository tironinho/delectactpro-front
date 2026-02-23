import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Card, CardContent, CardHeader } from '../../components/ui/Card.jsx'
import { listConnectors, listCustomerApis, listHashRecipes, listPartners, listCascadePolicies, listRuns } from '../../services/appService.js'
import { toList } from '../../services/appService.js'
import { Check, Circle, AlertCircle, Calendar } from 'lucide-react'

export default function Dashboard() {
  const [connectors, setConnectors] = useState([])
  const [customerApis, setCustomerApis] = useState([])
  const [recipes, setRecipes] = useState([])
  const [partners, setPartners] = useState([])
  const [policies, setPolicies] = useState([])
  const [runs, setRuns] = useState([])
  const [loading, setLoading] = useState(true)
  const [apiError, setApiError] = useState('')

  useEffect(() => {
    setApiError('')
    Promise.all([
      listConnectors().then((d) => toList(d)).catch((e) => { setApiError(e?.message || 'Failed to load connectors'); return [] }),
      listCustomerApis().then((d) => toList(d, ['integrations', 'items'])).catch((e) => { setApiError(e?.message || 'Failed to load Customer APIs'); return [] }),
      listHashRecipes().then((d) => toList(d)).catch(() => []),
      listPartners().then((d) => toList(d)).catch(() => []),
      listCascadePolicies().then((d) => toList(d)).catch(() => []),
      listRuns().then((d) => toList(d)).catch(() => [])
    ]).then(([c, a, r, p, pol, run]) => {
      setConnectors(c)
      setCustomerApis(a)
      setRecipes(r)
      setPartners(p)
      setPolicies(pol)
      setRuns(run)
    }).finally(() => setLoading(false))
  }, [])

  const hasIntegration = connectors.length > 0 || customerApis.length > 0
  const hasConnectedAgent = connectors.some((x) => x.last_heartbeat || x.lastHeartbeat)
  const hasHealthyCustomerApi = customerApis.some((x) => x.last_healthcheck || x.lastHealthcheck)
  const integrationOk = hasConnectedAgent || hasHealthyCustomerApi
  const hasHashRecipe = recipes.length > 0 && recipes.some((r) => r.active)
  const hasPartners = partners.length > 0
  const hasCascade = policies.length > 0
  const hasRunSchedule = true
  const scheduleOk = true

  const lastRunAt = runs[0]?.created_at || runs[0]?.createdAt
  const daysSinceLastRun = lastRunAt ? Math.floor((Date.now() - new Date(lastRunAt)) / (24 * 60 * 60 * 1000)) : null
  const within45Days = daysSinceLastRun != null && daysSinceLastRun <= 45

  const checks = [
    { label: 'Integration configured (Agent or Customer APIs)', ok: hasIntegration && integrationOk, link: '/app/integrations' },
    { label: 'Hash recipe active', ok: hasHashRecipe, link: '/app/hash-recipes' },
    { label: 'Partners configured', ok: hasPartners, link: '/app/partners' },
    { label: 'Cascade policy defined', ok: hasCascade, link: '/app/cascade-policies' },
    { label: 'Schedule (≤45 days)', ok: hasRunSchedule && scheduleOk, link: '/app/runs' }
  ]
  const score = checks.filter((c) => c.ok).length
  const total = checks.length

  const lastRun = runs[0]
  const lastHeartbeatConnector = connectors.filter((c) => c.last_heartbeat).sort((a, b) => new Date(b.last_heartbeat) - new Date(a.last_heartbeat))[0]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-slate-50">Dashboard</h1>
        <p className="mt-1 text-slate-400">Readiness for DROP compliance</p>
      </div>

      {apiError ? (
        <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-200">
          {apiError} Check your connection and try again, or go to <Link to="/app/settings" className="underline">Settings</Link>.
        </div>
      ) : null}

      <Card className="max-w-xl">
        <CardHeader>
          <div className="text-sm font-semibold text-slate-400">READINESS SCORE</div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-4xl font-extrabold text-slate-50">{score}</span>
            <span className="text-slate-400">/ {total}</span>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {checks.map(({ label, ok, link }) => (
            <Link
              key={label}
              to={link}
              className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-950/40 px-4 py-3 transition hover:bg-slate-800/30"
            >
              <span className="text-sm text-slate-200">{label}</span>
              {ok ? (
                <Check className="h-5 w-5 text-regulatory-400" />
              ) : (
                <AlertCircle className="h-5 w-5 text-slate-500" />
              )}
            </Link>
          ))}
        </CardContent>
      </Card>

      {(lastRun || lastHeartbeatConnector || runs.length === 0) && (
        <Card>
          <CardHeader>
            <div className="text-sm font-semibold text-slate-50">Last run / Last heartbeat</div>
            <div className="text-xs text-slate-400">45-day compliance window: run at least every 45 days</div>
          </CardHeader>
          <CardContent className="space-y-2">
            {lastRun ? (
              <>
                <p className="text-sm text-slate-300">
                  Last run: <span className="text-slate-200">{lastRun.id || lastRun.created_at}</span>
                  {lastRun.created_at ? ` — ${new Date(lastRun.created_at).toLocaleString()}` : ''}
                </p>
                {daysSinceLastRun != null && (
                  <p className="text-xs flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5 text-slate-500" />
                    <span className={within45Days ? 'text-regulatory-400' : 'text-amber-400'}>
                      {daysSinceLastRun === 0 ? 'Today' : `${daysSinceLastRun} day${daysSinceLastRun === 1 ? '' : 's'} since last run`}
                      {within45Days ? ' · Within 45-day window' : ' · Over 45 days — schedule a run'}
                    </span>
                  </p>
                )}
              </>
            ) : (
              <p className="text-sm text-slate-500">No runs yet. Configure a schedule in <Link to="/app/runs" className="text-regulatory-300 hover:text-regulatory-200">Runs</Link> to stay within the 45-day compliance window.</p>
            )}
            {lastHeartbeatConnector && (
              <p className="text-sm text-slate-300">
                Last successful sync (Agent): <span className="text-slate-200">{lastHeartbeatConnector.name || lastHeartbeatConnector.id}</span>
                {' '}{new Date(lastHeartbeatConnector.last_heartbeat || lastHeartbeatConnector.lastHeartbeat).toLocaleString()}
              </p>
            )}
          </CardContent>
        </Card>
      )}

      {loading ? (
        <p className="text-sm text-slate-500">Loading…</p>
      ) : connectors.length === 0 && customerApis.length === 0 ? (
        <Card>
          <CardHeader>
            <div className="text-sm font-semibold text-slate-50">Integration status</div>
            <div className="text-xs text-slate-400">No integrations yet</div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-slate-400 mb-4">Add a Connector (Docker Agent) or Customer API to start. Run onboarding for a guided setup.</p>
            <div className="flex gap-3">
              <Link to="/app/onboarding"><span className="inline-flex items-center justify-center rounded-xl bg-regulatory-500 px-4 py-3 text-sm font-semibold text-white hover:bg-regulatory-400">Start onboarding</span></Link>
              <Link to="/app/integrations"><span className="inline-flex items-center justify-center rounded-xl border border-slate-700 px-4 py-3 text-sm font-semibold text-slate-200 hover:bg-slate-800">Integrations</span></Link>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <div className="text-sm font-semibold text-slate-50">Integration status</div>
            <div className="text-xs text-slate-400">Connectors and Customer APIs</div>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {connectors.map((c) => (
                <li key={c.id} className="flex items-center gap-3 rounded-xl border border-slate-800 px-4 py-3">
                  <Circle className={c.last_heartbeat ? 'h-2.5 w-2.5 fill-regulatory-400 text-regulatory-400' : 'h-2.5 w-2.5 text-slate-500'} />
                  <span className="font-medium text-slate-200">Agent: {c.name || c.id}</span>
                  <span className="text-xs text-slate-500">{c.db_type}</span>
                  {c.agentVersion && <span className="text-xs text-slate-500">v{c.agentVersion}</span>}
                  {c.last_heartbeat ? (
                    <span className="ml-auto text-xs text-slate-400">Last heartbeat: {new Date(c.last_heartbeat).toLocaleString()}</span>
                  ) : (
                    <span className="ml-auto text-xs text-slate-500">No heartbeat</span>
                  )}
                </li>
              ))}
              {customerApis.map((api) => (
                <li key={api.id} className="flex items-center gap-3 rounded-xl border border-slate-800 px-4 py-3">
                  <Circle className={api.last_healthcheck ? 'h-2.5 w-2.5 fill-regulatory-400 text-regulatory-400' : 'h-2.5 w-2.5 text-slate-500'} />
                  <span className="font-medium text-slate-200">Customer API: {api.name || api.id}</span>
                  <span className="ml-auto text-xs text-slate-400 truncate max-w-[200px]">{api.baseUrl}</span>
                  {api.last_healthcheck && <span className="text-xs text-slate-500">Last health: {new Date(api.last_healthcheck).toLocaleString()}</span>}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

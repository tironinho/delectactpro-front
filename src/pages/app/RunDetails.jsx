import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Card, CardContent, CardHeader } from '../../components/ui/Card.jsx'
import { getRun } from '../../services/appService.js'

export default function RunDetails() {
  const { runId } = useParams()
  const [run, setRun] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!runId) return
    getRun(runId)
      .then(setRun)
      .catch(() => setRun(null))
      .finally(() => setLoading(false))
  }, [runId])

  if (loading) return <p className="text-slate-500">Loading…</p>
  if (!run) return <p className="text-slate-500">Run not found.</p>

  const events = run.events || []
  const cascades = run.cascades || []

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <Link to="/app/runs" className="text-sm text-slate-400 hover:text-slate-50">← Runs</Link>
        <h1 className="text-2xl font-extrabold text-slate-50">Run {runId}</h1>
      </div>

      <Card>
        <CardHeader>
          <div className="text-sm font-semibold text-slate-50">Details</div>
          <div className="text-xs text-slate-400">Status: {run.status || '—'} · Created: {run.created_at ? new Date(run.created_at).toLocaleString() : '—'}</div>
        </CardHeader>
        <CardContent className="space-y-4">
          {events.length > 0 && (
            <div>
              <div className="text-xs font-semibold text-slate-400 mb-2">Events</div>
              <ul className="space-y-1 text-sm text-slate-300">
                {events.map((e, i) => (
                  <li key={i}>{typeof e === 'string' ? e : JSON.stringify(e)}</li>
                ))}
              </ul>
            </div>
          )}
          {cascades.length > 0 && (
            <div>
              <div className="text-xs font-semibold text-slate-400 mb-2">Cascades</div>
              <ul className="space-y-1 text-sm text-slate-300">
                {cascades.map((c, i) => (
                  <li key={i}>{typeof c === 'string' ? c : JSON.stringify(c)}</li>
                ))}
              </ul>
            </div>
          )}
          {events.length === 0 && cascades.length === 0 && <p className="text-sm text-slate-500">No events or cascades.</p>}
        </CardContent>
      </Card>
    </div>
  )
}

import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Card, CardContent, CardHeader } from '../../components/ui/Card.jsx'
import { listRuns } from '../../services/appService.js'

export default function Runs() {
  const [runs, setRuns] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    listRuns()
      .then((data) => setRuns(Array.isArray(data) ? data : data?.runs || []))
      .catch(() => setRuns([]))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-slate-50">Runs</h1>
        <p className="mt-1 text-slate-400">Execution history and schedule (≤45 days recommended)</p>
      </div>

      <Card>
        <CardHeader>
          <div className="text-sm font-semibold text-slate-50">Runs</div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-sm text-slate-500">Loading…</p>
          ) : runs.length === 0 ? (
            <p className="text-sm text-slate-500">No runs yet.</p>
          ) : (
            <ul className="space-y-2">
              {runs.map((r) => (
                <li key={r.id}>
                  <Link
                    to={`/app/runs/${r.id}`}
                    className="block rounded-xl border border-slate-800 px-4 py-3 text-sm text-slate-200 hover:bg-slate-800/30"
                  >
                    <span className="font-medium">{r.id}</span>
                    {r.status ? <span className="ml-2 text-slate-500">{r.status}</span> : null}
                    {r.created_at ? <span className="ml-auto text-xs text-slate-500">{new Date(r.created_at).toLocaleString()}</span> : null}
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

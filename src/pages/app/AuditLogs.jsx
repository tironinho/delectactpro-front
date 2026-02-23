import { useState } from 'react'
import { Card, CardContent, CardHeader } from '../../components/ui/Card.jsx'
import Button from '../../components/ui/Button.jsx'
import { getAuditLogs, exportAuditPacket } from '../../services/appService.js'
import { Download } from 'lucide-react'

export default function AuditLogs() {
  const [requestId, setRequestId] = useState('')
  const [logs, setLogs] = useState([])
  const [loading, setLoading] = useState(false)
  const [exporting, setExporting] = useState(false)
  const [error, setError] = useState('')

  async function handleSearch(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const data = await getAuditLogs(requestId ? { request_id: requestId } : {})
      setLogs(Array.isArray(data) ? data : data?.events || data?.items || [])
    } catch (e) {
      setError(e?.message || 'Fetch failed. Check your connection or request_id.')
      setLogs([])
    } finally {
      setLoading(false)
    }
  }

  async function handleExport() {
    setError('')
    setExporting(true)
    try {
      const blob = await exportAuditPacket(requestId ? { request_id: requestId } : {})
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `audit-packet-${requestId || 'all'}-${Date.now()}.json`
      a.click()
      URL.revokeObjectURL(url)
    } catch (e) {
      setError(e?.message || 'Export failed')
    } finally {
      setExporting(false)
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-slate-50">Audit Logs</h1>
        <p className="mt-1 text-slate-400">Search by request_id and export audit packet (JSON)</p>
      </div>

      {error ? (
        <div className="rounded-xl border border-danger-500/30 bg-danger-500/10 px-4 py-3 text-sm text-danger-200">{error}</div>
      ) : null}

      <Card>
        <CardHeader>
          <div className="text-sm font-semibold text-slate-50">Search</div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSearch} className="flex flex-wrap gap-3">
            <input
              type="text"
              value={requestId}
              onChange={(e) => setRequestId(e.target.value)}
              placeholder="Request ID (optional)"
              className="w-64 rounded-xl border border-slate-800 bg-slate-950/60 px-3 py-2 text-sm text-slate-100"
            />
            <Button type="submit" disabled={loading}>{loading ? 'Searching…' : 'Search'}</Button>
            <Button type="button" variant="ghost" onClick={handleExport} disabled={exporting}>
              <Download className="h-4 w-4" /> {exporting ? 'Exporting…' : 'Export Audit Packet'}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="text-sm font-semibold text-slate-50">Audit events</div>
        </CardHeader>
        <CardContent>
          {logs.length === 0 && !loading ? (
            <p className="text-sm text-slate-500">No events. Run a search or export to download.</p>
          ) : (
            <ul className="space-y-2 max-h-96 overflow-y-auto">
              {logs.map((ev, i) => (
                <li key={i} className="rounded-xl border border-slate-800 px-4 py-2 text-xs font-mono text-slate-300">
                  {typeof ev === 'object' ? JSON.stringify(ev) : ev}
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

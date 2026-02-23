import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader } from '../../components/ui/Card.jsx'
import Button from '../../components/ui/Button.jsx'
import { listHashRecipes, createHashRecipe, updateHashRecipe, deleteHashRecipe, setActiveHashRecipe } from '../../services/appService.js'
import { sha256Hex } from '../../utils/sha256Browser.js'
import { Copy, Check } from 'lucide-react'

function normalizeEmail(s) {
  return (s || '').toLowerCase().trim()
}

function normalizePhone(s) {
  return (s || '').replace(/\D/g, '')
}

export default function HashRecipes() {
  const [recipes, setRecipes] = useState([])
  const [loading, setLoading] = useState(true)
  const [testerInput, setTesterInput] = useState({ email: '', phone: '' })
  const [testerHash, setTesterHash] = useState('')
  const [testerLoading, setTesterLoading] = useState(false)
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState('')

  function load() {
    setLoading(true)
    listHashRecipes()
      .then((data) => setRecipes(Array.isArray(data) ? data : data?.recipes || []))
      .catch(() => setRecipes([]))
      .finally(() => setLoading(false))
  }

  useEffect(() => load(), [])

  async function runTester() {
    setTesterLoading(true)
    setTesterHash('')
    try {
      const parts = []
      if (testerInput.email) parts.push(normalizeEmail(testerInput.email))
      if (testerInput.phone) parts.push(normalizePhone(testerInput.phone))
      const combined = parts.join('|')
      if (!combined) {
        setTesterHash('')
        return
      }
      const hash = await sha256Hex(combined)
      setTesterHash(hash)
    } catch (e) {
      setTesterHash('Error: ' + (e?.message || 'Hashing failed'))
    } finally {
      setTesterLoading(false)
    }
  }

  function copyHash() {
    if (testerHash) {
      navigator.clipboard.writeText(testerHash)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-slate-50">Hash Recipes</h1>
        <p className="mt-1 text-slate-400">p_hash / subject_hash — versioned recipes. Hashing runs in browser only (no PII sent).</p>
      </div>

      <Card>
        <CardHeader>
          <div className="text-sm font-semibold text-slate-50">Recipe Tester (client-side)</div>
          <p className="text-xs text-slate-400">Enter sample values; hash is generated locally with SHA-256. No data is sent to the server.</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-medium text-slate-400">Email (normalized: lower, trim)</label>
              <input
                type="text"
                value={testerInput.email}
                onChange={(e) => setTesterInput((p) => ({ ...p, email: e.target.value }))}
                placeholder="user@example.com"
                className="mt-1 w-full rounded-xl border border-slate-800 bg-slate-950/60 px-3 py-2 text-sm text-slate-100"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400">Phone (E.164 style: digits only)</label>
              <input
                type="text"
                value={testerInput.phone}
                onChange={(e) => setTesterInput((p) => ({ ...p, phone: e.target.value }))}
                placeholder="+15551234567"
                className="mt-1 w-full rounded-xl border border-slate-800 bg-slate-950/60 px-3 py-2 text-sm text-slate-100"
              />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button onClick={runTester} disabled={testerLoading}>
              {testerLoading ? 'Generating…' : 'Generate subject_hash'}
            </Button>
            {testerHash ? (
              <div className="flex items-center gap-2">
                <code className="rounded-lg border border-slate-700 bg-slate-900 px-2 py-1 text-xs text-slate-300 break-all">
                  {testerHash}
                </code>
                <button
                  type="button"
                  onClick={copyHash}
                  className="inline-flex items-center gap-1 rounded-lg border border-slate-700 bg-slate-800 px-2 py-1 text-xs text-slate-200 hover:bg-slate-700"
                >
                  {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />} Copy
                </button>
              </div>
            ) : null}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="text-sm font-semibold text-slate-50">Recipes (CRUD)</div>
          <p className="text-xs text-slate-400">Name, version, algorithm (SHA-256), delimiter, fields, normalization rules.</p>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-sm text-slate-500">Loading…</p>
          ) : recipes.length === 0 ? (
            <p className="text-sm text-slate-500">No recipes yet. Create one via API or add a simple form here.</p>
          ) : (
            <ul className="space-y-2">
              {recipes.map((r) => (
                <li key={r.id} className="flex items-center justify-between rounded-xl border border-slate-800 px-4 py-3">
                  <div>
                    <span className="font-medium text-slate-200">{r.name}</span>
                    <span className="ml-2 text-xs text-slate-500">v{r.version} · {r.algorithm || 'SHA-256'}</span>
                    {r.active && <span className="ml-2 text-xs text-regulatory-400">Active</span>}
                  </div>
                  {!r.active && (
                    <Button size="sm" variant="ghost" onClick={() => setActiveHashRecipe(r.id).then(load)}>Set active</Button>
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

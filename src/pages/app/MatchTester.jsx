import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { Card, CardContent, CardHeader } from '../../components/ui/Card.jsx'
import Button from '../../components/ui/Button.jsx'
import { listHashRecipes } from '../../services/appService.js'
import { toList } from '../../services/appService.js'
import { sha256Hex } from '../../utils/sha256Browser.js'
import { Copy, Check, ArrowLeft } from 'lucide-react'

function normalizePart(value, flags = {}) {
  let s = String(value ?? '').trim()
  if (flags.trim !== false) s = s.trim()
  if (flags.lowercase) s = s.toLowerCase()
  if (flags.digits_only) s = s.replace(/\D/g, '')
  if (flags.remove_accents) s = s.normalize('NFD').replace(/\p{Diacritic}/gu, '')
  return s
}

export default function MatchTester() {
  const [searchParams] = useSearchParams()
  const recipeIdParam = searchParams.get('recipe')
  const [recipes, setRecipes] = useState([])
  const [activeRecipe, setActiveRecipe] = useState(null)
  const [loading, setLoading] = useState(true)
  const [sample, setSample] = useState({ email: '', phone: '', name: '' })
  const [generatedHash, setGeneratedHash] = useState('')
  const [generating, setGenerating] = useState(false)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    listHashRecipes()
      .then((d) => {
        const list = toList(d, ['recipes', 'items'])
        setRecipes(list)
        const active = list.find((r) => r.active)
        const byId = recipeIdParam ? list.find((r) => r.id === recipeIdParam) : null
        setActiveRecipe(byId || active || list[0] || null)
      })
      .catch(() => setRecipes([]))
      .finally(() => setLoading(false))
  }, [recipeIdParam])

  async function generate() {
    if (!activeRecipe) return
    setGenerating(true)
    setGeneratedHash('')
    try {
      const delimiter = activeRecipe.delimiter ?? '|'
      const fields = Array.isArray(activeRecipe.fields) ? activeRecipe.fields : ['email', 'phone']
      const norm = activeRecipe.normalization ?? {}
      const parts = fields.map((f) => normalizePart(sample[f] ?? '', norm))
      const concatenated = parts.join(delimiter)
      if (!concatenated) {
        setGeneratedHash('')
        return
      }
      const hash = await sha256Hex(concatenated)
      setGeneratedHash(hash)
    } catch (e) {
      setGeneratedHash('Error: ' + (e?.message || 'Hashing failed'))
    } finally {
      setGenerating(false)
    }
  }

  function copyText(str) {
    navigator.clipboard.writeText(str)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const requestPayloadExample = generatedHash
    ? JSON.stringify(
        {
          request_id: 'req_abc123',
          subject_hash: generatedHash,
          source: 'DROP'
        },
        null,
        2
      )
    : ''

  return (
    <div className="space-y-8">
      <div>
        <Link to="/app/hash-recipes" className="inline-flex items-center gap-1 text-sm text-slate-400 hover:text-slate-200 mb-2">
          <ArrowLeft className="h-4 w-4" /> Hash Recipes
        </Link>
        <h1 className="text-2xl font-extrabold tracking-tight text-slate-50">Match Tester</h1>
        <p className="mt-1 text-slate-400">Generate subject_hash from sample data using an active recipe. Use for DROP request payload examples.</p>
      </div>

      <Card>
        <CardHeader>
          <div className="text-sm font-semibold text-slate-50">Recipe &amp; sample data</div>
          <p className="text-xs text-slate-400">Select a recipe and enter sample values. Hash is computed in the browser only.</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-400">Hash recipe</label>
            <select
              value={activeRecipe?.id ?? ''}
              onChange={(e) => setActiveRecipe(recipes.find((r) => r.id === e.target.value) || null)}
              className="mt-1 w-full max-w-md rounded-xl border border-slate-800 bg-slate-950/60 px-3 py-2 text-sm text-slate-100"
            >
              <option value="">Select</option>
              {recipes.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.name} {r.active ? '(active)' : ''}
                </option>
              ))}
            </select>
            {loading && <p className="text-xs text-slate-500 mt-1">Loading…</p>}
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="block text-xs font-medium text-slate-400">Email</label>
              <input
                type="text"
                value={sample.email}
                onChange={(e) => setSample((p) => ({ ...p, email: e.target.value }))}
                placeholder="user@example.com"
                className="mt-1 w-full rounded-xl border border-slate-800 bg-slate-950/60 px-3 py-2 text-sm text-slate-100"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400">Phone</label>
              <input
                type="text"
                value={sample.phone}
                onChange={(e) => setSample((p) => ({ ...p, phone: e.target.value }))}
                placeholder="+15551234567"
                className="mt-1 w-full rounded-xl border border-slate-800 bg-slate-950/60 px-3 py-2 text-sm text-slate-100"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400">Name (optional)</label>
              <input
                type="text"
                value={sample.name}
                onChange={(e) => setSample((p) => ({ ...p, name: e.target.value }))}
                placeholder="Jane Doe"
                className="mt-1 w-full rounded-xl border border-slate-800 bg-slate-950/60 px-3 py-2 text-sm text-slate-100"
              />
            </div>
          </div>
          <Button onClick={generate} disabled={!activeRecipe || generating}>
            {generating ? 'Generating…' : 'Generate subject_hash'}
          </Button>
        </CardContent>
      </Card>

      {generatedHash && (
        <>
          <Card>
            <CardHeader>
              <div className="text-sm font-semibold text-slate-50">Generated hash</div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <code className="flex-1 break-all rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-xs text-slate-200">
                  {generatedHash}
                </code>
                <button
                  type="button"
                  onClick={() => copyText(generatedHash)}
                  className="shrink-0 inline-flex items-center gap-1 rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-xs text-slate-200 hover:bg-slate-700"
                >
                  {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />} Copy
                </button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="text-sm font-semibold text-slate-50">Request payload example (DROP)</div>
              <p className="text-xs text-slate-400">Use this shape when calling your delete/status endpoints or when testing with the Agent.</p>
            </CardHeader>
            <CardContent>
              <pre className="rounded-xl border border-slate-800 bg-slate-900 p-4 text-xs text-slate-300 overflow-x-auto">
                {requestPayloadExample}
              </pre>
              <button
                type="button"
                onClick={() => copyText(requestPayloadExample)}
                className="mt-2 inline-flex items-center gap-1 rounded-lg border border-slate-700 bg-slate-800 px-2 py-1 text-xs text-slate-200 hover:bg-slate-700"
              >
                {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />} Copy JSON
              </button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="text-sm font-semibold text-slate-50">Integration guidance</div>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-slate-300">
              <p>
                <strong className="text-slate-200">Docker Agent:</strong> The agent uses the active hash recipe to compute subject_hash when processing deletion requests. Ensure the same recipe and field order are used when submitting requests to DROP.
              </p>
              <p>
                <strong className="text-slate-200">Customer API:</strong> Your delete/status endpoints receive <code className="text-slate-200">subject_hash</code> in the request body. Match records using this hash (e.g. in your DB) and return success or status.
              </p>
              <p>
                <Link to="/app/customer-apis" className="text-regulatory-300 hover:text-regulatory-200">Configure Customer APIs</Link>
                {' · '}
                <Link to="/app/connectors" className="text-regulatory-300 hover:text-regulatory-200">Connectors (Agent)</Link>
              </p>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}

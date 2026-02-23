import { useEffect, useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Card, CardContent, CardHeader } from '../../components/ui/Card.jsx'
import Button from '../../components/ui/Button.jsx'
import {
  listHashRecipes,
  createHashRecipe,
  updateHashRecipe,
  deleteHashRecipe,
  setActiveHashRecipe
} from '../../services/appService.js'
import { toList } from '../../services/appService.js'
import { sha256Hex } from '../../utils/sha256Browser.js'
import { Copy, Check, ChevronUp, ChevronDown, AlertTriangle } from 'lucide-react'

const DEFAULT_FIELDS = ['email', 'phone']
const NORMALIZATION_OPTIONS = [
  { id: 'trim', label: 'Trim whitespace' },
  { id: 'lowercase', label: 'Lowercase' },
  { id: 'digits_only', label: 'Digits only (e.g. phone)' },
  { id: 'remove_accents', label: 'Remove accents' }
]

function normalizePart(value, flags = {}) {
  let s = String(value ?? '').trim()
  if (flags.trim !== false) s = s.trim()
  if (flags.lowercase) s = s.toLowerCase()
  if (flags.digits_only) s = s.replace(/\D/g, '')
  if (flags.remove_accents) {
    s = s.normalize('NFD').replace(/\p{Diacritic}/gu, '')
  }
  return s
}

export default function HashRecipes() {
  const [recipes, setRecipes] = useState([])
  const [loading, setLoading] = useState(true)
  const [testerInput, setTesterInput] = useState({ email: '', phone: '' })
  const [testerHash, setTesterHash] = useState('')
  const [testerLoading, setTesterLoading] = useState(false)
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState('')
  const [builderOpen, setBuilderOpen] = useState(false)
  const [activateConfirm, setActivateConfirm] = useState(null)

  const [builder, setBuilder] = useState({
    name: '',
    delimiter: '|',
    fields: [...DEFAULT_FIELDS],
    normalization: { trim: true, lowercase: true, digits_only: false, remove_accents: false }
  })
  const [builderPreviewInput, setBuilderPreviewInput] = useState({ email: '', phone: '' })
  const [builderPreview, setBuilderPreview] = useState({ parts: [], concatenated: '', hash: '' })
  const [builderSaving, setBuilderSaving] = useState(false)

  function load() {
    setLoading(true)
    listHashRecipes()
      .then((d) => setRecipes(toList(d, ['recipes', 'items'])))
      .catch(() => setRecipes([]))
      .finally(() => setLoading(false))
  }

  useEffect(() => load(), [])

  const fieldOptions = useMemo(() => ['email', 'phone', 'name', 'external_id'].filter((f) => !builder.fields.includes(f)), [builder.fields])

  useEffect(() => {
    if (!builderOpen) return
    const email = (builderPreviewInput.email ?? '').trim()
    const phone = (builderPreviewInput.phone ?? '').replace(/\D/g, '')
    const parts = builder.fields.map((f) => {
      const raw = builderPreviewInput[f] ?? ''
      return normalizePart(raw, {
        trim: builder.normalization?.trim !== false,
        lowercase: builder.normalization?.lowercase,
        digits_only: builder.normalization?.digits_only && (f === 'phone' || f === 'external_id'),
        remove_accents: builder.normalization?.remove_accents
      })
    })
    const concatenated = parts.join(builder.delimiter || '|')
    if (!concatenated) {
      setBuilderPreview({ parts, concatenated: '', hash: '' })
      return
    }
    sha256Hex(concatenated).then((hash) => setBuilderPreview({ parts, concatenated, hash }))
  }, [builderOpen, builder.delimiter, builder.fields, builder.normalization, builderPreviewInput])

  async function runTester() {
    setTesterLoading(true)
    setTesterHash('')
    try {
      const parts = []
      if (testerInput.email) parts.push((testerInput.email || '').toLowerCase().trim())
      if (testerInput.phone) parts.push((testerInput.phone || '').replace(/\D/g, ''))
      const combined = parts.join('|')
      if (!combined) return
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

  function moveField(idx, dir) {
    const next = [...builder.fields]
    const swap = dir === 'up' ? idx - 1 : idx + 1
    if (swap < 0 || swap >= next.length) return
    ;[next[idx], next[swap]] = [next[swap], next[idx]]
    setBuilder((p) => ({ ...p, fields: next }))
  }

  async function saveRecipe() {
    setError('')
    setBuilderSaving(true)
    try {
      const payload = {
        name: builder.name || 'Recipe',
        algorithm: 'SHA-256',
        delimiter: builder.delimiter || '|',
        fields: builder.fields,
        normalization: builder.normalization
      }
      await createHashRecipe(payload)
      setBuilder({ name: '', delimiter: '|', fields: [...DEFAULT_FIELDS], normalization: { trim: true, lowercase: true, digits_only: false, remove_accents: false } })
      load()
    } catch (e) {
      setError(e?.message || 'Save failed')
    } finally {
      setBuilderSaving(false)
    }
  }

  async function handleSetActive(r) {
    const active = recipes.find((x) => x.active)
    if (active && active.id !== r.id) {
      setActivateConfirm(r)
      return
    }
    try {
      await setActiveHashRecipe(r.id)
      load()
    } catch (e) {
      setError(e?.message || 'Activate failed')
    }
  }

  async function confirmActivate() {
    if (!activateConfirm) return
    try {
      await setActiveHashRecipe(activateConfirm.id)
      load()
      setActivateConfirm(null)
    } catch (e) {
      setError(e?.message || 'Activate failed')
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-slate-50">Hash Recipes</h1>
        <p className="mt-1 text-slate-400">p_hash / subject_hash — versioned recipes. Hashing runs in browser only (no PII sent).</p>
      </div>

      {error ? (
        <div className="rounded-xl border border-danger-500/30 bg-danger-500/10 px-4 py-3 text-sm text-danger-200">{error}</div>
      ) : null}

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
                <code className="rounded-lg border border-slate-700 bg-slate-900 px-2 py-1 text-xs text-slate-300 break-all">{testerHash}</code>
                <button type="button" onClick={copyHash} className="inline-flex items-center gap-1 rounded-lg border border-slate-700 bg-slate-800 px-2 py-1 text-xs text-slate-200 hover:bg-slate-700">
                  {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />} Copy
                </button>
              </div>
            ) : null}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between gap-4">
          <div>
            <div className="text-sm font-semibold text-slate-50">Recipe Builder</div>
            <p className="text-xs text-slate-400">Fields order, delimiter, normalization. Preview and save.</p>
          </div>
          <Button variant="ghost" size="sm" onClick={() => setBuilderOpen((o) => !o)}>
            {builderOpen ? 'Collapse' : 'Expand'}
          </Button>
        </CardHeader>
        {builderOpen && (
          <CardContent className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-400">Recipe name</label>
              <input
                type="text"
                value={builder.name}
                onChange={(e) => setBuilder((p) => ({ ...p, name: e.target.value }))}
                placeholder="Default recipe"
                className="mt-1 w-full max-w-xs rounded-xl border border-slate-800 bg-slate-950/60 px-3 py-2 text-sm text-slate-100"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400">Fields order</label>
              <div className="flex flex-wrap items-center gap-2 mt-1">
                {builder.fields.map((f, idx) => (
                  <span key={f} className="inline-flex items-center gap-1 rounded-lg border border-slate-700 bg-slate-800 px-2 py-1 text-xs">
                    {f}
                    <button type="button" onClick={() => moveField(idx, 'up')} disabled={idx === 0} className="p-0.5 hover:bg-slate-700 rounded disabled:opacity-40">
                      <ChevronUp className="h-3 w-3" />
                    </button>
                    <button type="button" onClick={() => moveField(idx, 'down')} disabled={idx === builder.fields.length - 1} className="p-0.5 hover:bg-slate-700 rounded disabled:opacity-40">
                      <ChevronDown className="h-3 w-3" />
                    </button>
                  </span>
                ))}
                {fieldOptions.length > 0 && (
                  <select
                    value=""
                    onChange={(e) => {
                      const v = e.target.value
                      if (v) setBuilder((p) => ({ ...p, fields: [...p.fields, v] }))
                    }}
                    className="rounded-lg border border-slate-700 bg-slate-800 px-2 py-1 text-xs text-slate-200"
                  >
                    <option value="">+ Add field</option>
                    {fieldOptions.map((f) => (
                      <option key={f} value={f}>{f}</option>
                    ))}
                  </select>
                )}
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400">Delimiter</label>
              <input
                type="text"
                value={builder.delimiter}
                onChange={(e) => setBuilder((p) => ({ ...p, delimiter: e.target.value }))}
                className="mt-1 w-24 rounded-xl border border-slate-800 bg-slate-950/60 px-3 py-2 text-sm text-slate-100"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-400">Normalization</label>
              <div className="flex flex-wrap gap-3 mt-1">
                {NORMALIZATION_OPTIONS.map((opt) => (
                  <label key={opt.id} className="flex items-center gap-2 text-sm text-slate-300">
                    <input
                      type="checkbox"
                      checked={!!builder.normalization?.[opt.id]}
                      onChange={(e) => setBuilder((p) => ({ ...p, normalization: { ...p.normalization, [opt.id]: e.target.checked } }))}
                      className="rounded border-slate-700"
                    />
                    {opt.label}
                  </label>
                ))}
              </div>
            </div>
            <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
              <div className="text-xs font-medium text-slate-500 mb-2">Live preview — sample input</div>
              <div className="grid gap-2 sm:grid-cols-2 mb-3">
                {builder.fields.map((f) => (
                  <div key={f}>
                    <label className="block text-xs text-slate-500">{f}</label>
                    <input
                      type="text"
                      value={builderPreviewInput[f] ?? ''}
                      onChange={(e) => setBuilderPreviewInput((p) => ({ ...p, [f]: e.target.value }))}
                      placeholder={f === 'email' ? 'user@example.com' : f === 'phone' ? '+15551234567' : ''}
                      className="mt-0.5 w-full rounded-lg border border-slate-700 bg-slate-950/60 px-2 py-1.5 text-xs text-slate-100"
                    />
                  </div>
                ))}
              </div>
              <div className="text-xs space-y-1">
                <p><span className="text-slate-500">Normalized parts:</span> <code className="text-slate-300">{builderPreview.parts.join(', ') || '—'}</code></p>
                <p><span className="text-slate-500">Concatenated:</span> <code className="text-slate-300 break-all">{builderPreview.concatenated || '—'}</code></p>
                <p><span className="text-slate-500">Hash:</span> <code className="text-slate-300 break-all">{builderPreview.hash || '—'}</code></p>
              </div>
            </div>
            <Button onClick={saveRecipe} disabled={builderSaving}>{builderSaving ? 'Saving…' : 'Save recipe'}</Button>
          </CardContent>
        )}
      </Card>

      <Card>
        <CardHeader>
          <div className="text-sm font-semibold text-slate-50">Recipes (CRUD)</div>
          <p className="text-xs text-slate-400">Name, version, algorithm (SHA-256), delimiter, fields. Activate one for pipeline use.</p>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-sm text-slate-500">Loading…</p>
          ) : recipes.length === 0 ? (
            <p className="text-sm text-slate-500">No recipes yet. Create one with the Recipe Builder above.</p>
          ) : (
            <ul className="space-y-2">
              {recipes.map((r) => (
                <li key={r.id} className="flex items-center justify-between rounded-xl border border-slate-800 px-4 py-3">
                  <div>
                    <span className="font-medium text-slate-200">{r.name}</span>
                    <span className="ml-2 text-xs text-slate-500">v{r.version ?? 1} · {r.algorithm || 'SHA-256'}</span>
                    {r.active && <span className="ml-2 text-xs text-regulatory-400">Active</span>}
                  </div>
                  <div className="flex items-center gap-2">
                    <Link to={`/app/match-tester?recipe=${r.id}`} className="text-xs text-regulatory-300 hover:text-regulatory-200">Match tester</Link>
                    {!r.active && (
                      <Button size="sm" variant="ghost" onClick={() => handleSetActive(r)}>
                        Set active
                      </Button>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      {activateConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80">
          <div className="w-full max-w-sm rounded-2xl border border-slate-800 bg-slate-900 p-4">
            <div className="flex items-center gap-2 text-amber-400 mb-2">
              <AlertTriangle className="h-5 w-5" />
              <span className="text-sm font-semibold">Already an active recipe</span>
            </div>
            <p className="text-sm text-slate-300 mb-4">Activating this recipe will deactivate the current one. Continue?</p>
            <div className="flex gap-2">
              <Button size="sm" onClick={confirmActivate}>Activate</Button>
              <Button size="sm" variant="ghost" onClick={() => setActivateConfirm(null)}>Cancel</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

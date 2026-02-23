import { useState } from 'react'
import { submitLead } from '../services/leadService.js'
import Button from './ui/Button.jsx'
import { Mail, Building2, User } from 'lucide-react'

export default function EarlyAccessForm({ className = '' }) {
  const [email, setEmail] = useState('')
  const [company, setCompany] = useState('')
  const [role, setRole] = useState('')
  const [status, setStatus] = useState('idle') // idle | loading | ok | err
  const [err, setErr] = useState('')

  async function onSubmit(e) {
    e.preventDefault()
    setErr('')
    setStatus('loading')
    try {
      await submitLead({ email, company, role, source: 'hero_form' })
      setStatus('ok')
    } catch (ex) {
      setErr(ex?.message || 'Failed to submit.')
      setStatus('err')
    }
  }

  return (
    <form onSubmit={onSubmit} className={['rounded-3xl border border-slate-800 bg-slate-950/40 p-6 shadow-soft', className].join(' ')}>
      <div className="text-sm font-semibold text-slate-50">Secure Early Access</div>
      <p className="mt-2 text-sm text-slate-300">
        Get implementation notes + scheduling. We only onboard the first 100 clients.
      </p>

      <div className="mt-5 space-y-3">
        <label className="block">
          <div className="mb-1 text-xs font-semibold text-slate-400">Work email</div>
          <div className="flex items-center gap-2 rounded-2xl border border-slate-800 bg-slate-950/60 px-3 py-3">
            <Mail className="h-4 w-4 text-slate-400" />
            <input
              required
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@company.com"
              className="w-full bg-transparent text-sm text-slate-100 outline-none placeholder:text-slate-600"
            />
          </div>
        </label>

        <label className="block">
          <div className="mb-1 text-xs font-semibold text-slate-400">Company</div>
          <div className="flex items-center gap-2 rounded-2xl border border-slate-800 bg-slate-950/60 px-3 py-3">
            <Building2 className="h-4 w-4 text-slate-400" />
            <input
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              placeholder="Acme Data"
              className="w-full bg-transparent text-sm text-slate-100 outline-none placeholder:text-slate-600"
            />
          </div>
        </label>

        <label className="block">
          <div className="mb-1 text-xs font-semibold text-slate-400">Role (optional)</div>
          <div className="flex items-center gap-2 rounded-2xl border border-slate-800 bg-slate-950/60 px-3 py-3">
            <User className="h-4 w-4 text-slate-400" />
            <input
              value={role}
              onChange={(e) => setRole(e.target.value)}
              placeholder="Legal, Compliance, Engineering…"
              className="w-full bg-transparent text-sm text-slate-100 outline-none placeholder:text-slate-600"
            />
          </div>
        </label>
      </div>

      <div className="mt-5">
        <Button type="submit" className="w-full" disabled={status === 'loading' || status === 'ok'}>
          {status === 'loading' ? 'Submitting…' : status === 'ok' ? 'Submitted — we’ll reach out' : 'Request Early Access'}
        </Button>
        {status === 'err' ? <div className="mt-2 text-xs text-danger-200">{err}</div> : null}
        <div className="mt-2 text-[11px] text-slate-500">No spam. Unsubscribe anytime.</div>
      </div>
    </form>
  )
}

import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Container from '../../components/Container.jsx'
import { Card, CardContent, CardFooter, CardHeader } from '../../components/ui/Card.jsx'
import Button from '../../components/ui/Button.jsx'
import { signup } from '../../services/authService.js'
import { ShieldCheck } from 'lucide-react'

const COMPANY_TYPES = [
  { value: '', label: 'Select type (optional)' },
  { value: 'data_broker', label: 'Data Broker' },
  { value: 'lead_gen_agency', label: 'Lead Gen Agency' },
  { value: 'marketing_data_vendor', label: 'Marketing Data Vendor' },
  { value: 'other', label: 'Other' }
]

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function friendlyMessage(err) {
  const msg = (err?.message || err?.data?.message || '').toLowerCase()
  if (msg.includes('already') || msg.includes('registered') || msg.includes('exists') || err?.data?.code === 'EMAIL_TAKEN') return 'This email is already registered. Sign in or use a different email.'
  if (msg.includes('weak') || msg.includes('password') || msg.includes('invalid password')) return 'Password must be at least 8 characters and meet security requirements.'
  if (err?.status >= 500 || msg.includes('server')) return 'Server error. Please try again later.'
  if (err?.message === 'Failed to fetch' || msg.includes('network')) return 'Network error. Check your connection and try again.'
  return err?.message || err?.data?.message || 'Sign up failed. Please try again.'
}

export default function Signup() {
  const [fullName, setFullName] = useState('')
  const [workEmail, setWorkEmail] = useState('')
  const [companyName, setCompanyName] = useState('')
  const [companyType, setCompanyType] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [fieldErrors, setFieldErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [pendingApproval, setPendingApproval] = useState(false)
  const [pendingMessage, setPendingMessage] = useState('')
  const navigate = useNavigate()

  function validate() {
    const next = {}
    const name = fullName?.trim()
    const email = workEmail?.trim()
    if (!name) next.fullName = 'Full name is required.'
    if (!email) next.workEmail = 'Work email is required.'
    else if (!EMAIL_REGEX.test(email)) next.workEmail = 'Please enter a valid email address.'
    if (!companyName?.trim()) next.companyName = 'Company name is required.'
    if (password.length < 8) next.password = 'Password must be at least 8 characters.'
    if (password !== confirmPassword) next.confirmPassword = 'Passwords do not match.'
    setFieldErrors(next)
    return Object.keys(next).length === 0
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setFieldErrors({})
    if (!validate()) return
    setLoading(true)
    try {
      const result = await signup({
        fullName: fullName.trim(),
        email: workEmail.trim(),
        password,
        companyName: companyName.trim(),
        companyType: companyType || undefined
      })
      if (result?.pendingApproval) {
        setPendingApproval(true)
        setPendingMessage(result?.message || '')
        return
      }
      if (result?.success) {
        navigate('/app/onboarding', { replace: true })
        return
      }
      setError(result?.message || 'Request received. Contact sales if you need to activate your account.')
    } catch (err) {
      setError(friendlyMessage(err))
    } finally {
      setLoading(false)
    }
  }

  if (pendingApproval) {
    return (
      <main className="py-20">
        <Container className="flex justify-center">
          <Card className="w-full max-w-md">
            <CardHeader>
              <div className="flex items-center gap-2">
                <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-regulatory-500/15 ring-1 ring-regulatory-500/25">
                  <ShieldCheck className="h-5 w-5 text-regulatory-200" />
                </span>
                <div>
                  <h1 className="text-xl font-extrabold text-slate-50">Request received</h1>
                  <p className="text-xs text-slate-400">DROP Compliance Gateway</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-slate-300">
                Our team will contact you to activate your workspace.
                {pendingMessage ? ` ${pendingMessage}` : ''}
              </p>
              <div className="flex flex-col gap-3">
                <Button as="a" href="mailto:ceo@deleteactpro.com" className="w-full" aria-label="Email ceo@deleteactpro.com">
                  Email: ceo@deleteactpro.com
                </Button>
                <Link to="/" className="block text-center text-sm text-regulatory-300 hover:text-regulatory-200">
                  Back to home
                </Link>
              </div>
            </CardContent>
          </Card>
        </Container>
      </main>
    )
  }

  return (
    <main className="py-20">
      <Container className="flex justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <div className="flex items-center gap-2">
              <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-regulatory-500/15 ring-1 ring-regulatory-500/25">
                <ShieldCheck className="h-5 w-5 text-regulatory-200" />
              </span>
              <div>
                <h1 className="text-xl font-extrabold text-slate-50">Create account</h1>
                <p className="text-xs text-slate-400">DROP Compliance Gateway</p>
              </div>
            </div>
            <p className="mt-3 text-sm text-slate-400">
              For qualified organizations preparing for California Delete Act / DROP readiness.
            </p>
          </CardHeader>
          <form onSubmit={handleSubmit} noValidate>
            <CardContent className="space-y-4">
              {error ? (
                <div className="rounded-xl border border-danger-500/30 bg-danger-500/10 px-4 py-3 text-sm text-danger-200" role="alert">
                  {error}
                </div>
              ) : null}
              <div>
                <label htmlFor="signup-fullName" className="block text-sm font-semibold text-slate-300">Full name</label>
                <input
                  id="signup-fullName"
                  type="text"
                  autoComplete="name"
                  value={fullName}
                  onChange={(e) => { setFullName(e.target.value); setFieldErrors((p) => ({ ...p, fullName: '' })) }}
                  required
                  aria-invalid={!!fieldErrors.fullName}
                  aria-describedby={fieldErrors.fullName ? 'signup-fullName-err' : undefined}
                  className="mt-1 w-full rounded-xl border border-slate-800 bg-slate-950/60 px-4 py-3 text-slate-100 placeholder-slate-500 focus:border-regulatory-500/50 focus:outline-none focus:ring-2 focus:ring-regulatory-500/30"
                  placeholder="Jane Smith"
                />
                {fieldErrors.fullName ? <p id="signup-fullName-err" className="mt-1 text-xs text-danger-300">{fieldErrors.fullName}</p> : null}
              </div>
              <div>
                <label htmlFor="signup-workEmail" className="block text-sm font-semibold text-slate-300">Work email</label>
                <input
                  id="signup-workEmail"
                  type="email"
                  autoComplete="email"
                  value={workEmail}
                  onChange={(e) => { setWorkEmail(e.target.value); setFieldErrors((p) => ({ ...p, workEmail: '' })) }}
                  required
                  aria-invalid={!!fieldErrors.workEmail}
                  aria-describedby={fieldErrors.workEmail ? 'signup-workEmail-err' : undefined}
                  className="mt-1 w-full rounded-xl border border-slate-800 bg-slate-950/60 px-4 py-3 text-slate-100 placeholder-slate-500 focus:border-regulatory-500/50 focus:outline-none focus:ring-2 focus:ring-regulatory-500/30"
                  placeholder="you@company.com"
                />
                {fieldErrors.workEmail ? <p id="signup-workEmail-err" className="mt-1 text-xs text-danger-300">{fieldErrors.workEmail}</p> : null}
              </div>
              <div>
                <label htmlFor="signup-companyName" className="block text-sm font-semibold text-slate-300">Company name</label>
                <input
                  id="signup-companyName"
                  type="text"
                  autoComplete="organization"
                  value={companyName}
                  onChange={(e) => { setCompanyName(e.target.value); setFieldErrors((p) => ({ ...p, companyName: '' })) }}
                  required
                  aria-invalid={!!fieldErrors.companyName}
                  aria-describedby={fieldErrors.companyName ? 'signup-companyName-err' : undefined}
                  className="mt-1 w-full rounded-xl border border-slate-800 bg-slate-950/60 px-4 py-3 text-slate-100 placeholder-slate-500 focus:border-regulatory-500/50 focus:outline-none focus:ring-2 focus:ring-regulatory-500/30"
                  placeholder="Acme Inc."
                />
                {fieldErrors.companyName ? <p id="signup-companyName-err" className="mt-1 text-xs text-danger-300">{fieldErrors.companyName}</p> : null}
              </div>
              <div>
                <label htmlFor="signup-companyType" className="block text-sm font-semibold text-slate-300">Company type (optional)</label>
                <select
                  id="signup-companyType"
                  value={companyType}
                  onChange={(e) => setCompanyType(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-slate-800 bg-slate-950/60 px-4 py-3 text-slate-100 focus:border-regulatory-500/50 focus:outline-none focus:ring-2 focus:ring-regulatory-500/30"
                >
                  {COMPANY_TYPES.map((opt) => (
                    <option key={opt.value || 'empty'} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="signup-password" className="block text-sm font-semibold text-slate-300">Password</label>
                <input
                  id="signup-password"
                  type="password"
                  autoComplete="new-password"
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setFieldErrors((p) => ({ ...p, password: '', confirmPassword: '' })) }}
                  required
                  minLength={8}
                  aria-invalid={!!fieldErrors.password}
                  aria-describedby={fieldErrors.password ? 'signup-password-err' : undefined}
                  className="mt-1 w-full rounded-xl border border-slate-800 bg-slate-950/60 px-4 py-3 text-slate-100 placeholder-slate-500 focus:border-regulatory-500/50 focus:outline-none focus:ring-2 focus:ring-regulatory-500/30"
                  placeholder="••••••••"
                />
                {fieldErrors.password ? <p id="signup-password-err" className="mt-1 text-xs text-danger-300">{fieldErrors.password}</p> : null}
              </div>
              <div>
                <label htmlFor="signup-confirmPassword" className="block text-sm font-semibold text-slate-300">Confirm password</label>
                <input
                  id="signup-confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  value={confirmPassword}
                  onChange={(e) => { setConfirmPassword(e.target.value); setFieldErrors((p) => ({ ...p, confirmPassword: '' })) }}
                  required
                  aria-invalid={!!fieldErrors.confirmPassword}
                  aria-describedby={fieldErrors.confirmPassword ? 'signup-confirmPassword-err' : undefined}
                  className="mt-1 w-full rounded-xl border border-slate-800 bg-slate-950/60 px-4 py-3 text-slate-100 placeholder-slate-500 focus:border-regulatory-500/50 focus:outline-none focus:ring-2 focus:ring-regulatory-500/30"
                  placeholder="••••••••"
                />
                {fieldErrors.confirmPassword ? <p id="signup-confirmPassword-err" className="mt-1 text-xs text-danger-300">{fieldErrors.confirmPassword}</p> : null}
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-3">
              <Button type="submit" disabled={loading} className="w-full">
                {loading ? 'Creating account…' : 'Create Account'}
              </Button>
              <p className="text-center text-sm text-slate-400">
                Already have an account? <Link to="/login" className="font-semibold text-regulatory-300 hover:text-regulatory-200">Sign in</Link>
              </p>
            </CardFooter>
          </form>
        </Card>
      </Container>
    </main>
  )
}

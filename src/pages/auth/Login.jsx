import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import Container from '../../components/Container.jsx'
import { Card, CardContent, CardFooter, CardHeader } from '../../components/ui/Card.jsx'
import Button from '../../components/ui/Button.jsx'
import { login } from '../../services/authService.js'
import { ShieldCheck } from 'lucide-react'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from?.pathname || '/app'

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login({ email, password })
      navigate(from, { replace: true })
    } catch (err) {
      setError(err?.message || err?.data?.message || 'Login failed.')
    } finally {
      setLoading(false)
    }
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
                <h1 className="text-xl font-extrabold text-slate-50">Sign in</h1>
                <p className="text-xs text-slate-400">DROP Compliance Gateway</p>
              </div>
            </div>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              {error ? (
                <div className="rounded-xl border border-danger-500/30 bg-danger-500/10 px-4 py-3 text-sm text-danger-200">
                  {error}
                </div>
              ) : null}
              <div>
                <label className="block text-sm font-semibold text-slate-300">Email</label>
                <input
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="mt-1 w-full rounded-xl border border-slate-800 bg-slate-950/60 px-4 py-3 text-slate-100 placeholder-slate-500 focus:border-regulatory-500/50 focus:outline-none focus:ring-2 focus:ring-regulatory-500/30"
                  placeholder="you@company.com"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-300">Password</label>
                <input
                  type="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="mt-1 w-full rounded-xl border border-slate-800 bg-slate-950/60 px-4 py-3 text-slate-100 placeholder-slate-500 focus:border-regulatory-500/50 focus:outline-none focus:ring-2 focus:ring-regulatory-500/30"
                  placeholder="••••••••"
                />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-3">
              <Button type="submit" disabled={loading} className="w-full">
                {loading ? 'Signing in…' : 'Sign in'}
              </Button>
              <p className="text-center text-sm text-slate-400">
                No account? <Link to="/signup" className="font-semibold text-regulatory-300 hover:text-regulatory-200">Sign up</Link>
              </p>
            </CardFooter>
          </form>
        </Card>
      </Container>
    </main>
  )
}

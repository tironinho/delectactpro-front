import { Link } from 'react-router-dom'
import { ShieldCheck, Moon, Sun, ArrowRight } from 'lucide-react'
import Container from './Container.jsx'
import Button from './ui/Button.jsx'

export default function Navbar({ isDark, onToggleDark }) {
  return (
    <header className="sticky top-0 z-50 border-b border-slate-900/70 bg-slate-950/70 backdrop-blur">
      <Container className="py-4">
        <div className="flex items-center justify-between gap-4">
          <Link to="/" className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-regulatory-500/15 ring-1 ring-regulatory-500/25">
              <ShieldCheck className="h-5 w-5 text-regulatory-200" />
            </span>
            <div className="leading-tight">
              <div className="text-sm font-extrabold tracking-tight text-slate-50">DROP Compliance Gateway</div>
              <div className="text-xs text-slate-400">SB 362 automation for data brokers</div>
            </div>
          </Link>

          <nav className="hidden items-center gap-6 md:flex">
            <a href="#risk" className="text-sm font-semibold text-slate-300 hover:text-slate-50">Risk</a>
            <a href="#timeline" className="text-sm font-semibold text-slate-300 hover:text-slate-50">Timeline</a>
            <a href="#value" className="text-sm font-semibold text-slate-300 hover:text-slate-50">Value</a>
            <a href="#pricing" className="text-sm font-semibold text-slate-300 hover:text-slate-50">Pricing</a>
          </nav>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onToggleDark}
              className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-800 bg-slate-950/60 text-slate-200 hover:bg-slate-900"
              aria-label="Toggle theme"
              title="Toggle theme"
            >
              {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>

            <Link to="/login" className="text-sm font-semibold text-slate-300 hover:text-slate-50 hidden md:inline">Sign in</Link>
            <Button as="a" href="#early-access" size="md" className="hidden md:inline-flex">
              Secure Early Access <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Container>
    </header>
  )
}

import { useState } from 'react'
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom'
import { logout } from '../services/authService.js'
import clsx from 'clsx'
import {
  LayoutDashboard,
  Rocket,
  Link2,
  Plug,
  Globe,
  Hash,
  Users,
  GitBranch,
  Play,
  FileText,
  CreditCard,
  Settings,
  LogOut,
  ChevronDown,
  Menu,
  X
} from 'lucide-react'

const SIDEBAR_LINKS = [
  { to: '/app', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/app/onboarding', label: 'Onboarding', icon: Rocket },
  { to: '/app/integrations', label: 'Integrations', icon: Link2 },
  { to: '/app/connectors', label: 'Connectors (Agent)', icon: Plug },
  { to: '/app/customer-apis', label: 'Customer APIs', icon: Globe },
  { to: '/app/hash-recipes', label: 'Hash Recipes', icon: Hash },
  { to: '/app/partners', label: 'Partners', icon: Users },
  { to: '/app/cascade-policies', label: 'Cascade Policies', icon: GitBranch },
  { to: '/app/runs', label: 'Runs', icon: Play },
  { to: '/app/audit-logs', label: 'Audit Logs', icon: FileText },
  { to: '/app/billing', label: 'Billing', icon: CreditCard },
  { to: '/app/settings', label: 'Settings', icon: Settings }
]

export default function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  function handleLogout() {
    logout()
    navigate('/login', { replace: true })
  }

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100">
      {/* Sidebar - desktop */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col border-r border-slate-800/80 bg-slate-950/95 backdrop-blur md:flex">
        <div className="flex h-14 items-center gap-2 border-b border-slate-800/80 px-4">
          <Link to="/app" className="text-sm font-extrabold tracking-tight text-slate-50">
            DROP Gateway
          </Link>
        </div>
        <nav className="flex-1 space-y-0.5 overflow-y-auto p-3">
          {SIDEBAR_LINKS.map(({ to, label, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              className={clsx(
                'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition',
                location.pathname === to || (to !== '/app' && location.pathname.startsWith(to))
                  ? 'bg-regulatory-500/15 text-regulatory-200'
                  : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-100'
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {label}
            </Link>
          ))}
        </nav>
      </aside>

      {/* Sidebar - mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-950/80 backdrop-blur md:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-hidden
        />
      )}
      <aside
        className={clsx(
          'fixed inset-y-0 left-0 z-50 w-64 flex-col border-r border-slate-800 bg-slate-950 md:hidden',
          sidebarOpen ? 'flex' : 'hidden'
        )}
      >
        <div className="flex h-14 items-center justify-between border-b border-slate-800 px-4">
          <Link to="/app" className="text-sm font-extrabold text-slate-50" onClick={() => setSidebarOpen(false)}>
            DROP Gateway
          </Link>
          <button type="button" onClick={() => setSidebarOpen(false)} className="p-2 text-slate-400 hover:text-slate-100">
            <X className="h-5 w-5" />
          </button>
        </div>
        <nav className="flex-1 space-y-0.5 overflow-y-auto p-3">
          {SIDEBAR_LINKS.map(({ to, label, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              onClick={() => setSidebarOpen(false)}
              className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-300 hover:bg-slate-800/50 hover:text-slate-100"
            >
              <Icon className="h-4 w-4 shrink-0" />
              {label}
            </Link>
          ))}
        </nav>
      </aside>

      <div className="flex flex-1 flex-col md:pl-64">
        {/* Topbar */}
        <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-slate-800/80 bg-slate-950/80 px-4 backdrop-blur">
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            className="p-2 text-slate-400 hover:text-slate-100 md:hidden"
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </button>
          <div className="flex-1 md:flex-none" />
          <div className="flex items-center gap-3">
            <span className="hidden text-xs text-slate-500 sm:inline">Workspace</span>
            <div className="relative">
              <button
                type="button"
                onClick={() => setUserMenuOpen((o) => !o)}
                className="flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-900/50 px-3 py-2 text-sm text-slate-200 hover:bg-slate-800"
              >
                Account
                <ChevronDown className="h-4 w-4" />
              </button>
              {userMenuOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setUserMenuOpen(false)} aria-hidden />
                  <div className="absolute right-0 top-full z-20 mt-1 w-48 rounded-xl border border-slate-800 bg-slate-900 py-1 shadow-lg">
                    <Link
                      to="/app/settings"
                      className="block px-4 py-2 text-sm text-slate-200 hover:bg-slate-800"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      Settings
                    </Link>
                    <button
                      type="button"
                      onClick={() => { setUserMenuOpen(false); handleLogout(); }}
                      className="flex w-full items-center gap-2 px-4 py-2 text-sm text-slate-200 hover:bg-slate-800"
                    >
                      <LogOut className="h-4 w-4" />
                      Sign out
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </header>

        <main className="flex-1 p-6 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

import { Check, Circle, AlertCircle, XCircle } from 'lucide-react'
import { Link } from 'react-router-dom'
import clsx from 'clsx'

const STATUS = {
  complete: { label: 'Complete', icon: Check, className: 'text-regulatory-400' },
  in_progress: { label: 'In Progress', icon: Circle, className: 'text-amber-400' },
  not_started: { label: 'Not Started', icon: Circle, className: 'text-slate-500' },
  blocked: { label: 'Blocked', icon: XCircle, className: 'text-danger-400' }
}

/**
 * Reusable readiness checklist for DROP compliance.
 * Items: { id, label, ok, link?, status? }
 * status overrides: 'complete' | 'in_progress' | 'not_started' | 'blocked'
 */
export default function ReadinessChecklist({ items, className }) {
  return (
    <ul className={clsx('space-y-2', className)}>
      {items.map((item) => {
        const statusKey = item.status ?? (item.ok ? 'complete' : 'not_started')
        const config = STATUS[statusKey] ?? STATUS.not_started
        const Icon = config.icon
        const content = (
          <span className="flex items-center justify-between gap-3 rounded-xl border border-slate-800 bg-slate-950/40 px-4 py-3 text-sm text-slate-200">
            <span className="flex items-center gap-2">
              <Icon className={clsx('h-4 w-4 shrink-0', config.className, item.ok && statusKey === 'complete' && 'fill-regulatory-400')} />
              {item.label}
            </span>
            {config.label !== 'Complete' && <span className="text-xs text-slate-500">{config.label}</span>}
          </span>
        )
        return (
          <li key={item.id ?? item.label}>
            {item.link ? (
              <Link to={item.link} className="block transition hover:bg-slate-800/30 rounded-xl">
                {content}
              </Link>
            ) : (
              content
            )}
          </li>
        )
      })}
    </ul>
  )
}

/** Build default checklist items from summary (for Dashboard / Onboarding). */
export function buildReadinessItems(summary) {
  const hasIntegration = (summary?.connectorsCount ?? 0) > 0 || (summary?.customerApisCount ?? 0) > 0
  const hasRecentOnline = !!summary?.lastOnlineConnectorAt
  return [
    { id: 'integration', label: 'At least one integration configured', ok: hasIntegration && hasRecentOnline, link: '/app/integrations' },
    { id: 'recipe', label: 'Hash recipe active', ok: false, link: '/app/hash-recipes' },
    { id: 'partners', label: 'At least one partner registered', ok: false, link: '/app/partners' },
    { id: 'cascade', label: 'Cascade policy configured', ok: false, link: '/app/cascade-policies' },
    { id: 'dryrun', label: 'Dry-run completed successfully in last 45 days', ok: false, link: '/app/runs' },
    { id: 'billing', label: 'Billing setup fee paid', ok: !!summary?.billingSetupPaid, link: '/app/billing' }
  ]
}

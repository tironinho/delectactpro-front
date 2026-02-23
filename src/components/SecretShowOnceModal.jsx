import { useState } from 'react'
import { Copy, Check, AlertTriangle } from 'lucide-react'
import Button from './ui/Button.jsx'

/**
 * Modal for secrets shown once (e.g. rotated API secret, connector token).
 * Warning text, copy button, and "I saved it" to dismiss.
 */
export default function SecretShowOnceModal({ secret, title = 'Secret (shown once)', onDismiss }) {
  const [copied, setCopied] = useState(false)
  const [dismissed, setDismissed] = useState(false)

  const copyText = () => {
    if (secret) {
      navigator.clipboard.writeText(secret)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handleDismiss = () => {
    setDismissed(true)
    onDismiss?.()
  }

  if (!secret || dismissed) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80" role="dialog" aria-modal="true">
      <div className="w-full max-w-md rounded-2xl border border-amber-500/40 bg-slate-900 shadow-xl">
        <div className="flex items-center gap-2 border-b border-slate-800 px-4 py-3">
          <AlertTriangle className="h-5 w-5 text-amber-400 shrink-0" />
          <span className="text-sm font-semibold text-slate-50">{title}</span>
        </div>
        <div className="px-4 py-4 space-y-3">
          <p className="text-xs font-medium text-amber-200/90">Shown once. Store securely. You will not be able to see it again.</p>
          <div className="flex items-center gap-2">
            <code className="flex-1 break-all rounded-lg border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-slate-200">
              {secret}
            </code>
            <button
              type="button"
              onClick={copyText}
              className="shrink-0 inline-flex items-center gap-1 rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-xs text-slate-200 hover:bg-slate-700"
            >
              {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />} {copied ? 'Copied' : 'Copy'}
            </button>
          </div>
        </div>
        <div className="flex justify-end gap-2 border-t border-slate-800 px-4 py-3">
          <Button variant="ghost" size="sm" onClick={handleDismiss}>
            I saved it
          </Button>
        </div>
      </div>
    </div>
  )
}

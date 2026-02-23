import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader } from '../../components/ui/Card.jsx'
import Button from '../../components/ui/Button.jsx'
import { getBillingStatus, getCustomerPortalUrl } from '../../services/appService.js'
import { ExternalLink } from 'lucide-react'

export default function Billing() {
  const [status, setStatus] = useState(null)
  const [loading, setLoading] = useState(true)
  const [portalLoading, setPortalLoading] = useState(false)

  useEffect(() => {
    getBillingStatus()
      .then(setStatus)
      .catch(() => setStatus(null))
      .finally(() => setLoading(false))
  }, [])

  async function openPortal() {
    setPortalLoading(true)
    try {
      const url = await getCustomerPortalUrl()
      if (url) window.location.href = url
    } finally {
      setPortalLoading(false)
    }
  }

  const setupFeePaid = status?.setup_fee_paid ?? status?.setupFeePaid ?? false

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-slate-50">Billing</h1>
        <p className="mt-1 text-slate-400">Billing and customer portal</p>
      </div>

      <Card>
        <CardHeader>
          <div className="text-sm font-semibold text-slate-50">Early Access</div>
          <p className="text-xs text-slate-400">One-time Early Access onboarding (status from backend)</p>
        </CardHeader>
        <CardContent className="space-y-4">
          {loading ? (
            <p className="text-sm text-slate-500">Loading…</p>
          ) : (
            <>
              <p className="text-sm text-slate-300">
                Status: <span className={setupFeePaid ? 'text-regulatory-400' : 'text-slate-500'}>{setupFeePaid ? 'Paid' : 'Not paid'}</span>
              </p>
              {!setupFeePaid && (
                <Button
                  as="a"
                  href="mailto:ceo@deleteactpro.com?subject=DeleteActPro%20-%20Talk%20to%20Sales"
                  aria-label="Contact sales at ceo@deleteactpro.com"
                >
                  Contact Sales
                </Button>
              )}
            </>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="text-sm font-semibold text-slate-50">Customer portal</div>
          <p className="text-xs text-slate-400">Manage subscription and payment methods (backend returns URL)</p>
        </CardHeader>
        <CardContent>
          <Button onClick={openPortal} disabled={portalLoading}>
            <ExternalLink className="h-4 w-4" /> {portalLoading ? 'Opening…' : 'Open Customer Portal'}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}

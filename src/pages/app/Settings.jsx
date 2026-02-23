import { Card, CardContent, CardHeader } from '../../components/ui/Card.jsx'

export default function Settings() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-slate-50">Settings</h1>
        <p className="mt-1 text-slate-400">Workspace and account settings</p>
      </div>

      <Card>
        <CardHeader>
          <div className="text-sm font-semibold text-slate-50">Profile</div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-slate-400">Account and notification preferences (MVP placeholder).</p>
        </CardContent>
      </Card>
    </div>
  )
}

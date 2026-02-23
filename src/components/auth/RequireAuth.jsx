import { useEffect, useState } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { me } from '../../services/authService.js'

export default function RequireAuth({ children }) {
  const [status, setStatus] = useState('loading') // 'loading' | 'ok' | 'unauthorized'
  const location = useLocation()

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      setStatus('unauthorized')
      return
    }
    me()
      .then(() => setStatus('ok'))
      .catch(() => {
        localStorage.removeItem('token')
        setStatus('unauthorized')
      })
  }, [])

  if (status === 'loading') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950">
        <div className="text-slate-400">Checking session…</div>
      </div>
    )
  }
  if (status === 'unauthorized') {
    return <Navigate to="/login" state={{ from: location }} replace />
  }
  return children
}

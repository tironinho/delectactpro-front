import { Outlet } from 'react-router-dom'
import Navbar from '../components/Navbar.jsx'
import Footer from '../components/Footer.jsx'

export default function PublicLayout({ isDark, onToggleDark }) {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <Navbar isDark={isDark} onToggleDark={onToggleDark} />
      <Outlet />
      <Footer />
    </div>
  )
}

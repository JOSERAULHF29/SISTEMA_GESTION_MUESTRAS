import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/shared/hooks/useAuth'
import { LayoutDashboard, Send, Users, LogOut, Shield, Droplets, Package } from 'lucide-react'

export function AppLayout() {
  const { profile, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  const navItems = [
    { to: '/app', label: 'Dashboard', icon: LayoutDashboard, roles: ['admin', 'tribologo', 'asesor', 'almacenero'] },
    { to: '/app/envios', label: 'Mis envíos', icon: Send, roles: ['asesor'] },
    { to: '/app/control-envios', label: 'Control de envíos', icon: Shield, roles: ['admin', 'tribologo'] },
    { to: '/app/almacen', label: 'Envíos pendientes', icon: Package, roles: ['almacenero'] },
    { to: '/app/usuarios', label: 'Usuarios', icon: Users, roles: ['admin'] },
  ]

  const filteredNav = navItems.filter((item) => profile?.rol && item.roles.includes(profile.rol))

  return (
    <div className="flex h-screen bg-slate-900">
      <aside className="flex w-64 flex-col border-r border-slate-700/50 bg-slate-800">
        <div className="flex h-16 items-center gap-3 border-b border-slate-700/50 px-6">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600">
            <Droplets className="h-4 w-4 text-white" />
          </div>
          <span className="text-xl font-bold text-white">SIGMA</span>
        </div>

        <nav className="flex-1 space-y-1 px-3 py-4">
          {filteredNav.map((item) => {
            const isActive = location.pathname === item.to
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-blue-600/10 text-blue-400'
                    : 'text-slate-400 hover:bg-slate-700/50 hover:text-slate-200'
                }`}
              >
                <item.icon className="h-5 w-5" />
                {item.label}
              </Link>
            )
          })}
        </nav>

        <div className="border-t border-slate-700/50 p-4">
          <div className="mb-1 text-sm font-medium text-slate-200">
            {profile?.nombre} {profile?.apellido}
          </div>
          <div className="mb-3 text-xs text-slate-500">{profile?.email}</div>
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-400 transition-colors hover:bg-red-500/10 hover:text-red-400"
          >
            <LogOut className="h-4 w-4" />
            Cerrar sesión
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-auto bg-slate-900">
        <div className="p-8">
          <Outlet />
        </div>
      </main>
    </div>
  )
}

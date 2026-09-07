import { useState } from 'react'
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/shared/hooks/useAuth'
import { LayoutDashboard, Send, Users, LogOut, Shield, Droplets, Package, Menu, X } from 'lucide-react'

export function AppLayout() {
  const { profile, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [sidebarOpen, setSidebarOpen] = useState(false)

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

  const handleNavClick = () => setSidebarOpen(false)

  const Sidebar = ({ className = '' }: { className?: string }) => (
    <aside className={`flex flex-col border-r border-slate-700/50 bg-slate-800 ${className}`}>
      <div className="flex h-16 items-center justify-between border-b border-slate-700/50 px-6">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600">
            <Droplets className="h-4 w-4 text-white" />
          </div>
          <span className="text-xl font-bold text-white">SIGMA</span>
        </div>
        <button
          onClick={() => setSidebarOpen(false)}
          className="rounded-lg p-1 text-slate-400 hover:bg-slate-700 lg:hidden"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <nav className="flex-1 space-y-1 px-3 py-4">
        {filteredNav.map((item) => {
          const isActive = location.pathname === item.to
          return (
            <Link
              key={item.to}
              to={item.to}
              onClick={handleNavClick}
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
        <div className="mb-1 truncate text-sm font-medium text-slate-200">
          {profile?.nombre} {profile?.apellido}
        </div>
        <div className="mb-3 truncate text-xs text-slate-500">{profile?.email}</div>
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-slate-400 transition-colors hover:bg-red-500/10 hover:text-red-400"
        >
          <LogOut className="h-4 w-4" />
          Cerrar sesión
        </button>
      </div>
    </aside>
  )

  return (
    <div className="flex h-screen bg-slate-900">
      <div className="hidden lg:flex lg:w-64">
        <Sidebar className="w-full" />
      </div>

      {sidebarOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setSidebarOpen(false)}
          />
          <div className="relative z-10 w-64">
            <Sidebar className="h-full" />
          </div>
        </div>
      )}

      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="flex h-16 items-center border-b border-slate-700/50 bg-slate-800 px-4 lg:px-8">
          <button
            onClick={() => setSidebarOpen(true)}
            className="mr-4 rounded-lg p-2 text-slate-400 hover:bg-slate-700 lg:hidden"
          >
            <Menu className="h-5 w-5" />
          </button>
          <div className="flex items-center gap-3 lg:hidden">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-600">
              <Droplets className="h-3.5 w-3.5 text-white" />
            </div>
            <span className="text-lg font-bold text-white">SIGMA</span>
          </div>
        </header>

        <main className="flex-1 overflow-auto bg-slate-900">
          <div className="p-4 sm:p-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthLayout } from '@/shared/layouts/AuthLayout'
import { AppLayout } from '@/shared/layouts/AppLayout'
import { ProtectedRoute } from '@/app/router/ProtectedRoute'
import { LoginPage } from '@/modules/auth/presentation/pages/LoginPage'
import { DashboardPage } from '@/modules/dashboard/presentation/pages/DashboardPage'
import { MisEnviosPage } from '@/modules/envios/presentation/pages/MisEnviosPage'
import { NuevoEnvioPage } from '@/modules/envios/presentation/pages/NuevoEnvioPage'
import { DetalleEnvioPage } from '@/modules/envios/presentation/pages/DetalleEnvioPage'
import { ControlEnviosPage } from '@/modules/envios/presentation/pages/ControlEnviosPage'
import { UsuariosPage } from '@/modules/usuarios/presentation/pages/UsuariosPage'
import { AlmacenPage } from '@/modules/almacen/presentation/pages/AlmacenPage'

export function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<LoginPage />} />
        </Route>

        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            <Route path="/app" element={<DashboardPage />} />
            <Route path="/app/envios" element={<MisEnviosPage />} />
            <Route path="/app/envios/nuevo" element={<NuevoEnvioPage />} />
            <Route path="/app/envios/:id" element={<DetalleEnvioPage />} />
            <Route path="/app/control-envios" element={<ControlEnviosPage />} />
            <Route path="/app/usuarios" element={<UsuariosPage />} />
            <Route path="/app/almacen" element={<AlmacenPage />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

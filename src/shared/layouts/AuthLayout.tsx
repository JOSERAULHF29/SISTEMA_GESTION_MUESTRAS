import { Outlet } from 'react-router-dom'

export function AuthLayout() {
  return (
    <div className="flex min-h-screen">
      <div className="relative hidden w-1/2 lg:block">
        <img
          src="/foto_login.jpg"
          alt="SIGMA"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-900/60 to-slate-900/30" />
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <h1 className="text-5xl font-bold text-white drop-shadow-lg">SIGMA</h1>
          <p className="mt-3 text-lg text-slate-300 drop-shadow">
            Sistema de Gestión de Muestras de Aceite
          </p>
        </div>
      </div>

      <div className="flex w-full items-center justify-center bg-slate-900 p-8 lg:w-1/2">
        <div className="w-full max-w-md">
          <Outlet />
        </div>
      </div>
    </div>
  )
}

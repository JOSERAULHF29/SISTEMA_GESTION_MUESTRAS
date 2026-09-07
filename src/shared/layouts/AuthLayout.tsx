import { Outlet } from 'react-router-dom'

export function AuthLayout() {
  return (
    <div className="flex min-h-screen">
      <div className="relative hidden w-1/2 lg:block">
        <img
          src="/foto_login.jpg"
          alt="SIGMA"
          className="h-full w-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-900/60 to-slate-900/30" />
        <div className="absolute inset-0 flex flex-col items-center justify-center px-4 text-center">
          <h1 className="text-3xl font-bold text-white drop-shadow-lg sm:text-5xl">SIGMA</h1>
          <p className="mt-3 text-sm text-slate-300 drop-shadow sm:text-lg">
            Sistema de Gestión de Muestras de Aceite
          </p>
        </div>
      </div>

      <div className="relative flex w-full items-center justify-center bg-slate-900 p-4 sm:p-8 lg:w-1/2">
        <div className="absolute inset-0 lg:hidden">
          <img
            src="/foto_login.jpg"
            alt="SIGMA"
            className="h-full w-full object-cover object-center opacity-20"
          />
          <div className="absolute inset-0 bg-slate-900/80" />
        </div>
        <div className="relative w-full max-w-md">
          <Outlet />
        </div>
      </div>
    </div>
  )
}

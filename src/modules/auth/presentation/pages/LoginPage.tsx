import { useState } from 'react'
import { signInWithGoogle } from '@/modules/auth/application/useCases/authUseCases'
import { useAuth } from '@/shared/hooks/useAuth'
import { Droplets, AlertCircle } from 'lucide-react'

export function LoginPage() {
  const { error } = useAuth()
  const [loading, setLoading] = useState(false)

  const handleLogin = async () => {
    try {
      setLoading(true)
      await signInWithGoogle()
    } catch (err) {
      console.error('Error al iniciar sesión:', err)
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col items-center gap-10">
      <div className="flex flex-col items-center gap-4 lg:hidden">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-600 shadow-lg shadow-blue-600/30">
          <Droplets className="h-8 w-8 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-white">SIGMA</h1>
        <p className="text-center text-sm text-slate-400">
          Sistema de Gestión de Muestras de Aceite
        </p>
      </div>

      <div className="hidden flex-col items-center gap-4 lg:flex">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600 shadow-lg shadow-blue-600/30">
          <Droplets className="h-7 w-7 text-white" />
        </div>
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white">Bienvenido</h2>
          <p className="mt-1 text-sm text-slate-400">
            Inicia sesión con tu cuenta corporativa
          </p>
        </div>
      </div>

      <div className="w-full rounded-2xl border border-slate-700/50 bg-slate-800/80 p-8 shadow-2xl backdrop-blur-sm">
        {error && (
          <div className="mb-6 flex items-center gap-2 rounded-lg bg-red-500/10 p-3 text-sm text-red-400 ring-1 ring-red-500/20">
            <AlertCircle className="h-4 w-4 flex-shrink-0" />
            {error}
          </div>
        )}

        <button
          onClick={handleLogin}
          disabled={loading}
          className="flex w-full items-center justify-center gap-3 rounded-xl bg-white px-4 py-3.5 text-sm font-semibold text-gray-800 shadow-lg transition-all hover:bg-gray-50 hover:shadow-xl disabled:opacity-50"
        >
          {loading ? (
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-gray-300 border-t-blue-600" />
          ) : (
            <svg className="h-5 w-5" viewBox="0 0 24 24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
          )}
          Continuar con cuenta IPESA
        </button>

        <div className="mt-6 flex items-center gap-3">
          <div className="h-px flex-1 bg-slate-700" />
          <span className="text-xs text-slate-500">IPESA</span>
          <div className="h-px flex-1 bg-slate-700" />
        </div>

        <p className="mt-5 text-center text-xs text-slate-500">
          Solo se permiten correos{' '}
          <span className="font-medium text-slate-400">@ipesa.com.pe</span>
        </p>
      </div>
    </div>
  )
}

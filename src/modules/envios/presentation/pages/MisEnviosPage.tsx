import { Link } from 'react-router-dom'
import { useAuth } from '@/shared/hooks/useAuth'
import { useEnvios } from '@/shared/hooks/useEnvios'
import { EnvioTable } from '@/shared/components/EnvioTable'
import { Package, Plus, AlertCircle } from 'lucide-react'

export function MisEnviosPage() {
  const { profile } = useAuth()
  const { envios, loading, error, totalMuestras } = useEnvios(profile?.id)

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Mis envíos</h1>
          <p className="mt-1 text-sm text-slate-400">Tus envíos de muestras de aceite</p>
        </div>
        <Link
          to="/app/envios/nuevo"
          className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-500 shadow-lg shadow-blue-600/20"
        >
          <Plus className="h-4 w-4" />
          Registrar nuevo envío
        </Link>
      </div>

      <div className="mb-6 grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-slate-700/50 bg-slate-800 p-4 shadow-lg">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10">
              <Package className="h-5 w-5 text-blue-400" />
            </div>
            <div>
              <p className="text-xs text-slate-400">Total envíos</p>
              <p className="text-xl font-bold text-white">{envios.length}</p>
            </div>
          </div>
        </div>
        <div className="rounded-xl border border-slate-700/50 bg-slate-800 p-4 shadow-lg">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-500/10">
              <Package className="h-5 w-5 text-green-400" />
            </div>
            <div>
              <p className="text-xs text-slate-400">Total muestras</p>
              <p className="text-xl font-bold text-white">{totalMuestras}</p>
            </div>
          </div>
        </div>
      </div>

      {error && (
        <div className="mb-6 flex items-center gap-2 rounded-lg bg-red-500/10 p-3 text-sm text-red-400 ring-1 ring-red-500/20">
          <AlertCircle className="h-4 w-4" />
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent" />
        </div>
      ) : envios.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-700 py-16">
          <Package className="mb-4 h-12 w-12 text-slate-600" />
          <p className="text-sm text-slate-500">No hay envíos registrados</p>
          <Link
            to="/app/envios/nuevo"
            className="mt-4 text-sm font-medium text-blue-400 hover:text-blue-300"
          >
            Registrar tu primer envío
          </Link>
        </div>
      ) : (
        <EnvioTable envios={envios} />
      )}
    </div>
  )
}

import { useState } from 'react'
import { useAuth } from '@/shared/hooks/useAuth'
import { useEnviosAlmacen } from '@/shared/hooks/useEnviosAlmacen'
import { EstadoBadge } from '@/shared/components/EstadoBadge'
import { ConfirmarEnvioModal } from '@/modules/almacen/presentation/components/ConfirmarEnvioModal'
import { Package, AlertCircle, CheckCircle, User } from 'lucide-react'
import type { EnvioMuestra } from '@/shared/types'

export function AlmacenPage() {
  const { profile } = useAuth()
  const { enviosPendientes, loading, error, refetch } = useEnviosAlmacen(profile?.email)
  const [selectedEnvio, setSelectedEnvio] = useState<EnvioMuestra | null>(null)

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Envíos pendientes</h1>
        <p className="mt-1 text-sm text-slate-400">Envíos que debes confirmar</p>
      </div>

      <div className="mb-6 grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-slate-700/50 bg-slate-800 p-4 shadow-lg">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-500/10">
              <Package className="h-5 w-5 text-orange-400" />
            </div>
            <div>
              <p className="text-xs text-slate-400">Pendientes</p>
              <p className="text-xl font-bold text-white">{enviosPendientes.length}</p>
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
      ) : enviosPendientes.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-700 py-16">
          <CheckCircle className="mb-4 h-12 w-12 text-green-500/50" />
          <p className="text-sm text-slate-500">No hay envíos pendientes</p>
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-slate-700/50 bg-slate-800">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-slate-700/50">
              <tr>
                <th className="px-4 py-3 font-medium text-slate-400">Fecha</th>
                <th className="px-4 py-3 font-medium text-slate-400">Sucursal</th>
                <th className="px-4 py-3 font-medium text-slate-400">Muestras</th>
                <th className="px-4 py-3 font-medium text-slate-400">Asesor</th>
                <th className="px-4 py-3 font-medium text-slate-400">Estado</th>
                <th className="px-4 py-3 font-medium text-slate-400">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/50">
              {enviosPendientes.map((envio) => (
                <tr key={envio.id} className="transition-colors hover:bg-slate-700/30">
                  <td className="whitespace-nowrap px-4 py-3 text-slate-200">
                    {new Date(envio.fecha_envio).toLocaleDateString('es-PE')}
                  </td>
                  <td className="px-4 py-3 text-slate-200">{envio.sucursal}</td>
                  <td className="px-4 py-3 text-slate-200">{envio.cantidad_muestras}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1 text-slate-400">
                      <User className="h-3 w-3" />
                      <span className="text-xs">{envio.asesor_email || 'No disponible'}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <EstadoBadge estado={envio.estado} />
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => setSelectedEnvio(envio)}
                      className="rounded-lg bg-green-600 px-4 py-1.5 text-sm font-medium text-white transition-colors hover:bg-green-500"
                    >
                      Confirmar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {selectedEnvio && (
        <ConfirmarEnvioModal
          envio={selectedEnvio}
          onConfirm={() => {
            setSelectedEnvio(null)
            refetch()
          }}
          onCancel={() => setSelectedEnvio(null)}
        />
      )}
    </div>
  )
}

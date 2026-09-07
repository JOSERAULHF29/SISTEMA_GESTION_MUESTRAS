import { Link } from 'react-router-dom'
import { useAuth } from '@/shared/hooks/useAuth'
import { useEnvios } from '@/shared/hooks/useEnvios'
import { useAllEnvios } from '@/shared/hooks/useAllEnvios'
import { EstadoBadge } from '@/shared/components/EstadoBadge'
import { Package, FileSpreadsheet, Plus, ArrowRight, Download } from 'lucide-react'

export function DashboardPage() {
  const { profile } = useAuth()
  const { envios: misEnvios, totalMuestras } = useEnvios(profile?.id)
  const { envios: allEnvios, totalMuestras: allMuestras } = useAllEnvios()

  const isAsesor = profile?.rol === 'asesor'
  const isTribologoOrAdmin = profile?.rol === 'tribologo' || profile?.rol === 'admin'

  const enviosRecientes = isAsesor ? misEnvios.slice(0, 5) : allEnvios.slice(0, 5)

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">
          Hola, {profile?.nombre}
        </h1>
        <p className="text-sm text-slate-400">Bienvenido a SIGMA</p>
      </div>

      <div className="mb-8 grid gap-6 sm:grid-cols-2">
        <div className="rounded-xl border border-slate-700/50 bg-slate-800 p-6 shadow-lg">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-500/10">
              <Package className="h-6 w-6 text-blue-400" />
            </div>
            <div>
              <p className="text-sm text-slate-400">
                {isAsesor ? 'Mis envíos' : 'Total envíos'}
              </p>
              <p className="text-2xl font-bold text-white">
                {isAsesor ? misEnvios.length : allEnvios.length}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-slate-700/50 bg-slate-800 p-6 shadow-lg">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-500/10">
              <FileSpreadsheet className="h-6 w-6 text-green-400" />
            </div>
            <div>
              <p className="text-sm text-slate-400">
                {isAsesor ? 'Mis muestras' : 'Total muestras'}
              </p>
              <p className="text-2xl font-bold text-white">
                {isAsesor ? totalMuestras : allMuestras}
              </p>
            </div>
          </div>
        </div>
      </div>

      {isAsesor && (
        <div className="mb-8 flex flex-wrap gap-4">
          <Link
            to="/app/envios/nuevo"
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-500 shadow-lg shadow-blue-600/20"
          >
            <Plus className="h-4 w-4" />
            Registrar nuevo envío
          </Link>
          <a
            href="/formato_envio.xlsx"
            download
            className="inline-flex items-center gap-2 rounded-lg border border-slate-600 px-4 py-2.5 text-sm font-medium text-slate-300 transition-colors hover:bg-slate-700"
          >
            <Download className="h-4 w-4" />
            Descargar formato Excel
          </a>
        </div>
      )}

      <div className="rounded-xl border border-slate-700/50 bg-slate-800 p-6 shadow-lg">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">
            {isAsesor ? 'Mis envíos recientes' : 'Envíos recientes'}
          </h2>
          {(isAsesor || isTribologoOrAdmin) && (
            <Link
              to={isAsesor ? '/app/envios' : '/app/control-envios'}
              className="flex items-center gap-1 text-sm text-blue-400 hover:text-blue-300"
            >
              Ver todos
              <ArrowRight className="h-4 w-4" />
            </Link>
          )}
        </div>

        {enviosRecientes.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12">
            <Package className="mb-4 h-12 w-12 text-slate-600" />
            <p className="text-sm text-slate-500">No hay envíos registrados aún</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-slate-700/50">
                <tr>
                  <th className="pb-2 font-medium text-slate-400">Fecha</th>
                  <th className="pb-2 font-medium text-slate-400">Sucursal</th>
                  <th className="pb-2 font-medium text-slate-400">Muestras</th>
                  <th className="pb-2 font-medium text-slate-400">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/30">
                {enviosRecientes.map((envio) => (
                  <tr key={envio.id}>
                    <td className="whitespace-nowrap py-3 text-slate-200">
                      {new Date(envio.fecha_envio).toLocaleDateString('es-PE')}
                    </td>
                    <td className="py-3 text-slate-200">{envio.sucursal}</td>
                    <td className="py-3 text-slate-200">{envio.cantidad_muestras}</td>
                    <td className="py-3">
                      <EstadoBadge estado={envio.estado} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

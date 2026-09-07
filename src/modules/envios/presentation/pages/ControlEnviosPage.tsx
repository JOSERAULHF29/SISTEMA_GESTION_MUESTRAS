import { useState, useMemo } from 'react'
import { useAllEnvios } from '@/shared/hooks/useAllEnvios'
import { EstadoBadge } from '@/shared/components/EstadoBadge'
import { FiltrosEnvio } from '@/modules/envios/presentation/components/FiltrosEnvio'
import { getSignedUrl } from '@/infrastructure/supabase/storage'
import {
  Package,
  FileSpreadsheet,
  Calendar,
  Clock,
  AlertCircle,
  Download,
  Eye,
  Mail,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export function ControlEnviosPage() {
  const { envios, loading, error, totalMuestras, enviosSemana, enviosMes } = useAllEnvios()
  const navigate = useNavigate()

  const [filtros, setFiltros] = useState<FiltrosEnvio>({
    busqueda: '',
    sucursal: '',
    estado: '',
  })

  const sucursales = useMemo(() => {
    const unique = [...new Set(envios.map((e) => e.sucursal))]
    return unique.sort()
  }, [envios])

  const enviosFiltrados = useMemo(() => {
    return envios.filter((envio) => {
      if (filtros.sucursal && envio.sucursal !== filtros.sucursal) return false
      if (filtros.estado && envio.estado !== filtros.estado) return false
      if (filtros.busqueda) {
        const busqueda = filtros.busqueda.toLowerCase()
        const matchSucursal = envio.sucursal.toLowerCase().includes(busqueda)
        const matchAlmacen = envio.correo_almacen.toLowerCase().includes(busqueda)
        if (!matchSucursal && !matchAlmacen) return false
      }
      return true
    })
  }, [envios, filtros])

  const handleDownload = async (archivoPath: string, archivoNombre: string) => {
    try {
      const url = await getSignedUrl(archivoPath)
      const a = document.createElement('a')
      a.href = url
      a.download = archivoNombre
      a.click()
    } catch (err) {
      console.error('Error al descargar:', err)
    }
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Control de envíos</h1>
        <p className="mt-1 text-sm text-slate-400">Vista general de todos los envíos</p>
      </div>

      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
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
              <FileSpreadsheet className="h-5 w-5 text-green-400" />
            </div>
            <div>
              <p className="text-xs text-slate-400">Total muestras</p>
              <p className="text-xl font-bold text-white">{totalMuestras}</p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-slate-700/50 bg-slate-800 p-4 shadow-lg">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-500/10">
              <Calendar className="h-5 w-5 text-purple-400" />
            </div>
            <div>
              <p className="text-xs text-slate-400">Esta semana</p>
              <p className="text-xl font-bold text-white">{enviosSemana}</p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-slate-700/50 bg-slate-800 p-4 shadow-lg">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-500/10">
              <Clock className="h-5 w-5 text-orange-400" />
            </div>
            <div>
              <p className="text-xs text-slate-400">Este mes</p>
              <p className="text-xl font-bold text-white">{enviosMes}</p>
            </div>
          </div>
        </div>
      </div>

      <FiltrosEnvio
        filtros={filtros}
        onFiltrosChange={setFiltros}
        sucursales={sucursales}
      />

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
      ) : enviosFiltrados.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-700 py-16">
          <Package className="mb-4 h-12 w-12 text-slate-600" />
          <p className="text-sm text-slate-500">No hay envíos que mostrar</p>
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
                <th className="px-4 py-3 font-medium text-slate-400">Almacén</th>
                <th className="px-4 py-3 font-medium text-slate-400">Estado</th>
                <th className="px-4 py-3 font-medium text-slate-400">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/50">
              {enviosFiltrados.map((envio) => (
                <tr key={envio.id} className="transition-colors hover:bg-slate-700/30">
                  <td className="whitespace-nowrap px-4 py-3 text-slate-200">
                    {new Date(envio.fecha_envio).toLocaleDateString('es-PE')}
                  </td>
                  <td className="px-4 py-3 text-slate-200">{envio.sucursal}</td>
                  <td className="px-4 py-3 text-slate-200">{envio.cantidad_muestras}</td>
                  <td className="px-4 py-3">
                    <div className="flex flex-col">
                      <span className="text-xs text-slate-300">{envio.asesor_nombre} {envio.asesor_email ? `(${envio.asesor_email})` : ''}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1 text-slate-400">
                      <Mail className="h-3 w-3" />
                      <span className="text-xs">{envio.correo_almacen}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <EstadoBadge estado={envio.estado} />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => navigate(`/app/envios/${envio.id}`)}
                        className="rounded p-1 text-slate-400 transition-colors hover:bg-slate-700 hover:text-slate-200"
                        title="Ver detalle"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDownload(envio.archivo_path, envio.archivo_nombre)}
                        className="rounded p-1 text-slate-400 transition-colors hover:bg-slate-700 hover:text-slate-200"
                        title="Descargar archivo"
                      >
                        <Download className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

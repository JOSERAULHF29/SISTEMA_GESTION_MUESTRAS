import type { EnvioMuestra } from '@/shared/types'
import { EstadoBadge } from '@/shared/components/EstadoBadge'
import { getSignedUrl } from '@/infrastructure/supabase/storage'
import { Download, Eye } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

interface Props {
  envios: EnvioMuestra[]
}

export function EnvioTable({ envios }: Props) {
  const navigate = useNavigate()

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

  if (envios.length === 0) {
    return null
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-slate-700/50 bg-slate-800">
      <table className="w-full text-left text-sm">
        <thead className="border-b border-slate-700/50">
          <tr>
            <th className="px-4 py-3 font-medium text-slate-400">Fecha</th>
            <th className="px-4 py-3 font-medium text-slate-400">Sucursal</th>
            <th className="px-4 py-3 font-medium text-slate-400">Muestras</th>
            <th className="px-4 py-3 font-medium text-slate-400">Archivo</th>
            <th className="px-4 py-3 font-medium text-slate-400">Estado</th>
            <th className="px-4 py-3 font-medium text-slate-400">Acciones</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-700/50">
          {envios.map((envio) => (
            <tr key={envio.id} className="transition-colors hover:bg-slate-700/30">
              <td className="whitespace-nowrap px-4 py-3 text-slate-200">
                {new Date(envio.fecha_envio).toLocaleDateString('es-PE')}
              </td>
              <td className="px-4 py-3 text-slate-200">{envio.sucursal}</td>
              <td className="px-4 py-3 text-slate-200">{envio.cantidad_muestras}</td>
              <td className="max-w-[200px] truncate px-4 py-3 text-slate-400">
                {envio.archivo_nombre}
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
  )
}

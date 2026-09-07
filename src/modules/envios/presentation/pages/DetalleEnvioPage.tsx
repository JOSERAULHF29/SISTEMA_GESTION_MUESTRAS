import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '@/shared/hooks/useAuth'
import {
  getEnvioById,
  updateEnvioEstado,
} from '@/modules/envios/infrastructure/envios.service'
import { getSignedUrl } from '@/infrastructure/supabase/storage'
import { EstadoBadge } from '@/shared/components/EstadoBadge'
import type { EnvioMuestra } from '@/shared/types'
import {
  ArrowLeft,
  Download,
  Calendar,
  Building2,
  Hash,
  FileSpreadsheet,
  AlertCircle,
  Mail,
  FileText,
  CheckCircle,
  XCircle,
  User,
} from 'lucide-react'

export function DetalleEnvioPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { profile } = useAuth()
  const [envio, setEnvio] = useState<EnvioMuestra | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [updating, setUpdating] = useState(false)

  const isTribologoOrAdmin = profile?.rol === 'tribologo' || profile?.rol === 'admin'

  useEffect(() => {
    async function load() {
      if (!id) return
      try {
        const data = await getEnvioById(id)
        setEnvio(data)
      } catch {
        setError('Error al cargar el envío')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [id])

  const handleDownload = async (filePath: string, fileName: string) => {
    try {
      const url = await getSignedUrl(filePath)
      const a = document.createElement('a')
      a.href = url
      a.download = fileName
      a.click()
    } catch (err) {
      console.error('Error al descargar:', err)
    }
  }

  const handleUpdateEstado = async (nuevoEstado: EnvioMuestra['estado']) => {
    if (!envio) return
    setUpdating(true)
    try {
      await updateEnvioEstado(envio.id, nuevoEstado)
      setEnvio({ ...envio, estado: nuevoEstado })
    } catch (err) {
      console.error('Error al actualizar estado:', err)
      setError('Error al actualizar el estado')
    } finally {
      setUpdating(false)
    }
  }

  const getBackPath = () => {
    if (profile?.rol === 'asesor') return '/app/envios'
    return '/app/control-envios'
  }

  const getBackLabel = () => {
    if (profile?.rol === 'asesor') return 'Volver a mis envíos'
    return 'Volver a control de envíos'
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent" />
      </div>
    )
  }

  if (error || !envio) {
    return (
      <div className="flex flex-col items-center gap-4 py-16">
        <AlertCircle className="h-12 w-12 text-red-400" />
        <p className="text-sm text-slate-400">{error || 'Envío no encontrado'}</p>
        <button
          onClick={() => navigate(getBackPath())}
          className="text-sm font-medium text-blue-400 hover:text-blue-300"
        >
          {getBackLabel()}
        </button>
      </div>
    )
  }

  return (
    <div>
      <button
        onClick={() => navigate(getBackPath())}
        className="mb-6 flex items-center gap-2 text-sm text-slate-400 hover:text-slate-200"
      >
        <ArrowLeft className="h-4 w-4" />
        {getBackLabel()}
      </button>

      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Detalle del envío</h1>
          <p className="mt-1 text-sm text-slate-400">Información completa del envío</p>
        </div>
        <EstadoBadge estado={envio.estado} />
      </div>

      {error && (
        <div className="mb-6 flex items-center gap-2 rounded-lg bg-red-500/10 p-3 text-sm text-red-400 ring-1 ring-red-500/20">
          <AlertCircle className="h-4 w-4" />
          {error}
        </div>
      )}

      <div className="grid gap-6 sm:grid-cols-2">
        <div className="rounded-xl border border-slate-700/50 bg-slate-800 p-6 shadow-lg">
          <div className="flex items-center gap-3">
            <Calendar className="h-5 w-5 text-slate-500" />
            <div>
              <p className="text-xs text-slate-400">Fecha de envío</p>
              <p className="text-sm font-medium text-white">
                {new Date(envio.fecha_envio).toLocaleDateString('es-PE', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-slate-700/50 bg-slate-800 p-6 shadow-lg">
          <div className="flex items-center gap-3">
            <Building2 className="h-5 w-5 text-slate-500" />
            <div>
              <p className="text-xs text-slate-400">Sucursal</p>
              <p className="text-sm font-medium text-white">{envio.sucursal}</p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-slate-700/50 bg-slate-800 p-6 shadow-lg">
          <div className="flex items-center gap-3">
            <Hash className="h-5 w-5 text-slate-500" />
            <div>
              <p className="text-xs text-slate-400">Cantidad de muestras</p>
              <p className="text-sm font-medium text-white">{envio.cantidad_muestras}</p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-slate-700/50 bg-slate-800 p-6 shadow-lg">
          <div className="flex items-center gap-3">
            <Mail className="h-5 w-5 text-slate-500" />
            <div>
              <p className="text-xs text-slate-400">Correo del almacén</p>
              <p className="text-sm font-medium text-white">{envio.correo_almacen}</p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-slate-700/50 bg-slate-800 p-6 shadow-lg">
          <div className="flex items-center gap-3">
            <User className="h-5 w-5 text-slate-500" />
            <div>
              <p className="text-xs text-slate-400">Asesor</p>
              <p className="text-sm font-medium text-white">
                {envio.asesor_nombre ? `${envio.asesor_nombre} (${envio.asesor_email})` : envio.asesor_email || 'No disponible'}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-slate-700/50 bg-slate-800 p-6 shadow-lg">
          <div className="flex items-center gap-3">
            <FileSpreadsheet className="h-5 w-5 text-slate-500" />
            <div>
              <p className="text-xs text-slate-400">Archivo Excel</p>
              <p className="text-sm font-medium text-white">{envio.archivo_nombre}</p>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-slate-700/50 bg-slate-800 p-6 shadow-lg">
          <div className="flex items-center gap-3">
            <FileText className="h-5 w-5 text-slate-500" />
            <div>
              <p className="text-xs text-slate-400">Comprobante PDF</p>
              <p className="text-sm font-medium text-white">
                {envio.comprobante_pdf_nombre || 'Aún no subido'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {envio.observacion && (
        <div className="mt-6 rounded-xl border border-slate-700/50 bg-slate-800 p-6 shadow-lg">
          <p className="mb-2 text-xs text-slate-400">Observación</p>
          <p className="text-sm text-slate-200">{envio.observacion}</p>
        </div>
      )}

      <div className="mt-6 rounded-xl border border-slate-700/50 bg-slate-800 p-6 shadow-lg">
        <p className="mb-2 text-xs text-slate-400">Fecha de registro</p>
        <p className="text-sm text-slate-200">
          {new Date(envio.created_at).toLocaleString('es-PE')}
        </p>
      </div>

      <div className="mt-6 flex flex-wrap gap-4">
        <button
          onClick={() => handleDownload(envio.archivo_path, envio.archivo_nombre)}
          className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-500 shadow-lg shadow-blue-600/20"
        >
          <Download className="h-4 w-4" />
          Descargar Excel
        </button>

        {envio.comprobante_pdf_path && (
          <button
            onClick={() =>
              handleDownload(envio.comprobante_pdf_path!, envio.comprobante_pdf_nombre!)
            }
            className="flex items-center gap-2 rounded-lg bg-purple-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-purple-500 shadow-lg shadow-purple-600/20"
          >
            <Download className="h-4 w-4" />
            Descargar comprobante PDF
          </button>
        )}

        {isTribologoOrAdmin && envio.estado === 'enviado' && (
          <button
            onClick={() => handleUpdateEstado('confirmado')}
            disabled={updating}
            className="flex items-center gap-2 rounded-lg bg-green-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-green-500 disabled:opacity-50"
          >
            <CheckCircle className="h-4 w-4" />
            {updating ? 'Confirmando...' : 'Confirmar envío'}
          </button>
        )}

        {isTribologoOrAdmin &&
          envio.estado !== 'anulado' &&
          envio.estado !== 'confirmado' && (
            <button
              onClick={() => handleUpdateEstado('anulado')}
              disabled={updating}
              className="flex items-center gap-2 rounded-lg border border-red-500/30 px-4 py-2.5 text-sm font-medium text-red-400 transition-colors hover:bg-red-500/10 disabled:opacity-50"
            >
              <XCircle className="h-4 w-4" />
              {updating ? 'Anulando...' : 'Anular envío'}
            </button>
          )}
      </div>
    </div>
  )
}

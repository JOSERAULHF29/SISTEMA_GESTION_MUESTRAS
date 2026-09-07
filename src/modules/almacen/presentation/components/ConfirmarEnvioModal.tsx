import { useState } from 'react'
import { uploadComprobante } from '@/infrastructure/supabase/storage'
import { updateEnvioComprobante } from '@/modules/envios/infrastructure/envios.service'
import { useAuth } from '@/shared/hooks/useAuth'
import { AlertCircle, CheckCircle, FileText } from 'lucide-react'
import type { EnvioMuestra } from '@/shared/types'

interface ConfirmarEnvioModalProps {
  envio: EnvioMuestra
  onConfirm: () => void
  onCancel: () => void
}

export function ConfirmarEnvioModal({ envio, onConfirm, onCancel }: ConfirmarEnvioModalProps) {
  const { profile } = useAuth()
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const validateFile = (f: File): string | null => {
    if (f.type !== 'application/pdf') return 'Solo se permiten archivos PDF'
    if (f.size > 10 * 1024 * 1024) return 'El archivo no debe exceder 10MB'
    return null
  }

  const handleConfirm = async () => {
    setError(null)

    if (!file) {
      setError('Debes adjuntar el comprobante PDF')
      return
    }

    const fileError = validateFile(file)
    if (fileError) {
      setError(fileError)
      return
    }

    if (!profile) {
      setError('Debes estar autenticado')
      return
    }

    setLoading(true)

    try {
      const filePath = `${profile.id}/${envio.id}/${Date.now()}.pdf`

      await uploadComprobante(file, filePath)
      await updateEnvioComprobante(envio.id, filePath, file.name)

      setSuccess(true)
      setTimeout(() => {
        onConfirm()
      }, 1500)
    } catch (err) {
      console.error('Error al confirmar envío:', err)
      setError('Error al confirmar el envío. Intenta novamente.')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
        <div className="w-full max-w-md rounded-xl bg-slate-800 p-6 shadow-xl">
          <div className="flex flex-col items-center gap-4">
            <CheckCircle className="h-12 w-12 text-green-400" />
            <h3 className="text-lg font-semibold text-green-300">Envío confirmado</h3>
            <p className="text-sm text-slate-400">El comprobante fue subido exitosamente</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-full max-w-md rounded-xl bg-slate-800 p-6 shadow-xl">
        <h3 className="mb-4 text-lg font-semibold text-white">Confirmar envío</h3>

        <div className="mb-4 space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-slate-400">Sucursal:</span>
            <span className="text-slate-200">{envio.sucursal}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Muestras:</span>
            <span className="text-slate-200">{envio.cantidad_muestras}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Fecha:</span>
            <span className="text-slate-200">
              {new Date(envio.fecha_envio).toLocaleDateString('es-PE')}
            </span>
          </div>
        </div>

        {error && (
          <div className="mb-4 flex items-center gap-2 rounded-lg bg-red-500/10 p-3 text-sm text-red-400 ring-1 ring-red-500/20">
            <AlertCircle className="h-4 w-4 flex-shrink-0" />
            {error}
          </div>
        )}

        <div className="mb-6">
          <label className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-300">
            <FileText className="h-4 w-4" />
            Comprobante de envío (PDF)
          </label>
          <input
            type="file"
            accept=".pdf"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            className="w-full rounded-lg border border-slate-600 bg-slate-700/50 px-3 py-2 text-sm text-slate-200 file:mr-3 file:rounded-md file:border-0 file:bg-blue-600 file:px-3 file:py-1 file:text-sm file:text-white hover:file:bg-blue-500"
          />
          <p className="mt-1 text-xs text-slate-500">Máximo 10MB</p>
        </div>

        <div className="flex gap-4">
          <button
            onClick={handleConfirm}
            disabled={loading}
            className="rounded-lg bg-green-600 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-green-500 disabled:opacity-50"
          >
            {loading ? 'Confirmando...' : 'Confirmar envío'}
          </button>
          <button
            onClick={onCancel}
            disabled={loading}
            className="rounded-lg border border-slate-600 px-6 py-2.5 text-sm font-medium text-slate-300 transition-colors hover:bg-slate-700 disabled:opacity-50"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  )
}

import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/shared/hooks/useAuth'
import { createEnvio } from '@/modules/envios/infrastructure/envios.service'
import { uploadFile } from '@/infrastructure/supabase/storage'
import {
  ALLOWED_EXTENSIONS,
  ALLOWED_FILE_TYPES,
  MAX_FILE_SIZE_MB,
  WAREHOUSE_EMAIL_PATTERN,
} from '@/shared/constants'
import {
  Calendar,
  Building2,
  Hash,
  FileSpreadsheet,
  AlertCircle,
  CheckCircle,
  Mail,
} from 'lucide-react'

export function EnvioForm() {
  const { profile } = useAuth()
  const navigate = useNavigate()

  const [fechaEnvio, setFechaEnvio] = useState(new Date().toISOString().split('T')[0])
  const [sucursal, setSucursal] = useState('')
  const [cantidadMuestras, setCantidadMuestras] = useState<number>(1)
  const [correoAlmacen, setCorreoAlmacen] = useState('')
  const [observacion, setObservacion] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const validateFile = (f: File): string | null => {
    const ext = '.' + f.name.split('.').pop()?.toLowerCase()
    if (!ALLOWED_EXTENSIONS.includes(ext)) return 'Solo se permiten archivos .xlsx'
    if (!ALLOWED_FILE_TYPES.includes(f.type) && f.type !== '') return 'Tipo de archivo no válido'
    if (f.size > MAX_FILE_SIZE_MB * 1024 * 1024) return `El archivo no debe exceder ${MAX_FILE_SIZE_MB}MB`
    return null
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!profile) {
      setError('Debes estar autenticado')
      return
    }

    if (!sucursal.trim()) {
      setError('La sucursal es obligatoria')
      return
    }

    if (!correoAlmacen.trim()) {
      setError('El correo del almacén es obligatorio')
      return
    }

    if (!WAREHOUSE_EMAIL_PATTERN.test(correoAlmacen.trim())) {
      setError('El correo debe comenzar con "almacen" y terminar en @ipesa.com.pe')
      return
    }

    if (!file) {
      setError('Debes adjuntar un archivo Excel')
      return
    }

    const fileError = validateFile(file)
    if (fileError) {
      setError(fileError)
      return
    }

    setLoading(true)

    try {
      const fileExt = file.name.split('.').pop()
      const filePath = `${profile.id}/${Date.now()}.${fileExt}`

      await uploadFile(file, filePath)

      await createEnvio({
        asesor_id: profile.id,
        fecha_envio: fechaEnvio,
        sucursal: sucursal.trim(),
        cantidad_muestras: cantidadMuestras,
        correo_almacen: correoAlmacen.trim().toLowerCase(),
        observacion: observacion.trim() || null,
        archivo_nombre: file.name,
        archivo_path: filePath,
        comprobante_pdf_path: null,
        comprobante_pdf_nombre: null,
        estado: 'pendiente',
      })

      setSuccess(true)
      setTimeout(() => {
        navigate('/app/envios')
      }, 1500)
    } catch (err) {
      console.error('Error al registrar envío:', err)
      setError('Error al registrar el envío. Intenta novamente.')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="flex flex-col items-center gap-4 rounded-xl border border-green-500/20 bg-green-500/10 p-8">
        <CheckCircle className="h-12 w-12 text-green-400" />
        <h3 className="text-lg font-semibold text-green-300">Envío registrado exitosamente</h3>
        <p className="text-sm text-green-400">Redirigiendo a tus envíos...</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="flex items-center gap-2 rounded-lg bg-red-500/10 p-3 text-sm text-red-400 ring-1 ring-red-500/20">
          <AlertCircle className="h-4 w-4 flex-shrink-0" />
          {error}
        </div>
      )}

      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="fechaEnvio" className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-300">
            <Calendar className="h-4 w-4" />
            Fecha de envío
          </label>
          <input
            id="fechaEnvio"
            type="date"
            value={fechaEnvio}
            onChange={(e) => setFechaEnvio(e.target.value)}
            className="w-full rounded-lg border border-slate-600 bg-slate-700/50 px-3 py-2 text-sm text-slate-200 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="sucursal" className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-300">
            <Building2 className="h-4 w-4" />
            Sucursal
          </label>
          <input
            id="sucursal"
            type="text"
            value={sucursal}
            onChange={(e) => setSucursal(e.target.value)}
            placeholder="Ej: Lima Centro"
            className="w-full rounded-lg border border-slate-600 bg-slate-700/50 px-3 py-2 text-sm text-slate-200 placeholder-slate-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="cantidad" className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-300">
            <Hash className="h-4 w-4" />
            Cantidad de muestras
          </label>
          <input
            id="cantidad"
            type="number"
            min="1"
            value={cantidadMuestras}
            onChange={(e) => setCantidadMuestras(Number(e.target.value))}
            className="w-full rounded-lg border border-slate-600 bg-slate-700/50 px-3 py-2 text-sm text-slate-200 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="correoAlmacen" className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-300">
            <Mail className="h-4 w-4" />
            Correo del almacén
          </label>
          <input
            id="correoAlmacen"
            type="email"
            value={correoAlmacen}
            onChange={(e) => setCorreoAlmacen(e.target.value)}
            placeholder="almacen1@ipesa.com.pe"
            className="w-full rounded-lg border border-slate-600 bg-slate-700/50 px-3 py-2 text-sm text-slate-200 placeholder-slate-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
          <p className="mt-1 text-xs text-slate-500">Debe comenzar con "almacen"</p>
        </div>

        <div>
          <label htmlFor="archivo" className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-300">
            <FileSpreadsheet className="h-4 w-4" />
            Archivo Excel (obligatorio)
          </label>
          <input
            id="archivo"
            type="file"
            accept=".xlsx"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            className="w-full rounded-lg border border-slate-600 bg-slate-700/50 px-3 py-2 text-sm text-slate-200 file:mr-3 file:rounded-md file:border-0 file:bg-blue-600 file:px-3 file:py-1 file:text-sm file:text-white hover:file:bg-blue-500"
          />
          <p className="mt-1 text-xs text-slate-500">Máximo {MAX_FILE_SIZE_MB}MB</p>
        </div>
      </div>

      <div>
        <label htmlFor="observacion" className="mb-2 block text-sm font-medium text-slate-300">
          Observación (opcional)
        </label>
        <textarea
          id="observacion"
          value={observacion}
          onChange={(e) => setObservacion(e.target.value)}
          rows={3}
          placeholder="Algún comentario adicional..."
          className="w-full rounded-lg border border-slate-600 bg-slate-700/50 px-3 py-2 text-sm text-slate-200 placeholder-slate-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>

      <div className="flex gap-4">
        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-500 disabled:opacity-50 shadow-lg shadow-blue-600/20"
        >
          {loading ? 'Registrando...' : 'Registrar envío'}
        </button>
        <button
          type="button"
          onClick={() => navigate('/app/envios')}
          className="rounded-lg border border-slate-600 px-6 py-2.5 text-sm font-medium text-slate-300 transition-colors hover:bg-slate-700"
        >
          Cancelar
        </button>
      </div>
    </form>
  )
}

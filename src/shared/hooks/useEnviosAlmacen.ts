import { useState, useEffect } from 'react'
import { getEnviosByAlmacen } from '@/modules/envios/infrastructure/envios.service'
import type { EnvioMuestra } from '@/shared/types'

export function useEnviosAlmacen(correoAlmacen: string | undefined) {
  const [envios, setEnvios] = useState<EnvioMuestra[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadEnvios = async () => {
    if (!correoAlmacen) {
      setEnvios([])
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError(null)
      const data = await getEnviosByAlmacen(correoAlmacen)
      setEnvios(data)
    } catch (err) {
      console.error('Error al cargar envíos:', err)
      setError('Error al cargar los envíos')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadEnvios()
  }, [correoAlmacen])

  const enviosPendientes = envios.filter((e) => e.estado === 'pendiente')
  const enviosEnviados = envios.filter((e) => e.estado === 'enviado')

  return {
    envios,
    enviosPendientes,
    enviosEnviados,
    loading,
    error,
    refetch: loadEnvios,
  }
}

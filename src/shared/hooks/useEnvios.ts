import { useState, useEffect, useCallback } from 'react'
import type { EnvioMuestra } from '@/shared/types'
import { getEnviosByUser } from '@/modules/envios/infrastructure/envios.service'

export function useEnvios(userId: string | undefined) {
  const [envios, setEnvios] = useState<EnvioMuestra[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadEnvios = useCallback(async () => {
    if (!userId) {
      setEnvios([])
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError(null)
      const data = await getEnviosByUser(userId)
      setEnvios(data)
    } catch (err) {
      console.error('Error al cargar envíos:', err)
      setError('Error al cargar los envíos')
    } finally {
      setLoading(false)
    }
  }, [userId])

  useEffect(() => {
    loadEnvios()
  }, [loadEnvios])

  const totalMuestras = envios.reduce((sum, e) => sum + e.cantidad_muestras, 0)

  return { envios, loading, error, totalMuestras, refetch: loadEnvios }
}

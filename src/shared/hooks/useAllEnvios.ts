import { useState, useEffect, useCallback } from 'react'
import type { EnvioMuestra } from '@/shared/types'
import { getAllEnvios } from '@/modules/envios/infrastructure/envios.service'

export function useAllEnvios() {
  const [envios, setEnvios] = useState<EnvioMuestra[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadEnvios = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await getAllEnvios()
      setEnvios(data)
    } catch (err) {
      console.error('Error al cargar envíos:', err)
      setError('Error al cargar los envíos')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadEnvios()
  }, [loadEnvios])

  const totalMuestras = envios.reduce((sum, e) => sum + e.cantidad_muestras, 0)

  const now = new Date()
  const startOfWeek = new Date(now)
  startOfWeek.setDate(now.getDate() - now.getDay())
  startOfWeek.setHours(0, 0, 0, 0)

  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)

  const enviosSemana = envios.filter((e) => new Date(e.created_at) >= startOfWeek).length
  const enviosMes = envios.filter((e) => new Date(e.created_at) >= startOfMonth).length

  return {
    envios,
    loading,
    error,
    totalMuestras,
    enviosSemana,
    enviosMes,
    refetch: loadEnvios,
  }
}

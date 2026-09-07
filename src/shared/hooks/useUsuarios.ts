import { useState, useEffect, useCallback } from 'react'
import type { Profile } from '@/shared/types'
import { getAllProfiles, toggleUserActive } from '@/modules/usuarios/infrastructure/usuarios.service'

export function useUsuarios() {
  const [usuarios, setUsuarios] = useState<Profile[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadUsuarios = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await getAllProfiles()
      setUsuarios(data)
    } catch (err) {
      console.error('Error al cargar usuarios:', err)
      setError('Error al cargar los usuarios')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadUsuarios()
  }, [loadUsuarios])

  const handleToggleActive = async (userId: string, currentState: boolean) => {
    try {
      await toggleUserActive(userId, !currentState)
      setUsuarios((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, activo: !currentState } : u))
      )
    } catch (err) {
      console.error('Error al actualizar usuario:', err)
      setError('Error al actualizar el usuario')
    }
  }

  return { usuarios, loading, error, handleToggleActive, refetch: loadUsuarios }
}

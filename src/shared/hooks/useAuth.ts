import { useState, useEffect, useCallback } from 'react'
import type { Profile } from '@/shared/types'
import { getCurrentUser, getSession, signOut } from '@/modules/auth/application/useCases/authUseCases'
import { supabase } from '@/infrastructure/supabase/client'
import { ALLOWED_DOMAIN } from '@/shared/constants'

export function useAuth() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const loadUser = useCallback(async () => {
    try {
      setError(null)
      const session = await getSession()
      if (!session) {
        setProfile(null)
        return
      }

      const email = session.user.email
      if (!email || !email.endsWith(`@${ALLOWED_DOMAIN}`)) {
        await signOut()
        setProfile(null)
        setError('Solo se permiten correos corporativos @ipesa.com.pe')
        return
      }

      const p = await getCurrentUser()
      setProfile(p)
    } catch {
      setProfile(null)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadUser()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async () => {
      await loadUser()
    })

    return () => subscription.unsubscribe()
  }, [loadUser])

  const logout = async () => {
    await signOut()
    setProfile(null)
    setError(null)
  }

  return { profile, loading, error, logout }
}

import { supabase } from '@/infrastructure/supabase/client'
import type { Profile } from '@/shared/types'
import { getProfile } from '@/modules/auth/infrastructure/auth.service'

export async function signInWithGoogle() {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}/app`,
    },
  })
  if (error) throw error
}

export async function signOut() {
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}

export async function getCurrentUser(): Promise<Profile | null> {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user || !user.email) return null
  return await getProfile(user.id)
}

export async function getSession() {
  const { data: { session } } = await supabase.auth.getSession()
  return session
}

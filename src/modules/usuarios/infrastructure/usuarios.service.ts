import { supabase } from '@/infrastructure/supabase/client'
import type { Profile } from '@/shared/types'

export async function getAllProfiles(): Promise<Profile[]> {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) throw error
  return (data ?? []) as Profile[]
}

export async function toggleUserActive(userId: string, activo: boolean): Promise<void> {
  const { error } = await supabase
    .from('profiles')
    .update({ activo, updated_at: new Date().toISOString() })
    .eq('id', userId)

  if (error) throw error
}

export async function updateUserRole(userId: string, rol: Profile['rol']): Promise<void> {
  const { error } = await supabase
    .from('profiles')
    .update({ rol, updated_at: new Date().toISOString() })
    .eq('id', userId)

  if (error) throw error
}

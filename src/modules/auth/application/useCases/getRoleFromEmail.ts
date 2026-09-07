import type { Role } from '@/shared/types'
import { ADMIN_EMAIL, TRIBOLOGO_EMAIL, WAREHOUSE_EMAIL_PATTERN } from '@/shared/constants'

export function getRoleFromEmail(email: string): Role {
  if (email === ADMIN_EMAIL) return 'admin'
  if (email === TRIBOLOGO_EMAIL) return 'tribologo'
  if (WAREHOUSE_EMAIL_PATTERN.test(email)) return 'almacenero'
  return 'asesor'
}

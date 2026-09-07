import type { Role } from '@/shared/types'

interface Props {
  rol: Role
}

const styles: Record<Role, string> = {
  admin: 'bg-purple-500/15 text-purple-400 ring-1 ring-purple-500/20',
  tribologo: 'bg-orange-500/15 text-orange-400 ring-1 ring-orange-500/20',
  asesor: 'bg-blue-500/15 text-blue-400 ring-1 ring-blue-500/20',
  almacenero: 'bg-yellow-500/15 text-yellow-400 ring-1 ring-yellow-500/20',
}

const labels: Record<Role, string> = {
  admin: 'Admin',
  tribologo: 'Tribólogo',
  asesor: 'Asesor',
  almacenero: 'Almacenero',
}

export function RoleBadge({ rol }: Props) {
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${styles[rol]}`}>
      {labels[rol]}
    </span>
  )
}

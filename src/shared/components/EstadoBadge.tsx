import type { EstadoEnvio } from '@/shared/types'

interface Props {
  estado: EstadoEnvio
}

const styles: Record<EstadoEnvio, string> = {
  pendiente: 'bg-yellow-500/15 text-yellow-400 ring-1 ring-yellow-500/20',
  enviado: 'bg-blue-500/15 text-blue-400 ring-1 ring-blue-500/20',
  confirmado: 'bg-green-500/15 text-green-400 ring-1 ring-green-500/20',
  anulado: 'bg-red-500/15 text-red-400 ring-1 ring-red-500/20',
}

const labels: Record<EstadoEnvio, string> = {
  pendiente: 'Pendiente',
  enviado: 'Enviado',
  confirmado: 'Confirmado',
  anulado: 'Anulado',
}

export function EstadoBadge({ estado }: Props) {
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${styles[estado]}`}>
      {labels[estado]}
    </span>
  )
}

export type Role = 'admin' | 'tribologo' | 'asesor' | 'almacenero'

export type EstadoEnvio = 'pendiente' | 'enviado' | 'confirmado' | 'anulado'

export interface Profile {
  id: string
  email: string
  nombre: string
  apellido: string
  rol: Role
  activo: boolean
  created_at: string
  updated_at: string
}

export interface EnvioMuestra {
  id: string
  asesor_id: string
  fecha_envio: string
  sucursal: string
  cantidad_muestras: number
  observacion: string | null
  archivo_nombre: string
  archivo_path: string
  correo_almacen: string
  comprobante_pdf_path: string | null
  comprobante_pdf_nombre: string | null
  estado: EstadoEnvio
  created_at: string
  updated_at: string
  asesor_nombre?: string
  asesor_email?: string
}

export interface AuthUser {
  id: string
  email: string
}

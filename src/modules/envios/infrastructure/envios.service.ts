import { supabase } from '@/infrastructure/supabase/client'
import { sendEmail, templates } from '@/modules/email/infrastructure/email.service'
import { ADMIN_EMAIL } from '@/shared/constants'
import type { EnvioMuestra } from '@/shared/types'

function mapEnvio(data: Record<string, unknown>): EnvioMuestra {
  const asesor = data.asesor as { nombre?: string; email?: string } | null
  return {
    ...(data as Omit<EnvioMuestra, 'asesor_nombre' | 'asesor_email'>),
    asesor_nombre: asesor?.nombre ?? undefined,
    asesor_email: asesor?.email ?? undefined,
  }
}

export async function getEnviosByUser(userId: string): Promise<EnvioMuestra[]> {
  const { data, error } = await supabase
    .from('envios_muestras')
    .select('*, asesor:profiles!asesor_id(nombre, email)')
    .eq('asesor_id', userId)
    .order('created_at', { ascending: false })

  if (error) throw error
  return (data ?? []).map(mapEnvio)
}

export async function getAllEnvios(): Promise<EnvioMuestra[]> {
  const { data, error } = await supabase
    .from('envios_muestras')
    .select('*, asesor:profiles!asesor_id(nombre, email)')
    .order('created_at', { ascending: false })

  if (error) throw error
  return (data ?? []).map(mapEnvio)
}

export async function getEnviosByAlmacen(correoAlmacen: string): Promise<EnvioMuestra[]> {
  const { data, error } = await supabase
    .from('envios_muestras')
    .select('*, asesor:profiles!asesor_id(nombre, email)')
    .eq('correo_almacen', correoAlmacen)
    .order('created_at', { ascending: false })

  if (error) throw error
  return (data ?? []).map(mapEnvio)
}

export async function getEnvioById(id: string): Promise<EnvioMuestra | null> {
  const { data, error } = await supabase
    .from('envios_muestras')
    .select('*, asesor:profiles!asesor_id(nombre, email)')
    .eq('id', id)
    .single()

  if (error && error.code !== 'PGRST116') throw error
  return data ? mapEnvio(data) : null
}

export async function createEnvio(
  envio: Omit<EnvioMuestra, 'id' | 'created_at' | 'updated_at' | 'asesor_nombre' | 'asesor_email'>
): Promise<EnvioMuestra> {
  const { data, error } = await supabase
    .from('envios_muestras')
    .insert(envio)
    .select('*, asesor:profiles!asesor_id(nombre, email)')
    .single()

  if (error) throw error

  const envioCreado = mapEnvio(data)
  const fecha = new Date(envioCreado.fecha_envio).toLocaleDateString('es-PE')

  sendEmail(
    envioCreado.correo_almacen,
    'Nuevo envío pendiente de confirmar - SIGMA',
    templates.nuevoEnvio(envioCreado.sucursal, envioCreado.cantidad_muestras, fecha, envioCreado.asesor_email || 'No disponible')
  )

  return envioCreado
}

export async function updateEnvioEstado(
  id: string,
  estado: EnvioMuestra['estado']
): Promise<void> {
  const envio = await getEnvioById(id)

  const { error } = await supabase
    .from('envios_muestras')
    .update({ estado, updated_at: new Date().toISOString() })
    .eq('id', id)

  if (error) throw error

  if (envio && envio.asesor_email) {
    if (estado === 'confirmado') {
      sendEmail(
        envio.asesor_email,
        'Tu envío ha sido confirmado - SIGMA',
        templates.envioConfirmado(envio.sucursal, envio.cantidad_muestras)
      )
    } else if (estado === 'anulado') {
      sendEmail(
        envio.asesor_email,
        'Tu envío ha sido anulado - SIGMA',
        templates.envioAnulado(envio.sucursal, envio.cantidad_muestras)
      )
    }
  }
}

export async function updateEnvioComprobante(
  id: string,
  comprobante_pdf_path: string,
  comprobante_pdf_nombre: string
): Promise<void> {
  const envio = await getEnvioById(id)

  const { error } = await supabase
    .from('envios_muestras')
    .update({
      comprobante_pdf_path,
      comprobante_pdf_nombre,
      estado: 'enviado',
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)

  if (error) throw error

  if (envio) {
    const fecha = new Date(envio.fecha_envio).toLocaleDateString('es-PE')
    sendEmail(
      ADMIN_EMAIL,
      'Envío recibido, pendiente de revisión - SIGMA',
      templates.envioRecibido(envio.sucursal, envio.cantidad_muestras, fecha)
    )
    if (envio.asesor_email) {
      sendEmail(
        envio.asesor_email,
        'Tu envío fue enviado - SIGMA',
        templates.envioEnviado(envio.sucursal, envio.cantidad_muestras)
      )
    }
  }
}

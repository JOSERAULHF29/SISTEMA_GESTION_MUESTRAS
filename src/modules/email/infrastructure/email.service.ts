import { RESEND_FUNCTION_URL } from '@/shared/constants'
import { supabase } from '@/infrastructure/supabase/client'

export async function sendEmail(to: string, subject: string, html: string): Promise<void> {
  try {
    const { data: { session } } = await supabase.auth.getSession()

    const response = await fetch(RESEND_FUNCTION_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session?.access_token ?? ''}`,
      },
      body: JSON.stringify({ to, subject, html }),
    })

    if (!response.ok) {
      console.error('Error al enviar correo:', await response.text())
    }
  } catch (err) {
    console.error('Error al enviar correo:', err)
  }
}

export const templates = {
  nuevoEnvio: (sucursal: string, muestras: number, fecha: string, asesor: string) => `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: #1e40af; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
        <h1 style="color: white; margin: 0; font-size: 24px;">SIGMA</h1>
        <p style="color: #bfdbfe; margin: 5px 0 0;">Sistema de Gestión de Muestras de Aceite</p>
      </div>
      <div style="background: #1e293b; padding: 30px; border-radius: 0 0 8px 8px;">
        <h2 style="color: #f1f5f9; margin-top: 0;">Nuevo envío pendiente de confirmar</h2>
        <p style="color: #94a3b8;">Se ha registrado un nuevo envío de muestras de aceite.</p>
        <div style="background: #334155; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p style="color: #e2e8f0; margin: 8px 0;"><strong>Sucursal:</strong> ${sucursal}</p>
          <p style="color: #e2e8f0; margin: 8px 0;"><strong>Muestras:</strong> ${muestras}</p>
          <p style="color: #e2e8f0; margin: 8px 0;"><strong>Fecha:</strong> ${fecha}</p>
          <p style="color: #e2e8f0; margin: 8px 0;"><strong>Asesor:</strong> ${asesor}</p>
        </div>
        <p style="color: #94a3b8;">Por favor, ingresa al sistema para confirmar el envío y adjuntar el comprobante PDF.</p>
      </div>
    </div>
  `,

  envioRecibido: (sucursal: string, muestras: number, fecha: string) => `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: #1e40af; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
        <h1 style="color: white; margin: 0; font-size: 24px;">SIGMA</h1>
        <p style="color: #bfdbfe; margin: 5px 0 0;">Sistema de Gestión de Muestras de Aceite</p>
      </div>
      <div style="background: #1e293b; padding: 30px; border-radius: 0 0 8px 8px;">
        <h2 style="color: #f1f5f9; margin-top: 0;">Envío recibido, pendiente de revisión</h2>
        <p style="color: #94a3b8;">El almacén ha confirmado la recepción de un envío.</p>
        <div style="background: #334155; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p style="color: #e2e8f0; margin: 8px 0;"><strong>Sucursal:</strong> ${sucursal}</p>
          <p style="color: #e2e8f0; margin: 8px 0;"><strong>Muestras:</strong> ${muestras}</p>
          <p style="color: #e2e8f0; margin: 8px 0;"><strong>Fecha:</strong> ${fecha}</p>
        </div>
        <p style="color: #94a3b8;">Ingresa al sistema para confirmar o anular el envío.</p>
      </div>
    </div>
  `,

  envioConfirmado: (sucursal: string, muestras: number) => `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: #16a34a; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
        <h1 style="color: white; margin: 0; font-size: 24px;">SIGMA</h1>
        <p style="color: #bbf7d0; margin: 5px 0 0;">Sistema de Gestión de Muestras de Aceite</p>
      </div>
      <div style="background: #1e293b; padding: 30px; border-radius: 0 0 8px 8px;">
        <h2 style="color: #f1f5f9; margin-top: 0;">Envío confirmado</h2>
        <p style="color: #94a3b8;">Tu envío ha sido confirmado exitosamente.</p>
        <div style="background: #334155; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p style="color: #e2e8f0; margin: 8px 0;"><strong>Sucursal:</strong> ${sucursal}</p>
          <p style="color: #e2e8f0; margin: 8px 0;"><strong>Muestras:</strong> ${muestras}</p>
        </div>
        <p style="color: #94a3b8;">Gracias por usar SIGMA.</p>
      </div>
    </div>
  `,

  envioAnulado: (sucursal: string, muestras: number) => `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: #dc2626; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
        <h1 style="color: white; margin: 0; font-size: 24px;">SIGMA</h1>
        <p style="color: #fecaca; margin: 5px 0 0;">Sistema de Gestión de Muestras de Aceite</p>
      </div>
      <div style="background: #1e293b; padding: 30px; border-radius: 0 0 8px 8px;">
        <h2 style="color: #f1f5f9; margin-top: 0;">Envío anulado</h2>
        <p style="color: #94a3b8;">Tu envío ha sido anulado.</p>
        <div style="background: #334155; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p style="color: #e2e8f0; margin: 8px 0;"><strong>Sucursal:</strong> ${sucursal}</p>
          <p style="color: #e2e8f0; margin: 8px 0;"><strong>Muestras:</strong> ${muestras}</p>
        </div>
        <p style="color: #94a3b8;">Si tienes dudas, contacta al administrador.</p>
      </div>
    </div>
  `,

  envioEnviado: (sucursal: string, muestras: number) => `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <div style="background: #2563eb; padding: 20px; text-align: center; border-radius: 8px 8px 0 0;">
        <h1 style="color: white; margin: 0; font-size: 24px;">SIGMA</h1>
        <p style="color: #bfdbfe; margin: 5px 0 0;">Sistema de Gestión de Muestras de Aceite</p>
      </div>
      <div style="background: #1e293b; padding: 30px; border-radius: 0 0 8px 8px;">
        <h2 style="color: #f1f5f9; margin-top: 0;">Tu envío fue enviado</h2>
        <p style="color: #94a3b8;">El almacén ha confirmado la recepción de tu envío.</p>
        <div style="background: #334155; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p style="color: #e2e8f0; margin: 8px 0;"><strong>Sucursal:</strong> ${sucursal}</p>
          <p style="color: #e2e8f0; margin: 8px 0;"><strong>Muestras:</strong> ${muestras}</p>
        </div>
        <p style="color: #94a3b8;">Tu envío está pendiente de revisión por el administrador.</p>
      </div>
    </div>
  `,
}

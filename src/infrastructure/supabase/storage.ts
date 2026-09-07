import { supabase } from './client'

export const BUCKET_NAME = 'envios-muestras'

export async function uploadFile(file: File, path: string) {
  const { data, error } = await supabase.storage.from(BUCKET_NAME).upload(path, file, {
    contentType: file.type,
  })
  if (error) throw error
  return data
}

export async function uploadComprobante(file: File, path: string) {
  const { data, error } = await supabase.storage
    .from(BUCKET_NAME)
    .upload(`comprobantes/${path}`, file, {
      contentType: 'application/pdf',
    })
  if (error) throw error
  return data
}

export async function getSignedUrl(path: string) {
  const { data, error } = await supabase.storage.from(BUCKET_NAME).createSignedUrl(path, 3600)
  if (error) throw error
  return data.signedUrl
}

export async function deleteFile(path: string) {
  const { error } = await supabase.storage.from(BUCKET_NAME).remove([path])
  if (error) throw error
}

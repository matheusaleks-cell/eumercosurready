'use server'

import cloudinary from '@/lib/cloudinary'
import { auth } from '@/lib/auth'

export async function uploadImage(formData: FormData): Promise<{ success: boolean; url?: string; error?: string }> {
  const session = await auth()
  if (!session) return { success: false, error: 'Não autorizado' }

  try {
    const file = formData.get('file') as File
    if (!file || file.size === 0) {
      return { success: false, error: 'Nenhum arquivo enviado ou arquivo vazio' }
    }

    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    return new Promise((resolve) => {
      cloudinary.uploader.upload_stream(
        { 
          folder: 'eu-mercosur-ready',
          resource_type: 'auto'
        },
        (error, result) => {
          if (error) {
            console.error('Cloudinary upload error:', error)
            resolve({ success: false, error: 'Falha ao enviar para o Cloudinary' })
          } else {
            console.log('Cloudinary Success:', result?.secure_url)
            resolve({ success: true, url: result?.secure_url })
          }
        }
      ).end(buffer)
    })
  } catch (error) {
    console.error('Server upload error:', error)
    return { success: false, error: 'Erro interno no servidor de upload' }
  }
}

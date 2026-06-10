"use server"

import cloudinary from "@/lib/cloudinary"
import { auth } from "@/lib/auth"

export async function uploadImage(formData: FormData) {
  const session = await auth()
  if (!session) return { success: false, error: "Não autorizado" }

  const file = formData.get('file') as File
  if (!file) return { success: false, error: "Nenhum arquivo enviado" }

  const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif']
  if (!ALLOWED_TYPES.includes(file.type)) {
    return { success: false, error: "Tipo de arquivo não permitido. Use JPEG, PNG, WebP, GIF ou AVIF." }
  }

  const MAX_SIZE_BYTES = 5 * 1024 * 1024
  if (file.size > MAX_SIZE_BYTES) {
    return { success: false, error: "Arquivo muito grande. O tamanho máximo é 5 MB." }
  }

  try {
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)
    const base64 = `data:${file.type};base64,${buffer.toString('base64')}`

    const result = await cloudinary.uploader.upload(base64, {
      folder: 'platform_settings',
    })

    return { success: true, url: result.secure_url }
  } catch (error) {
    console.error("Erro no upload para Cloudinary:", error)
    return { success: false, error: "Falha ao subir para a nuvem" }
  }
}

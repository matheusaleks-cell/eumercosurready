"use server"

import cloudinary from "@/lib/cloudinary"
import { auth } from "@/lib/auth"

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif']

/**
 * Verifica os bytes de assinatura ("magic numbers") do arquivo, além do MIME type
 * declarado pelo cliente (que pode ser forjado facilmente em um multipart/form-data).
 */
function matchesImageSignature(buffer: Buffer, mimeType: string): boolean {
  if (buffer.length < 12) return false

  switch (mimeType) {
    case 'image/jpeg':
      return buffer[0] === 0xFF && buffer[1] === 0xD8 && buffer[2] === 0xFF
    case 'image/png':
      return buffer.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A]))
    case 'image/gif':
      return buffer.subarray(0, 4).toString('ascii') === 'GIF8'
    case 'image/webp':
      return buffer.subarray(0, 4).toString('ascii') === 'RIFF' && buffer.subarray(8, 12).toString('ascii') === 'WEBP'
    case 'image/avif':
      return buffer.subarray(4, 8).toString('ascii') === 'ftyp'
    default:
      return false
  }
}

export async function uploadImage(formData: FormData) {
  const session = await auth()
  if (!session) return { success: false, error: "Não autorizado" }

  const file = formData.get('file') as File
  if (!file) return { success: false, error: "Nenhum arquivo enviado" }

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

    if (!matchesImageSignature(buffer, file.type)) {
      return { success: false, error: "O conteúdo do arquivo não corresponde a uma imagem válida do tipo informado." }
    }

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

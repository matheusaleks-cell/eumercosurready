'use server'

import { revalidatePath } from 'next/cache'
import prisma from '@/lib/prisma'
import { z } from 'zod'
import { auth } from '@/lib/auth'

const ProductSchema = z.object({
  companyId: z.string(),
  title: z.string().min(2, 'Título é obrigatório'),
  title_en: z.string().optional().nullable(),
  title_es: z.string().optional().nullable(),
  description: z.string(),
  description_en: z.string().optional().nullable(),
  description_es: z.string().optional().nullable(),
  imageUrl: z.string().optional().nullable(),
  category: z.string().optional().nullable(),
  isReadyToShip: z.boolean().default(false),
  isLowMOQ: z.boolean().default(false),
  isCertified: z.boolean().default(false),
  isSustainable: z.boolean().default(false),
  moq: z.string().optional().nullable(),
  incoterms: z.string().optional().nullable(),
  leadTime: z.string().optional().nullable(),
  portOfOrigin: z.string().optional().nullable(),
  productionCapacity: z.string().optional().nullable(),
  type: z.enum(['PRODUCT', 'SERVICE']).default('PRODUCT'),
})

/** Gera slug a partir do título */
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // remove acentos
    .replace(/[^a-z0-9]+/g, '-')    // substitui caracteres especiais por hífen
    .replace(/^-+|-+$/g, '')         // remove hífens no início/fim
    .substring(0, 80)               // limita tamanho
}

/** Converte strings vazias em null para campos opcionais */
function cleanOptionalFields(data: Record<string, any>) {
  const optionalStringFields = [
    'imageUrl', 'category', 'moq', 'incoterms', 'leadTime', 'portOfOrigin', 
    'productionCapacity', 'title_en', 'title_es', 'description_en', 'description_es', 'type'
  ]
  const cleaned = { ...data }
  for (const field of optionalStringFields) {
    if (cleaned[field] === '' || cleaned[field] === undefined) {
      cleaned[field] = null
    }
  }
  return cleaned
}

export async function addProduct(data: z.infer<typeof ProductSchema>) {
  const session = await auth()
  if (!session) return { success: false, error: 'Não autorizado' }

  try {
    const cleaned = cleanOptionalFields(data)
    const slug = generateSlug(data.title)
    
    const product = await prisma.product.create({
      data: {
        ...cleaned as any,
        slug,
      }
    })
    
    const company = await prisma.company.findUnique({
      where: { id: data.companyId },
      select: { slug: true }
    })

    if (company) {
      revalidatePath(`/empresa/${company.slug}`)
      revalidatePath(`/empresa/${company.slug}/catalogo`)
    }
    revalidatePath('/admin/empresas')
    
    return { success: true, data: product }
  } catch (error) {
    console.error('Error adding product:', error)
    return { success: false, error: 'Erro ao adicionar produto' }
  }
}

export async function updateProduct(id: string, data: Partial<z.infer<typeof ProductSchema>>) {
  const session = await auth()
  if (!session) return { success: false, error: 'Não autorizado' }

  try {
    const cleaned = cleanOptionalFields(data)
    
    // Se o título mudou, regenerar o slug
    if (data.title) {
      (cleaned as any).slug = generateSlug(data.title)
    }
    
    const product = await prisma.product.update({
      where: { id },
      data: cleaned as any
    })
    
    const company = await prisma.company.findUnique({
      where: { id: product.companyId },
      select: { slug: true }
    })

    if (company) {
      revalidatePath(`/empresa/${company.slug}`)
      revalidatePath(`/empresa/${company.slug}/catalogo`)
    }
    revalidatePath('/admin/empresas')
    
    return { success: true, data: product }
  } catch (error) {
    console.error('Error updating product:', error)
    return { success: false, error: 'Erro ao atualizar produto' }
  }
}

export async function deleteProduct(id: string, companyId: string) {
  const session = await auth()
  if (!session) return { success: false, error: 'Não autorizado' }

  try {
    const product = await prisma.product.delete({
      where: { id }
    })

    const company = await prisma.company.findUnique({
      where: { id: companyId },
      select: { slug: true }
    })

    if (company) {
      revalidatePath(`/empresa/${company.slug}`)
      revalidatePath(`/empresa/${company.slug}/catalogo`)
    }
    revalidatePath('/admin/empresas')

    return { success: true }
  } catch (error) {
    console.error('Error deleting product:', error)
    return { success: false, error: 'Erro ao excluir produto' }
  }
}

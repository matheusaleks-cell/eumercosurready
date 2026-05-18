'use server'

import { revalidatePath } from 'next/cache'
import prisma from '@/lib/prisma'
import { z } from 'zod'
import { auth } from '@/lib/auth'

const CompanySchema = z.object({

  name: z.string().min(2, 'Nome é obrigatório'),
  slug: z.string().min(2, 'Slug é obrigatório'),
  logoUrl: z.string().optional().nullable(),
  bannerUrl: z.string().optional().nullable(),
  country: z.string().min(1, 'País é obrigatório'),
  countryCode: z.string().min(2, 'Código do país é obrigatório'),
  region: z.enum(['EU', 'MERCOSUL']),
  sectorId: z.string().min(1, 'Setor é obrigatório'),
  city: z.string().optional().nullable(),
  shortDescription: z.string().max(200),
  shortDescription_en: z.string().max(200).optional().nullable(),
  shortDescription_es: z.string().max(200).optional().nullable(),
  fullDescription: z.string(),
  fullDescription_en: z.string().optional().nullable(),
  fullDescription_es: z.string().optional().nullable(),
  videoUrl: z.string().optional().nullable(),
  keywords: z.array(z.string()).default([]),
  foundedYear: z.number().optional().nullable(),
  auditStatus: z.enum(['NONE', 'BRONZE', 'SILVER', 'GOLD']).default('NONE'),
  email: z.string().email().optional().or(z.literal('')).nullable(),
  phone: z.string().optional().nullable(),
  whatsapp: z.string().optional().nullable(),
  website: z.string().optional().or(z.literal('')).nullable(),
  linkedin: z.string().optional().nullable(),
  instagram: z.string().optional().nullable(),
  facebook: z.string().optional().nullable(),
  twitter: z.string().optional().nullable(),
  certifications: z.array(z.string()).default([]),
  targetMarkets: z.array(z.string()).default([]),
  secondarySectors: z.array(z.string()).default([]),
  employeesRange: z.string().optional().nullable(),
  featured: z.boolean().default(false),
  status: z.enum(['ACTIVE', 'INACTIVE', 'PENDING', 'DRAFT', 'FEATURED']).default('PENDING'),
  logoColor: z.string().default('#003399'),
  internalNotes: z.string().optional().nullable(),
  verificationNotes: z.string().optional().nullable(),
})

/** Converte strings vazias em null para campos opcionais de URL/texto e formata URLs */
function cleanOptionalFields(data: Record<string, any>) {
  const fieldsToClean = [
    'logoUrl', 'bannerUrl', 'city', 'videoUrl', 'email', 'phone', 'whatsapp', 
    'website', 'linkedin', 'instagram', 'facebook', 'twitter', 'employeesRange', 
    'internalNotes', 'verificationNotes',
    'shortDescription_en', 'shortDescription_es', 'fullDescription_en', 'fullDescription_es'
  ]
  const cleaned = { ...data }
  
  for (const field of fieldsToClean) {
    if (cleaned[field] === '' || cleaned[field] === undefined) {
      cleaned[field] = null
    }
  }

  // Formatação automática de Website (adiciona https:// se não tiver)
  if (cleaned.website && !cleaned.website.startsWith('http')) {
    cleaned.website = `https://${cleaned.website}`
  }

  // Limpeza de Telefone e WhatsApp (mais flexível para internacional)
  // Removemos espaços, parênteses e traços, mas mantemos o + inicial
  const cleanPhone = (val: string | null) => {
    if (!val) return null
    const hasPlus = val.startsWith('+')
    const digits = val.replace(/\D/g, '')
    return (hasPlus ? '+' : '') + digits
  }

  if (cleaned.phone) cleaned.phone = cleanPhone(cleaned.phone)
  if (cleaned.whatsapp) cleaned.whatsapp = cleanPhone(cleaned.whatsapp)

  return cleaned
}

export async function createCompany(formData: any) {
  const session = await auth()
  if (!session) return { success: false, error: 'Não autorizado' }

  try {
    const validated = CompanySchema.parse(formData)
    const cleaned = cleanOptionalFields(validated)
    
    // Verificar se o slug já existe
    const existing = await prisma.company.findUnique({
      where: { slug: cleaned.slug }
    })
    if (existing) {
      return { success: false, error: `O slug "${cleaned.slug}" já está em uso. Escolha outro.` }
    }
    
    const company = await prisma.company.create({
      data: {
        ...cleaned as any,
        keywords: validated.keywords || [],
        reviews: (formData.reviews && formData.reviews.length > 0) ? {
          create: formData.reviews.map((r: any) => ({
            author: String(r.author || 'Anônimo'),
            rating: Number(r.rating) || 5,
            comment: String(r.comment || ''),
            date: r.date ? new Date(r.date) : new Date(),
          }))
        } : undefined
      }
    })
    
    revalidatePath('/admin/empresas')
    revalidatePath('/')
    revalidatePath('/', 'layout')
    return { success: true }
  } catch (error) {
    console.error('Error creating company:', error)
    if (error instanceof z.ZodError) {
      return { success: false, error: error.issues[0].message }
    }
    return { success: false, error: 'Erro ao criar empresa' }
  }
}

export async function updateCompany(id: string, formData: any) {
  const session = await auth()
  if (!session) return { success: false, error: 'Não autorizado' }

  try {
    const validated = CompanySchema.parse(formData)
    const cleaned = cleanOptionalFields(validated)
    
    // Verificar se o slug já existe em outra empresa
    const existing = await prisma.company.findFirst({
      where: { slug: cleaned.slug, NOT: { id } }
    })
    if (existing) {
      return { success: false, error: `O slug "${cleaned.slug}" já está em uso por outra empresa.` }
    }

    const company = await prisma.company.update({
      where: { id },
      data: {
        ...cleaned as any,
        reviews: (formData.reviews && formData.reviews.length > 0) ? {
          deleteMany: {},
          create: formData.reviews.map((r: any) => ({
            author: String(r.author || 'Anônimo'),
            rating: Number(r.rating) || 5,
            comment: String(r.comment || ''),
            date: r.date ? new Date(r.date) : new Date(),
          }))
        } : undefined
      }
    })
    
    revalidatePath('/admin/empresas')
    revalidatePath(`/admin/empresas/${id}`)
    revalidatePath(`/empresa/${company.slug}`)
    revalidatePath('/')
    revalidatePath('/', 'layout')
    
    return { success: true }
  } catch (error) {
    console.error('Error updating company:', error)
    if (error instanceof z.ZodError) {
      return { success: false, error: `Erro de validação: ${error.issues[0].message}` }
    }
    return { success: false, error: 'Erro ao atualizar empresa no banco de dados' }
  }
}

export async function getCompanies(options: { 
  page?: number, 
  limit?: number, 
  search?: string, 
  sectorId?: string, 
  status?: string,
  region?: string,
  countryCode?: string 
}) {
  const session = await auth()
  if (!session) return { success: false, error: 'Não autorizado' }

  const { page = 1, limit = 10, search, sectorId, status, region, countryCode } = options
  const skip = (page - 1) * limit

  const where: any = {}
  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { slug: { contains: search, mode: 'insensitive' } }
    ]
  }
  if (sectorId && sectorId !== 'ALL') where.sectorId = sectorId
  if (status && status !== 'ALL') where.status = status
  if (region && region !== 'ALL') where.region = region
  if (countryCode && countryCode !== 'ALL') where.countryCode = countryCode

  try {
    const [companies, total] = await Promise.all([
      prisma.company.findMany({
        where,
        select: {
          id: true,
          name: true,
          slug: true,
          logoUrl: true,
          country: true,
          countryCode: true,
          region: true,
          status: true,
          auditStatus: true,
          featured: true,
          createdAt: true,
          sector: {
            select: { 
              id: true,
              name: true 
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit
      }),
      prisma.company.count({ where })
    ])

    return { 
      success: true, 
      companies, 
      total, 
      pages: Math.ceil(total / limit) 
    }
  } catch (error) {
    console.error('Error fetching companies:', error)
    return { success: false, error: 'Erro ao buscar empresas' }
  }
}

export async function deleteCompany(id: string) {
  const session = await auth()
  if (!session) return { success: false, error: 'Não autorizado' }

  try {
    await prisma.company.delete({
      where: { id }
    })
    
    revalidatePath('/admin/empresas')
    revalidatePath('/')
    revalidatePath('/', 'layout')
    return { success: true }
  } catch (error) {
    console.error('Error deleting company:', error)
    return { success: false, error: 'Erro ao excluir empresa' }
  }
}

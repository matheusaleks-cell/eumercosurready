'use server'

import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { countriesList } from '@/lib/countries-list'
import { auth } from '@/lib/auth'


import { z } from 'zod'

const RequestSchema = z.object({
  companyName: z.string().min(2, 'Nome da empresa é obrigatório').max(100),
  countryCode: z.string().min(2).max(10),
  sector: z.string().min(2).max(100),
  website: z.string().or(z.literal('')).optional().nullable(),
  responsibleName: z.string().min(2, 'Nome do responsável é obrigatório').max(100),
  email: z.string().email('E-mail inválido'),
  ddi: z.string().min(1).max(5),
  ddd: z.string().optional().or(z.literal('')).nullable(),
  phoneNum: z.string().min(5).max(20),
  linkedin: z.string().or(z.literal('')).optional().nullable(),
  instagram: z.string().or(z.literal('')).optional().nullable(),
  description: z.string().min(10, 'Descrição muito curta').max(5000),
  logoUrl: z.string().optional().nullable(),
  bannerUrl: z.string().optional().nullable(),
})

/** Função auxiliar para garantir que a URL tenha o protocolo https:// */
function fixUrl(url: string | null | undefined) {
  if (!url || url === '') return url
  if (url.startsWith('http://') || url.startsWith('https://')) return url
  return `https://${url}`
}

export async function createRequest(formData: FormData) {
  try {
    const rawData = {
      companyName: formData.get('companyName') as string,
      countryCode: formData.get('country') as string,
      sector: formData.get('sector') as string,
      website: fixUrl(formData.get('website') as string),
      responsibleName: formData.get('responsibleName') as string,
      email: formData.get('email') as string,
      ddi: formData.get('ddi') as string,
      ddd: formData.get('ddd') as string,
      phoneNum: formData.get('phone') as string,
      linkedin: fixUrl(formData.get('linkedin') as string),
      instagram: formData.get('instagram') as string,
      description: formData.get('description') as string,
      logoUrl: formData.get('logoUrl') as string,
      bannerUrl: formData.get('bannerUrl') as string,
    }

    const validated = RequestSchema.parse(rawData)

    // 1. RATE LIMITING: Verificar se este e-mail já enviou uma solicitação recentemente (ex: última 1 hora)
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000)
    const recentRequest = await prisma.contactRequest.findFirst({
      where: {
        email: validated.email,
        createdAt: { gte: oneHourAgo }
      }
    })

    if (recentRequest) {
      return { 
        success: false, 
        error: 'Você já enviou uma solicitação recentemente. Por favor, aguarde uma hora antes de tentar novamente.' 
      }
    }

    // 2. VERIFICAÇÃO DE DUPLICIDADE: Ver se a empresa já existe no sistema principal
    const existingCompany = await prisma.company.findFirst({
      where: { 
        name: { equals: validated.companyName, mode: 'insensitive' } 
      }
    })

    if (existingCompany) {
      return { 
        success: false, 
        error: 'Esta empresa já está cadastrada em nossa plataforma.' 
      }
    }

    // Formatar telefone: +DDI (DDD) NUMERO - Se não tiver DDD, coloca apenas +DDI NUMERO
    const phone = validated.ddd 
      ? `+${validated.ddi} (${validated.ddd}) ${validated.phoneNum}`
      : `+${validated.ddi} ${validated.phoneNum}`

    const request = await prisma.contactRequest.create({
      data: {
        companyName: validated.companyName,
        country: validated.countryCode, // No DB 'country' armazena o código
        countryCode: validated.countryCode,
        sector: validated.sector,
        responsibleName: validated.responsibleName,
        email: validated.email,
        phone,
        website: validated.website,
        description: validated.description,
        logoUrl: validated.logoUrl,
        bannerUrl: validated.bannerUrl,
        message: `LinkedIn: ${validated.linkedin || 'N/A'}\nInstagram: ${validated.instagram || 'N/A'}`
      }
    })

    // VERIFICAR AUTO-APROVAÇÃO
    try {
      const autoApproveSetting = await prisma.platformSetting.findUnique({ where: { key: 'AUTO_APPROVE' } })
      if (autoApproveSetting?.value === 'true') {
        await internalPromote(request.id)
      }
    } catch (promoError) {
      console.error('Error in auto-promotion:', promoError)
      // Não falha a criação da solicitação se apenas a promoção falhar
    }

    revalidatePath('/admin/solicitacoes')
    return { success: true, id: request.id }
  } catch (error: any) {
    console.error('Error creating request:', error)
    return { 
      success: false, 
      error: error.message || 'Falha ao enviar solicitação. Verifique os dados e tente novamente.' 
    }
  }
}

import { translateText } from '@/lib/deepl'

// Versão interna sem revalidatePath repetido para uso no createRequest
async function internalPromote(requestId: string) {
    const request = await prisma.contactRequest.findUnique({ where: { id: requestId } })
    if (!request) return null
    if (request.companyId) return request.companyId

    const countryInfo = countriesList.find(c => c.code === request.countryCode)
    const region = countryInfo?.bloc === 'Mercosul' ? 'MERCOSUL' : 'EU'

    let sector = await prisma.sector.findFirst({
      where: { 
        OR: [
          { name: { contains: request.sector, mode: 'insensitive' } },
          { slug: { contains: request.sector.toLowerCase(), mode: 'insensitive' } }
        ]
      }
    })
    if (!sector) sector = await prisma.sector.findFirst()
    if (!sector) return null

    const baseSlug = request.companyName.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
    let slug = baseSlug
    let counter = 1
    while (await prisma.company.findUnique({ where: { slug } })) {
      slug = `${baseSlug}-${counter}`
      counter++
    }

    // Verificar se já existe uma empresa com este nome exato para evitar duplicidade na aprovação
    const companyExists = await prisma.company.findFirst({
      where: { name: { equals: request.companyName, mode: 'insensitive' } }
    })
    
    if (companyExists) {
      // Se já existe, apenas marca como aprovada e associa ao ID existente
      await prisma.contactRequest.update({
        where: { id: requestId },
        data: { status: 'APPROVED', companyId: companyExists.id, reviewedAt: new Date() }
      })
      return companyExists.id
    }

    // TRADUÇÃO AUTOMÁTICA (DeepL)
    const shortDescPt = request.description.substring(0, 195) + '...'
    const fullDescPt = request.description

    const [shortEn, shortEs, fullEn, fullEs] = await Promise.all([
      translateText(shortDescPt, 'en-US'),
      translateText(shortDescPt, 'es'),
      translateText(fullDescPt, 'en-US'),
      translateText(fullDescPt, 'es')
    ])

    const company = await prisma.company.create({
      data: {
        name: request.companyName,
        slug,
        sectorId: sector.id,
        country: request.country,
        countryCode: request.countryCode || 'BR',
        region: region as any,
        shortDescription: shortDescPt.substring(0, 200),
        shortDescription_en: shortEn.substring(0, 200),
        shortDescription_es: shortEs.substring(0, 200),
        fullDescription: fullDescPt,
        fullDescription_en: fullEn,
        fullDescription_es: fullEs,
        email: request.email,
        phone: request.phone,
        website: request.website,
        logoUrl: request.logoUrl,
        bannerUrl: request.bannerUrl,
        status: 'DRAFT',
        auditStatus: 'NONE'
      }
    })

    await prisma.contactRequest.update({
      where: { id: requestId },
      data: { status: 'APPROVED', companyId: company.id, reviewedAt: new Date() }
    })

    return company.id
}

export async function getRequests() {
  const session = await auth()
  if (!session) return { success: false, error: 'Não autorizado' }

  try {
    const requests = await prisma.contactRequest.findMany({
      select: {
        id: true,
        companyName: true,
        responsibleName: true,
        email: true,
        status: true,
        createdAt: true,
        countryCode: true,
        companyId: true,
        reviewedBy: {
          select: { name: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    })
    return { success: true, requests }
  } catch (error) {
    return { success: false, error: 'Falha ao buscar solicitações' }
  }
}

export async function updateRequestStatus(id: string, status: 'APPROVED' | 'REJECTED', rejectionReason?: string) {
  const session = await auth()
  if (!session) return { success: false, error: 'Não autorizado' }

  try {
    if (status === 'APPROVED') {
      // internalPromote cria a empresa e já atualiza status + companyId na solicitação
      const companyId = await internalPromote(id)
      if (!companyId) return { success: false, error: 'Falha ao criar empresa: nenhum setor cadastrado no sistema.' }
      revalidatePath('/admin/solicitacoes')
      return { success: true }
    }

    await prisma.contactRequest.update({
      where: { id },
      data: { status, rejectionReason, reviewedAt: new Date() }
    })

    revalidatePath('/admin/solicitacoes')
    return { success: true }
  } catch (error: any) {
    console.error('updateRequestStatus error:', error)
    return { success: false, error: error?.message || 'Falha ao atualizar status' }
  }
}

export async function getRequestById(id: string) {
  const session = await auth()
  if (!session) return { success: false, error: 'Não autorizado' }

  try {
    const request = await prisma.contactRequest.findUnique({
      where: { id },
      include: {
        reviewedBy: {
          select: { name: true }
        }
      }
    })
    return { success: true, request }
  } catch (error) {
    return { success: false, error: 'Falha ao buscar detalhes da solicitação' }
  }
}

export async function promoteToCompany(requestId: string) {
  const session = await auth()
  if (!session) return { success: false, error: 'Não autorizado' }

  try {
    const companyId = await internalPromote(requestId)
    if (!companyId) return { success: false, error: 'Falha ao criar empresa: nenhum setor cadastrado no sistema.' }
    revalidatePath('/admin/solicitacoes')
    revalidatePath('/admin/empresas')
    return { success: true, companyId }
  } catch (error: any) {
    console.error('Promotion error:', error)
    return { success: false, error: error?.message || 'Falha ao converter solicitação em empresa' }
  }
}

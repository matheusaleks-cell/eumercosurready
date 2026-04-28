'use server'

import prisma from '@/lib/prisma'
import { translateText } from '@/lib/deepl'
import { revalidatePath } from 'next/cache'
import { auth } from '@/lib/auth'

export async function translateCompany(companyId: string) {
  const session = await auth()
  if (!session) return { success: false, error: 'Não autorizado' }

  try {
    const company = await prisma.company.findUnique({
      where: { id: companyId }
    })

    if (!company) return { success: false, error: 'Empresa não encontrada' }

    const updates: any = {}

    // Traduzir descrição curta se faltar
    if (!company.shortDescription_en) {
      updates.shortDescription_en = await translateText(company.shortDescription, 'en-US')
    }
    if (!company.shortDescription_es) {
      updates.shortDescription_es = await translateText(company.shortDescription, 'es')
    }

    // Traduzir descrição longa se faltar
    if (!company.fullDescription_en) {
      updates.fullDescription_en = await translateText(company.fullDescription, 'en-US')
    }
    if (!company.fullDescription_es) {
      updates.fullDescription_es = await translateText(company.fullDescription, 'es')
    }

    if (Object.keys(updates).length > 0) {
      await prisma.company.update({
        where: { id: companyId },
        data: updates
      })
    }

    revalidatePath(`/admin/empresas/${companyId}`)
    revalidatePath(`/empresa/${company.slug}`)
    
    return { success: true }
  } catch (error) {
    console.error('Translation Action Error:', error)
    return { success: false, error: 'Falha ao processar tradução' }
  }
}

export async function translateProduct(productId: string) {
  const session = await auth()
  if (!session) return { success: false, error: 'Não autorizado' }

  try {
    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: { company: { select: { slug: true } } }
    })

    if (!product) return { success: false, error: 'Produto não encontrado' }

    const updates: any = {}

    if (!product.title_en) {
      updates.title_en = await translateText(product.title, 'en-US')
    }
    if (!product.title_es) {
      updates.title_es = await translateText(product.title, 'es')
    }

    if (!product.description_en) {
      updates.description_en = await translateText(product.description, 'en-US')
    }
    if (!product.description_es) {
      updates.description_es = await translateText(product.description, 'es')
    }

    if (Object.keys(updates).length > 0) {
      await prisma.product.update({
        where: { id: productId },
        data: updates
      })
    }

    if (product.company) {
      revalidatePath(`/empresa/${product.company.slug}`)
    }

    return { success: true }
  } catch (error) {
    console.error('Product Translation Error:', error)
    return { success: false, error: 'Falha ao traduzir produto' }
  }
}

export async function translateSingleText(text: string, targetLang: 'en-US' | 'es') {
  const session = await auth()
  if (!session) return { success: false, error: 'Não autorizado' }

  try {
    const translated = await translateText(text, targetLang)
    return { success: true, text: translated }
  } catch (error) {
    console.error('Single Translation Error:', error)
    return { success: false, error: 'Falha na tradução' }
  }
}

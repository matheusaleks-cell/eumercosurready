'use server'

import prisma from '@/lib/prisma'
import { translateText, TranslationUnavailableError } from '@/lib/deepl'
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

    const updates: Record<string, string> = {}
    const failedFields: string[] = []

    async function tryTranslate(field: string, source: string, lang: 'en-US' | 'es') {
      try {
        updates[field] = await translateText(source, lang)
      } catch (err) {
        console.error(`Falha ao traduzir ${field} da empresa ${companyId}:`, err)
        failedFields.push(field)
      }
    }

    // Traduzir descrição curta se faltar
    if (!company.shortDescription_en) await tryTranslate('shortDescription_en', company.shortDescription, 'en-US')
    if (!company.shortDescription_es) await tryTranslate('shortDescription_es', company.shortDescription, 'es')

    // Traduzir descrição longa se faltar
    if (!company.fullDescription_en) await tryTranslate('fullDescription_en', company.fullDescription, 'en-US')
    if (!company.fullDescription_es) await tryTranslate('fullDescription_es', company.fullDescription, 'es')

    if (Object.keys(updates).length > 0) {
      await prisma.company.update({
        where: { id: companyId },
        data: updates
      })
    }

    revalidatePath(`/admin/empresas/${companyId}`)
    revalidatePath(`/empresa/${company.slug}`)

    if (failedFields.length > 0) {
      return {
        success: Object.keys(updates).length > 0,
        error: `Não foi possível traduzir: ${failedFields.join(', ')}. Verifique a chave/cota da API DeepL. Os campos ficarão vazios para poderem ser retraduzidos depois.`,
      }
    }

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

    const updates: Record<string, string> = {}
    const failedFields: string[] = []

    async function tryTranslate(field: string, source: string, lang: 'en-US' | 'es') {
      try {
        updates[field] = await translateText(source, lang)
      } catch (err) {
        console.error(`Falha ao traduzir ${field} do produto ${productId}:`, err)
        failedFields.push(field)
      }
    }

    if (!product.title_en) await tryTranslate('title_en', product.title, 'en-US')
    if (!product.title_es) await tryTranslate('title_es', product.title, 'es')

    if (!product.description_en) await tryTranslate('description_en', product.description, 'en-US')
    if (!product.description_es) await tryTranslate('description_es', product.description, 'es')

    if (Object.keys(updates).length > 0) {
      await prisma.product.update({
        where: { id: productId },
        data: updates
      })
    }

    if (product.company) {
      revalidatePath(`/empresa/${product.company.slug}`)
    }

    if (failedFields.length > 0) {
      return {
        success: Object.keys(updates).length > 0,
        error: `Não foi possível traduzir: ${failedFields.join(', ')}. Verifique a chave/cota da API DeepL.`,
      }
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
  } catch (error: any) {
    console.error('Single Translation Error:', error)
    if (error instanceof TranslationUnavailableError && error.message === 'DEEPL_API_KEY_MISSING') {
      return { success: false, error: 'Chave do DeepL não configurada no servidor' }
    }
    return { success: false, error: 'Falha na tradução automática' }
  }
}

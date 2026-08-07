'use server'

import { revalidatePath } from 'next/cache'
import prisma from '@/lib/prisma'
import { z } from 'zod'
import { auth } from '@/lib/auth'
import { logAudit } from '@/lib/audit'
import { countriesList } from '@/lib/countries-list'
import { countriesData } from '@/lib/countries-data'
import { reportsData } from '@/lib/reports-data'

const SectorSchema = z.object({
  title: z.string().min(1).max(150),
  title_en: z.string().max(150).optional().nullable(),
  title_es: z.string().max(150).optional().nullable(),
  description: z.string().min(1).max(1000),
  description_en: z.string().max(1000).optional().nullable(),
  description_es: z.string().max(1000).optional().nullable(),
})

const CountrySchema = z.object({
  code: z.string().trim().toUpperCase().length(2, 'Código ISO deve ter 2 letras'),
  name: z.string().min(2, 'Nome é obrigatório'),
  name_en: z.string().optional().nullable(),
  name_es: z.string().optional().nullable(),
  group: z.enum(['EU', 'MERCOSUL', 'GUEST']),
  ddi: z.string().min(1, 'DDI é obrigatório').max(5),
  flagUrl: z.string().optional().nullable(),
  order: z.number().default(0),

  // Perfil público
  description: z.string().max(2000).optional().nullable(),
  description_en: z.string().max(2000).optional().nullable(),
  description_es: z.string().max(2000).optional().nullable(),
  highlight: z.string().max(300).optional().nullable(),
  highlight_en: z.string().max(300).optional().nullable(),
  highlight_es: z.string().max(300).optional().nullable(),
  ctaTitle: z.string().max(300).optional().nullable(),
  ctaTitle_en: z.string().max(300).optional().nullable(),
  ctaTitle_es: z.string().max(300).optional().nullable(),
  ctaDescription: z.string().max(1000).optional().nullable(),
  ctaDescription_en: z.string().max(1000).optional().nullable(),
  ctaDescription_es: z.string().max(1000).optional().nullable(),

  // Economia
  gdp: z.string().max(50).optional().nullable(),
  growth: z.string().max(50).optional().nullable(),
  mainSector: z.string().max(150).optional().nullable(),
  mainSector_en: z.string().max(150).optional().nullable(),
  mainSector_es: z.string().max(150).optional().nullable(),
  taxRate: z.string().max(50).optional().nullable(),

  // Setores e comércio exterior
  sectors: z.array(SectorSchema).max(10).optional(),
  naturalRiches: z.array(z.string().max(200)).max(20).optional(),
  naturalRiches_en: z.array(z.string().max(200)).max(20).optional(),
  naturalRiches_es: z.array(z.string().max(200)).max(20).optional(),
  exports: z.array(z.string().max(200)).max(20).optional(),
  exports_en: z.array(z.string().max(200)).max(20).optional(),
  exports_es: z.array(z.string().max(200)).max(20).optional(),
  imports: z.array(z.string().max(200)).max(20).optional(),
  imports_en: z.array(z.string().max(200)).max(20).optional(),
  imports_es: z.array(z.string().max(200)).max(20).optional(),
})

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export async function getCountries(filters?: { group?: 'EU' | 'MERCOSUL' | 'GUEST' | 'ALL'; activeOnly?: boolean }) {
  const session = await auth()
  if (!session || (session.user as any).role !== 'SUPER_ADMIN') {
    return { success: false, error: 'Não autorizado. Apenas Super Admins podem gerenciar países.' }
  }

  try {
    const where: Record<string, unknown> = {}
    if (filters?.group && filters.group !== 'ALL') where.group = filters.group
    if (filters?.activeOnly) where.active = true

    const countries = await prisma.country.findMany({
      where,
      orderBy: [{ group: 'asc' }, { order: 'asc' }, { name: 'asc' }],
    })

    return { success: true, countries }
  } catch (error) {
    console.error('Erro ao buscar países:', error)
    return { success: false, error: 'Falha ao buscar países' }
  }
}

/** Versão pública (sem sessão) usada por dropdowns/filtros do site. */
export async function getPublicCountries() {
  try {
    const countries = await prisma.country.findMany({
      where: { active: true },
      orderBy: [{ group: 'asc' }, { order: 'asc' }, { name: 'asc' }],
    })
    return countries
  } catch (error) {
    console.error('Erro ao buscar países públicos:', error)
    return []
  }
}

export async function createCountry(data: unknown) {
  const session = await auth()
  if (!session || (session.user as any).role !== 'SUPER_ADMIN') {
    return { success: false, error: 'Não autorizado. Apenas Super Admins podem gerenciar países.' }
  }

  try {
    const validated = CountrySchema.parse(data)
    const slug = generateSlug(validated.name)

    const existingCode = await prisma.country.findUnique({ where: { code: validated.code } })
    if (existingCode) {
      return { success: false, error: `Já existe um país com o código "${validated.code}".` }
    }
    const existingSlug = await prisma.country.findUnique({ where: { slug } })
    if (existingSlug) {
      return { success: false, error: `Já existe um país com o nome "${validated.name}".` }
    }

    const country = await prisma.country.create({
      data: { ...validated, slug }
    })

    revalidatePath('/admin/paises')
    await logAudit({ action: 'country.create', entityType: 'Country', entityId: country.id, details: `${country.name} (${country.code})` })
    return { success: true, country }
  } catch (error) {
    console.error('Erro ao criar país:', error)
    if (error instanceof z.ZodError) {
      return { success: false, error: error.issues[0].message }
    }
    return { success: false, error: 'Falha ao criar país' }
  }
}

export async function updateCountry(id: string, data: unknown) {
  const session = await auth()
  if (!session || (session.user as any).role !== 'SUPER_ADMIN') {
    return { success: false, error: 'Não autorizado. Apenas Super Admins podem gerenciar países.' }
  }

  try {
    const validated = CountrySchema.parse(data)
    const slug = generateSlug(validated.name)

    const existingCode = await prisma.country.findFirst({ where: { code: validated.code, NOT: { id } } })
    if (existingCode) {
      return { success: false, error: `Já existe outro país com o código "${validated.code}".` }
    }
    const existingSlug = await prisma.country.findFirst({ where: { slug, NOT: { id } } })
    if (existingSlug) {
      return { success: false, error: `Já existe outro país com o nome "${validated.name}".` }
    }

    const country = await prisma.country.update({
      where: { id },
      data: { ...validated, slug }
    })

    revalidatePath('/admin/paises')
    await logAudit({ action: 'country.update', entityType: 'Country', entityId: id, details: `${country.name} (${country.code})` })
    return { success: true, country }
  } catch (error) {
    console.error('Erro ao atualizar país:', error)
    if (error instanceof z.ZodError) {
      return { success: false, error: error.issues[0].message }
    }
    return { success: false, error: 'Falha ao atualizar país' }
  }
}

export async function deleteCountry(id: string) {
  const session = await auth()
  if (!session || (session.user as any).role !== 'SUPER_ADMIN') {
    return { success: false, error: 'Não autorizado. Apenas Super Admins podem gerenciar países.' }
  }

  try {
    const country = await prisma.country.findUnique({ where: { id } })
    if (!country) return { success: false, error: 'País não encontrado' }

    // Não há FK entre Company e Country (país é armazenado como string solta em Company.countryCode),
    // então o bloqueio de "em uso" precisa ser checado manualmente.
    const companiesUsingCountry = await prisma.company.count({ where: { countryCode: country.code } })
    if (companiesUsingCountry > 0) {
      return {
        success: false,
        error: `Existem ${companiesUsingCountry} empresa(s) cadastradas com este país. Desative-o em vez de excluir.`
      }
    }

    await prisma.country.delete({ where: { id } })

    revalidatePath('/admin/paises')
    await logAudit({ action: 'country.delete', entityType: 'Country', entityId: id, details: `${country.name} (${country.code})` })
    return { success: true }
  } catch (error) {
    console.error('Erro ao excluir país:', error)
    return { success: false, error: 'Falha ao excluir país' }
  }
}

export async function toggleCountryActive(id: string, active: boolean) {
  const session = await auth()
  if (!session || (session.user as any).role !== 'SUPER_ADMIN') {
    return { success: false, error: 'Não autorizado. Apenas Super Admins podem gerenciar países.' }
  }

  try {
    await prisma.country.update({ where: { id }, data: { active } })
    revalidatePath('/admin/paises')
    await logAudit({ action: active ? 'country.activate' : 'country.deactivate', entityType: 'Country', entityId: id })
    return { success: true }
  } catch (error) {
    console.error('Erro ao alterar status do país:', error)
    return { success: false, error: 'Falha ao alterar status' }
  }
}

/**
 * Popula a tabela Country a partir dos dados estáticos legados (lib/countries-list.ts +
 * lib/countries-data.ts), preservando a bandeira já curada quando existir.
 * Idempotente: nunca sobrescreve uma bandeira já definida manualmente por um admin.
 * Semeia apenas EU/MERCOSUL — países "Convidados" são cadastrados manualmente.
 */
export async function seedInitialCountries() {
  const session = await auth()
  if (!session || (session.user as any).role !== 'SUPER_ADMIN') {
    return { success: false, error: 'Não autorizado. Apenas Super Admins podem gerenciar países.' }
  }

  try {
    const flagByCode = new Map(countriesData.map(c => [c.id, c.flagPath]))

    let order = 0
    for (const c of countriesList) {
      const group = c.bloc === 'Mercosul' ? 'MERCOSUL' : 'EU'
      const slug = generateSlug(c.name)
      const flagUrl = flagByCode.get(c.code) || null
      const currentOrder = order++

      const existing = await prisma.country.findUnique({ where: { code: c.code } })

      await prisma.country.upsert({
        where: { code: c.code },
        update: {
          name: c.name,
          name_en: c.name_en,
          name_es: c.name_es,
          slug,
          group,
          ddi: c.ddi,
          order: currentOrder,
          // Nunca sobrescreve uma bandeira já existente (definida manualmente ou por uma sincronização anterior)
          ...(existing?.flagUrl ? {} : { flagUrl }),
        },
        create: {
          code: c.code,
          name: c.name,
          name_en: c.name_en,
          name_es: c.name_es,
          slug,
          group,
          ddi: c.ddi,
          flagUrl,
          order: currentOrder,
        }
      })
    }

    revalidatePath('/admin/paises')
    await logAudit({ action: 'country.seed', entityType: 'Country', details: `${countriesList.length} países sincronizados` })
    return { success: true }
  } catch (error) {
    console.error('Erro ao sincronizar países:', error)
    return { success: false, error: 'Falha ao sincronizar países. Verifique o console.' }
  }
}

/**
 * Importa o "perfil" de cada país (descrição, destaque, CTA, economia, setores de destaque,
 * riquezas naturais e comércio exterior) a partir dos arquivos estáticos legados
 * (lib/countries-data.ts + lib/reports-data.ts) para a tabela Country.
 *
 * Idempotente e defensivo: só atualiza países que já existem no banco (via seedInitialCountries)
 * e só preenche um campo se ele ainda estiver vazio — nunca sobrescreve uma edição manual feita
 * no admin. Pode ser executada quantas vezes forem necessárias sem risco.
 */
export async function migrateLegacyCountryProfiles() {
  const session = await auth()
  if (!session || (session.user as any).role !== 'SUPER_ADMIN') {
    return { success: false, error: 'Não autorizado. Apenas Super Admins podem gerenciar países.' }
  }

  try {
    let updated = 0

    for (const opportunity of countriesData) {
      const existing = await prisma.country.findUnique({ where: { code: opportunity.id } })
      if (!existing) continue

      const report = reportsData[opportunity.id]

      const fill = <T>(current: T | null | undefined, incoming: T | undefined): T | undefined =>
        (current === null || current === undefined || current === '') && incoming !== undefined ? incoming : undefined

      const fillArray = (current: string[] | undefined, incoming: string[] | undefined): string[] | undefined =>
        (!current || current.length === 0) && incoming && incoming.length > 0 ? incoming : undefined

      const data: Record<string, unknown> = {
        description: fill(existing.description, opportunity.description),
        description_en: fill(existing.description_en, opportunity.description_en),
        description_es: fill(existing.description_es, opportunity.description_es),
        highlight: fill(existing.highlight, opportunity.highlight),
        highlight_en: fill(existing.highlight_en, opportunity.highlight_en),
        highlight_es: fill(existing.highlight_es, opportunity.highlight_es),
        ctaTitle: fill(existing.ctaTitle, opportunity.ctaTitle),
        ctaTitle_en: fill(existing.ctaTitle_en, opportunity.ctaTitle_en),
        ctaTitle_es: fill(existing.ctaTitle_es, opportunity.ctaTitle_es),
        ctaDescription: fill(existing.ctaDescription, opportunity.ctaDescription),
        ctaDescription_en: fill(existing.ctaDescription_en, opportunity.ctaDescription_en),
        ctaDescription_es: fill(existing.ctaDescription_es, opportunity.ctaDescription_es),
        gdp: fill(existing.gdp, opportunity.metrics?.gdp),
        growth: fill(existing.growth, opportunity.metrics?.growth),
        mainSector: fill(existing.mainSector, opportunity.metrics?.mainSector),
        mainSector_en: fill(existing.mainSector_en, opportunity.metrics?.mainSector_en),
        mainSector_es: fill(existing.mainSector_es, opportunity.metrics?.mainSector_es),
        taxRate: fill(existing.taxRate, opportunity.metrics?.taxRate),
      }

      if (report) {
        if (!existing.sectors || (Array.isArray(existing.sectors) && existing.sectors.length === 0)) {
          data.sectors = report.sectors
        }
        data.naturalRiches = fillArray(existing.naturalRiches, report.naturalRiches)
        data.naturalRiches_en = fillArray(existing.naturalRiches_en, report.naturalRiches_en)
        data.naturalRiches_es = fillArray(existing.naturalRiches_es, report.naturalRiches_es)
        data.exports = fillArray(existing.exports, report.trade.exports)
        data.exports_en = fillArray(existing.exports_en, report.trade.exports_en)
        data.exports_es = fillArray(existing.exports_es, report.trade.exports_es)
        data.imports = fillArray(existing.imports, report.trade.imports)
        data.imports_en = fillArray(existing.imports_en, report.trade.imports_en)
        data.imports_es = fillArray(existing.imports_es, report.trade.imports_es)
      }

      const changes = Object.fromEntries(Object.entries(data).filter(([, v]) => v !== undefined))
      if (Object.keys(changes).length === 0) continue

      await prisma.country.update({ where: { id: existing.id }, data: changes })
      updated++
    }

    revalidatePath('/admin/paises')
    await logAudit({ action: 'country.migrate_profile', entityType: 'Country', details: `${updated} país(es) atualizado(s) com dados legados` })
    return { success: true, updated }
  } catch (error) {
    console.error('Erro ao importar perfis legados:', error)
    return { success: false, error: 'Falha ao importar perfis legados. Verifique o console.' }
  }
}

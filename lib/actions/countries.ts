'use server'

import { revalidatePath } from 'next/cache'
import prisma from '@/lib/prisma'
import { z } from 'zod'
import { auth } from '@/lib/auth'
import { logAudit } from '@/lib/audit'
import { countriesList } from '@/lib/countries-list'
import { countriesData } from '@/lib/countries-data'

const CountrySchema = z.object({
  code: z.string().trim().toUpperCase().length(2, 'Código ISO deve ter 2 letras'),
  name: z.string().min(2, 'Nome é obrigatório'),
  name_en: z.string().optional().nullable(),
  name_es: z.string().optional().nullable(),
  group: z.enum(['EU', 'MERCOSUL', 'GUEST']),
  ddi: z.string().min(1, 'DDI é obrigatório').max(5),
  flagUrl: z.string().optional().nullable(),
  order: z.number().default(0),
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
  if (!session) return { success: false, error: 'Não autorizado' }

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
  if (!session) return { success: false, error: 'Não autorizado' }

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
  if (!session) return { success: false, error: 'Não autorizado' }

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
  if (!session) return { success: false, error: 'Não autorizado' }

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
  if (!session) return { success: false, error: 'Não autorizado' }

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
  if (!session) return { success: false, error: 'Não autorizado' }

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

"use server"

import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { auth } from "@/lib/auth"
import { logAudit } from "@/lib/audit"

export async function getSettings() {
  const session = await auth()
  if (!session) return { success: false, error: "Não autorizado" }

  try {
    const settings = await prisma.platformSetting.findMany()
    // Transformar array de {key, value} em um objeto { key: value }
    const settingsObj = settings.reduce((acc, curr) => {
      acc[curr.key] = curr.value
      return acc
    }, {} as Record<string, string>)
    
    return { success: true, settings: settingsObj }
  } catch (error) {
    console.error("Erro ao buscar configurações:", error)
    return { success: false, error: "Falha ao carregar configurações" }
  }
}

export async function updateSettings(data: Record<string, string>) {
  const session = await auth()
  if (!session || (session.user as any).role !== 'SUPER_ADMIN') {
    return { success: false, error: "Não autorizado. Apenas Super Admins podem alterar configurações." }
  }

  const ALLOWED_SETTING_KEYS = [
    'PLATFORM_NAME', 'PLATFORM_FAVICON', 'META_TITLE', 'META_DESCRIPTION',
    'PRIMARY_COLOR', 'SECONDARY_COLOR', 'CONTACT_WHATSAPP', 'CONTACT_EMAIL',
    'HERO_TITLE', 'HERO_SUBTITLE', 'AUTO_APPROVE',
  ]

  try {
    const filteredEntries = Object.entries(data).filter(([key]) => ALLOWED_SETTING_KEYS.includes(key))
    const promises = filteredEntries.map(([key, value]) => {
      return prisma.platformSetting.upsert({
        where: { key },
        update: { value },
        create: { key, value }
      })
    })

    await Promise.all(promises)
    
    // Revalidar o site inteiro para aplicar o novo favicon/meta-dados
    revalidatePath("/", "layout")
    revalidatePath("/admin/configuracoes")
    await logAudit({ action: 'settings.update', entityType: 'PlatformSetting', details: filteredEntries.map(([k]) => k).join(', ') })
    return { success: true }
  } catch (error) {
    console.error("Erro ao salvar configurações:", error)
    return { success: false, error: "Falha ao salvar configurações" }
  }
}

const PUBLIC_SETTING_KEYS = [
  'PLATFORM_NAME', 'PLATFORM_FAVICON', 'META_TITLE', 'META_DESCRIPTION',
  'PRIMARY_COLOR', 'SECONDARY_COLOR', 'CONTACT_WHATSAPP', 'CONTACT_EMAIL',
  'HERO_TITLE', 'HERO_SUBTITLE',
]

export async function getPublicSettings() {
  try {
    const settings = await prisma.platformSetting.findMany({
      where: { key: { in: PUBLIC_SETTING_KEYS } }
    })
    return settings.reduce((acc, curr) => {
      acc[curr.key] = curr.value
      return acc
    }, {} as Record<string, string>)
  } catch (error) {
    return {}
  }
}

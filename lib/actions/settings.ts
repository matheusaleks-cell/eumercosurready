"use server"

import prisma from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { auth } from "@/lib/auth"

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
  if (!session) return { success: false, error: "Não autorizado" }

  try {
    const promises = Object.entries(data).map(([key, value]) => {
      return prisma.platformSetting.upsert({
        where: { key },
        update: { value },
        create: { key, value }
      })
    })

    await Promise.all(promises)
    
    revalidatePath("/admin/configuracoes")
    return { success: true }
  } catch (error) {
    console.error("Erro ao salvar configurações:", error)
    return { success: false, error: "Falha ao salvar configurações" }
  }
}

export async function getPublicSettings() {
  try {
    const settings = await prisma.platformSetting.findMany()
    return settings.reduce((acc, curr) => {
      acc[curr.key] = curr.value
      return acc
    }, {} as Record<string, string>)
  } catch (error) {
    return {}
  }
}

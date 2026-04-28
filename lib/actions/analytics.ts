"use server"

import prisma from "@/lib/prisma"
import { AuditStatus } from "@prisma/client"
import { auth } from "@/lib/auth"

export async function incrementCompanyView(companyId: string) {
  try {
    // Incrementa o contador global e salva registro histórico em paralelo
    // Incrementa o contador global
    await prisma.company.update({
      where: { id: companyId },
      data: { views: { increment: 1 } }
    })

    // Tenta salvar registro histórico se o modelo existir (evita erro de Prisma Client desatualizado)
    if ((prisma as any).companyView) {
      await (prisma as any).companyView.create({
        data: { companyId }
      }).catch((e: any) => console.error("Erro ao salvar histórico de views:", e))
    }
  } catch (error) {
    console.error("Erro ao incrementar visualização:", error)
  }
}

export async function getTopCompanies(limit = 5) {
  try {
    return await prisma.company.findMany({
      where: { 
        status: "ACTIVE" 
      },
      orderBy: { 
        views: "desc" 
      },
      take: limit,
      include: {
        sector: true
      }
    })
  } catch (error) {
    console.error("Erro ao buscar ranking de empresas:", error)
    return []
  }
}

export async function updateAuditStatus(companyId: string, status: AuditStatus, notes?: string) {
  const session = await auth()
  if (!session) return { success: false, error: 'Não autorizado' }

  try {
    return await prisma.company.update({
      where: { id: companyId },
      data: { 
        auditStatus: status,
        verificationNotes: notes
      }
    })
  } catch (error) {
    console.error("Erro ao atualizar status de auditoria:", error)
    throw new Error("Falha ao atualizar auditoria.")
  }
}

export async function getDashboardStats() {
  const session = await auth()
  if (!session) return { success: false, error: "Não autorizado" }

  try {
    const [totalCompanies, pendingRequests, activeSectors] = await Promise.all([
      prisma.company.count({ where: { status: "ACTIVE" } }),
      prisma.contactRequest.count({ where: { status: "PENDING" } }),
      prisma.sector.count()
    ])

    return {
      totalCompanies,
      pendingRequests,
      activeSectors
    }
  } catch (error) {
    console.error("Erro ao carregar estatísticas do dashboard:", error)
    return {
      totalCompanies: 0,
      pendingRequests: 0,
      activeSectors: 0
    }
  }
}

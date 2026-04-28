"use server"

import prisma from "@/lib/prisma"

export async function exportCompaniesToCSV() {
  try {
    const companies = await prisma.company.findMany({
      include: { sector: true },
      orderBy: { name: 'asc' }
    })

    const header = ["ID", "Nome", "Slug", "Pais", "Setor", "Status", "Audit", "Views", "Criado Em"]
    const rows = companies.map(c => [
      c.id,
      c.name,
      c.slug,
      c.country,
      c.sector.name,
      c.status,
      c.auditStatus,
      c.views,
      c.createdAt.toISOString()
    ])

    const csvContent = [
      header.join(','),
      ...rows.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','))
    ].join('\n')

    return { success: true, csv: csvContent }
  } catch (error) {
    console.error("Erro ao exportar empresas:", error)
    return { success: false, error: "Falha ao exportar dados" }
  }
}

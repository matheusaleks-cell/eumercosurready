import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  const sectors = [
    { name: "Agronegócio", slug: "agronegocio", icon: "🌱" },
    { name: "Tecnologia & IA", slug: "tecnologia-ia", icon: "🤖" },
    { name: "Alimentos & Bebidas", slug: "alimentos-bebidas", icon: "🍷" },
    { name: "Logística & Supply Chain", slug: "logistica-supply-chain", icon: "📦" },
    { name: "Serviços Financeiros", slug: "servicos-financeiros", icon: "💰" },
    { name: "Construção Civil & Real Estate", slug: "construcao-civil", icon: "🏗️" },
    { name: "Energias Renováveis", slug: "energias-renovaveis", icon: "⚡" },
    { name: "Saúde & Farmacêutico", slug: "saude-farmaceutico", icon: "🏥" },
    { name: "Moda & Têxtil", slug: "moda-textil", icon: "👕" },
    { name: "Turismo & Hospitalidade", slug: "turismo-hospitalidade", icon: "✈️" },
    { name: "Educação & EdTech", slug: "educacao-edtech", icon: "🎓" },
    { name: "Serviços de Consultoria", slug: "consultoria", icon: "🤝" },
    { name: "Indústria Manufatureira", slug: "industria-manufatureira", icon: "🏭" },
    { name: "Mineração & Metais", slug: "mineracao-metais", icon: "⛏️" }
  ]

  console.log('Seed de setores iniciado...')

  for (const s of sectors) {
    const existing = await prisma.sector.findFirst({
      where: {
        OR: [
          { name: s.name },
          { slug: s.slug }
        ]
      }
    })

    if (existing) {
      await prisma.sector.update({
        where: { id: existing.id },
        data: { name: s.name, slug: s.slug, icon: s.icon }
      })
      console.log(`Atualizado: ${s.name}`)
    } else {
      await prisma.sector.create({
        data: { name: s.name, slug: s.slug, icon: s.icon }
      })
      console.log(`Criado: ${s.name}`)
    }
  }

  console.log('Seed de setores concluído com sucesso!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

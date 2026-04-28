import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  const sectors = await prisma.sector.findMany()
  console.log(JSON.stringify(sectors, null, 2))
}

main().catch(console.error).finally(() => prisma.$disconnect())

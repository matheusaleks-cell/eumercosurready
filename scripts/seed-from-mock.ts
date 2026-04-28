import { PrismaClient, Region, CompanyStatus, AuditStatus } from '@prisma/client'
import { companiesData } from '../lib/companies-data'

const prisma = new PrismaClient()

async function main() {
  console.log('Iniciando seed completo a partir do Mock...')

  for (const mockCompany of companiesData) {
    // 1. Garantir que o Setor existe
    let sector = await prisma.sector.findUnique({
      where: { name: mockCompany.sector.name }
    })
    
    if (!sector) {
      sector = await prisma.sector.create({
        data: {
          name: mockCompany.sector.name,
          slug: mockCompany.sector.name.toLowerCase().replace(/\s+/g, '-'),
          icon: '🏢',
          order: 99
        }
      })
    }

    // 2. Map verificationLevel -> AuditStatus
    let auditStatus: AuditStatus = AuditStatus.NONE
    if (mockCompany.verificationLevel) {
      const lvl = mockCompany.verificationLevel.toUpperCase()
      if (lvl === 'OURO' || lvl === 'GOLD') auditStatus = AuditStatus.GOLD
      else if (lvl === 'PRATA' || lvl === 'SILVER') auditStatus = AuditStatus.SILVER
      else if (lvl === 'BRONZE') auditStatus = AuditStatus.BRONZE
    }

    // 3. Upsert Empresa
    const company = await prisma.company.upsert({
      where: { slug: mockCompany.slug },
      update: {
        logoUrl: mockCompany.logoUrl,
        bannerUrl: mockCompany.bannerUrl,
        country: mockCompany.country,
        countryCode: mockCompany.countryCode,
        region: mockCompany.region === 'EU' ? Region.EU : Region.MERCOSUL,
        sectorId: sector.id,
        shortDescription: mockCompany.shortDescription,
        fullDescription: mockCompany.fullDescription,
        website: mockCompany.website || '',
        email: mockCompany.email,
        phone: mockCompany.phone,
        linkedin: mockCompany.socialLinks?.linkedin,
        instagram: mockCompany.socialLinks?.instagram,
        facebook: mockCompany.socialLinks?.facebook,
        twitter: mockCompany.socialLinks?.twitter,
        auditStatus,
        featured: mockCompany.featured || false,
        status: CompanyStatus.ACTIVE,
      },
      create: {
        name: mockCompany.name,
        slug: mockCompany.slug,
        logoColor: mockCompany.logoColor || '#003399',
        logoUrl: mockCompany.logoUrl,
        bannerUrl: mockCompany.bannerUrl,
        country: mockCompany.country,
        countryCode: mockCompany.countryCode,
        region: mockCompany.region === 'EU' ? Region.EU : Region.MERCOSUL,
        sectorId: sector.id,
        shortDescription: mockCompany.shortDescription,
        fullDescription: mockCompany.fullDescription,
        website: mockCompany.website || '',
        email: mockCompany.email,
        phone: mockCompany.phone,
        linkedin: mockCompany.socialLinks?.linkedin,
        instagram: mockCompany.socialLinks?.instagram,
        facebook: mockCompany.socialLinks?.facebook,
        twitter: mockCompany.socialLinks?.twitter,
        auditStatus,
        featured: mockCompany.featured || false,
        status: CompanyStatus.ACTIVE,
      }
    })

    console.log(`✅ Upserted company: ${company.name}`)

    // 4. Inserir Produtos
    if (mockCompany.products && mockCompany.products.length > 0) {
      for (const prod of mockCompany.products) {
        await prisma.product.create({
          data: {
            companyId: company.id,
            title: prod.title,
            slug: prod.slug,
            description: prod.description,
            imageUrl: prod.imageUrl,
            category: prod.category,
            moq: prod.moq,
            incoterms: prod.incoterms ? (Array.isArray(prod.incoterms) ? prod.incoterms.join(', ') : prod.incoterms) : null,
            leadTime: prod.leadTime,
            portOfOrigin: prod.portOfOrigin,
            productionCapacity: prod.productionCapacity,
            isReadyToShip: prod.isReadyToShip || false,
            isLowMOQ: prod.isLowMOQ || false,
            isCertified: prod.isCertified || false,
            isSustainable: prod.isSustainable || false,
          }
        })
      }
      console.log(`   📦 Adicionados ${mockCompany.products.length} produtos para ${company.name}`)
    }
  }

  console.log('🎉 Seed completo finalizado com sucesso!')
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

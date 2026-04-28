// prisma/seed.ts
import { PrismaClient, Region, CompanyStatus, AdminRole } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('Iniciando seed...')

  // 1. Criar Admin Padrão
  const adminPassword = await bcrypt.hash('Admin@2025!', 12)
  await prisma.adminUser.upsert({
    where: { email: 'admin@madeinatlantic.com' },
    update: {},
    create: {
      email: 'admin@madeinatlantic.com',
      username: 'admin',
      name: 'Super Admin',
      passwordHash: adminPassword,
      role: AdminRole.SUPER_ADMIN,
    },
  })
  console.log('Admin criado.')

  // 2. Criar Setores Padrão
  const sectorsData = [
    { name: 'Tecnologia', slug: 'tecnologia', icon: '💻', order: 1 },
    { name: 'Agronegócio', slug: 'agronegocio', icon: '🌾', order: 2 },
    { name: 'Alimentos & Bebidas', slug: 'alimentos-bebidas', icon: '🍷', order: 3 },
    { name: 'Financeiro', slug: 'financeiro', icon: '📊', order: 4 },
    { name: 'Logística', slug: 'logistica', icon: '🚢', order: 5 },
    { name: 'Saúde', slug: 'saude', icon: '🏥', order: 6 },
    { name: 'Energia', slug: 'energia', icon: '⚡', order: 7 },
    { name: 'Jurídico', slug: 'juridico', icon: '⚖️', order: 8 },
    { name: 'Indústria', slug: 'industria', icon: '🏭', order: 9 },
    { name: 'Educação', slug: 'educacao', icon: '🎓', order: 10 },
    { name: 'Turismo', slug: 'turismo', icon: '✈️', order: 11 },
    { name: 'Moda & Design', slug: 'moda-design', icon: '👗', order: 12 },
  ]

  for (const sector of sectorsData) {
    await prisma.sector.upsert({
      where: { name: sector.name },
      update: {},
      create: sector,
    })
  }
  console.log('Setores criados.')

  // Buscar IDs dos setores criados para associar às empresas
  const techSector = await prisma.sector.findUnique({ where: { name: 'Tecnologia' } })
  const agroSector = await prisma.sector.findUnique({ where: { name: 'Agronegócio' } })
  const foodSector = await prisma.sector.findUnique({ where: { name: 'Alimentos & Bebidas' } })
  const finSector = await prisma.sector.findUnique({ where: { name: 'Financeiro' } })
  const logSector = await prisma.sector.findUnique({ where: { name: 'Logística' } })
  const healthSector = await prisma.sector.findUnique({ where: { name: 'Saúde' } })
  const energySector = await prisma.sector.findUnique({ where: { name: 'Energia' } })
  const lawSector = await prisma.sector.findUnique({ where: { name: 'Jurídico' } })

  // 3. Criar 10 Empresas Exemplo
  // Nota: countryCode e region devem bater
  const companies = [
    {
      name: 'TechLisboa', slug: 'techlisboa', country: 'Portugal', countryCode: 'PT', region: Region.EU,
      sectorId: techSector!.id, status: CompanyStatus.FEATURED, featured: true,
      shortDescription: 'Inovação tecnológica no coração de Lisboa.',
      fullDescription: 'Empresa especializada em desenvolvimento de software e IA sediada em Portugal.'
    },
    {
      name: 'Iberfinance', slug: 'iberfinance', country: 'Espanha', countryCode: 'ES', region: Region.EU,
      sectorId: finSector!.id, status: CompanyStatus.ACTIVE,
      shortDescription: 'Soluções financeiras transatlânticas.',
      fullDescription: 'Consultoria financeira focada em investimentos entre Europa e América Latina.'
    },
    {
      name: 'NordLogistics', slug: 'nordlogistics', country: 'Alemanha', countryCode: 'DE', region: Region.EU,
      sectorId: logSector!.id, status: CompanyStatus.ACTIVE,
      shortDescription: 'Eficiência logística europeia.',
      fullDescription: 'Gestão de cadeia de suprimentos e transporte internacional.'
    },
    {
      name: 'CleanEnergia', slug: 'cleanenergia', country: 'França', countryCode: 'FR', region: Region.EU,
      sectorId: energySector!.id, status: CompanyStatus.ACTIVE,
      shortDescription: 'Energias renováveis para um futuro sustentável.',
      fullDescription: 'Desenvolvimento de parques solares e eólicos na Europa.'
    },
    {
      name: 'LegalBridge', slug: 'legalbridge', country: 'Itália', countryCode: 'IT', region: Region.EU,
      sectorId: lawSector!.id, status: CompanyStatus.ACTIVE,
      shortDescription: 'Sua ponte jurídica no Mercosul.',
      fullDescription: 'Escritório de advocacia internacional especializado em comércio exterior.'
    },
    {
      name: 'AgroSul Brasil', slug: 'agrosul-brasil', country: 'Brasil', countryCode: 'BR', region: Region.MERCOSUL,
      sectorId: agroSector!.id, status: CompanyStatus.FEATURED, featured: true,
      shortDescription: 'O melhor do agronegócio brasileiro.',
      fullDescription: 'Exportadora de grãos e tecnologia agrícola de ponta.'
    },
    {
      name: 'Pampa Carnes', slug: 'pampa-carnes', country: 'Argentina', countryCode: 'AR', region: Region.MERCOSUL,
      sectorId: foodSector!.id, status: CompanyStatus.ACTIVE,
      shortDescription: 'Carnes premium da Patagônia.',
      fullDescription: 'Produção e exportação de carnes bovinas de alta qualidade.'
    },
    {
      name: 'MedTech Uruguay', slug: 'medtech-uruguay', country: 'Uruguai', countryCode: 'UY', region: Region.MERCOSUL,
      sectorId: healthSector!.id, status: CompanyStatus.ACTIVE,
      shortDescription: 'Inovação em saúde no Cone Sul.',
      fullDescription: 'Desenvolvimento de dispositivos médicos e serviços digitais de saúde.'
    },
    {
      name: 'Mate & Co', slug: 'mate-co', country: 'Paraguai', countryCode: 'PY', region: Region.MERCOSUL,
      sectorId: foodSector!.id, status: CompanyStatus.ACTIVE,
      shortDescription: 'Tradição em erva-mate.',
      fullDescription: 'Exportação de produtos derivados de erva-mate para o mercado global.'
    },
    {
      name: 'VinhoFino', slug: 'vinhofino', country: 'Portugal', countryCode: 'PT', region: Region.EU,
      sectorId: foodSector!.id, status: CompanyStatus.PENDING,
      shortDescription: 'Vinhos selecionados das melhores regiões.',
      fullDescription: 'Curadoria de vinhos premium portugueses para exportação.'
    },
  ]

  for (const company of companies) {
    await prisma.company.upsert({
      where: { slug: company.slug },
      update: {},
      create: {
        ...company,
        logoColor: '#003399'
      },
    })
  }

  console.log('Empresas criadas.')
  console.log('Seed finalizado com sucesso!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

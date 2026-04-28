import { HeroSection } from '@/components/public/HeroSection'
import { BusinessesSection } from '@/components/public/BusinessesSection'
import { OpportunitiesSection } from '@/components/public/OpportunitiesSection'
import { CallToAction } from '@/components/public/CallToAction'
import prisma from '@/lib/prisma'

export const revalidate = 0 // Força renderização dinâmica para testes

export default async function HomePage() {
  let dbError = null
  let companiesData: any[] = []
  try {
    companiesData = await prisma.company.findMany({
      where: {}, // Removido filtro de status para teste de conexão
      select: {
        id: true,
        name: true,
        slug: true,
        logoUrl: true,
        bannerUrl: true,
        logoColor: true,
        country: true,
        countryCode: true,
        region: true,
        shortDescription: true,
        shortDescription_en: true,
        shortDescription_es: true,
        status: true,
        auditStatus: true,
        featured: true,
        createdAt: true,
        updatedAt: true,
        publishedAt: true,
        sector: {
          select: {
            id: true,
            name: true,
            name_en: true,
            name_es: true
          }
        }
      },
      orderBy: [
        { featured: 'desc' }, // Destaques primeiro
        { name: 'asc' }
      ]
    })
  } catch (error: any) {
    console.error("Erro crítico ao carregar empresas:", error)
    dbError = error.message || "Erro desconhecido de conexão"
    companiesData = []
  }

  // Evitar vazamento de dados sensíveis ou Date objectos que quebram o Client Component
  const safeCompanies = companiesData.map(c => ({
    id: c.id,
    name: c.name,
    slug: c.slug,
    logoUrl: c.logoUrl,
    bannerUrl: c.bannerUrl,
    logoColor: c.logoColor,
    country: c.country,
    countryCode: c.countryCode,
    region: c.region,
    shortDescription: c.shortDescription,
    shortDescription_en: c.shortDescription_en,
    shortDescription_es: c.shortDescription_es,
    status: c.status,
    auditStatus: c.auditStatus,
    featured: c.featured,
    sector: c.sector ? {
      id: c.sector.id,
      name: c.sector.name,
      name_en: c.sector.name_en,
      name_es: c.sector.name_es
    } : null
  }))

  return (
    <div className="flex flex-col">
      <HeroSection />
      
      <main className="flex-grow">
        {dbError && (
          <div className="container-custom py-4">
            <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-lg text-xs font-mono">
              <strong>DEBUG DB ERROR:</strong> {dbError}
            </div>
          </div>
        )}
        {/* Restaurando o container para que os filtros não fiquem gigantes */}
        <div className="container-custom relative z-30">
          <BusinessesSection initialCompanies={safeCompanies as any} />
        </div>
        
        <OpportunitiesSection />
        <CallToAction />
      </main>
    </div>
  )
}

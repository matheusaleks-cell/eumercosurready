import { HeroSection } from '@/components/public/HeroSection'
import { BusinessesSection } from '@/components/public/BusinessesSection'
import { OpportunitiesSection } from '@/components/public/OpportunitiesSection'
import { CallToAction } from '@/components/public/CallToAction'
import prisma from '@/lib/prisma'

export const revalidate = 0 // Força renderização dinâmica para testes

export default async function HomePage() {
  // Buscar todas as empresas publicadas no banco de dados real
  const companiesData = await prisma.company.findMany({
    where: {
      status: 'ACTIVE'
    },
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

  // Evitar vazamento de dados sensíveis ou Date objectos que quebram o Client Component
  // Serializamos a data e excluímos notas internas
  const safeCompanies = companiesData.map(c => ({
    ...c,
    createdAt: c.createdAt.toISOString(),
    updatedAt: c.updatedAt.toISOString(),
    publishedAt: c.publishedAt?.toISOString() || null,
    internalNotes: undefined,
    verificationNotes: undefined
  }))
  return (
    <main className="min-h-screen">
      <HeroSection />
      
      {/* Sistema de Vitrine com Filtros Funcionais Premium */}
      <div className="container-custom relative z-30">
        <BusinessesSection initialCompanies={safeCompanies as any} />
      </div>

      {/* Seção Interativa: Conheça as Oportunidades */}
      <OpportunitiesSection />

      {/* Seção de Chamada para Ação (CTA) Personalizada */}
      <CallToAction />
    </main>
  )
}

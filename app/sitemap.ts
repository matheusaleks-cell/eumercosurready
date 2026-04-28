import { MetadataRoute } from 'next'
export const dynamic = 'force-dynamic'
import prisma from '@/lib/prisma'
import { countriesData } from '@/lib/countries-data'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://eumercosurready.com'

  // Rotas estáticas principais
  const staticRoutes = [
    '',
    '/sobre',
    '/solicitar-cadastro',
    '/login',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1 : 0.8,
  }))

  // Rotas dinâmicas de países
  const countryRoutes = countriesData.map((country) => ({
    url: `${baseUrl}/pais/${country.slug}`,
    lastModified: new Date(),
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))

  // Rotas dinâmicas de empresas
  const companies = await prisma.company.findMany({
    where: { status: 'ACTIVE' },
    select: { slug: true, updatedAt: true }
  })

  const companyRoutes = companies.map((company) => ({
    url: `${baseUrl}/empresa/${company.slug}`,
    lastModified: company.updatedAt,
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }))

  return [...staticRoutes, ...countryRoutes, ...companyRoutes]
}

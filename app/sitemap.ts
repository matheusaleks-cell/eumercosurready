import { MetadataRoute } from 'next'
export const dynamic = 'force-dynamic'
import prisma from '@/lib/prisma'
import { getPublicCountries } from '@/lib/actions/countries'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://eumercosurready.com'
  const countries = await getPublicCountries()

  // Rotas estáticas principais
  const staticRoutes = [
    '',
    '/sobre',
    '/solicitar-cadastro',
    '/aviso-legal',
    '/politica-de-cookies',
    '/politica-de-privacidade',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1 : 0.8,
  }))

  // Rotas dinâmicas de países
  const countryRoutes = countries.map((country) => ({
    url: `${baseUrl}/pais/${country.slug}`,
    lastModified: country.updatedAt,
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

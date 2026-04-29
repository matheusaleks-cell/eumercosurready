import React from 'react'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { 
  ChevronLeft, 
  Globe, 
  BarChart3, 
  TrendingUp, 
  Briefcase, 
  ArrowRight,
  Target,
  Ship,
  TrendingDown,
  Info
} from 'lucide-react'
import { countriesData } from '@/lib/countries-data'
import { reportsData } from '@/lib/reports-data'
import { SafeImage } from '@/components/public/SafeImage'
import { cn } from '@/lib/utils'
import { Metadata } from 'next'

import { cookies } from 'next/headers'

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const cookieStore = await cookies()
  const language = cookieStore.get('mr-language')?.value || 'pt'
  
  const country = countriesData.find(c => c.slug === slug)
  if (!country) return { title: 'País não encontrado' }

  const t = (pt: string, en?: string | null, es?: string | null) => {
    if (language === 'en' && en) return en
    if (language === 'es' && es) return es
    return pt
  }

  const name = t(country.name, country.name_en, country.name_es)
  const desc = t(country.description, country.description_en, country.description_es)

  return {
    title: `${name} - ${t('Oportunidades B2B', 'B2B Opportunities', 'Oportunidades B2B')} | EU-Mercosur Ready`,
    description: desc,
    openGraph: {
      title: `${name} - ${t('Plataforma de Negócios Internacionais', 'International Business Platform', 'Plataforma de Negocios Internacionales')}`,
      description: desc,
      images: [country.flagPath],
    }
  }
}

export default async function CountryProfilePage({ params }: PageProps) {
  const { slug } = await params
  const cookieStore = await cookies()
  const language = cookieStore.get('mr-language')?.value || 'pt'

  const t = (pt: string, en?: string | null, es?: string | null) => {
    if (language === 'en' && en) return en
    if (language === 'es' && es) return es
    return pt
  }
  
  const ta = (pt: string[], en?: string[] | null, es?: string[] | null) => {
    if (language === 'en' && en && en.length > 0) return en
    if (language === 'es' && es && es.length > 0) return es
    return pt
  }

  // Buscar o país pelo slug
  const country = countriesData.find(c => c.slug === slug)
  
  if (!country) {
    notFound()
  }

  // Buscar o relatório correspondente (pelo ID do país)
  const report = reportsData[country.id]

  return (
    <main className="min-h-screen bg-[var(--color-cream)] pb-20">
      {/* Hero Section Cinematográfica */}
      <section className="relative h-[55vh] min-h-[450px] w-full overflow-hidden bg-[var(--color-navy)]">
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <SafeImage 
            src={country.flagPath} 
            alt={t(country.name, country.name_en, country.name_es)} 
            fill 
            className="object-cover blur-3xl scale-110" 
          />
        </div>
        
        {/* Overlay Gradiente */}
        <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-navy)] via-[var(--color-navy)]/60 to-transparent pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-r from-[var(--color-navy)] via-[var(--color-navy)]/80 to-transparent pointer-events-none" />

        {/* Navbar Simplificada no Hero */}
        <div className="absolute top-0 w-full z-30 p-6 md:p-10">
          <div className="container-custom">
            <Link 
              href="/#oportunidades" 
              className="inline-flex items-center gap-2 text-white/70 hover:text-white transition-colors text-sm font-medium bg-white/5 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 w-fit"
            >
              <ChevronLeft size={16} />
              {t('Voltar para Fronteiras', 'Back to Frontiers', 'Volver a las Fronteras')}
            </Link>
          </div>
        </div>

        {/* Conteúdo do Hero */}
        <div className="absolute bottom-0 w-full z-20 pb-16">
          <div className="container-custom">
            <div className="flex flex-col md:flex-row gap-8 items-start md:items-end">
              {/* Bandeira */}
              <div className="relative w-32 h-24 md:w-48 md:h-32 rounded-2xl overflow-hidden shadow-2xl border-4 border-white/10 shrink-0 bg-white/5">
                <SafeImage 
                  src={country.flagPath} 
                  alt={t(country.name, country.name_en, country.name_es)} 
                  fill 
                  className="object-cover" 
                  fallbackSrc="https://placehold.co/400x300/f3f4f6/9ca3af?text="
                />
              </div>

              {/* Títulos */}
              <div className="space-y-4 flex-1">
                <div className="flex items-center gap-3">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-xs font-bold uppercase tracking-widest text-[var(--color-gold-light)] border border-white/20">
                    <Globe size={12} />
                    {country.region === 'EU' ? t('União Europeia', 'European Union', 'Unión Europea') : 'Mercosul'}
                  </span>
                </div>
                
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-white tracking-tight">
                  {t(country.name, country.name_en, country.name_es)}
                </h1>
                
                <p className="text-base md:text-lg text-gray-300 font-body max-w-2xl leading-relaxed">
                  {t(country.description, country.description_en, country.description_es)}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Grid de Métricas Estratégicas (Flutuando) */}
      <div className="relative z-30 -mt-8">
        <div className="container-custom">
          <div className={cn(
            "bg-white rounded-3xl p-6 md:p-8 shadow-2xl border border-[var(--color-navy)]/5 grid gap-6 divide-y md:divide-y-0 md:divide-x divide-[var(--color-navy)]/5",
            [country.metrics?.gdp, country.metrics?.growth, true].filter(Boolean).length === 3 ? "grid-cols-1 md:grid-cols-3" :
            [country.metrics?.gdp, country.metrics?.growth, true].filter(Boolean).length === 2 ? "grid-cols-1 md:grid-cols-2" : "grid-cols-1"
          )}>
            {country.metrics?.gdp && (
              <div className="px-4 py-2 md:py-0 group">
                <span className="block text-xs uppercase tracking-widest text-gray-400 font-bold mb-2">{t('Produto Interno Bruto (PIB)', 'Gross Domestic Product (GDP)', 'Producto Interno Bruto (PIB)')}</span>
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-[var(--color-gold)]/10 rounded-xl text-[var(--color-gold)] group-hover:scale-110 transition-transform">
                    <BarChart3 size={24} />
                  </div>
                  <span className="text-2xl font-bold text-[var(--color-navy)]">{country.metrics.gdp}</span>
                </div>
              </div>
            )}
            
            {country.metrics?.growth && (
              <div className="px-4 pt-6 md:pt-0 pb-2 md:pb-0 group">
                <span className="block text-xs uppercase tracking-widest text-gray-400 font-bold mb-2">{t('Crescimento Estimado', 'Estimated Growth', 'Crecimiento Estimado')}</span>
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-green-500/10 rounded-xl text-green-500 group-hover:scale-110 transition-transform">
                    <TrendingUp size={24} />
                  </div>
                  <span className="text-2xl font-bold text-[var(--color-navy)]">{country.metrics.growth}</span>
                </div>
              </div>
            )}
            
            <div className="px-4 pt-6 md:pt-0 group">
              <span className="block text-xs uppercase tracking-widest text-gray-400 font-bold mb-2">{t('Setor Principal', 'Main Sector', 'Sector Principal')}</span>
              <div className="flex items-center gap-4">
                <div className="p-3 bg-[var(--color-navy)]/10 rounded-xl text-[var(--color-navy)] group-hover:scale-110 transition-transform">
                  <Briefcase size={24} />
                </div>
                <span className="text-xl font-bold text-[var(--color-navy)] leading-tight">{t(country.metrics?.mainSector || 'Industrial', country.metrics?.mainSector_en, country.metrics?.mainSector_es)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container-custom py-16 space-y-16">
        
        {/* Destaque Comercial */}
        <div className="bg-[var(--color-navy)] text-white rounded-[2.5rem] p-8 md:p-12 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--color-gold)]/20 rounded-full blur-[100px]" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/20 rounded-full blur-[100px]" />
          
          <div className="relative z-10 flex flex-col md:flex-row items-center gap-8 justify-between">
            <div className="space-y-4 max-w-2xl">
              <div className="flex items-center gap-3 text-[var(--color-gold)]">
                <Target size={24} />
                <span className="text-sm font-bold uppercase tracking-widest">{t('Aliança Comercial Estratégica', 'Strategic Trade Alliance', 'Alianza Comercial Estratégica')}</span>
              </div>
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-display font-bold leading-tight">
                {t(
                  `O mercado de ${country.name} busca fornecedores de excelência. Eles vão encontrar você ou seu concorrente?`,
                  `The ${t(country.name, country.name_en, country.name_es)} market is looking for excellent suppliers. Will they find you or your competitor?`,
                  `El mercado de ${t(country.name, country.name_en, country.name_es)} busca proveedores de excelencia. ¿Le encontrarán a usted o a su competidor?`
                )}
              </h2>
              <p className="text-gray-300 font-body text-lg">
                {t(
                  'Expanda as fronteiras da sua empresa. O mercado europeu valoriza marcas preparadas e com documentação validada. Posicione-se como um parceiro de alta confiabilidade.',
                  'Expand your company\'s frontiers. The European market values prepared brands with validated documentation. Position yourself as a highly reliable partner.',
                  'Expanda las fronteras de su empresa. El mercado europeo valora las marcas preparadas y con documentación validada. Posiciónese como un socio de alta confiabilidad.'
                )}
              </p>
            </div>
            <div className="flex flex-col gap-4 w-full sm:w-auto shrink-0">
              <Link href="/solicitar-cadastro" className="btn-premium whitespace-nowrap text-center justify-center">
                <span>{t(`Destacar minha empresa para ${country.name}`, `Highlight my company for ${t(country.name, country.name_en, country.name_es)}`, `Destacar mi empresa para ${t(country.name, country.name_en, country.name_es)}`)}</span>
              </Link>
              <Link 
                href={`/?origin=${country.id}#partners-section`} 
                className="inline-flex items-center justify-center px-8 py-4 rounded-full border border-white/20 bg-white/5 text-white font-bold hover:bg-white/10 transition-all text-sm uppercase tracking-widest"
              >
                <Briefcase className="mr-2" size={18} />
                <span>{t(`Ver Empresas da ${country.name}`, `View Companies from ${t(country.name, country.name_en, country.name_es)}`, `Ver Empresas de ${t(country.name, country.name_en, country.name_es)}`)}</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Relatório Comercial */}
        {report ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Coluna Principal: Setores */}
            <div className="lg:col-span-2 space-y-8">
              <div>
                <h3 className="text-2xl font-display font-bold text-[var(--color-navy)] mb-6 flex items-center gap-3">
                  <Briefcase className="text-[var(--color-gold)]" size={24} />
                  {t('Setores de Destaque', 'Key Sectors', 'Sectores Destacados')}
                </h3>
                <div className="space-y-4">
                  {report.sectors.map((sector, index) => (
                    <div key={index} className="bg-white p-6 rounded-2xl border border-[var(--color-navy)]/5 shadow-sm hover:shadow-md transition-shadow">
                      <h4 className="text-xl font-bold text-[var(--color-navy)] mb-2">{t(sector.title, sector.title_en, sector.title_es)}</h4>
                      <p className="text-gray-600 leading-relaxed font-body">{t(sector.description, sector.description_en, sector.description_es)}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-2xl font-display font-bold text-[var(--color-navy)] mb-6 flex items-center gap-3">
                  <Globe className="text-[var(--color-gold)]" size={24} />
                  {t('Riquezas e Recursos Naturais', 'Natural Resources & Wealth', 'Riquezas y Recursos Naturales')}
                </h3>
                <div className="flex flex-wrap gap-3">
                  {ta(report.naturalRiches, report.naturalRiches_en, report.naturalRiches_es).map((riche, index) => (
                    <span key={index} className="px-5 py-3 bg-white border border-[var(--color-navy)]/5 rounded-xl text-gray-700 font-semibold shadow-sm flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-[var(--color-gold)]" />
                      {riche}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Coluna Lateral: Balança Comercial */}
            <div className="space-y-6">
              <div className="bg-white p-8 rounded-3xl border border-[var(--color-navy)]/5 shadow-sm">
                <h3 className="text-xl font-display font-bold text-[var(--color-navy)] mb-6 flex items-center gap-3">
                  <Ship className="text-[var(--color-gold)]" size={20} />
                  {t('Balança Comercial', 'Trade Balance', 'Balanza Comercial')}
                </h3>
                
                <div className="space-y-8">
                  {/* Exportações */}
                  <div>
                    <h4 className="text-sm font-bold uppercase tracking-widest text-green-600 mb-4 flex items-center gap-2">
                      <TrendingUp size={16} /> {t('Principais Exportações', 'Main Exports', 'Principales Exportaciones')}
                    </h4>
                    <ul className="space-y-3">
                      {ta(report.trade.exports, report.trade.exports_en, report.trade.exports_es).map((item, index) => (
                        <li key={index} className="flex items-center gap-3 text-gray-600 font-body">
                          <div className="w-1.5 h-1.5 rounded-full bg-green-500 shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="h-px w-full bg-gray-100" />

                  {/* Importações */}
                  <div>
                    <h4 className="text-sm font-bold uppercase tracking-widest text-blue-600 mb-4 flex items-center gap-2">
                      <TrendingDown size={16} /> {t('Principais Importações', 'Main Imports', 'Principales Importaciones')}
                    </h4>
                    <ul className="space-y-3">
                      {ta(report.trade.imports, report.trade.imports_en, report.trade.imports_es).map((item, index) => (
                        <li key={index} className="flex items-center gap-3 text-gray-600 font-body">
                          <div className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Estado de Fallback (País sem Relatório Mapeado) */
          <div className="bg-white rounded-3xl p-12 text-center border border-[var(--color-navy)]/5 shadow-sm space-y-6">
            <div className="inline-flex p-4 bg-[var(--color-navy)]/5 rounded-full text-[var(--color-navy)] mb-2">
              <Info size={48} />
            </div>
            <h3 className="text-2xl font-display font-bold text-[var(--color-navy)]">{t('Relatório Detalhado em Construção', 'Detailed Report Under Construction', 'Informe Detallado en Construcción')}</h3>
            <p className="text-gray-500 max-w-xl mx-auto">
              {t(
                `Nossa equipe de inteligência de mercado está mapeando as oportunidades, setores e balança comercial de ${country.name}. Em breve, disponibilizaremos o relatório completo.`,
                `Our market intelligence team is mapping the opportunities, sectors, and trade balance of ${country.name}. Soon, we will provide the full report.`,
                `Nuestro equipo de inteligencia de mercado está mapeando las oportunidades, sectores y balanza comercial de ${country.name}. Próximamente, pondremos a su disposición el informe completo.`
              )}
            </p>
          </div>
        )}

      </div>
    </main>
  )
}

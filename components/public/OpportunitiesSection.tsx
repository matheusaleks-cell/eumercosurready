'use client'
import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Globe, ChevronLeft, ChevronRight, BarChart3, TrendingUp, Briefcase, Target } from 'lucide-react'
import { useLanguage } from '@/hooks/use-language'
import { cn } from '@/lib/utils'
import { SafeImage } from './SafeImage'
import Link from 'next/link'
import type { Country } from '@/types'

type RegionGroup = 'EU' | 'MERCOSUL' | 'GUEST'

interface OpportunitiesSectionProps {
  countries: Country[]
}

export const OpportunitiesSection = ({ countries }: OpportunitiesSectionProps) => {
  const { t } = useLanguage()
  const hasGuestCountries = countries.some(c => c.group === 'GUEST')
  const initialRegion: RegionGroup = countries.some(c => c.group === 'EU')
    ? 'EU'
    : (countries[0]?.group as RegionGroup) || 'EU'
  const [activeRegion, setActiveRegion] = useState<RegionGroup>(initialRegion)
  const [activeId, setActiveId] = useState(
    countries.find(c => c.group === initialRegion)?.code || countries[0]?.code || ''
  )
  const scrollRef = useRef<HTMLDivElement>(null)

  const filteredCountries = countries.filter(c => c.group === activeRegion)
  const currentCountry = countries.find(c => c.code === activeId) || filteredCountries[0]

  const handleRegionChange = (region: RegionGroup) => {
    setActiveRegion(region)
    const firstOfRegion = countries.find(c => c.group === region)
    if (firstOfRegion) setActiveId(firstOfRegion.code)
  }

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current
      const scrollTo = direction === 'left' ? scrollLeft - clientWidth / 2 : scrollLeft + clientWidth / 2
      scrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' })
    }
  }

  return (
    <section id="oportunidades" className="py-24 bg-[var(--color-cream)] relative overflow-hidden">
      {/* Elementos Decorativos de Fundo */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-white/40 skew-x-[-15deg] translate-x-1/4 z-0 pointer-events-none" />

      <div className="container-custom relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          
          {/* Lado Esquerdo: Conteúdo e Seletor */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-10"
          >
            <div className="space-y-5">
              <span className="text-[var(--color-gold)] font-display font-bold uppercase tracking-[0.2em] text-[10px] bg-[var(--color-gold)]/10 px-3 py-1 rounded-full">
                {t('Países do eixo UE-Mercosul', 'EU-Mercosur Axis Countries', 'Países del eje UE-Mercosur')}
              </span>
              <h2 className="text-2xl md:text-4xl font-display font-bold text-[var(--color-navy)] leading-[1.1]">
                {t('Saiba mais sobre os países ', 'Learn more about the countries ', 'Conozca más sobre los países ')}
                <span className="text-[var(--color-gold)]">{t('do eixo UE-Mercosul.', 'of the EU-Mercosur axis.', 'del eje UE-Mercosur.')}</span>
              </h2>
              <p className="text-base md:text-lg text-gray-600 font-body leading-relaxed max-w-lg">
                {t(
                  'Selecione uma nação e descubra mais sobre os pontos fortes de cada uma. É aqui que sua marca deve estar.',
                  'Select a nation and discover more about the strengths of each one. This is where your brand must be.',
                  'Seleccione una nación y descubra más sobre los puntos fuertes de cada una. Aquí es donde su marca debe estar.'
                )}
              </p>
            </div>

            <div className="space-y-8">
              {/* Tabs de Região */}
              <div className="flex bg-[var(--color-navy)]/5 p-1 rounded-2xl w-fit border border-[var(--color-navy)]/10">
                <button
                  onClick={() => handleRegionChange('EU')}
                  className={cn(
                    "px-8 py-3 rounded-xl text-sm font-bold transition-all duration-300 flex items-center gap-2",
                    activeRegion === 'EU' ? "bg-[var(--color-navy)] text-white shadow-xl" : "text-gray-500 hover:text-[var(--color-navy)]"
                  )}
                >
                  <Globe size={16} />
                  {t('União Europeia', 'European Union', 'Unión Europea')}
                </button>
                <button
                  onClick={() => handleRegionChange('MERCOSUL')}
                  className={cn(
                    "px-8 py-3 rounded-xl text-sm font-bold transition-all duration-300 flex items-center gap-2",
                    activeRegion === 'MERCOSUL' ? "bg-[var(--color-navy)] text-white shadow-xl" : "text-gray-500 hover:text-[var(--color-navy)]"
                  )}
                >
                  <Globe size={16} />
                  {t('Mercosul', 'Mercosur', 'Mercosur')}
                </button>
                {hasGuestCountries && (
                  <button
                    onClick={() => handleRegionChange('GUEST')}
                    className={cn(
                      "px-8 py-3 rounded-xl text-sm font-bold transition-all duration-300 flex items-center gap-2",
                      activeRegion === 'GUEST' ? "bg-[var(--color-navy)] text-white shadow-xl" : "text-gray-500 hover:text-[var(--color-navy)]"
                    )}
                  >
                    <Globe size={16} />
                    {t('Convidados', 'Guests', 'Invitados')}
                  </button>
                )}
              </div>

              {/* Carrossel de Países */}
              <div className="relative group">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest">{t('Selecione uma Nação', 'Select a Nation', 'Seleccione una Nación')}</h4>
                  <div className="flex gap-2">
                    <button onClick={() => scroll('left')} className="p-2 bg-white rounded-full shadow-md hover:bg-[var(--color-gold)] hover:text-white transition-all">
                      <ChevronLeft size={16} />
                    </button>
                    <button onClick={() => scroll('right')} className="p-2 bg-white rounded-full shadow-md hover:bg-[var(--color-gold)] hover:text-white transition-all">
                      <ChevronRight size={16} />
                    </button>
                  </div>
                </div>

                <div 
                  ref={scrollRef}
                  className="flex gap-4 overflow-x-auto scrollbar-hide pb-6 pt-2 snap-x"
                  style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                  {filteredCountries.map((country) => (
                    <button
                      key={country.code}
                      onClick={() => setActiveId(country.code)}
                      className={cn(
                        "flex-shrink-0 w-32 snap-start group relative flex flex-col items-center p-5 rounded-3xl transition-all duration-500 border-2",
                        activeId === country.code
                          ? "bg-white border-[var(--color-gold)] shadow-2xl scale-105"
                          : "bg-white/40 border-transparent grayscale opacity-50 hover:opacity-100 hover:grayscale-0 hover:border-gray-200"
                      )}
                    >
                      <div className="relative w-12 h-12 mb-3 rounded-xl overflow-hidden shadow-sm border border-gray-100">
                        <SafeImage
                          src={country.flagUrl || ''}
                          alt={t(country.name, country.name_en, country.name_es)}
                          fill
                          sizes="48px"
                          className="object-cover"
                          fallbackSrc="https://placehold.co/48x48/f3f4f6/9ca3af?text="
                        />
                      </div>
                      <span className="text-[10px] uppercase font-bold text-gray-600 group-hover:text-[var(--color-navy)] text-center line-clamp-1">
                        {t(country.name, country.name_en, country.name_es)}
                      </span>
                    </button>
                  ))}
                  {filteredCountries.length === 0 && (
                    <p className="text-xs text-gray-400 py-4">
                      {t('Nenhum país cadastrado nesta categoria ainda.', 'No countries registered in this category yet.', 'Ningún país registrado en esta categoría todavía.')}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Lado Direito: Showcase Ativo */}
          <div className="sticky top-24">
            {currentCountry && (
            <AnimatePresence mode="wait">
              <motion.div
                key={activeId}
                initial={{ opacity: 0, scale: 0.98, y: 10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 1.02, y: -10 }}
                transition={{ type: "spring", damping: 25, stiffness: 120 }}
                className="bg-[var(--color-navy)] rounded-[2.5rem] p-8 md:p-10 shadow-[0_30px_60px_-15px_rgba(11,31,58,0.4)] text-white relative overflow-hidden flex flex-col justify-between min-h-[500px] border border-white/5"
              >
                {/* Background Decor - Flag Blured */}
                <div className="absolute inset-0 opacity-10 pointer-events-none">
                   <SafeImage src={currentCountry.flagUrl || ''} alt="" fill sizes="(max-width: 1024px) 100vw, 600px" className="object-cover blur-3xl scale-110" />
                </div>

                <div className="relative z-10 space-y-6">
                  {/* Header do Card */}
                  <div className="flex items-center gap-5">
                    <div className="relative w-20 h-14 rounded-xl overflow-hidden shadow-xl border border-white/10 shrink-0">
                       <SafeImage src={currentCountry.flagUrl || ''} alt={t(currentCountry.name, currentCountry.name_en, currentCountry.name_es)} fill sizes="80px" className="object-cover" />
                    </div>
                    <div className="space-y-1">
                      <div className="flex flex-wrap gap-2">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-white/5 rounded-full text-[9px] font-bold uppercase tracking-widest text-[var(--color-gold-light)] border border-white/10">
                          <Globe size={9} />
                          {currentCountry?.group === 'EU'
                            ? t('União Europeia', 'European Union', 'Unión Europea')
                            : currentCountry?.group === 'MERCOSUL'
                              ? t('Mercosul', 'Mercosur', 'Mercosur')
                              : t('Convidado', 'Guest', 'Invitado')}
                        </span>
                      </div>
                      <h3 className="text-3xl md:text-4xl font-display font-bold tracking-tight">
                        {t(currentCountry.name, currentCountry.name_en, currentCountry.name_es)}
                      </h3>
                    </div>
                  </div>

                  {/* Grid de Métricas Estratégicas */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {currentCountry?.gdp && (
                      <div className="bg-white/5 p-3 rounded-xl border border-white/5 backdrop-blur-sm group/metric hover:bg-white/10 transition-colors">
                        <span className="block text-[7px] uppercase tracking-widest text-gray-400 font-bold mb-1.5">{t('PIB', 'GDP', 'PIB')}</span>
                        <div className="flex items-center gap-2">
                          <div className="p-1 bg-[var(--color-gold)]/10 rounded-md text-[var(--color-gold)] group-hover/metric:scale-110 transition-transform">
                            <BarChart3 size={12} />
                          </div>
                          <span className="text-xs font-bold">{currentCountry.gdp}</span>
                        </div>
                      </div>
                    )}
                    {currentCountry?.growth && (
                      <div className="bg-white/5 p-3 rounded-xl border border-white/5 backdrop-blur-sm group/metric hover:bg-white/10 transition-colors">
                        <span className="block text-[7px] uppercase tracking-widest text-gray-400 font-bold mb-1.5">{t('Crescimento', 'Growth', 'Crecimiento')}</span>
                        <div className="flex items-center gap-2">
                          <div className="p-1 bg-green-500/10 rounded-md text-green-400 group-hover/metric:scale-110 transition-transform">
                            <TrendingUp size={12} />
                          </div>
                          <span className="text-xs font-bold">{currentCountry.growth}</span>
                        </div>
                      </div>
                    )}
                    <div className="bg-white/5 p-3 rounded-xl border border-white/5 backdrop-blur-sm group/metric hover:bg-white/10 transition-colors">
                      <span className="block text-[7px] uppercase tracking-widest text-gray-400 font-bold mb-1.5">{t('Setor', 'Sector', 'Sector')}</span>
                      <div className="flex items-center gap-2">
                        <div className="p-1 bg-blue-500/10 rounded-md text-blue-400 group-hover/metric:scale-110 transition-transform">
                          <Briefcase size={12} />
                        </div>
                        <span className="text-[10px] font-bold truncate leading-none">{t(currentCountry?.mainSector || 'Industrial', currentCountry?.mainSector_en || undefined, currentCountry?.mainSector_es || undefined)}</span>
                      </div>
                    </div>
                  </div>

                  <p className="text-sm md:text-base text-gray-200 font-body leading-relaxed max-w-md">
                    {t(currentCountry?.description || '', currentCountry?.description_en || undefined, currentCountry?.description_es || undefined)}
                  </p>
                </div>

                <div className="relative z-10 space-y-6 mt-8">
                  <div className="group/opt p-5 bg-gradient-to-br from-white/10 to-white/[0.02] rounded-2xl border border-white/10 backdrop-blur-md shadow-inner transition-all hover:border-[var(--color-gold)]/30">
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-[var(--color-gold)] rounded-xl text-[var(--color-navy)] shadow-lg">
                        <Target size={18} />
                      </div>
                      <div>
                        <span className="block text-[8px] font-bold text-[var(--color-gold)] uppercase tracking-[0.2em] mb-1">{t('Oportunidade de Mercado', 'Market Opportunity', 'Oportunidad de Mercado')}</span>
                        <p className="text-white text-base md:text-lg font-display font-medium leading-tight">{t(currentCountry?.highlight || '', currentCountry?.highlight_en || undefined, currentCountry?.highlight_es || undefined)}</p>
                      </div>
                    </div>
                  </div>

                  <Link
                    href={`/pais/${currentCountry.slug}`}
                    className="flex items-center gap-4 text-white font-bold group w-full justify-between p-3.5 px-5 bg-white/5 rounded-xl border border-white/5 hover:bg-white/10 transition-all font-body"
                  >
                    <span className="text-xs tracking-wide">{t('Análise e Relatório Comercial', 'Trade Analysis & Report', 'Análisis e Informe Comercial')}</span>
                    <div className="p-1.5 bg-[var(--color-gold)] rounded-full text-[var(--color-navy)] shadow-md transition-transform group-hover:translate-x-1">
                      <ChevronRight size={16} />
                    </div>
                  </Link>
                </div>

                {/* Marca D'água Estilizada */}
                <div className="absolute -bottom-12 -right-12 text-[240px] font-bold text-white/[0.02] select-none pointer-events-none leading-none font-display">
                  {currentCountry?.code}
                </div>
              </motion.div>
            </AnimatePresence>
            )}
          </div>

        </div>
      </div>
    </section>
  )
}

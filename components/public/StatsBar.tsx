'use client'
import { useLanguage } from '@/hooks/use-language'

interface StatsBarProps {
  stats?: {
    companies: number
    countries: number
    sectors: number
    opportunities: number
  }
}

export const StatsBar = ({ stats: dynamicStats }: StatsBarProps) => {
  const { t } = useLanguage()
  
  const stats = [
    { label: t('Empresas Cadastradas', 'Registered Companies', 'Empresas Registradas'), value: `${dynamicStats?.companies || 150}+` },
    { label: t('Países Representados', 'Represented Countries', 'Países Representados'), value: dynamicStats?.countries || '25' },
    { label: t('Setores Industriais', 'Industrial Sectors', 'Sectores Industriales'), value: dynamicStats?.sectors || '12' },
    { label: t('Oportunidades Geradas', 'Generated Opportunities', 'Oportunidades Generadas'), value: `${dynamicStats?.opportunities || 500}+` },
  ]

  return (
    <section className="bg-white border-t border-[var(--color-border)] py-16">
      <div className="container-custom">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center group">
              <div className="text-3xl md:text-5xl font-display font-bold text-[var(--color-navy)] mb-2 group-hover:text-[var(--color-gold)] transition-colors duration-300">
                {stat.value}
              </div>
              <div className="text-sm font-body text-[var(--color-text-muted)] uppercase tracking-widest font-semibold">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

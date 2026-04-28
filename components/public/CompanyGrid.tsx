// components/public/CompanyGrid.tsx
'use client'

import React from 'react'
import { CompanyCard } from './CompanyCard'
import { Company } from '@/lib/companies-data'
import { SearchX } from 'lucide-react'
import { useLanguage } from '@/hooks/use-language'

interface CompanyGridProps {
  companies: any[]
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

export const CompanyGrid = ({ 
  companies, 
  currentPage, 
  totalPages, 
  onPageChange 
}: CompanyGridProps) => {
  const { t } = useLanguage()

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return
    onPageChange(page)
    
    // Scroll suave para o topo da seção de parceiros
    const element = document.getElementById('partners-section')
    if (element) {
      const offset = 100 // Margem para não ficar colado no topo
      const elementPosition = element.getBoundingClientRect().top
      const offsetPosition = elementPosition + window.pageYOffset - offset

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      })
    }
  }

  if (companies.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
        <div className="p-6 bg-gray-50 rounded-full text-gray-300">
          <SearchX size={64} strokeWidth={1} />
        </div>
        <div className="space-y-1">
          <h3 className="text-xl font-display font-bold text-[var(--color-navy)]">{t('Nenhum resultado encontrado', 'No results found', 'Ningún resultado encontrado')}</h3>
          <p className="text-[var(--color-text-muted)] font-body max-w-sm mx-auto">
            {t(
              'Tente ajustar os filtros ou pesquisar por outros termos para encontrar as empresas parceiras.',
              'Try adjusting the filters or searching for other terms to find partner companies.',
              'Intente ajustar los filtros o buscar otros términos para encontrar empresas asociadas.'
            )}
          </p>
        </div>
        <button 
          onClick={() => window.location.reload()} 
          className="text-[var(--color-gold)] font-bold text-sm hover:underline pt-2"
        >
          {t('Ver todas as empresas', 'View all companies', 'Ver todas las empresas')}
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {companies.map((company) => (
          <CompanyCard 
            key={company.id} 
            company={company} 
          />
        ))}
      </div>
      
      {/* Paginação Dinâmica */}
      {totalPages > 1 && (
        <div className="flex flex-wrap justify-center items-center gap-2 pt-8">
          <button 
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-4 py-2 border border-gray-200 rounded-[var(--radius-md)] text-[var(--color-text-primary)] disabled:text-gray-400 disabled:cursor-not-allowed text-xs transition-colors hover:bg-white shadow-sm font-medium"
          >
            {t('Anterior', 'Previous', 'Anterior')}
          </button>

          <div className="flex items-center gap-1.5">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`w-8 h-8 rounded-[var(--radius-md)] font-bold text-xs transition-all ${
                  currentPage === page
                    ? 'bg-[var(--color-navy)] text-white shadow-md scale-110'
                    : 'hover:bg-white border border-gray-100 text-[var(--color-text-primary)] hover:border-gray-200'
                }`}
              >
                {page}
              </button>
            ))}
          </div>

          <button 
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-4 py-2 border border-gray-200 rounded-[var(--radius-md)] text-[var(--color-text-primary)] disabled:text-gray-400 disabled:cursor-not-allowed text-xs transition-colors hover:bg-white shadow-sm font-medium"
          >
            {t('Próxima', 'Next', 'Siguiente')}
          </button>
        </div>
      )}
    </div>
  )
}

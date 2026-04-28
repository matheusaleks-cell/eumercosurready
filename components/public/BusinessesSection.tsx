// components/public/BusinessesSection.tsx
'use client'

import React, { useState, useMemo, useEffect } from 'react'
import { AdvancedFilters } from './AdvancedFilters'
import { CompanyGrid } from './CompanyGrid'
import { useLanguage } from '@/hooks/use-language'

export interface FilterState {
  search: string
  origin: string
  segment: string
}

interface BusinessesSectionProps {
  initialCompanies: any[]
}

export const BusinessesSection = ({ initialCompanies = [] }: BusinessesSectionProps) => {
  const { language } = useLanguage()
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    origin: '',
    segment: ''
  })
  const [activeQuickFilters, setActiveQuickFilters] = useState<string[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const ITEMS_PER_PAGE = 9

  const filteredCompanies = useMemo(() => {
    return initialCompanies.filter(company => {
      // 1. Filtro de Busca (Texto) - Busca em todos os idiomas
      const searchTerm = filters.search.toLowerCase()
      const searchMatch = !filters.search || 
        company.name.toLowerCase().includes(searchTerm) ||
        (company.shortDescription || '').toLowerCase().includes(searchTerm) ||
        (company.shortDescription_en || '').toLowerCase().includes(searchTerm) ||
        (company.shortDescription_es || '').toLowerCase().includes(searchTerm) ||
        (company.sector?.name || '').toLowerCase().includes(searchTerm)

      // 2. Filtro de Origem (Dropdown)
      const originMatch = !filters.origin || company.countryCode === filters.origin

      // 3. Filtro de Segmento (Dropdown)
      const segmentMap: Record<string, string> = {
        'agro': 'Agronegócio',
        'tech': 'Tecnologia',
        'energy': 'Energia',
        'logistics': 'Logística',
        'finance': 'Financeiro',
        'health': 'Saúde',
        'industry': 'Indústria'
      }
      const segmentMatch = !filters.segment || company.sector?.name === segmentMap[filters.segment]

      // 4. Filtros Rápidos (Chips)
      let quickFilterMatch = true
      if (activeQuickFilters.length > 0) {
        quickFilterMatch = activeQuickFilters.some(qId => {
          if (qId === 'solo-ue') return company.region === 'EU'
          if (qId === 'solo-merc') return company.region === 'MERCOSUL'
          if (qId === 'germany') return company.countryCode === 'DE'
          if (qId === 'brazil') return company.countryCode === 'BR'
          if (qId === 'argentina') return company.countryCode === 'AR'
          if (qId === 'portugal') return company.countryCode === 'PT'
          return true
        })
      }

      return searchMatch && originMatch && segmentMatch && quickFilterMatch
    })
  }, [filters, activeQuickFilters, initialCompanies])

  // Resetar para página 1 sempre que os filtros mudarem
  useEffect(() => {
    setCurrentPage(1)
  }, [filters, activeQuickFilters])

  const totalPages = Math.ceil(filteredCompanies.length / ITEMS_PER_PAGE)
  
  const paginatedCompanies = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
    return filteredCompanies.slice(startIndex, startIndex + ITEMS_PER_PAGE)
  }, [filteredCompanies, currentPage])

  return (
    <div className="flex flex-col gap-12">
      {/* Sistema de Filtros */}
      <div id="partners-section" className="-mt-10 relative z-30">
        <AdvancedFilters 
          filters={filters} 
          setFilters={setFilters}
          activeQuickFilters={activeQuickFilters}
          setActiveQuickFilters={setActiveQuickFilters}
          totalResults={filteredCompanies.length}
        />
      </div>

      {/* Grid de Empresas */}
      <div className="py-8 md:py-12">
        <CompanyGrid 
          companies={paginatedCompanies} 
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  )
}

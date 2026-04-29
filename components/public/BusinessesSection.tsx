// components/public/BusinessesSection.tsx
'use client'

import React, { useState, useMemo, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
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
  const searchParams = useSearchParams()
  
  const [filters, setFilters] = useState<FilterState>({
    search: searchParams.get('search') || '',
    origin: searchParams.get('origin') || '',
    segment: searchParams.get('segment') || ''
  })

  // Sincronizar filtros com a URL se eles mudarem externamente
  useEffect(() => {
    const origin = searchParams.get('origin') || ''
    const search = searchParams.get('search') || ''
    const segment = searchParams.get('segment') || ''
    
    // Atualiza o estado dos filtros para refletir a URL
    setFilters(prev => {
      if (prev.origin !== origin || prev.search !== search || prev.segment !== segment) {
        return { origin, search, segment }
      }
      return prev
    })
    
    // Se houver origem ou se viemos de uma página de país, rolar para a seção
    if ((origin || window.location.hash === '#partners-section') && typeof window !== 'undefined') {
      const scrollToSection = () => {
        const element = document.getElementById('partners-section')
        if (element) {
          const offset = 100 // Ajuste para não ficar colado no topo
          const elementPosition = element.getBoundingClientRect().top
          const offsetPosition = elementPosition + window.pageYOffset - offset
          
          window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
          })
        }
      }

      // Tentar imediatamente e depois de um pequeno delay para garantir renderização
      scrollToSection()
      const timer = setTimeout(scrollToSection, 500)
      return () => clearTimeout(timer)
    }
  }, [searchParams])

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
      const originMatch = !filters.origin || 
        (company.countryCode && company.countryCode.toUpperCase() === filters.origin.toUpperCase())

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

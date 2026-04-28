// components/public/AdvancedFilters.tsx
'use client'

import React, { useEffect } from 'react'
import { 
  Search, Globe, Tag, X, RotateCcw, Save, Check, ChevronDown, 
  Sprout, Cpu, Zap, Truck, Landmark, Stethoscope, Factory 
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { countriesData } from '@/lib/countries-data'
import Image from 'next/image'
import { useLanguage } from '@/hooks/use-language'

export interface FilterState {
  search: string
  origin: string
  segment: string
}

interface AdvancedFiltersProps {
  filters: FilterState
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>
  activeQuickFilters: string[]
  setActiveQuickFilters: React.Dispatch<React.SetStateAction<string[]>>
  totalResults: number
}

export const AdvancedFilters = ({ 
  filters, 
  setFilters, 
  activeQuickFilters, 
  setActiveQuickFilters,
  totalResults
}: AdvancedFiltersProps) => {
  const { t } = useLanguage()
  const [isSegmentOpen, setIsSegmentOpen] = React.useState(false)

  useEffect(() => {
    const handleFilterCountry = (e: any) => {
      setFilters(prev => ({ ...prev, origin: e.detail }))
    }

    window.addEventListener('filter-country', handleFilterCountry)
    return () => window.removeEventListener('filter-country', handleFilterCountry)
  }, [setFilters])

  const segments = [
    { id: 'agro', name: t('Agronegócio', 'Agribusiness', 'Agronegócio'), icon: Sprout },
    { id: 'tech', name: t('Tecnologia', 'Technology', 'Tecnología'), icon: Cpu },
    { id: 'energy', name: t('Energia', 'Energy', 'Energía'), icon: Zap },
    { id: 'logistics', name: t('Logística', 'Logistics', 'Logística'), icon: Truck },
    { id: 'finance', name: t('Financeiro', 'Finance', 'Financiero'), icon: Landmark },
    { id: 'health', name: t('Saúde', 'Health', 'Salud'), icon: Stethoscope },
    { id: 'industry', name: t('Indústria', 'Industry', 'Industria'), icon: Factory },
  ]

  const quickFilters = [
    { id: 'solo-ue', label: t('Eixo UE', 'EU Axis', 'Eje UE'), flagPath: '/flags/EU.png' },
    { id: 'solo-merc', label: t('Eixo Mercosul', 'Mercosur Axis', 'Eje Mercosur'), flagPath: '/flags/Mercosul.png' },
    { id: 'germany', label: t('Alemanha', 'Germany', 'Alemania'), flagPath: '/flags/Alemanha.png' },
    { id: 'brazil', label: t('Brasil', 'Brazil', 'Brasil'), flagPath: '/flags/Brasil.png' },
    { id: 'argentina', label: t('Argentina', 'Argentina', 'Argentina'), flagPath: '/flags/Argentina.png' },
    { id: 'portugal', label: t('Portugal', 'Portugal', 'Portugal'), flagPath: '/flags/Portugal.png' },
  ]

  const toggleQuickFilter = (id: string) => {
    setActiveQuickFilters(prev => 
      prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]
    )
  }

  const clearFilters = () => {
    setFilters({ search: '', origin: '', segment: '' })
    setActiveQuickFilters([])
  }

  const selectedSegment = segments.find(s => s.id === filters.segment)

  return (
    <div className="w-full bg-[var(--color-navy)] rounded-2xl shadow-2xl border border-white/5 relative">
      {/* Header do Painel */}
      <div className="px-6 py-4 border-b border-white/5 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-white/5 rounded-lg">
            <Search size={18} className="text-[var(--color-gold)]" />
          </div>
          <h2 className="text-white font-display font-bold uppercase tracking-wider text-sm">
            {t('Filtrar Empresas', 'Filter Companies', 'Filtrar Empresas')}
          </h2>
          {/* Active Tags */}
          <div className="flex flex-wrap gap-2 ml-0 md:ml-4 mt-2 md:mt-0">
            {filters.search && (
              <span className="flex items-center gap-1.5 px-2 py-1 bg-white/5 text-[10px] text-[var(--color-gold)] rounded-md border border-[var(--color-gold)]/20">
                {filters.search} <X size={10} className="cursor-pointer" onClick={() => setFilters(f => ({...f, search: ''}))} />
              </span>
            )}
            {filters.origin && (
              <span className="flex items-center gap-1.5 px-2 py-1 bg-white/5 text-[10px] text-[var(--color-gold)] rounded-md border border-[var(--color-gold)]/20">
                {t('Origem', 'Origin', 'Origen')}: {(() => {
                  const c = countriesData.find(c => c.id === filters.origin);
                  return c ? t(c.name, c.name_en, c.name_es) : '';
                })()} <X size={10} className="cursor-pointer" onClick={() => setFilters(f => ({...f, origin: ''}))} />
              </span>
            )}
            {filters.segment && (
               <span className="flex items-center gap-1.5 px-2 py-1 bg-white/5 text-[10px] text-[var(--color-gold)] rounded-md border border-[var(--color-gold)]/20">
               {segments.find(s => s.id === filters.segment)?.name} <X size={10} className="cursor-pointer" onClick={() => setFilters(f => ({...f, segment: ''}))} />
             </span>
            )}
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-center md:justify-end gap-3 flex-1">
          <span className="text-xs text-gray-400 font-body">
            {t('Exibindo', 'Showing', 'Mostrando')} <span className="text-[var(--color-gold)] font-bold">{totalResults}</span> {t('resultados', 'results', 'resultados')}
          </span>
          <div className="h-4 w-[1px] bg-white/10 mx-2"></div>
          <button 
            onClick={clearFilters}
            className="flex items-center gap-2 px-3 py-1.5 text-xs text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-all"
          >
            <RotateCcw size={14} />
            {t('Limpar Filtros', 'Clear Filters', 'Limpiar Filtros')}
          </button>
          <button className="flex items-center gap-2 px-3 py-1.5 text-xs text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-all border border-white/10">
            <Save size={14} />
            {t('Salvar Busca', 'Save Search', 'Guardar Búsqueda')}
          </button>
        </div>
      </div>

      {/* Grid de Inputs Principal */}
      <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Busca por Nome */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-[10px] font-bold text-gray-500 uppercase tracking-widest pl-1">
            <Search size={12} className="text-[var(--color-gold)]" />
            {t('Palavra-chave', 'Keyword', 'Palabra clave')}
          </div>
          <div className="relative group">
            <input 
              type="text" 
              placeholder={t('Nome, marca ou tecnologia...', 'Name, brand or technology...', 'Nombre, marca o tecnología...')}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-[var(--color-gold)]/50 transition-all"
              value={filters.search}
              onChange={(e) => setFilters(f => ({ ...f, search: e.target.value }))}
            />
          </div>
        </div>

        {/* Made In (Países) */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-[10px] font-bold text-gray-500 uppercase tracking-widest pl-1">
            <Globe size={12} className="text-[var(--color-gold)]" />
            {t('Origem (Made In)', 'Origin (Made In)', 'Origen (Made In)')}
          </div>
          <div className="relative">
            <select 
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-[var(--color-gold)]/50 transition-all appearance-none cursor-pointer"
              value={filters.origin}
              onChange={(e) => setFilters(f => ({ ...f, origin: e.target.value }))}
            >
              <option value="" className="bg-[var(--color-navy)]">{t('Todos os países', 'All countries', 'Todos los países')}</option>
              <optgroup label={t('União Europeia', 'European Union', 'Unión Europea')} className="bg-[var(--color-navy)]">
                {countriesData.filter(c => c.region === 'EU').map(c => (
                  <option key={c.id} value={c.id}>{t('Origem', 'Origin', 'Origen')}: {t(c.name, c.name_en, c.name_es)}</option>
                ))}
              </optgroup>
              <optgroup label={t('Mercosul', 'Mercosur', 'Mercosur')} className="bg-[var(--color-navy)]">
                {countriesData.filter(c => c.region === 'MERCOSUL').map(c => (
                  <option key={c.id} value={c.id}>{t('Origem', 'Origin', 'Origen')}: {t(c.name, c.name_en, c.name_es)}</option>
                ))}
              </optgroup>
            </select>
            <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
          </div>
        </div>

        {/* Setor Industrial (Custom Dropdown com Ícones) */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-[10px] font-bold text-gray-500 uppercase tracking-widest pl-1">
            <Tag size={12} className="text-[var(--color-gold)]" />
            {t('Setor Industrial', 'Industrial Sector', 'Sector Industrial')}
          </div>
          <div className="relative">
            <button
              onClick={() => setIsSegmentOpen(!isSegmentOpen)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-left text-white flex items-center justify-between hover:border-white/20 transition-all"
            >
              <div className="flex items-center gap-2">
                {selectedSegment ? (
                  <>
                    <selectedSegment.icon size={16} className="text-[var(--color-gold)]" />
                    {selectedSegment.name}
                  </>
                ) : (
                  t('Todos os setores', 'All sectors', 'Todos los sectores')
                )}
              </div>
              <ChevronDown size={16} className={cn("text-gray-500 transition-transform", isSegmentOpen && "rotate-180")} />
            </button>

            {isSegmentOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setIsSegmentOpen(false)} />
                <div className="absolute top-full left-0 right-0 mt-2 bg-[var(--color-navy)] border border-white/10 rounded-xl shadow-2xl z-50 overflow-hidden py-1">
                  <button
                    onClick={() => { setFilters(f => ({ ...f, segment: '' })); setIsSegmentOpen(false) }}
                    className="w-full px-4 py-2 text-sm text-left text-gray-400 hover:bg-white/5 hover:text-white transition-colors"
                  >
                    {t('Todos os setores', 'All sectors', 'Todos los sectores')}
                  </button>
                  {segments.map((s) => (
                    <button
                      key={s.id}
                      onClick={() => { setFilters(f => ({ ...f, segment: s.id })); setIsSegmentOpen(false) }}
                      className={cn(
                        "w-full px-4 py-2 text-sm text-left flex items-center gap-3 transition-colors",
                        filters.segment === s.id ? "bg-[var(--color-gold)]/10 text-[var(--color-gold)]" : "text-gray-300 hover:bg-white/5 hover:text-white"
                      )}
                    >
                      <s.icon size={16} />
                      {s.name}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Acesso Rápido (Chips) */}
      <div className="px-6 pb-6 pt-2">
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-[10px] font-bold text-gray-600 uppercase tracking-widest mr-2">
            {t('Acesso Rápido', 'Quick Access', 'Acceso Rápido')}
          </span>
          {quickFilters.map((q) => (
            <button
              key={q.id}
              onClick={() => toggleQuickFilter(q.id)}
              className={cn(
                "px-4 py-2 text-[11px] font-medium rounded-full border transition-all duration-300 flex items-center gap-2",
                activeQuickFilters.includes(q.id)
                  ? "bg-[var(--color-gold)]/10 border-[var(--color-gold)] text-[var(--color-gold)]"
                  : "bg-white/5 border-white/10 text-gray-400 hover:border-white/30 hover:text-white"
              )}
            >
              {q.flagPath ? (
                <div className="relative w-4 h-3 overflow-hidden rounded-sm border border-white/10">
                  <Image 
                    src={q.flagPath} 
                    alt={q.label}
                    fill
                    className="object-cover"
                  />
                </div>
              ) : (
                <div className="w-1.5 h-1.5 rounded-full bg-current opacity-60"></div>
              )}
              {q.label}
              {activeQuickFilters.includes(q.id) && <Check size={10} />}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

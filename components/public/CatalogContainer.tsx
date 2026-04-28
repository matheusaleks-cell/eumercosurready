'use client'

import React, { useState, useMemo } from 'react'
import { Search, Filter, X, ChevronRight, SlidersHorizontal } from 'lucide-react'
import { ProductGallery } from './ProductGallery'
import { Product } from '@/lib/companies-data'
import { cn } from '@/lib/utils'

interface CatalogContainerProps {
  products: Product[]
  companyName: string
  companySlug: string
}

export const CatalogContainer = ({ products, companyName, companySlug }: CatalogContainerProps) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [readyToShipOnly, setReadyToShipOnly] = useState(false)
  const [lowMOQOnly, setLowMOQOnly] = useState(false)
  const [certifiedOnly, setCertifiedOnly] = useState(false)
  const [sustainableOnly, setSustainableOnly] = useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  const categories = useMemo(() => {
    const cats = Array.from(new Set(products.map(p => p.category).filter((c): c is string => !!c)))
    return cats.sort()
  }, [products])

  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const matchesSearch = product.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            product.description.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesCategory = selectedCategory ? product.category === selectedCategory : true
      
      // Lógica OU para os filtros de especificação (se algum estiver marcado, mostra se atender a pelo menos um)
      const hasSpecFilter = readyToShipOnly || lowMOQOnly || certifiedOnly || sustainableOnly
      const matchesSpecs = hasSpecFilter 
        ? (readyToShipOnly && product.isReadyToShip) || 
          (lowMOQOnly && product.isLowMOQ) ||
          (certifiedOnly && product.isCertified) ||
          (sustainableOnly && product.isSustainable)
        : true
      
      return matchesSearch && matchesCategory && matchesSpecs
    })
  }, [products, searchTerm, selectedCategory, readyToShipOnly, lowMOQOnly, certifiedOnly, sustainableOnly])

  return (
    <div className="flex flex-col lg:flex-row gap-12">
      {/* Sidebar de Filtros (Desktop) */}
      <aside className="hidden lg:block w-72 space-y-8">
        <div className="space-y-6">
          <div className="flex items-center gap-2 text-[var(--color-navy)] pb-4 border-b border-gray-200">
            <SlidersHorizontal size={20} className="text-[var(--color-gold)]" />
            <h3 className="text-xl font-display font-bold">Filtros</h3>
          </div>

          {/* Categorias */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold uppercase tracking-widest text-gray-400">Categorias</h4>
            <div className="space-y-2">
              <button 
                onClick={() => setSelectedCategory(null)}
                className={cn(
                  "w-full flex items-center justify-between px-4 py-2 rounded-xl text-sm font-medium transition-all",
                  selectedCategory === null 
                    ? "bg-[var(--color-navy)] text-white shadow-lg" 
                    : "text-gray-600 hover:bg-gray-100"
                )}
              >
                Todas as Categorias
                <ChevronRight size={16} className={cn("transition-transform", selectedCategory === null && "rotate-90")} />
              </button>
              {categories.map(category => (
                <button 
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={cn(
                    "w-full flex items-center justify-between px-4 py-2 rounded-xl text-sm font-medium transition-all",
                    selectedCategory === category 
                      ? "bg-[var(--color-navy)] text-white shadow-lg" 
                      : "text-gray-600 hover:bg-gray-100"
                  )}
                >
                  {category}
                  <ChevronRight size={16} className={cn("transition-transform", selectedCategory === category && "rotate-90")} />
                </button>
              ))}
            </div>
          </div>

          {/* Filtros de Vantagens B2B (4 Padrões) */}
          <div className="space-y-4 pt-4 border-t border-gray-100">
            <h4 className="text-sm font-bold uppercase tracking-widest text-gray-400">Diferenciais B2B</h4>
            <div className="space-y-3">
              <label className="flex items-center gap-3 cursor-pointer group">
                <input 
                  type="checkbox" 
                  checked={readyToShipOnly}
                  onChange={(e) => setReadyToShipOnly(e.target.checked)}
                  className="w-5 h-5 rounded border-gray-300 text-[var(--color-gold)] focus:ring-[var(--color-gold)] cursor-pointer" 
                />
                <span className={cn(
                  "text-sm transition-colors",
                  readyToShipOnly ? "text-[var(--color-navy)] font-bold" : "text-gray-600"
                )}>
                  Pronta Entrega
                </span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer group">
                <input 
                  type="checkbox" 
                  checked={lowMOQOnly}
                  onChange={(e) => setLowMOQOnly(e.target.checked)}
                  className="w-5 h-5 rounded border-gray-300 text-[var(--color-gold)] focus:ring-[var(--color-gold)] cursor-pointer" 
                />
                <span className={cn(
                  "text-sm transition-colors",
                  lowMOQOnly ? "text-[var(--color-navy)] font-bold" : "text-gray-600"
                )}>
                  Baixo MOQ
                </span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer group">
                <input 
                  type="checkbox" 
                  checked={certifiedOnly}
                  onChange={(e) => setCertifiedOnly(e.target.checked)}
                  className="w-5 h-5 rounded border-gray-300 text-[var(--color-gold)] focus:ring-[var(--color-gold)] cursor-pointer" 
                />
                <span className={cn(
                  "text-sm transition-colors",
                  certifiedOnly ? "text-[var(--color-navy)] font-bold" : "text-gray-600"
                )}>
                  Certificado
                </span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer group">
                <input 
                  type="checkbox" 
                  checked={sustainableOnly}
                  onChange={(e) => setSustainableOnly(e.target.checked)}
                  className="w-5 h-5 rounded border-gray-300 text-[var(--color-gold)] focus:ring-[var(--color-gold)] cursor-pointer" 
                />
                <span className={cn(
                  "text-sm transition-colors",
                  sustainableOnly ? "text-[var(--color-navy)] font-bold" : "text-gray-600"
                )}>
                  Sustentável
                </span>
              </label>
            </div>
          </div>
        </div>
      </aside>

      {/* Área de Conteúdo */}
      <div className="flex-1 space-y-8">
        {/* Barra de Pesquisa e Filtros Mobile */}
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white p-4 rounded-[2rem] shadow-sm border border-gray-100">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="O que você está procurando?"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-6 py-3 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-[var(--color-gold)] outline-none text-sm"
            />
            {searchTerm && (
              <button 
                onClick={() => setSearchTerm('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X size={16} />
              </button>
            )}
          </div>

          <div className="flex items-center gap-4 w-full md:w-auto">
            <button className="lg:hidden flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gray-50 rounded-2xl text-sm font-bold text-[var(--color-navy)]">
              <Filter size={18} /> Filtros
            </button>
            <div className="hidden md:block text-xs font-bold text-gray-400 uppercase tracking-widest whitespace-nowrap">
              Exibindo {filteredProducts.length} resultados
            </div>
          </div>
        </div>

        {/* Listagem de Produtos */}
        {filteredProducts.length > 0 ? (
          <ProductGallery 
            products={filteredProducts} 
            companyName={companyName} 
            companySlug={companySlug}
            useLink={true}
          />
        ) : (
          <div className="text-center py-32 bg-white rounded-[3rem] border border-dashed border-gray-200">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-300">
              <Search size={40} />
            </div>
            <h3 className="text-2xl font-display font-bold text-[var(--color-navy)] mb-2">Nenhum produto encontrado</h3>
            <p className="text-gray-500 max-w-xs mx-auto font-body">
              Tente ajustar sua busca ou limpar os filtros para encontrar o que precisa.
            </p>
            <button 
              onClick={() => { 
                setSearchTerm(''); 
                setSelectedCategory(null); 
                setReadyToShipOnly(false);
                setLowMOQOnly(false);
              }}
              className="mt-8 text-[var(--color-gold)] font-bold uppercase tracking-widest text-sm hover:underline"
            >
              Limpar todos os filtros
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

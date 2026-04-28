'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight, Truck, Zap, ShieldCheck, Leaf, Package } from 'lucide-react'
import { ProductModal } from './ProductModal'
import { Product } from '@/lib/companies-data'
import { cn } from '@/lib/utils'
import { SafeImage } from './SafeImage'
import { useLanguage } from '@/hooks/use-language'

interface ProductGalleryProps {
  products: Product[]
  companyName: string
  companySlug?: string
  useLink?: boolean
}

export const ProductGallery = ({ products, companyName, companySlug, useLink = false }: ProductGalleryProps) => {
  const { t } = useLanguage()
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleOpenModal = (product: Product) => {
    setSelectedProduct(product)
    setIsModalOpen(true)
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
        {products.map((product, idx) => (
          <div 
            key={idx} 
            className="group bg-white rounded-3xl border border-gray-100 overflow-hidden premium-shadow hover-lift transition-all duration-500 flex flex-col"
          >
            <div className="relative h-64 overflow-hidden bg-gray-100">
              {product.imageUrl ? (
                <SafeImage 
                  src={product.imageUrl} 
                  alt={product.title} 
                  fill 
                  className="object-cover group-hover:scale-110 transition-transform duration-700"
                  fallbackIcon={<Package size={48} className="text-gray-300" />}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Package size={48} className="text-gray-300" />
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute top-4 left-4 z-10 flex flex-wrap gap-2">
                <span className={cn(
                  "px-3 py-1 bg-[var(--color-gold)] text-[var(--color-navy)] font-black uppercase tracking-widest rounded-full shadow-lg",
                  product.category && product.category.length > 10 ? "text-[8px]" : "text-[10px]"
                )}>
                  {product.category}
                </span>
                {product.isReadyToShip && (
                  <span className="px-3 py-1 bg-green-500 text-white text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg flex items-center gap-1">
                    <Truck size={10} /> {t('Pronta Entrega', 'Ready to Ship', 'Pronta Entrega')}
                  </span>
                )}
                {product.isLowMOQ && (
                  <span className="px-3 py-1 bg-blue-500 text-white text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg flex items-center gap-1">
                    <Zap size={10} /> {t('Baixo MOQ', 'Low MOQ', 'Bajo MOQ')}
                  </span>
                )}
                {product.isCertified && (
                  <span className="px-3 py-1 bg-purple-500 text-white text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg flex items-center gap-1">
                    <ShieldCheck size={10} /> {t('Certificado', 'Certified', 'Certificado')}
                  </span>
                )}
                {product.isSustainable && (
                  <span className="px-3 py-1 bg-emerald-600 text-white text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg flex items-center gap-1">
                    <Leaf size={10} /> {t('Sustentável', 'Sustainable', 'Sustentable')}
                  </span>
                )}
              </div>
              <div className="absolute bottom-6 left-6 right-6">
                <h4 className="text-xl font-display font-bold text-white mb-2 drop-shadow-md">
                  {t(product.title, (product as any).title_en, (product as any).title_es)}
                </h4>
              </div>
            </div>
            <div className="p-8 flex flex-col flex-1">
              <p className="text-[var(--color-text-muted)] text-sm font-body leading-relaxed mb-6 line-clamp-2">
                {t(product.description, (product as any).description_en, (product as any).description_es)}
              </p>
              
              {useLink && companySlug ? (
                <Link 
                  href={`/empresa/${companySlug}/produto/${product.slug}`}
                  className="mt-auto flex items-center gap-2 text-[var(--color-gold)] font-bold text-sm uppercase tracking-wider hover:gap-4 transition-all"
                >
                  {t('Conhecer Produto', 'Explore Product', 'Conocer Producto')} <ArrowRight size={16} />
                </Link>
              ) : (
                <button 
                  onClick={() => handleOpenModal(product)}
                  className="mt-auto flex items-center gap-2 text-[var(--color-gold)] font-bold text-sm uppercase tracking-wider hover:gap-4 transition-all"
                >
                  {t('Saber mais', 'Learn more', 'Saber más')} <ArrowRight size={16} />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {!useLink && (
        <ProductModal 
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          product={selectedProduct}
          companyName={companyName}
        />
      )}
    </>
  )
}

'use client'

import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ArrowRight, CheckCircle2, ShieldCheck, Zap, Truck, Leaf, Package, Globe, MapPin } from 'lucide-react'
import Image from 'next/image'
import { cn } from '@/lib/utils'
import { SafeImage } from './SafeImage'
import { useLanguage } from '@/hooks/use-language'

interface Product {
  title: string
  title_en?: string | null
  title_es?: string | null
  description: string
  description_en?: string | null
  description_es?: string | null
  imageUrl?: string | null
  moq?: string | null
  incoterms?: string[] | string | null
  portOfOrigin?: string | null
  productionCapacity?: string | null
  leadTime?: string | null
  isReadyToShip?: boolean
  isLowMOQ?: boolean
  isCertified?: boolean
  isSustainable?: boolean
  type?: 'PRODUCT' | 'SERVICE' | string | null
}

interface ProductModalProps {
  isOpen: boolean
  onClose: () => void
  product: Product | null
  companyName: string
}

export const ProductModal = ({ isOpen, onClose, product, companyName }: ProductModalProps) => {
  const { t } = useLanguage()
  if (!product) return null

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 md:p-6 overflow-hidden">
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-[var(--color-navy)]/80 backdrop-blur-md"
          />

          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-5xl bg-white rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col md:flex-row h-auto max-h-[90vh]"
          >
            {/* Imagem (Esquerda) */}
            <div className="relative w-full md:w-1/2 h-64 md:h-auto bg-gray-100">
              {product.imageUrl ? (
                <SafeImage 
                  src={product.imageUrl} 
                  alt={product.title} 
                  fill 
                  className="object-cover"
                  fallbackIcon={<ShieldCheck size={64} className="text-gray-300" />}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-300">
                  <ShieldCheck size={64} />
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent md:hidden" />
              <button 
                onClick={onClose}
                className="absolute top-5 left-5 p-2 bg-white/20 hover:bg-white/40 backdrop-blur-md rounded-full text-white transition-all md:hidden z-20"
              >
                <X size={18} />
              </button>
            </div>

            {/* Conteúdo (Direita) */}
            <div className="flex-1 p-8 md:p-12 overflow-y-auto flex flex-col custom-scrollbar">
              <button 
                onClick={onClose}
                className="absolute top-8 right-8 p-2 text-gray-400 hover:text-[var(--color-navy)] transition-all hidden md:block"
              >
                <X size={24} />
              </button>

              <div className="space-y-8">
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-[var(--color-gold)] font-bold text-xs uppercase tracking-[0.2em]">
                    <Zap size={14} /> {t('Produto Premium Verificado', 'Verified Premium Product', 'Producto Premium Verificado')}
                  </div>
                  <h2 className="text-3xl md:text-4xl font-display font-bold text-[var(--color-navy)]">
                    {t(product.title, product.title_en, product.title_es)}
                  </h2>
                  
                  {/* Selos B2B no Header do Modal */}
                  <div className="flex flex-wrap gap-2">
                    {product.isReadyToShip && (
                      <span className="flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-[10px] font-black tracking-wider uppercase border border-blue-100">
                        <Truck size={12} /> {t('Pronta Entrega', 'Ready to Ship', 'Pronta Entrega')}
                      </span>
                    )}
                    {product.isCertified && (
                      <span className="flex items-center gap-1.5 px-3 py-1 bg-green-50 text-green-600 rounded-full text-[10px] font-black tracking-wider uppercase border border-green-100">
                        <ShieldCheck size={12} /> {t('Verificado', 'Verified', 'Verificado')}
                      </span>
                    )}
                    {product.isSustainable && (
                      <span className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-black tracking-wider uppercase border border-emerald-100">
                        <Leaf size={12} /> {t('Sustentável', 'Sustainable', 'Sustentable')}
                      </span>
                    )}
                  </div>

                  <p className="text-lg text-[var(--color-text-muted)] font-body leading-relaxed">
                    {t(product.description, product.description_en, product.description_es)}
                  </p>
                </div>

                {/* Especificações Técnicas B2B Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-x-8 gap-y-8 pt-8 border-t border-gray-100">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                      {product.type === 'SERVICE' ? <Zap size={12} className="text-[var(--color-gold)]" /> : <Package size={12} className="text-[var(--color-gold)]" />}
                      {product.type === 'SERVICE' ? t('SLA / Horas', 'SLA / Hours', 'SLA / Horas') : 'MOQ'}
                    </div>
                    <p className="text-sm font-bold text-[var(--color-navy)]">{product.moq || t('Sob Consulta', 'On Request', 'Bajo Consulta')}</p>
                  </div>
                  
                  {product.type !== 'SERVICE' && (
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                        <Globe size={12} className="text-[var(--color-gold)]" />
                        Incoterms
                      </div>
                      <p className="text-sm font-bold text-[var(--color-navy)]">
                        {Array.isArray(product.incoterms) ? product.incoterms.join(', ') : (product.incoterms || 'FOB / CIF')}
                      </p>
                    </div>
                  )}

                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                      <Zap size={12} className="text-[var(--color-gold)]" />
                      {product.type === 'SERVICE' ? t('Capacidade de Atendimento', 'Service Capacity', 'Capacidad de Servicio') : t('Capacidade', 'Capacity', 'Capacidad')}
                    </div>
                    <p className="text-sm font-bold text-[var(--color-navy)]">{product.productionCapacity || t('Alta Escala', 'Large Scale', 'Alta Escala')}</p>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                      {product.type === 'SERVICE' ? <MapPin size={12} className="text-[var(--color-gold)]" /> : <Truck size={12} className="text-[var(--color-gold)]" />}
                      {product.type === 'SERVICE' ? t('Local de Prestação', 'Service Location', 'Lugar de Prestación') : t('Porto de Origem', 'Port of Origin', 'Puerto de Origen')}
                    </div>
                    <p className="text-sm font-bold text-[var(--color-navy)]">{product.portOfOrigin || (product.type === 'SERVICE' ? t('Global / Remoto', 'Global / Remote', 'Global / Remoto') : t('Logística Internacional', 'International Logistics', 'Logística Internacional'))}</p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                      <CheckCircle2 size={12} className="text-[var(--color-gold)]" />
                      {product.type === 'SERVICE' ? t('Prazo de Execução', 'Execution Time', 'Plazo de Ejecución') : t('Lead Time', 'Lead Time', 'Lead Time')}
                    </div>
                    <p className="text-sm font-bold text-[var(--color-navy)]">{product.leadTime || t('Sob Consulta', 'On Request', 'Bajo Consulta')}</p>
                  </div>

                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{t('Conformidade', 'Compliance', 'Conformidad')}</p>
                    <div className={cn(
                      "flex items-center gap-1.5 font-bold text-[10px]",
                      product.isCertified ? "text-green-600" : "text-gray-400"
                    )}>
                      <ShieldCheck size={12} /> {product.isCertified ? t('Verificado EU-Mercosul', 'EU-Mercosur Verified', 'Verificado EU-Mercosul') : t('Padrão Internacional', 'International Standard', 'Estándar Internacional')}
                    </div>
                  </div>
                </div>

                {/* Diferenciais */}
                <div className="space-y-4 pt-8 border-t border-gray-100">
                  <h4 className="font-display font-bold text-[var(--color-navy)] uppercase text-[10px] tracking-widest">{t('Garantias & Diferenciais', 'Guarantees & Differences', 'Garantías y Diferenciales')}</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {[
                      product.isCertified && t('Certificação de Origem Controlada', 'Controlled Origin Certification', 'Certificación de Origen Controlada'),
                      product.isSustainable && t('Produção com Selo Eco-Social', 'Eco-Social Label Production', 'Producción con Sello Eco-Social'),
                      product.isReadyToShip && t('Disponibilidade de Estoque Imediato', 'Immediate Stock Availability', 'Disponibilidad de Stock Inmediato'),
                      t('Rastreabilidade Digital Completa', 'Full Digital Traceability', 'Trazabilidad Digital Completa'),
                      t('Inspeção de Qualidade Pré-embarque', 'Pre-shipment Quality Inspection', 'Inspección de Calidad Pre-embarque')
                    ].filter(Boolean).map((item, i) => (
                      <div key={i} className="flex items-center gap-3 text-xs font-medium text-gray-600">
                        <CheckCircle2 size={14} className="text-[var(--color-gold)]" />
                        {item}
                      </div>
                    ))}
                  </div>
                </div>

                {/* CTA */}
                <div className="pt-8 space-y-4 mt-auto">
                  <button className="w-full bg-[var(--color-navy)] hover:bg-[var(--color-navy-light)] text-white font-display font-bold py-5 rounded-2xl shadow-xl hover:shadow-2xl transition-all flex items-center justify-center gap-3 group">
                    {t('Solicitar Cotação para este Item', 'Request Quote for this Item', 'Solicitar Cotización para este Artículo')}
                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                  <p className="text-[10px] text-center text-gray-400 uppercase font-bold tracking-widest">
                    {t('Fornecido por', 'Supplied by', 'Suministrado por')} <span className="text-[var(--color-navy)]">{companyName}</span> • EU-Mercosur Ready Verified
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

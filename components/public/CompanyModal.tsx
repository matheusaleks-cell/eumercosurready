'use client'
import React, { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  X, Globe, MapPin, Star, MessageSquare, ExternalLink, ShieldCheck, Link2 
} from 'lucide-react'
import Image from 'next/image'
import { Company } from '@/lib/companies-data'
import { cn } from '@/lib/utils'
import { useLenis } from 'lenis/react'

import { useLanguage } from '@/hooks/use-language'

interface CompanyModalProps {
  isOpen: boolean
  onClose: () => void
  company: any | null
}

export const CompanyModal = ({ isOpen, onClose, company }: CompanyModalProps) => {
  const { t } = useLanguage()
  const lenis = useLenis()

  // Trava de scroll (CSS + Lenis)
  useEffect(() => {
    if (!lenis) return

    if (isOpen) {
      document.body.style.overflow = 'hidden'
      lenis.stop()
    } else {
      document.body.style.overflow = 'unset'
      lenis.start()
    }

    return () => {
      document.body.style.overflow = 'unset'
      lenis?.start()
    }
  }, [isOpen, lenis])

  if (!company) return null

  const initials = company.name.substring(0, 2).toUpperCase()

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6 overflow-hidden">
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-[var(--color-navy)]/60 backdrop-blur-md"
          />

          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: 10 }}
            className="relative w-full max-w-4xl max-h-[90vh] bg-white rounded-[2rem] shadow-[0_40px_100px_-20px_rgba(11,31,58,0.5)] overflow-hidden flex flex-col"
          >
            {/* Header / Hero */}
            <div className="relative h-40 md:h-48 shrink-0 overflow-hidden bg-gray-50 flex items-center justify-center">
              <div 
                className="absolute inset-0 opacity-10"
                style={{ backgroundColor: company.logoColor }}
              />
              <button 
                onClick={onClose}
                className="absolute top-5 right-5 p-2 bg-white/20 hover:bg-white/40 backdrop-blur-md rounded-full text-[var(--color-navy)] transition-all z-20"
              >
                <X size={18} />
              </button>

              {/* Logo Centralizada */}
              <div className="relative z-10 text-center flex flex-col items-center">
                <div 
                  className="w-20 h-20 md:w-24 md:h-24 rounded-2xl flex items-center justify-center text-white text-3xl md:text-4xl font-display font-bold shadow-xl border-2 border-white mb-3"
                  style={{ backgroundColor: company.logoColor }}
                >
                  {initials}
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1 bg-white/80 backdrop-blur-sm rounded-full border border-gray-100 shadow-sm">
                  <ShieldCheck size={12} className="text-green-500" />
                  <span className="text-[9px] font-bold uppercase tracking-widest text-[var(--color-navy)]">Parceiro Verificado</span>
                </div>
              </div>
            </div>

            {/* Scrollable Body */}
            <div className="flex-1 overflow-y-auto p-6 md:p-10" data-lenis-prevent>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                
                {/* Lado Esquerdo: Info Principal */}
                <div className="lg:col-span-2 space-y-8">
                  <section>
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-3 mb-5">
                      <div className="space-y-1">
                        <span className="text-[10px] font-bold text-[var(--color-gold)] uppercase tracking-widest">{company.sector.name}</span>
                        <h2 className="text-2xl md:text-3xl font-display font-bold text-[var(--color-navy)]">{company.name}</h2>
                      </div>
                      <div className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 rounded-xl border border-gray-100">
                         <div className="relative w-5 h-3.5 overflow-hidden rounded-sm shadow-sm">
                            <Image 
                              src={`/flags/${company.country.normalize('NFD').replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, '')}.png`} 
                              alt={company.country}
                              fill
                              className="object-cover"
                            />
                         </div>
                         <span className="text-xs font-bold text-gray-700">{company.country}</span>
                      </div>
                    </div>
                    <p className="text-sm md:text-base text-[var(--color-text-muted)] font-body leading-relaxed">
                      {t(company.fullDescription, company.fullDescription_en, company.fullDescription_es)}
                    </p>
                  </section>

                  {/* Redes Sociais */}
                  <section className="space-y-3">
                    <h3 className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Redes Sociais Oficiais</h3>
                    <div className="flex flex-wrap gap-3">
                      {company.socialLinks.linkedin && (
                        <a href={company.socialLinks.linkedin} target="_blank" className="p-3 bg-gray-50 rounded-xl text-blue-600 hover:bg-blue-50 transition-colors border border-gray-100 flex items-center gap-2 group">
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:stroke-[#0077B5] transition-colors"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>
                          <span className="text-[10px] font-bold">LinkedIn</span>
                        </a>
                      )}
                      {company.socialLinks.instagram && (
                        <a href={company.socialLinks.instagram} target="_blank" className="p-3 bg-gray-50 rounded-xl text-pink-600 hover:bg-pink-50 transition-colors border border-gray-100 flex items-center gap-2 group">
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:stroke-[#E4405F] transition-colors"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
                          <span className="text-[10px] font-bold">Instagram</span>
                        </a>
                      )}
                      {company.socialLinks.facebook && (
                        <a href={company.socialLinks.facebook} target="_blank" className="p-3 bg-gray-50 rounded-xl text-blue-800 hover:bg-blue-50 transition-colors border border-gray-100 flex items-center gap-2 group">
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:stroke-[#1877F2] transition-colors"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
                          <span className="text-[10px] font-bold">Facebook</span>
                        </a>
                      )}
                    </div>
                  </section>

                  {/* Avaliações */}
                  <section className="space-y-5 pt-5 border-t border-gray-100">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-display font-bold text-[var(--color-navy)] flex items-center gap-2">
                        <Star className="text-[var(--color-gold)] fill-[var(--color-gold)]" size={20} />
                        Avaliações e Feedback
                      </h3>
                      <button className="text-[10px] font-bold text-[var(--color-gold)] hover:underline">Deixar Avaliação</button>
                    </div>
                    
                    <div className="space-y-3">
                      {company.reviews.map((review: any) => (
                        <div key={review.id} className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-bold text-[var(--color-navy)]">{review.userName}</span>
                            <div className="flex gap-0.5">
                              {[...Array(5)].map((_, i) => (
                                <Star key={i} size={10} className={cn(i < review.rating ? "text-[var(--color-gold)] fill-[var(--color-gold)]" : "text-gray-300")} />
                              ))}
                            </div>
                          </div>
                          <p className="text-[11px] text-gray-600 italic">"{review.comment}"</p>
                        </div>
                      ))}
                    </div>
                  </section>
                </div>

                {/* Lado Direito: Contact Card & Map */}
                <div className="space-y-5">
                  <div className="p-6 bg-[var(--color-navy)] rounded-3xl text-white space-y-6 shadow-xl">
                    <h3 className="text-sm font-display font-bold">Contato Direto</h3>
                    
                    <div className="space-y-5">
                      <div className="flex items-start gap-3">
                        <div className="p-2.5 bg-white/10 rounded-lg text-[var(--color-gold)]">
                          <Globe size={18} />
                        </div>
                        <div>
                          <span className="block text-[8px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">Website Oficial</span>
                          <a href={company.website} target="_blank" className="text-xs font-bold hover:text-[var(--color-gold)] transition-colors inline-flex items-center gap-1.5">
                            {company.website.replace('https://', '')} <ExternalLink size={12} />
                          </a>
                        </div>
                      </div>

                      <div className="flex items-start gap-3">
                        <div className="p-2.5 bg-white/10 rounded-lg text-[var(--color-gold)]">
                          <MapPin size={18} />
                        </div>
                        <div>
                          <span className="block text-[8px] font-bold text-gray-400 uppercase tracking-widest mb-0.5">Endereço Sede</span>
                          <p className="text-[11px] leading-relaxed text-gray-200">{company.address}</p>
                        </div>
                      </div>
                    </div>

                    <button className="w-full py-3.5 bg-[var(--color-gold)] text-[var(--color-navy)] rounded-xl text-xs font-bold hover:brightness-110 transition-all shadow-lg">
                      Solicitar Reunião B2B
                    </button>
                  </div>
                </div>

              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

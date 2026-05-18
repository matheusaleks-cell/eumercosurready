'use client'
// components/public/CompanyCard.tsx
import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Globe, ShieldCheck, Star, Building2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Company } from '@/lib/companies-data'
import { SafeImage } from './SafeImage'

import { useLanguage } from '@/hooks/use-language'
import { countriesData } from '@/lib/countries-data'

interface CompanyCardProps {
  company: any // Aceita tanto o Mock quanto o Prisma
}

export const CompanyCard = ({ company }: CompanyCardProps) => {
  const { t } = useLanguage()
  const initials = company.name.substring(0, 2).toUpperCase()
  
  // Mapeamento de cores para o selo KYB
  const getVerificationColor = (level?: string) => {
    if (!level) return null;
    const l = level.toUpperCase();
    if (l === 'GOLD' || l === 'OURO') return 'text-yellow-500 bg-yellow-50 border-yellow-200';
    if (l === 'SILVER' || l === 'PRATA') return 'text-gray-500 bg-gray-50 border-gray-200';
    if (l === 'BRONZE') return 'text-[#CD7F32] bg-orange-50 border-orange-200';
    return null;
  }
  
  const verificationStatus = company.verificationLevel || company.auditStatus;
  const vColor = getVerificationColor(verificationStatus);
  
  return (
    <Link 
      href={`/empresa/${company.slug}`}
      className={cn(
        "group bg-white rounded-[2rem] border overflow-hidden transition-all duration-500 flex flex-col h-full w-full text-left relative",
        company.featured 
          ? "border-[var(--color-gold)] shadow-[0_20px_50px_rgba(200,148,58,0.1)] hover:shadow-[0_30px_60px_rgba(200,148,58,0.2)]" 
          : "border-[var(--color-border)] shadow-sm hover:shadow-2xl"
      , "hover:-translate-y-2")}
    >
      {company.featured && (
        <div className="absolute top-4 left-4 bg-[var(--color-gold)] text-[var(--color-navy)] text-[9px] font-black uppercase tracking-[0.2em] px-3 py-1.5 rounded-full z-30 shadow-lg flex items-center gap-1.5">
          <Star size={10} fill="currentColor" /> {t('Destaque', 'Featured', 'Destacado')}
        </div>
      )}

      {/* Header do Card (Banner/Capa) */}
      <div className="relative h-36 w-full overflow-hidden">
        {/* Background Fallback (Gradiente Premium) */}
        <div className={cn(
          "absolute inset-0 bg-gradient-to-br transition-transform duration-700 group-hover:scale-110",
          company.region === 'EU' ? "from-[#003399] to-[#001A4D]" : "from-[#009688] to-[#004D40]"
        )} />
        
        {company.bannerUrl && (
          <SafeImage 
            src={company.bannerUrl} 
            alt={`Capa ${company.name}`} 
            fill 
            unoptimized={true}
            className="object-cover opacity-90 transition-transform duration-700 group-hover:scale-110"
          />
        )}

        {/* Overlay de Gradiente para o Logo */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />

        {/* Badge de Região (Style Premium) */}
        <div className={cn(
          "absolute top-4 right-4 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest text-white backdrop-blur-md border border-white/20 z-20 shadow-xl",
          company.region === 'EU' ? "bg-blue-600/40" : "bg-emerald-600/40"
        )}>
          {company.region}
        </div>
      </div>
      
      {/* Conteúdo com Logo Flutuante */}
      <div className="relative p-6 pt-12 flex flex-col flex-1">
        {/* Logo que "quebra" a linha do banner - Sem fundo e maior */}
        <div className="absolute -top-14 left-4 z-20 w-24 h-24 group-hover:scale-110 transition-transform duration-500 flex items-center justify-center">
          <SafeImage 
            src={company.logoUrl} 
            alt={company.name} 
            fill 
            className="object-contain drop-shadow-[0_10px_10px_rgba(0,0,0,0.3)]"
            fallbackIcon={
              <div className="text-4xl font-black text-white/90 drop-shadow-[0_10px_10px_rgba(0,0,0,0.5)] select-none italic tracking-tighter">
                {initials}
              </div>
            }
          />
        </div>

        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="text-[10px] font-bold text-[var(--color-gold)] uppercase tracking-[0.2em]">
            {company.sector ? t(company.sector.name, company.sector.name_en, company.sector.name_es) : t('Geral', 'General', 'General')}
          </span>
          
          {verificationStatus && verificationStatus !== 'NONE' && (
            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 text-[8px] font-bold uppercase tracking-widest border border-emerald-500/20">
              <ShieldCheck size={10} />
              <span>{t('Verificada', 'Verified', 'Verificada')}</span>
            </div>
          )}
        </div>
        
        <h3 className="text-xl font-display font-bold text-[var(--color-navy)] mb-2 group-hover:text-[var(--color-gold)] transition-colors line-clamp-1">
          {company.name}
        </h3>
        
        <p className="text-sm text-[var(--color-text-muted)] font-body mb-6 line-clamp-2 leading-relaxed">
          {t(company.shortDescription, company.shortDescription_en, company.shortDescription_es)}
        </p>
        
        <div className="mt-auto pt-4 border-t border-[var(--color-border)] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="relative w-5 h-3.5 overflow-hidden rounded-sm shadow-sm border border-gray-100 grayscale-[20%] group-hover:grayscale-0 transition-all">
              <SafeImage 
                src={(() => {
                  const c = countriesData.find(curr => curr.id === company.countryCode);
                  return c?.flagPath || `/flags/${company.country.normalize('NFD').replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, '')}.png`;
                })()} 
                alt={company.country}
                fill
                className="object-cover"
                fallbackSrc="https://placehold.co/32x20/f3f4f6/9ca3af?text="
              />
            </div>
            <span className="text-[11px] font-bold text-[var(--color-navy-light)] uppercase tracking-wide">
              {(() => {
                const c = countriesData.find(c => c.id === company.countryCode);
                return c ? t(c.name, c.name_en, c.name_es) : company.country;
              })()}
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-[var(--color-gold)] group-hover:translate-x-1 transition-transform">
            <span className="text-[10px] font-black uppercase tracking-widest">{t('Perfil', 'Profile', 'Perfil')}</span>
            <Globe size={14} />
          </div>
        </div>
      </div>
    </Link>
  )
}

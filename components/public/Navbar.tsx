'use client'
// components/public/Navbar.tsx
import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Menu, ChevronDown, X, Globe, Building2, Info, UserPlus } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { LanguageSwitcher } from './LanguageSwitcher'
import { useLanguage } from '@/hooks/use-language'
import { countriesData } from '@/lib/countries-data'
import { cn } from '@/lib/utils'

export const Navbar = () => {
  const { t, language } = useLanguage()
  const [isCountriesOpen, setIsCountriesOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  // Controle de scroll para efeito de transparência
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Impedir scroll quando menu mobile está aberto
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
  }, [isMobileMenuOpen])

  const menuVariants: any = {
    closed: { x: "100%", transition: { type: "spring", stiffness: 300, damping: 30 } },
    open: { x: 0, transition: { type: "spring", stiffness: 300, damping: 30 } }
  }

  const linkVariants = {
    closed: { opacity: 0, x: 20 },
    open: (i: number) => ({
      opacity: 1,
      x: 0,
      transition: { delay: 0.1 + i * 0.1, duration: 0.5, ease: "easeOut" as any }
    })
  }

  return (
    <nav 
      className={cn(
        "fixed top-4 md:top-6 inset-x-0 mx-auto w-[92%] max-w-6xl z-50 transition-all duration-500 rounded-full border border-white/10 shadow-2xl",
        scrolled 
          ? "bg-[var(--color-navy)]/90 backdrop-blur-xl py-3 shadow-black/50" 
          : "bg-[var(--color-navy)]/60 backdrop-blur-md py-4"
      )}
      suppressHydrationWarning
    >
      <div className="container-custom" suppressHydrationWarning>
        <div className="flex items-center justify-between">
          {/* Logo sobressaindo */}
          <Link href="/" className="group relative z-50 flex items-center" onClick={() => setIsMobileMenuOpen(false)}>
            <div className="relative w-32 h-10 md:w-40 md:h-12 transition-transform duration-500 group-hover:scale-105 drop-shadow-[0_4px_12px_rgba(0,0,0,0.3)]">
              <Image 
                src="/logo-mia-white.png" 
                alt="Made In Atlantic" 
                fill 
                className="object-contain"
                priority
              />
            </div>
          </Link>

          {/* Links Desktop */}
          <div className="hidden md:flex items-center gap-10">
            <Link href="/" className="text-sm font-bold text-gray-300 hover:text-[var(--color-gold)] transition-colors tracking-wide uppercase text-[11px]">{t('Empresas', 'Companies', 'Empresas')}</Link>
            
            {/* Dropdown Países */}
            <div 
              className="relative py-2"
              onMouseEnter={() => setIsCountriesOpen(true)}
              onMouseLeave={() => setIsCountriesOpen(false)}
            >
              <button className="flex items-center gap-1.5 text-sm font-bold text-gray-300 hover:text-[var(--color-gold)] transition-colors tracking-wide uppercase text-[11px]">
                {t('Países', 'Countries', 'Países')}
                <ChevronDown size={14} className={cn("transition-transform duration-500", isCountriesOpen && "rotate-180 text-[var(--color-gold)]")} />
              </button>

              <AnimatePresence>
                {isCountriesOpen && (
                  <motion.div 
                    initial={{ opacity: 0, y: 15, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.98 }}
                    transition={{ duration: 0.3, ease: "circOut" }}
                    className="absolute top-full left-1/2 -translate-x-1/2 w-[640px] bg-[var(--color-navy)]/95 border border-white/10 rounded-[2rem] shadow-[0_40px_80px_-15px_rgba(0,0,0,0.5)] p-8 grid grid-cols-2 gap-10 backdrop-blur-2xl mt-2"
                  >
                    {/* União Europeia */}
                    <div className="space-y-5">
                      <h4 className="text-[10px] font-bold text-[var(--color-gold)] uppercase tracking-[0.3em] border-b border-white/5 pb-3">
                        {t('União Europeia', 'European Union', 'Unión Europea')}
                      </h4>
                      <div className="grid grid-cols-2 gap-x-4 gap-y-3 max-h-[320px] overflow-y-auto pr-3 custom-scrollbar">
                        {countriesData.filter(c => c.region === 'EU').map(country => (
                          <Link 
                            key={country.id} 
                            href={`/pais/${country.slug}`}
                            className="flex items-center gap-3 text-[11px] font-medium text-gray-400 hover:text-white transition-all group/item"
                            onClick={() => setIsCountriesOpen(false)}
                          >
                            <div className="relative w-5 h-3.5 overflow-hidden rounded-sm grayscale group-hover/item:grayscale-0 transition-all border border-white/5">
                              <Image src={country.flagPath} alt={country.name} fill className="object-cover" />
                            </div>
                            <span className="truncate">{t(country.name, country.name_en, country.name_es)}</span>
                          </Link>
                        ))}
                      </div>
                    </div>

                    {/* Mercosul */}
                    <div className="space-y-5">
                      <h4 className="text-[10px] font-bold text-[var(--color-gold)] uppercase tracking-[0.3em] border-b border-white/5 pb-3">
                        {t('Mercosul', 'Mercosur', 'Mercosur')}
                      </h4>
                      <div className="space-y-3">
                        {countriesData.filter(c => c.region === 'MERCOSUL').map(country => (
                          <Link 
                            key={country.id} 
                            href={`/pais/${country.slug}`}
                            className="flex items-center gap-3 text-[11px] font-medium text-gray-400 hover:text-white transition-all group/item"
                            onClick={() => setIsCountriesOpen(false)}
                          >
                            <div className="relative w-6 h-4 overflow-hidden rounded-sm grayscale group-hover/item:grayscale-0 transition-all border border-white/5">
                              <Image src={country.flagPath} alt={country.name} fill className="object-cover" />
                            </div>
                            <span>{t(country.name, country.name_en, country.name_es)}</span>
                          </Link>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <Link href="/sobre" className="text-sm font-bold text-gray-300 hover:text-[var(--color-gold)] transition-colors tracking-wide uppercase text-[11px]">{t('Sobre', 'About', 'Sobre')}</Link>
            
            <div className="w-[1px] h-4 bg-white/10" />

            <LanguageSwitcher />

            <Link href="/solicitar-cadastro" className="btn-premium group py-3 px-6">
              <span className="text-[11px] font-bold tracking-widest">{t('CADASTRAR EMPRESA', 'REGISTER COMPANY', 'REGISTRAR EMPRESA')}</span>
            </Link>
          </div>
          
          {/* Mobile Menu Toggle */}
          <div className="flex md:hidden items-center gap-4">
            <LanguageSwitcher />
            <button 
              className="p-2.5 bg-white/5 rounded-xl border border-white/10 text-gray-300 hover:text-white transition-all active:scale-90"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu size={24} />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[90] md:hidden"
            />
            
            {/* Drawer */}
            <motion.div
              variants={menuVariants}
              initial="closed"
              animate="open"
              exit="closed"
              style={{ backgroundColor: '#0B1F3A', opacity: 1 }}
              className="fixed top-0 right-0 bottom-0 h-screen min-h-screen w-[85%] max-w-sm z-[9999] flex flex-col shadow-[-20px_0_60px_rgba(0,0,0,0.9)] md:hidden border-l border-white/10 overflow-hidden"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-white/10 bg-white/5">
                <div className="flex items-center gap-3">
                  <div className="relative w-24 h-8">
                    <Image src="/logo-mia-white.png" alt="Made In Atlantic" fill className="object-contain" />
                  </div>
                  <span className="font-display font-bold text-white text-xs tracking-widest opacity-40 uppercase">MENU</span>
                </div>
                <button 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-3 bg-white/5 rounded-full text-gray-300 hover:text-white border border-white/10 transition-all active:rotate-90"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Links */}
              <div 
                className="flex-1 overflow-y-auto p-8 space-y-10 custom-scrollbar"
                style={{ backgroundColor: '#0B1F3A' }}
              >
                <nav className="flex flex-col gap-6">
                  <motion.div custom={0} variants={linkVariants}>
                    <Link 
                      href="/" 
                      className="flex items-center gap-4 text-2xl font-display font-bold text-white hover:text-[var(--color-gold)] transition-colors"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <Building2 className="text-[var(--color-gold)]" size={24} />
                      {t('Empresas', 'Companies', 'Empresas')}
                    </Link>
                  </motion.div>
                  
                  <motion.div custom={1} variants={linkVariants} className="space-y-6 pt-4">
                    <div className="flex items-center gap-3">
                      <span className="text-[9px] font-bold text-[var(--color-gold)] uppercase tracking-[0.3em]">{t('Países Estratégicos', 'Strategic Countries', 'Países Estratégicos')}</span>
                      <div className="flex-1 h-[1px] bg-white/10"></div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      {countriesData.slice(0, 10).map((country, idx) => (
                        <Link 
                          key={country.id} 
                          href={`/pais/${country.slug}`}
                          className="flex items-center gap-2.5 text-[11px] text-gray-400 hover:text-white transition-all bg-white/5 p-2.5 rounded-lg border border-transparent hover:border-white/10"
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          <div className="relative w-5 h-3.5 overflow-hidden rounded-sm grayscale transition-all group-hover:grayscale-0">
                            <Image src={country.flagPath} alt={country.name} fill className="object-cover" />
                          </div>
                          <span className="font-medium truncate">{t(country.name, country.name_en, country.name_es)}</span>
                        </Link>
                      ))}
                    </div>
                    <Link 
                      href="/#oportunidades" 
                      className="inline-flex items-center gap-2 text-[10px] text-[var(--color-gold)] font-bold uppercase tracking-widest bg-[var(--color-gold)]/10 px-4 py-2 rounded-full" 
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {t('Explorar Mapa Completo', 'Explore Full Map', 'Explorar Mapa Completo')} 
                      <Globe size={12} />
                    </Link>
                  </motion.div>

                  <motion.div custom={2} variants={linkVariants} className="pt-4">
                    <Link 
                      href="/sobre" 
                      className="flex items-center gap-4 text-2xl font-display font-bold text-white hover:text-[var(--color-gold)] transition-colors"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <Info className="text-[var(--color-gold)]" size={24} />
                      {t('Sobre', 'About', 'Sobre')}
                    </Link>
                  </motion.div>
                </nav>
              </div>

              {/* CTA */}
              <div className="p-8 border-t border-white/10" style={{ backgroundColor: '#0B1F3A' }}>
                <motion.div custom={3} variants={linkVariants}>
                  <Link 
                    href="/solicitar-cadastro" 
                    className="btn-premium w-full flex items-center justify-center gap-3 py-4 text-sm font-bold shadow-[0_0_30px_rgba(200,148,58,0.15)]"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <UserPlus size={18} />
                    <span>{t('Registrar Empresa', 'Register Company', 'Registrar Empresa')}</span>
                  </Link>
                </motion.div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </nav>
  )
}

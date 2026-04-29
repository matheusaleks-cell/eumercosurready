import React, { useState } from 'react'
import { useLanguage, type Language } from '@/hooks/use-language'
import { cn } from '@/lib/utils'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'

export const LanguageSwitcher = () => {
  const { language, setLanguage } = useLanguage()
  const [isOpen, setIsOpen] = useState(false)

  const langs: { id: Language; label: string; flag: string }[] = [
    { id: 'pt', label: 'PT', flag: '/flags/Brasil.png' },
    { id: 'es', label: 'ES', flag: '/flags/Espanha.svg' },
    { id: 'en', label: 'EN', flag: '/flags/EUA.png' }
  ]

  const sortedLangs = [...langs].sort((a, b) => {
    if (a.id === language) return -1
    if (b.id === language) return 1
    return 0
  })

  // Fecha o menu ao selecionar um idioma
  const handleSelect = (id: Language) => {
    setLanguage(id)
    setIsOpen(false)
  }

  return (
    <div className="relative">
      {/* Backdrop invisível para fechar ao clicar fora */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-transparent" 
          onClick={() => setIsOpen(false)}
        />
      )}

      <div 
        className={cn(
          "relative z-50 flex items-center justify-center h-10 px-2 rounded-full border backdrop-blur-md transition-all duration-500 cursor-pointer",
          isOpen 
            ? "bg-white/15 border-white/20 px-3 gap-2" 
            : "bg-white/5 border-white/10 hover:bg-white/10"
        )}
        onClick={() => setIsOpen(!isOpen)}
        suppressHydrationWarning
      >
        <motion.div 
          layout
          className="flex items-center gap-2"
        >
          <AnimatePresence mode="popLayout">
            {(isOpen ? langs : sortedLangs.slice(0, 1)).map((lang, idx) => (
              <motion.button
                key={lang.id}
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.2 }}
                onClick={(e) => {
                  e.stopPropagation()
                  handleSelect(lang.id)
                }}
                className={cn(
                  "relative w-7 h-7 rounded-full overflow-hidden transition-all duration-300 ring-2 ring-offset-2 ring-offset-transparent shrink-0",
                  language === lang.id 
                    ? "ring-[var(--color-gold)] grayscale-0 z-10" 
                    : "ring-transparent opacity-60 grayscale hover:opacity-100 hover:grayscale-0"
                )}
                title={lang.label}
              >
                <Image
                  src={lang.flag}
                  alt={lang.label}
                  fill
                  className="object-cover"
                />
              </motion.button>
            ))}
          </AnimatePresence>
          {!isOpen && (
            <span className="text-[10px] font-bold text-white/50 ml-1 uppercase">{language}</span>
          )}
        </motion.div>
      </div>
    </div>
  )
}

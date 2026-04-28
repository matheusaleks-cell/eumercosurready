import React, { useState } from 'react'
import { useLanguage, type Language } from '@/hooks/use-language'
import { cn } from '@/lib/utils'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'

export const LanguageSwitcher = () => {
  const { language, setLanguage } = useLanguage()
  const [isHovered, setIsHovered] = useState(false)

  const langs: { id: Language; label: string; flag: string }[] = [
    { id: 'pt', label: 'PT', flag: '/flags/Brasil.png' },
    { id: 'es', label: 'ES', flag: '/flags/Espanha.png' },
    { id: 'en', label: 'EN', flag: '/flags/EUA.png' }
  ]

  // Coloca o idioma atual primeiro na lista para o estado colapsado
  const sortedLangs = [...langs].sort((a, b) => {
    if (a.id === language) return -1
    if (b.id === language) return 1
    return 0
  })

  return (
    <div 
      className="relative flex items-center justify-center h-10 px-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm transition-all duration-500 hover:bg-white/10"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      suppressHydrationWarning
    >
      <motion.div 
        layout
        className="flex items-center gap-2"
      >
        <AnimatePresence mode="popLayout">
          {(isHovered ? sortedLangs : sortedLangs.slice(0, 1)).map((lang, idx) => (
            <motion.button
              key={lang.id}
              layout
              initial={{ opacity: 0, scale: 0.8, x: -10 }}
              animate={{ opacity: 1, scale: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.8, x: -10 }}
              transition={{ duration: 0.3, delay: idx * 0.05 }}
              onClick={() => setLanguage(lang.id)}
              className={cn(
                "relative w-6 h-6 rounded-full overflow-hidden transition-all duration-300 ring-2 ring-offset-2 ring-offset-transparent",
                language === lang.id 
                  ? "ring-[var(--color-gold)] grayscale-0 z-10" 
                  : "ring-transparent opacity-40 grayscale hover:opacity-100 hover:grayscale-0 hover:scale-110"
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
      </motion.div>
    </div>
  )
}

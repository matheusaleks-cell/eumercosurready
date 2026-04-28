'use client'

import React from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'

import { type Language } from '@/hooks/use-language'

interface LanguageLoadingProps {
  isVisible: boolean
  targetLanguage: Language | null
}

export const LanguageLoading = ({ isVisible, targetLanguage }: LanguageLoadingProps) => {
  const getLoadingText = () => {
    switch (targetLanguage) {
      case 'en': return 'Setting up Language'
      case 'es': return 'Configurando Idioma'
      case 'pt': return 'Configurando Idioma'
      default: return 'Configurando Idioma'
    }
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#0B1F3A] overflow-hidden"
        >
          {/* Fundo Decorativo */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-[var(--color-gold)]/20 blur-[150px] rounded-full" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-blue-500/20 blur-[150px] rounded-full" />
          </div>

          <div className="relative z-10 flex flex-col items-center">
            {/* Logo Centralizado com Animação */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ 
                scale: [0.95, 1.05, 0.95],
                opacity: 1
              }}
              transition={{ 
                scale: {
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                },
                opacity: { duration: 0.5 }
              }}
              className="relative w-48 h-48 md:w-64 md:h-64 mb-8"
            >
              <Image 
                src="/logo-mercosur.png" 
                alt="EU-Mercosur Ready" 
                fill 
                className="object-contain"
                priority
              />
            </motion.div>

            {/* Barra de Progresso Sutil */}
            <div className="w-48 h-1 bg-white/10 rounded-full overflow-hidden">
              <motion.div 
                initial={{ x: "-100%" }}
                animate={{ x: "100%" }}
                transition={{ 
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "linear"
                }}
                className="w-full h-full bg-gradient-to-r from-transparent via-[var(--color-gold)] to-transparent"
              />
            </div>
            
            <motion.p 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mt-6 text-white/60 font-display text-xs uppercase tracking-[0.4em] font-bold"
            >
              {getLoadingText()}
            </motion.p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

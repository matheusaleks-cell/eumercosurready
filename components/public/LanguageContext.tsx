'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { LanguageLoading } from './LanguageLoading'

export type Language = 'pt' | 'en' | 'es'

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (pt: string, en?: string | null, es?: string | null) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export const LanguageProvider = ({ 
  children, 
  initialLanguage = 'pt' 
}: { 
  children: React.ReactNode,
  initialLanguage?: Language 
}) => {
  const [language, setLanguageState] = useState<Language>(initialLanguage)
  const [isLoading, setIsLoading] = useState(false)
  const [targetLanguage, setTargetLanguage] = useState<Language | null>(null)

  // Sincronizar com localStorage no client
  useEffect(() => {
    const saved = localStorage.getItem('mr-language') as Language
    if (saved && ['pt', 'en', 'es'].includes(saved) && saved !== language) {
      setLanguageState(saved)
    }
  }, [language])

  const setLanguage = (lang: Language) => {
    setTargetLanguage(lang)
    setIsLoading(true)
    
    // Pequeno delay para garantir que o usuário veja a animação de loading
    // antes do navegador travar com o reload
    setTimeout(() => {
      setLanguageState(lang)
      localStorage.setItem('mr-language', lang)
      // Definir cookie para o servidor
      document.cookie = `mr-language=${lang}; path=/; max-age=31536000; SameSite=Lax`
      // Refresh para componentes de servidor
      window.location.reload()
    }, 600)
  }

  // Função auxiliar para selecionar o texto correto
  const t = (pt: string, en?: string | null, es?: string | null) => {
    if (language === 'en' && en) return en
    if (language === 'es' && es) return es
    return pt
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      <LanguageLoading isVisible={isLoading} targetLanguage={targetLanguage} />
      {children}
    </LanguageContext.Provider>
  )
}

export const useLanguage = () => {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}

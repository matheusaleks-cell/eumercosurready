'use client'
import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Mail, ArrowUp } from 'lucide-react'
import { useLanguage } from '@/hooks/use-language'

interface FloatingContactProps {
  phone?: string | null
  whatsapp?: string | null
  email?: string | null
  companyName?: string
  language?: string
}

export const FloatingContact = ({ phone, whatsapp, email, companyName, language }: FloatingContactProps) => {
  const { t } = useLanguage()
  const [isVisible, setIsVisible] = React.useState(false)

  React.useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 500) {
        setIsVisible(true)
      } else {
        setIsVisible(false)
      }
    }
    window.addEventListener('scroll', toggleVisibility)
    return () => window.removeEventListener('scroll', toggleVisibility)
  }, [])

  // Use specific or global
  const targetWhatsApp = whatsapp || phone || "34610410748"
  const targetEmail = email || "espana@madeinatlantic.com"

  const handleWhatsApp = () => {
    let message = ""
    if (companyName) {
      message = encodeURIComponent(t(
        `Olá, vi a ${companyName} na plataforma EU-Mercosur Ready e gostaria de conversar sobre parcerias.`,
        `Hi, I saw ${companyName} on the EU-Mercosur Ready platform and would like to discuss partnerships.`,
        `Hola, vi a ${companyName} en la plataforma EU-Mercosur Ready e me gustaría conversar sobre asociaciones.`
      ))
    }
    window.open(`https://wa.me/${targetWhatsApp.replace(/\D/g, '')}${message ? `?text=${message}` : ''}`, '_blank')
  }

  const handleEmail = () => {
    if (companyName) {
      const subject = encodeURIComponent(t(`Contato - ${companyName}`, `Contact - ${companyName}`, `Contacto - ${companyName}`))
      const body = encodeURIComponent(t(
        `Olá,\n\nGostaria de entrar em contato com a ${companyName} referente às oportunidades de negócio visualizadas na plataforma EU-Mercosur Ready.`,
        `Hello,\n\nI would like to contact ${companyName} regarding the business opportunities viewed on the EU-Mercosur Ready platform.`,
        `Hola,\n\nMe gustaría ponerme en contacto con ${companyName} en relación con las oportunidades de negocio visualizadas en la plataforma EU-Mercosur Ready.`
      ))
      window.location.href = `mailto:${targetEmail}?subject=${subject}&body=${body}`
    } else {
      window.location.href = `mailto:${targetEmail}`
    }
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 items-end">
      <AnimatePresence>
        {isVisible && (
          <motion.button
            initial={{ opacity: 0, scale: 0.5, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.5, y: 20 }}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="w-12 h-12 bg-white text-[var(--color-navy)] rounded-full shadow-lg flex items-center justify-center border border-gray-100 hover:bg-gray-50 transition-colors mb-2"
            title={t('Voltar ao topo', 'Back to top', 'Volver arriba')}
          >
            <ArrowUp size={20} />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Email Button */}
      <motion.button
        onClick={handleEmail}
        initial={{ opacity: 0, scale: 0.8, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ delay: 0.2, type: 'spring', stiffness: 200, damping: 20 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="w-12 h-12 bg-[var(--color-gold)] text-[var(--color-navy)] rounded-full flex items-center justify-center shadow-[0_8px_30px_rgba(200,148,58,0.4)] border-2 border-white cursor-pointer group"
        aria-label="Email Us"
      >
        <Mail size={22} className="group-hover:scale-110 transition-transform" />
      </motion.button>

      {/* WhatsApp Button */}
      <motion.button
        onClick={handleWhatsApp}
        initial={{ opacity: 0, scale: 0.8, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ delay: 0.3, type: 'spring', stiffness: 200, damping: 20 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="w-14 h-14 bg-[#25D366] text-white rounded-full flex items-center justify-center shadow-[0_8px_30px_rgba(37,211,102,0.4)] border-2 border-white cursor-pointer group"
        aria-label="WhatsApp Us"
      >
        <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor" className="group-hover:scale-110 transition-transform">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/>
        </svg>
      </motion.button>
    </div>
  )
}

'use client'

import React from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { Rocket, ArrowRight, ShieldCheck } from 'lucide-react'

import { useLanguage } from '@/hooks/use-language'

export const CallToAction = () => {
  const { t } = useLanguage()
  return (
    <section className="py-20 px-4 md:px-0">
      <div className="container-custom">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="relative bg-gradient-to-br from-[var(--color-navy)] via-[#0D2A4D] to-[var(--color-navy-mid)] rounded-[2.5rem] p-12 md:p-20 overflow-hidden shadow-2xl border border-white/5"
        >
          {/* Efeitos de Luz (Glow) */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-[var(--color-gold)]/10 blur-[120px] rounded-full -mr-20 -mt-20 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-500/10 blur-[120px] rounded-full -ml-20 -mb-20 pointer-events-none" />

          <div className="relative z-10 flex flex-col items-center text-center space-y-8">
            <motion.div 
               initial={{ scale: 0.8, opacity: 0 }}
               whileInView={{ opacity: 1, scale: 1 }}
               transition={{ delay: 0.2, type: "spring" }}
               className="relative mb-4"
             >
               {/* Logo sem fundo e muito maior */}
               <div className="relative w-48 h-48 drop-shadow-[0_0_20px_rgba(200,148,58,0.4)]">
                 <Image 
                   src="/logo-mercosur.png" 
                   alt="EU-Mercosur Ready" 
                   fill 
                   className="object-contain"
                   priority
                 />
               </div>
             </motion.div>


            <div className="space-y-4 max-w-4xl">
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-white leading-tight">
                {t('Somente empresas preparadas', 'Only prepared companies', 'Sólo empresas preparadas')} <br className="hidden md:block" />
                <span className="text-[var(--color-gold)]">{t('cruzam fronteiras.', 'cross borders.', 'cruzan fronteras.')}</span>
              </h2>
              <p className="text-base md:text-lg text-gray-300 font-body max-w-3xl mx-auto leading-relaxed">
                {t(
                  'Estar pronto para operar no Corredor UE-Mercosul não se resume a ter o melhor produto. Trata-se de ser visível para os compradores certos, no momento certo, e cumprir todas as aprovações, registros e adaptações necessárias. Você tem o produto, nós o guiaremos passo a passo durante todo o processo de expansão. Somos uma empresa local e atuamos no território para ajudá-lo, todos os dias do ano.',
                  'Being ready to operate in the EU-Mercosur Corridor is not just about having the best product. It is about being visible to the right buyers, at the right time, and complying with all necessary approvals, registrations, and adaptations. You have the product, we will guide you step by step throughout the expansion process. We are a local company and act in the territory to help you, every day of the year.',
                  'Estar listo para operar en el Corredor UE-Mercosur no se resume en tener el mejor producto. Se trata de ser visible para los compradores adecuados, en el momento adecuado, y cumplir con todas las aprobaciones, registros y adaptaciones necesarias. Usted tiene el producto, nosotros lo guiaremos paso a paso durante todo el proceso de expansión. Somos una empresa local y actuamos en el territorio para ayudarle, todos los días del año.'
                )}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-6 pt-4">
              <Link 
                href="/solicitar-cadastro"
                className="btn-premium flex items-center gap-3 group"
              >
                <span>{t('Quero promover minha empresa', 'I want to promote my company', 'Quiero promover mi empresa')}</span>
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              
              <div className="flex items-center gap-2 text-white/60 text-sm font-medium">
                <ShieldCheck size={18} className="text-green-500" />
                <span>{t('Processo de verificação seguro', 'Secure verification process', 'Proceso de verificación seguro')}</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

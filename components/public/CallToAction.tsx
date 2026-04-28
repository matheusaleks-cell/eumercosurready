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
                {t('Apenas Empresas Preparadas', 'Only Prepared Companies', 'Sólo Empresas Preparadas')} <br className="hidden md:block" />
                <span className="text-[var(--color-gold)]">{t('Cruzam Fronteiras.', 'Cross Borders.', 'Cruzan Fronteras.')}</span>
              </h2>
              <p className="text-base md:text-lg text-gray-300 font-body max-w-3xl mx-auto leading-relaxed">
                {t(
                  'Estar preparado para a aliança EU-Mercosul não é sobre ter o melhor produto. É sobre estar visível para os compradores certos, na hora certa, com a documentação auditada. Você tem a infraestrutura. Nós temos o palco global.',
                  'Being prepared for the EU-Mercosur alliance is not about having the best product. It is about being visible to the right buyers, at the right time, with audited documentation. You have the infrastructure. We have the global stage.',
                  'Estar preparado para la alianza UE-Mercosur no se trata de tener el mejor producto. Se trata de ser visible para os compradores adequados, en el momento adequado, con documentación auditada. Usted tiene la infraestructura. Nosotros temos el escenario global.'
                )}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-6 pt-4">
              <Link 
                href="/solicitar-cadastro"
                className="btn-premium flex items-center gap-3 group"
              >
                <span>{t('Iniciar Auditoria e Promover Empresa', 'Start Audit and Promote Company', 'Iniciar Auditoría y Promover Empresa')}</span>
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              
              <div className="flex items-center gap-2 text-white/60 text-sm font-medium">
                <ShieldCheck size={18} className="text-green-500" />
                <span>{t('Processo de verificação seguro', 'Secure verification process', 'Proceso de verificación seguro')}</span>
              </div>
            </div>

            {/* Tags Flutuantes Decorativas (Visual Premium) */}
            <div className="hidden lg:block absolute left-20 top-20 animate-bounce transition-all duration-1000">
               <div className="px-4 py-2 bg-white/5 backdrop-blur-md rounded-full border border-white/10 text-xs text-white/50">
                  {t('+1.200 Empresas Conectadas', '+1,200 Connected Companies', '+1.200 Empresas Conectadas')}
               </div>
            </div>
            <div className="hidden lg:block absolute right-20 bottom-20 animate-pulse">
               <div className="px-4 py-2 bg-white/5 backdrop-blur-md rounded-full border border-white/10 text-xs text-white/50">
                  {t('Exportação Simplificada', 'Simplified Export', 'Exportación Simplificada')}
               </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

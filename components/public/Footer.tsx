// components/public/Footer.tsx
import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowUpRight, Share2, Globe, MessageCircle, Send } from 'lucide-react'
import prisma from '@/lib/prisma'
import { cookies } from 'next/headers'

export const Footer = async () => {
  const cookieStore = await cookies()
  const language = cookieStore.get('mr-language')?.value || 'pt'
  
  const t = (pt: string, en?: string | null, es?: string | null) => {
    if (language === 'en' && en) return en
    if (language === 'es' && es) return es
    return pt
  }

  // Buscar configurações para links sociais
  const settings = await prisma.platformSetting.findMany();
  const config = settings.reduce((acc, curr) => {
    acc[curr.key] = curr.value;
    return acc;
  }, {} as Record<string, string>);

  const socialLinks = [
    { key: 'SOCIAL_LINKEDIN', icon: Share2, label: 'LinkedIn' },
    { key: 'SOCIAL_INSTAGRAM', icon: Globe, label: 'Instagram' },
    { key: 'SOCIAL_FACEBOOK', icon: MessageCircle, label: 'Facebook' },
    { key: 'SOCIAL_TWITTER', icon: Send, label: 'Twitter' },
  ];

  return (
    <footer className="bg-[var(--color-navy)] text-gray-400 py-20 border-t border-white/5">
      <div className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Info */}
          <div className="col-span-1 lg:col-span-1">
            <Link href="/" className="inline-block mb-6 group">
              <div className="relative w-20 h-20 overflow-hidden">
                <Image 
                  src="/logo-mercosur.png" 
                  alt={config['PLATFORM_NAME'] || "EU-Mercosur Ready"} 
                  fill 
                  className="object-contain scale-110"
                />
              </div>
            </Link>

            <p className="text-sm font-body leading-relaxed mb-6">
              {t(
                config['FOOTER_TEXT'] || "Conectando líderes e empresas que moldam o futuro do comércio entre a Europa e o Mercosul.",
                config['FOOTER_TEXT_EN'] || "Connecting leaders and companies shaping the future of trade between Europe and Mercosur.",
                config['FOOTER_TEXT_ES'] || "Conectando líderes y empresas que moldan el futuro del comercio entre Europa y el Mercosur."
              )}
            </p>
            <div className="flex items-center gap-3">
              {socialLinks.map((social) => config[social.key] && (
                <Link 
                  key={social.key}
                  href={config[social.key]} 
                  target="_blank"
                  className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-[var(--color-gold)] hover:text-[var(--color-navy)] transition-all"
                  title={social.label}
                >
                  <social.icon size={18} />
                </Link>
              ))}
            </div>
          </div>

          {/* Navegação */}
          <div>
            <h4 className="text-white font-display font-bold mb-6">{t('Plataforma', 'Platform', 'Plataforma')}</h4>
            <ul className="space-y-4 text-sm font-body">
              <li><Link href="/" className="hover:text-[var(--color-gold)] transition-colors">{t('Vitrine de Empresas', 'Company Showcase', 'Escaparate de Empresas')}</Link></li>
              <li><Link href="/sobre" className="hover:text-[var(--color-gold)] transition-colors">{t('Sobre', 'About', 'Sobre')}</Link></li>
              <li><Link href="/solicitar-cadastro" className="hover:text-[var(--color-gold)] transition-colors">{t('Cadastrar Negócio', 'Register Business', 'Registrar Negocio')}</Link></li>
            </ul>
          </div>
          
          {/* Suporte */}
          <div>
            <h4 className="text-white font-display font-bold mb-6">{t('Suporte', 'Support', 'Soporte')}</h4>
            <ul className="space-y-4 text-sm font-body">
              <li><Link href="/aviso-legal" className="hover:text-[var(--color-gold)] transition-colors">{t('Aviso Legal', 'Legal Notice', 'Aviso Legal')}</Link></li>
              <li><Link href="/politica-de-privacidade" className="hover:text-[var(--color-gold)] transition-colors">{t('Política de Privacidade', 'Privacy Policy', 'Política de Privacidad')}</Link></li>
              <li><Link href="/politica-de-cookies" className="hover:text-[var(--color-gold)] transition-colors">{t('Política de Cookies', 'Cookie Policy', 'Política de Cookies')}</Link></li>
              {config['SUPPORT_WHATSAPP'] && (
                <li>
                  <Link 
                    href={`https://wa.me/${config['SUPPORT_WHATSAPP'].replace(/\D/g, '')}`} 
                    className="hover:text-[var(--color-gold)] transition-colors"
                  >
                    {t('Contato Direto', 'Direct Contact', 'Contacto Directo')}
                  </Link>
                </li>
              )}
            </ul>
          </div>
          
          {/* Newsletter/Disclaimer */}
          <div>
            <h4 className="text-white font-display font-bold mb-6">Made In Atlantic</h4>
            <p className="text-xs font-body mb-4">
              {t(
                'Este ecossistema é uma iniciativa para facilitar o networking B2B e a internacionalização de empresas no eixo atlântico.',
                'This ecosystem is an initiative to facilitate B2B networking and the internationalization of companies on the Atlantic axis.',
                'Este ecosistema es una iniciativa para facilitar el networking B2B y la internacionalización de empresas en el eje atlántico.'
              )}
            </p>
            <Link 
              href="https://madeinatlantic.com" 
              target="_blank"
              className="inline-flex items-center gap-2 p-3 bg-white/5 border border-white/10 rounded-[var(--radius-md)] text-xs font-bold text-white hover:bg-white/10 transition-all uppercase tracking-widest"
            >
              {t('Visitar Portal Oficial', 'Visit Official Portal', 'Visitar Portal Oficial')}
              <ArrowUpRight size={14} />
            </Link>
          </div>
        </div>
        
        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs font-body">
            &copy; {new Date().getFullYear()} {config['PLATFORM_NAME'] || 'Made In Atlantic'}. {t('Todos os direitos reservados.', 'All rights reserved.', 'Todos los derechos reservados.')}
          </p>
          <div className="flex gap-6 text-[10px] uppercase font-bold tracking-widest">
            <span>{t('Desenvolvido por', 'Powered by', 'Desarrollado por')} Made In Atlantic</span>
          </div>
        </div>
      </div>
    </footer>
  )
}

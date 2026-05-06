// components/public/Footer.tsx
import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowUpRight, Globe, MessageCircle, Send } from 'lucide-react'
import prisma from '@/lib/prisma'
import { cookies } from 'next/headers'
import { cn } from '@/lib/utils'

// Ícones SVG oficiais para evitar erros de versão do Lucide
const LinkedInIcon = ({ size = 18 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
  </svg>
)

const InstagramIcon = ({ size = 18 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
  </svg>
)

const FacebookIcon = ({ size = 18 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
)

const TwitterIcon = ({ size = 18 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
)

export const Footer = async () => {
  const cookieStore = await cookies()
  const language = cookieStore.get('mr-language')?.value || 'pt'
  
  const t = (pt: string, en?: string | null, es?: string | null) => {
    if (language === 'en' && en) return en
    if (language === 'es' && es) return es
    return pt
  }

  // Buscar configurações para links sociais
  let config: Record<string, string> = {};
  try {
    const settings = await prisma.platformSetting.findMany();
    config = settings.reduce((acc, curr) => {
      acc[curr.key] = curr.value;
      return acc;
    }, {} as Record<string, string>);
  } catch (error) {
    console.error("Erro ao carregar configurações no Footer:", error);
  }

  const socialLinks = [
    { key: 'SOCIAL_LINKEDIN', icon: LinkedInIcon, label: 'LinkedIn', color: 'hover:bg-[#0077B5]' },
    { key: 'SOCIAL_INSTAGRAM', icon: InstagramIcon, label: 'Instagram', color: 'hover:bg-[#E1306C]' },
    { key: 'SOCIAL_FACEBOOK', icon: FacebookIcon, label: 'Facebook', color: 'hover:bg-[#1877F2]' },
    { key: 'SOCIAL_TWITTER', icon: TwitterIcon, label: 'Twitter', color: 'hover:bg-black' },
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
                  className={cn(
                    "w-10 h-10 rounded-full bg-white/5 flex items-center justify-center transition-all hover:text-white",
                    social.color
                  )}
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
              <li><Link href="/sobre" className="hover:text-[var(--color-gold)] transition-colors">{t('Sobre Nós', 'About Us', 'Sobre Nosotros')}</Link></li>
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
          
          {/* Newsletter/Disclaimer & Grupo Oficial */}
          <div>
            <h4 className="text-white font-display font-bold mb-6">Made In Atlantic</h4>
            <p className="text-xs font-body mb-6">
              {t(
                'Este ecossistema é uma iniciativa para facilitar o networking B2B e a internacionalização de empresas no eixo atlântico.',
                'This ecosystem is an initiative to facilitate B2B networking and the internationalization of companies on the Atlantic axis.',
                'Este ecosistema es una iniciativa para facilitar el networking B2B e a internacionalización de empresas en el eje atlántico.'
              )}
            </p>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-5 group hover:border-[#0077B5]/50 transition-colors">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 rounded-full bg-[#0077B5] flex items-center justify-center text-white shrink-0">
                  <LinkedInIcon size={14} />
                </div>
                <h5 className="text-white text-sm font-bold leading-tight">{t('Nosso Grupo Oficial', 'Our Official Group', 'Nuestro Grupo Oficial')}</h5>
              </div>
              <p className="text-xs text-gray-400 mb-4 leading-relaxed">
                {t(
                  'Faça parte da nossa comunidade exclusiva no LinkedIn e conecte-se com líderes do Corredor.',
                  'Join our exclusive LinkedIn community and connect with leaders in the Corridor.',
                  'Únase a nuestra comunidad exclusiva en LinkedIn y conéctese con líderes del Corredor.'
                )}
              </p>
              <Link 
                href="https://www.linkedin.com/groups/18131078/"
                target="_blank"
                className="inline-flex items-center justify-center gap-2 w-full py-2.5 bg-white/10 group-hover:bg-[#0077B5] text-white text-xs font-bold rounded-xl transition-all"
              >
                <span>{t('Participar do Grupo', 'Join Group', 'Unirse al Grupo')}</span>
                <ArrowUpRight size={14} />
              </Link>
            </div>
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

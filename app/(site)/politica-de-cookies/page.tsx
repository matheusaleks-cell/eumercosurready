// app/(public)/politica-de-cookies/page.tsx
import React from 'react'
import { Metadata } from 'next'
import { cookies } from 'next/headers'
import { Cookie, Info, ExternalLink, ShieldCheck } from 'lucide-react'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Política de Cookies | EU-Mercosur Ready',
  description: 'Saiba como utilizamos cookies para melhorar sua experiência na plataforma EU-Mercosur Ready.',
}

export default async function CookiePolicyPage() {
  const cookieStore = await cookies()
  const language = cookieStore.get('mr-language')?.value || 'pt'
  
  const t = (pt: string, en?: string | null, es?: string | null) => {
    if (language === 'en' && en) return en
    if (language === 'es' && es) return es
    return pt
  }

  return (
    <main className="min-h-screen bg-white">
      {/* Hero Minimalista */}
      <section className="bg-[var(--color-navy)] py-20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
        <div className="container-custom relative z-10">
          <div className="max-w-3xl">
            <div className="flex items-center gap-3 text-[var(--color-gold)] mb-4">
              <Cookie size={20} />
              <span className="text-xs font-black uppercase tracking-[0.3em]">Cookies & Tracking</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-display font-black text-white leading-tight mb-6">
              {t('Política de Cookies', 'Cookie Policy', 'Política de Cookies')}
            </h1>
            <p className="text-xl text-gray-400 font-body leading-relaxed">
              {t(
                'Transparência total sobre como utilizamos tecnologias de armazenamento no seu navegador.',
                'Full transparency on how we use storage technologies in your browser.',
                'En MADE IN ATLANTIC, nos tomamos muy en serio tu privacidad.'
              )}
            </p>
          </div>
        </div>
      </section>

      {/* Conteúdo Legal */}
      <section className="py-20">
        <div className="container-custom max-w-4xl">
          <div className="space-y-12 text-[var(--color-navy)] font-body leading-relaxed">
            
            <div className="space-y-4">
              <h2 className="text-2xl font-display font-bold flex items-center gap-3">
                <Info className="text-[var(--color-gold)]" size={24} />
                1. {t('O que é uma cookie?', 'What is a cookie?', '¿Qué es una cookie?')}
              </h2>
              <p>
                {t(
                  'Uma cookie é um pequeno ficheiro de texto que é descarregado no seu navegador ao aceder a determinadas páginas web. A sua finalidade principal é armazenar e recuperar informação sobre os seus hábitos de navegação ou do seu equipamento.',
                  'A cookie is a small text file that is downloaded to your browser when accessing certain web pages. Its primary purpose is to store and retrieve information about your browsing habits or your equipment.',
                  'Una cookie es un pequeño archivo de texto que se descarga en tu navegador al acceder a determinadas páginas web. Su finalidad principal es almacenar y recuperar información sobre tus hábitos de navegación o de tu equipo.'
                )}
              </p>
            </div>

            <div className="space-y-6">
              <h2 className="text-2xl font-display font-bold">2. {t('Uso de cookies neste site', 'Use of cookies on this website', 'Uso de cookies en este sitio web')}</h2>
              <p>
                {t(
                  'Atualmente, o site da MADE IN ATLANTIC informa os seus utilizadores do seguinte:',
                  'Currently, the MADE IN ATLANTIC website informs its users of the following:',
                  'Actualmente, el sitio web de MADE IN ATLANTIC informa a sus usuarios de lo siguiente:'
                )}
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="p-8 rounded-2xl bg-emerald-50 border border-emerald-100 space-y-4">
                  <div className="flex items-center gap-3 text-emerald-600">
                    <ShieldCheck size={24} />
                    <h3 className="font-bold uppercase tracking-wider text-xs">{t('Cookies Próprias', 'First-party Cookies', 'Cookies Propias')}</h3>
                  </div>
                  <p className="text-sm">
                    {t(
                      'Não utilizamos cookies próprias para recolher informação do utilizador além do estritamente necessário para o funcionamento da sessão.',
                      'We do not use our own cookies to collect user information beyond what is strictly necessary for the operation of the session.',
                      'No utilizamos cookies propias para recabar información del usuario.'
                    )}
                  </p>
                </div>

                <div className="p-8 rounded-2xl bg-blue-50 border border-blue-100 space-y-4">
                  <div className="flex items-center gap-3 text-blue-600">
                    <ShieldCheck size={24} />
                    <h3 className="font-bold uppercase tracking-wider text-xs">{t('Cookies de Terceiros', 'Third-party Cookies', 'Cookies de Terceros')}</h3>
                  </div>
                  <p className="text-sm">
                    {t(
                      'Não utilizamos serviços de terceiros que instalem cookies de seguimento, analítica ou publicidade personalizada no seu navegador através do nosso domínio.',
                      'We do not use third-party services that install tracking, analytics, or personalized advertising cookies in your browser through our domain.',
                      'No utilizamos servicios de terceros que instalen cookies de seguimiento, analítica o publicidad personalizada.'
                    )}
                  </p>
                </div>
              </div>

              <p className="p-6 bg-gray-50 rounded-xl border border-gray-100 text-sm italic">
                {t(
                  'A nossa web está desenhada para ser o mais respeitadora possível da privacidade dos nossos clientes e colaboradores.',
                  'Our website is designed to be as respectful as possible of the privacy of our clients and collaborators.',
                  'Nuestra web está diseñada para ser lo más respetuosa posible con la privacidad de nuestros clientes y colaboradores, limitándonos a las funcionalidades estrictamente necesarias.'
                )}
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl font-display font-bold">3. {t('Links a terceiros', 'Links to third parties', 'Enlaces a terceros')}</h2>
              <p>
                {t(
                  'Caso a nossa web contenha links para sites de terceiros (como LinkedIn ou outras redes sociais), informamos que, ao clicar nesses links e abandonar a nossa web, cada um desses sites terá a sua própria Política de Cookies e de Privacidade.',
                  'In case our website contains links to third-party sites (such as LinkedIn or other social networks), we inform you that, by clicking on those links and leaving our web, each of those sites will have its own Cookie and Privacy Policy.',
                  'En caso de que nuestra web contenga enlaces a sitios web de terceros, al pulsar en dichos enlaces y abandonar nuestra web, cada uno de esos sitios tendrá su propia Política de Cookies y de Privacidad.'
                )}
              </p>
            </div>

            <div className="p-10 bg-[var(--color-navy)] rounded-[2rem] text-white space-y-6">
              <h2 className="text-2xl font-display font-bold">{t('Responsável e Contacto', 'Responsible and Contact', 'Responsable del Tratamiento y Contacto')}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm">
                <div className="space-y-2">
                  <p className="text-gray-400 uppercase tracking-widest text-[10px] font-black">{t('Responsável', 'Responsible', 'Responsable')}</p>
                  <p className="font-bold text-lg">Teodoro Da Silva</p>
                </div>
                <div className="space-y-2">
                  <p className="text-gray-400 uppercase tracking-widest text-[10px] font-black">{t('Endereço', 'Address', 'Dirección')}</p>
                  <p>Calle Corazón de María 51, 28002 - Madrid, Espanha.</p>
                </div>
                <div className="space-y-2 col-span-1 md:col-span-2">
                  <p className="text-gray-400 uppercase tracking-widest text-[10px] font-black">{t('E-mail de Contacto', 'Contact Email', 'Correo electrónico')}</p>
                  <p className="text-[var(--color-gold)] font-bold text-lg">espana@madeinatlantic.com</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>
    </main>
  )
}

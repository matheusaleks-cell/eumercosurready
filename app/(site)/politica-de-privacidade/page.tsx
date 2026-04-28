// app/(public)/politica-de-privacidade/page.tsx
import React from 'react'
import { Metadata } from 'next'
import { cookies } from 'next/headers'
import { Shield, Lock, Eye, FileText, ChevronRight } from 'lucide-react'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Política de Privacidade | EU-Mercosur Ready',
  description: 'Conheça como tratamos seus dados e garantimos sua privacidade na plataforma EU-Mercosur Ready.',
}

export default async function PrivacyPolicyPage() {
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
              <Shield size={20} />
              <span className="text-xs font-black uppercase tracking-[0.3em]">Compliance & Privacy</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-display font-black text-white leading-tight mb-6">
              {t('Política de Privacidade', 'Privacy Policy', 'Política de Privacidad')}
            </h1>
            <p className="text-xl text-gray-400 font-body leading-relaxed">
              {t(
                'Na Made In Atlantic, levamos a sério a transparência e a proteção dos seus dados profissionais.',
                'At Made In Atlantic, we take transparency and the protection of your professional data seriously.',
                'En Made In Atlantic, nos tomamos muy en serio la transparencia y la protección de sus datos profesionales.'
              )}
            </p>
          </div>
        </div>
      </section>

      {/* Conteúdo Legal */}
      <section className="py-20">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
            
            {/* Sidebar de Navegação Rápida */}
            <aside className="lg:col-span-4 space-y-8">
              <div className="sticky top-32 p-8 bg-[var(--color-bg-alt)] border border-[var(--color-border)] rounded-[var(--radius-lg)]">
                <h3 className="text-sm font-black uppercase tracking-widest text-[var(--color-navy)] mb-6 border-b border-[var(--color-border)] pb-4">
                  {t('Navegação', 'Navigation', 'Navegación')}
                </h3>
                <nav className="space-y-4">
                  {[
                    { id: 'identidade', label: t('Responsável', 'Responsible Entity', 'Identidad del Responsable') },
                    { id: 'finalidade', label: t('Finalidade', 'Purpose', 'Finalidad del tratamiento') },
                    { id: 'base-juridica', label: t('Base Jurídica', 'Legal Basis', 'Base Jurídica') },
                    { id: 'conservacao', label: t('Conservação', 'Data Retention', 'Conservación de los datos') },
                    { id: 'destinatarios', label: t('Destinatários', 'Recipients', 'Destinatarios') },
                    { id: 'direitos', label: t('Seus Direitos', 'Your Rights', 'Sus Derechos') },
                  ].map((item) => (
                    <a 
                      key={item.id} 
                      href={`#${item.id}`} 
                      className="group flex items-center justify-between text-sm font-bold text-[var(--color-text-muted)] hover:text-[var(--color-gold)] transition-colors"
                    >
                      {item.label}
                      <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
                    </a>
                  ))}
                </nav>
              </div>
            </aside>

            {/* Texto Principal */}
            <div className="lg:col-span-8 space-y-16 text-[var(--color-navy)] font-body leading-relaxed">
              
              <div id="identidade" className="scroll-mt-32 space-y-4">
                <h2 className="text-2xl font-display font-bold">1. {t('Identidade do Responsável', 'Responsible Entity Identity', 'Identidad del Responsable')}</h2>
                <p>
                  {t(
                    'O responsável pelo tratamento dos seus dados é Teodoro Da Silva (doravante, "Made In Atlantic"), com sede na Calle Corazón de María 51, 28002 - Madrid, Espanha e e-mail de contacto: espana@madeinatlantic.com.',
                    'The entity responsible for processing your data is Teodoro Da Silva (hereinafter, "Made In Atlantic"), based at Calle Corazón de María 51, 28002 - Madrid, Spain and contact email: espana@madeinatlantic.com.',
                    'El responsable del tratamiento de sus datos es Teodoro Da Silva (en adelante, "Made In Atlantic"), con domicilio en Calle Corazón de María 51, 28002 - Madrid, España y correo electrónico de contacto: espana@madeinatlantic.com.'
                  )}
                </p>
              </div>

              <div id="finalidade" className="scroll-mt-32 space-y-4">
                <h2 className="text-2xl font-display font-bold">2. {t('Finalidade do Tratamento', 'Purpose of Processing', 'Finalidad del tratamiento')}</h2>
                <p>
                  {t(
                    'Na Made In Atlantic tratamos a informação que nos facultam as pessoas interessadas com o fim de:',
                    'At Made In Atlantic we process the information provided by interested parties in order to:',
                    'En Made In Atlantic tratamos la información que nos facilitan las personas interesadas con el fin de:'
                  )}
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>{t('Gerir o intercâmbio de informação e propostas relativas ao Desenvolvimento de Negócio na nossa região.', 'Manage the exchange of information and proposals regarding Business Development in our region.', 'Gestionar el intercambio de información y propuestas relativas al Desarrollo de Negocio en nuestra región.')}</li>
                  <li>{t('Estabelecer e manter relações profissionais de valor.', 'Establish and maintain valuable professional relationships.', 'Establecer y mantener relaciones profesionales de valor.')}</li>
                  <li>{t('Facilitar a conexão entre empresas, fornecedores e parceiros estratégicos no quadro do Acordo EU-Mercosul (e LatAm).', 'Facilitate the connection between companies, suppliers and strategic partners within the framework of the EU-Mercosur Agreement (and LatAm).', 'Facilitar la conexión entre empresas, proveedores y socios estratégicos dentro del marco del Acuerdo EU-Mercosur (y LatAm), siempre bajo el paraguas de la colaboración mutua.')}</li>
                  <li>{t('Enviar comunicações específicas sobre oportunidades de mercado, inteligência de negócio ou alterações regulamentares.', 'Send specific communications about market opportunities, business intelligence or regulatory changes.', 'Enviar comunicaciones específicas sobre oportunidades de mercado, inteligencia de negocio o cambios regulatorios que afecten directamente a la actividad del interesado.')}</li>
                </ul>
              </div>

              <div id="base-juridica" className="scroll-mt-32 space-y-4">
                <h2 className="text-2xl font-display font-bold">3. {t('Base Jurídica (Legitimação)', 'Legal Basis (Legitimation)', 'Base Jurídica (Legitimación)')}</h2>
                <p>
                  {t(
                    'Baseamos o tratamento dos seus dados em:',
                    'We base the processing of your data on:',
                    'Para que nuestra relación sea fluida y transparente, basamos el tratamiento de sus datos en:'
                  )}
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                  <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100">
                    <h4 className="font-bold mb-2">{t('Interesse Legítimo', 'Legitimate Interest', 'Interés legítimo')}</h4>
                    <p className="text-sm text-[var(--color-text-muted)]">
                      {t(
                        'Como profissionais do setor, existe um interesse mútuo em manter uma comunicação ativa para identificação de oportunidades.',
                        'As professionals in the sector, there is a mutual interest in maintaining active communication to identify opportunities.',
                        'Entendemos que, como profesionales del sector, existe un interés mutuo en mantener una comunicación activa.'
                      )}
                    </p>
                  </div>
                  <div className="p-6 bg-gray-50 rounded-2xl border border-gray-100">
                    <h4 className="font-bold mb-2">{t('Consentimento', 'Consent', 'Su consentimiento')}</h4>
                    <p className="text-sm text-[var(--color-text-muted)]">
                      {t(
                        'Ao contactar-nos, autoriza-nos a tratar os seus dados básicos para os fins de desenvolvimento de negócio mencionados.',
                        'By contacting us, you authorize us to process your basic data for the mentioned business development purposes.',
                        'Al contactar con nosotros, usted nos autoriza a tratar sus datos básicos (nombre, cargo, empresa y contacto).'
                      )}
                    </p>
                  </div>
                </div>
                <p className="text-xs italic text-gray-500 mt-4">
                  {t(
                    'Nota: Na Made In Atlantic não utilizamos os seus dados para campanhas de marketing massivo ou automatizado (spam). Cada contacto é gerido de forma individual.',
                    'Note: At Made In Atlantic we do not use your data for mass or automated marketing campaigns (spam). Each contact is managed individually.',
                    'Nota: En Made In Atlantic no utilizamos sus datos para campañas de marketing masivo o automatizado (spam). Cada contacto es gestionado de forma individual.'
                  )}
                </p>
              </div>

              <div id="conservacao" className="scroll-mt-32 space-y-4">
                <h2 className="text-2xl font-display font-bold">4. {t('Conservação dos Dados', 'Data Retention', 'Conservación de los datos')}</h2>
                <p>
                  {t(
                    'Os dados pessoais fornecidos serão conservados enquanto se mantiver a relação profissional ou enquanto o interessado não solicitar a sua eliminação.',
                    'The personal data provided will be kept as long as the professional relationship is maintained or as long as the interested party does not request its deletion.',
                    'Los datos personales proporcionados se conservarán mientras se mantenga la relación profesional o mientras el interesado no solicite su supresión.'
                  )}
                </p>
              </div>

              <div id="destinatarios" className="scroll-mt-32 space-y-4">
                <h2 className="text-2xl font-display font-bold">5. {t('Destinatários e Transferências', 'Recipients and Transfers', 'Destinatarios y Transferencias')}</h2>
                <p>
                  {t(
                    'A Made In Atlantic atua como uma ponte estratégica. Não venderemos nem cederemos os seus dados a terceiros para fins alheios ao seu próprio interesse comercial.',
                    'Made In Atlantic acts as a strategic bridge. We will not sell or transfer your data to third parties for purposes unrelated to your own commercial interest.',
                    'Made In Atlantic actúa como un puente estratégico. No venderemos ni cederemos sus datos a terceros para fines ajenos a su propio interés comercial.'
                  )}
                </p>
              </div>

              <div id="direitos" className="scroll-mt-32 space-y-4">
                <h2 className="text-2xl font-display font-bold">6. {t('Seus Direitos', 'Your Rights', 'Sus Derechos')}</h2>
                <p>
                  {t(
                    'Pode exercer os seus direitos de acesso, retificação, eliminação, limitação ou oposição enviando um e-mail para espana@madeinatlantic.com.',
                    'You can exercise your rights of access, rectification, deletion, limitation, or opposition by sending an email to espana@madeinatlantic.com.',
                    'Usted tiene derecho a obtener confirmación sobre si estamos tratando sus datos. Puede ejercer sus derechos enviando un correo a espana@madeinatlantic.com.'
                  )}
                </p>
              </div>

            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

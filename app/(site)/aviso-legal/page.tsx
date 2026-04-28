// app/(public)/aviso-legal/page.tsx
import React from 'react'
import { Metadata } from 'next'
import { cookies } from 'next/headers'
import { Gavel, Building, Scale, AlertCircle, FileCheck } from 'lucide-react'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Aviso Legal | EU-Mercosur Ready',
  description: 'Informações legais e termos de uso do portal EU-Mercosur Ready operado pela Made In Atlantic S.L.',
}

export default async function LegalNoticePage() {
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
        <div className="container-custom relative z-10 text-center mx-auto max-w-4xl">
          <div className="flex items-center justify-center gap-3 text-[var(--color-gold)] mb-4">
            <Gavel size={20} />
            <span className="text-xs font-black uppercase tracking-[0.3em]">Legal & Compliance</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-display font-black text-white leading-tight mb-6">
            {t('Aviso Legal', 'Legal Notice', 'Aviso Legal')}
          </h1>
          <p className="text-xl text-gray-400 font-body leading-relaxed">
            {t(
              'Informações obrigatórias sobre a titularidade e condições de uso do portal.',
              'Mandatory information about the ownership and conditions of use of the portal.',
              'Cumplimiento de la Ley 34/2002 de Servicios de la Sociedad de la Información.'
            )}
          </p>
        </div>
      </section>

      {/* Conteúdo Legal */}
      <section className="py-20">
        <div className="container-custom max-w-4xl">
          <div className="space-y-16 text-[var(--color-navy)] font-body leading-relaxed">
            
            {/* Dados Identificativos */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-b border-[var(--color-border)] pb-16">
              <div className="space-y-6">
                <div className="flex items-center gap-3 text-[var(--color-navy)]">
                  <Building className="text-[var(--color-gold)]" size={24} />
                  <h2 className="text-xl font-display font-bold uppercase tracking-widest">{t('Dados da Empresa', 'Company Data', 'Datos Identificativos')}</h2>
                </div>
                <div className="space-y-4 text-sm">
                  <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{t('Denominação Social', 'Social Denomination', 'Denominación Social')}</p>
                    <p className="font-bold text-lg">Made In Atlantic S.L.</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">NIF</p>
                    <p className="font-bold text-lg">B26916361</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{t('Sede Social', 'Registered Office', 'Domicilio Social')}</p>
                    <p className="font-medium">Calle Corazón de María 51, 28002 - Madrid, Espanha.</p>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 p-8 rounded-3xl border border-gray-100 flex flex-col justify-center">
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">{t('Dados Registrais', 'Registry Data', 'Datos Registrales')}</p>
                <p className="text-sm font-medium leading-relaxed">
                  {t(
                    'Inscrita no Registro Mercantil de Madrid, em folio electrónico, IRUS: 1000470177669, Folha M-882561, Inscrição 1ª.',
                    'Registered in the Commercial Registry of Madrid, in electronic folio, IRUS: 1000470177669, Sheet M-882561, 1st Registration.',
                    'Inscrita en el Registro Mercantil de Madrid, en folio electrónico, IRUS: 1000470177669, Hoja M-882561, Inscripción 1ª.'
                  )}
                </p>
              </div>
            </div>

            {/* Seções de Texto */}
            <div className="space-y-12">
              <div className="space-y-4">
                <h3 className="text-2xl font-display font-bold">1. {t('Objeto', 'Object', 'Objeto')}</h3>
                <p>
                  {t(
                    'Made In Atlantic S.L. coloca à disposição dos utilizadores o presente documento com o objetivo de dar cumprimento às obrigações legais, bem como informar sobre as condições de uso do portal web.',
                    'Made In Atlantic S.L. makes this document available to users with the aim of complying with legal obligations, as well as informing about the conditions of use of the web portal.',
                    'Made In Atlantic S.L. pone a disposición de los usuarios el presente documento con el objeto de dar cumplimiento a las obligaciones legales, así como informar sobre las condiciones de uso.'
                  )}
                </p>
              </div>

              <div className="space-y-4">
                <h3 className="text-2xl font-display font-bold">2. {t('Atividade e Finalidade', 'Activity and Purpose', 'Actividad y Finalidad')}</h3>
                <p>
                  {t(
                    'A Empresa dedica-se à exploração de um portal bilingue de inteligência comercial e serviços de intermediação comercial entre a União Europeia e os países do Mercosul.',
                    'The Company is dedicated to the operation of a bilingual portal for commercial intelligence and commercial intermediation services between the European Union and the Mercosur countries.',
                    'La Empresa se dedica a la explotación de un portal bilingüe de inteligencia comercial y servicios de intermediación comercial entre la Unión Europea y los países del Mercosur.'
                  )}
                </p>
              </div>

              <div className="space-y-4">
                <h3 className="text-2xl font-display font-bold">3. {t('Propriedade Intelectual', 'Intellectual Property', 'Propiedad Intelectual')}</h3>
                <p>
                  {t(
                    'O nome comercial, o domínio e a marca mista "EU-Mercosur Ready", bem como todos os conteúdos, designs e logótipos do portal, são propriedade da Made In Atlantic S.L.',
                    'The trade name, domain, and mixed trademark "EU-Mercosur Ready", as well as all contents, designs, and logos of the portal, are the property of Made In Atlantic S.L.',
                    'El nombre comercial, el dominio y la marca mixta "EU-Mercosur Ready", así como todos los contenidos, diseños y logotipos, son propiedad de Made In Atlantic S.L.'
                  )}
                </p>
              </div>

              <div className="p-8 bg-amber-50 rounded-2xl border border-amber-100 space-y-4">
                <div className="flex items-center gap-3 text-amber-700">
                  <AlertCircle size={20} />
                  <h3 className="font-bold text-lg">{t('Responsabilidade', 'Responsibility', 'Responsabilidad')}</h3>
                </div>
                <p className="text-sm text-amber-900/80">
                  {t(
                    'A Empresa não se responsabiliza pela veracidade da informação facultada pelos clientes nos seus perfis comerciais, embora se reserve o direito de retirar conteúdos que infrinjam a legalidade.',
                    'The Company is not responsible for the veracity of the information provided by customers in their commercial profiles, although it reserves the right to withdraw content that infringes legality.',
                    'La Empresa no se hace responsable de la veracidad de la información facilitada por los clientes, si bien se reserva el derecho de retirar contenidos que infrinjan la legalidad.'
                  )}
                </p>
              </div>

              <div className="space-y-4">
                <h3 className="text-2xl font-display font-bold">5. {t('Legislação Aplicável', 'Applicable Law', 'Legislación Aplicable')}</h3>
                <p>
                  {t(
                    'Para a resolução de todas as controvérsias ou questões relacionadas com o presente site, será aplicada a legislação espanhola, sendo competentes os Juizados e Tribunais de Madrid.',
                    'For the resolution of all controversies or issues related to this website, Spanish legislation will be applied, being competent the Courts and Tribunals of Madrid.',
                    'Para la resolución de todas las controversias relacionadas con el presente sitio web, será de aplicación la legislación española, siendo competentes los Juzgados de Madrid.'
                  )}
                </p>
              </div>
            </div>

            <div className="pt-16 flex justify-center">
               <div className="flex items-center gap-4 text-[var(--color-navy)]/30">
                  <FileCheck size={48} />
                  <div className="h-10 w-[1px] bg-[var(--color-border)]" />
                  <p className="text-[10px] font-black uppercase tracking-[0.4em] leading-tight">
                    Official Certified Portal<br />Made In Atlantic
                  </p>
               </div>
            </div>

          </div>
        </div>
      </section>
    </main>
  )
}

'use client'
// app/(public)/sobre/page.tsx
import React from 'react'
import { motion } from 'framer-motion'
import { 
  Building2, Globe2, ShieldCheck, Zap, 
  ArrowRight, CheckCircle2, Award, TrendingUp,
  LayoutGrid, Handshake, Users, Target, Heart
} from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { cn } from '@/lib/utils'
import { useLanguage } from '@/hooks/use-language'
import { CobeGlobe } from '@/components/public/CobeGlobe'

export default function SobrePage() {
  const { t } = useLanguage()
  
  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.6, ease: "easeOut" as any }
  }

  const levels = [
    {
      id: '01',
      title: t("Business Profile", "Business Profile", "Perfil de Negocio"),
      subtitle: t("Visibilidade e Acesso ao Mercado", "Market Visibility and Access", "Visibilidad y Acceso al Mercado"),
      desc: t(
        "Perfil profissional no ecossistema EU-Mercosur Ready, visibilidade perante potenciais clientes e parceiros, e participação em ações promocionais segmentadas. A empresa gere diretamente as suas relações comerciais.",
        "Professional profile in the EU-Mercosur Ready ecosystem, visibility to potential clients and partners, and participation in segmented promotional actions. The company manages its commercial relationships directly.",
        "Perfil profesional en el ecosistema EU-Mercosur Ready, visibilidad ante potenciales clientes y socios, y participación en acciones promocionales segmentadas. La empresa gestiona directamente sus relaciones comerciales."
      ),
      icon: <LayoutGrid className="text-[var(--color-navy)]" size={24} />
    },
    {
      id: '02',
      title: t("Apoio ao Desenvolvimento de Negócio", "Business Development Support", "Apoyo al Desarrollo de Negocio"),
      subtitle: t("Desenvolvimento Comercial Ativo", "Active Commercial Development", "Desarrollo Comercial Activo"),
      desc: t(
        "Apoio ativo no desenvolvimento de mercado no destino, introduções diretas a clientes e parceiros validados, acompanhamento comercial com conhecimento local profundo.",
        "Active support in market development at the destination, direct introductions to validated clients and partners, commercial follow-up with deep local knowledge.",
        "Apoyo activo en el desarrollo de mercado en el destino, introducciones directas a clientes y socios validados, seguimiento comercial con profundo conocimiento local."
      ),
      icon: <TrendingUp className="text-[var(--color-navy)]" size={24} />
    },
    {
      id: '03',
      title: t("Aliança Estratégica", "Strategic Alliance", "Alianza Estratégica"),
      subtitle: t("Crescimento com Modelo a Êxito", "Growth with Success-based Model", "Crecimiento con Modelo a Éxito"),
      desc: t(
        "Representação comercial plena no destino, ativação de mercado e geração ativa de oportunidades, gestão de clientes, fecho e acompanhamento. Colaboração de longo prazo com objetivos compartilhados.",
        "Full commercial representation at the destination, market activation and active lead generation, client management, closing, and follow-up. Long-term collaboration with shared objectives.",
        "Representación comercial plena en el destino, activación de mercado y generación activa de oportunidades, gestión de clientes, cierre y seguimiento. Colaboración de largo plazo con objetivos compartidos."
      ),
      icon: <Award className="text-[var(--color-navy)]" size={24} />
    }
  ]

  return (
    <div className="bg-[#fcfaf7] min-h-screen">
      {/* Seção Principal Unificada */}
      <section className="pt-40 pb-24 md:pt-48 md:pb-32 bg-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-40 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] pointer-events-none" />
        <div className="container-custom relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-start">
            <motion.div {...fadeInUp} className="space-y-10">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-[var(--color-gold)]/10 rounded-full border border-[var(--color-gold)]/20">
                  <Building2 size={14} className="text-[var(--color-gold)]" />
                  <span className="text-[var(--color-gold)] font-bold text-[10px] uppercase tracking-widest">{t("A Empresa", "The Company", "La Empresa")}</span>
                </div>
                <div className="flex items-center gap-4">
                   <Image src="/logo-made-in-atlantic.avif" alt="Made In Atlantic" width={180} height={60} className="object-contain" />
                </div>
              </div>
              
              <div className="space-y-8 text-lg text-gray-600 font-body leading-relaxed">
                <p className="text-[var(--color-navy)] font-display text-2xl leading-tight">
                  {t(
                    "Somos uma Plataforma B2B especializada em Desenvolvimento de Negócios, Vendas e Compras na região EU-Mercosul.",
                    "We are a B2B Platform specialized in Business Development, Sales, and Purchasing in the EU-Mercosur region.",
                    "Somos una Plataforma B2B especializada en Desarrollo de Negocios, Ventas y Compras en la región UE-Mercosur."
                  )}
                </p>
                
                <div className="space-y-4">
                  <p>
                    {t(
                      "Conhecemos a cultura, os tempos e os contatos-chave dos dois lados do Atlântico.",
                      "We know the culture, timings, and key contacts on both sides of the Atlantic.",
                      "Conocemos la cultura, los tiempos y los contactos clave de ambos lados del Atlántico."
                    )}
                  </p>
                  <p>
                    {t(
                      "Trabalhamos em colaboração com Câmaras de Comércio, Agências de Promoção Econômica, Clusters setoriais e Associações.",
                      "We work in collaboration with Chambers of Commerce, Economic Promotion Agencies, Sectoral Clusters, and Associations.",
                      "Trabajamos en colaboración con Cámaras de Comercio, Agencias de Promoción Económica, Clusters sectoriales y Asociaciones."
                    )}
                  </p>
                  <p>
                    {t(
                      "Não somos concorrência, somos o aliado que faz o trabalho local, de campo e ao longo de todo o ano.",
                      "We are not competition; we are the ally that does the local field work throughout the year.",
                      "No somos competencia, somos el aliado que realiza el trabajo local de campo durante todo el año."
                    )}
                  </p>
                </div>
                
                <div className="p-8 bg-white backdrop-blur-md rounded-[2rem] border-l-8 border-[var(--color-gold)] shadow-xl relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--color-gold)]/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl" />
                  <p className="text-[var(--color-navy)] text-xl md:text-2xl font-display leading-snug relative z-10 italic">
                    {t(
                      "\"Nosso modelo é o BDaaS - Business Development as a Service: você define o nível de implicação, nós executamos.\"",
                      "\"Our model is BDaaS - Business Development as a Service: you define the level of involvement, we execute.\"",
                      "\"Nuestro modelo es el BDaaS - Business Development as a Service: usted define el nivel de implicación, nosotros ejecutamos.\""
                    )}
                  </p>
                </div>
              </div>
            </motion.div>

            <div className="space-y-6">
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-[0.3em] mb-8">{t("Níveis de Atuação (BDaaS)", "Action Levels (BDaaS)", "Niveles de Actuación (BDaaS)")}</h3>
              <div className="grid gap-6">
                {levels.map((level, i) => (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, x: 30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.15 }}
                    className="group p-8 bg-white hover:bg-gray-50 rounded-3xl border border-gray-100 hover:border-[var(--color-gold)]/30 transition-all duration-500 shadow-sm hover:shadow-xl"
                  >
                    <div className="flex gap-6">
                      <div className="flex-shrink-0 w-14 h-14 rounded-2xl bg-gray-100 shadow-inner flex items-center justify-center group-hover:bg-[var(--color-gold)] group-hover:text-[var(--color-navy)] transition-all duration-500 transform group-hover:rotate-6">
                        {level.icon}
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center gap-3">
                          <span className="text-[9px] font-black text-[var(--color-navy)] bg-[var(--color-gold)] px-2.5 py-1 rounded-full whitespace-nowrap shrink-0">{t('Nível', 'Level', 'Nivel')} {level.id}</span>
                          <h4 className="font-display font-bold text-[var(--color-navy)] text-lg">{level.title}</h4>
                        </div>
                        <p className="text-[10px] font-bold text-[var(--color-gold-light)] uppercase tracking-widest">{level.subtitle}</p>
                        <p className="text-sm text-gray-600 leading-relaxed font-body">
                          {level.desc}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2.5 Nossos Valores */}
      <section className="py-24 bg-white relative overflow-hidden border-t border-gray-100">
        <div className="container-custom">
           <div className="max-w-4xl mx-auto text-center space-y-12">
              <motion.div {...fadeInUp} className="space-y-4">
                 <div className="inline-flex items-center gap-2 px-3 py-1 bg-[var(--color-navy)]/10 rounded-full border border-[var(--color-navy)]/20 mb-4">
                   <Heart size={14} className="text-[var(--color-navy)]" />
                   <span className="text-[var(--color-navy)] font-bold text-[10px] uppercase tracking-widest">{t("Nossos Valores", "Our Values", "Nuestros Valores")}</span>
                 </div>
                 <h2 className="text-3xl md:text-5xl font-display font-bold text-[var(--color-navy)] leading-tight">
                   {t("O que nos move?", "What drives us?", "¿Cuáles son nuestros valores?")}
                 </h2>
              </motion.div>
              
              <div className="grid md:grid-cols-2 gap-8 text-left">
                 <motion.div {...fadeInUp} className="p-8 bg-gray-50 rounded-3xl border border-gray-100 hover:border-[var(--color-gold)]/30 hover:shadow-lg transition-all duration-300">
                    <h3 className="text-xl font-bold text-[var(--color-navy)] mb-4">{t("Orgulho Regional", "Regional Pride", "Orgullo Regional")}</h3>
                    <p className="text-gray-600 leading-relaxed">
                      {t(
                        "Acreditamos profundamente no valor do que é produzido nas nossas terras. Num mundo que compete por preço e volume, nós apostamos na origem, na identidade e na qualidade do que fabricamos, cultivamos e inventamos em ambos os lados do Atlântico.",
                        "We deeply believe in the value of what is produced in our lands. In a world that competes on price and volume, we bet on the origin, identity, and quality of what we manufacture, cultivate, and invent on both sides of the Atlantic.",
                        "Creemos profundamente en el valor de lo que se produce en nuestras tierras. En un mundo que compite por precio y volumen, nosotros apostamos por el origen, la identidad y la calidad de lo que fabricamos, cultivamos e inventamos a ambos lados del Atlántico."
                      )}
                    </p>
                 </motion.div>
                 
                 <motion.div {...fadeInUp} transition={{ delay: 0.2 }} className="p-8 bg-gray-50 rounded-3xl border border-gray-100 hover:border-[var(--color-gold)]/30 hover:shadow-lg transition-all duration-300">
                    <h3 className="text-xl font-bold text-[var(--color-navy)] mb-4">{t("Excelência de Origem", "Excellence of Origin", "Excelencia de Origen")}</h3>
                    <p className="text-gray-600 leading-relaxed">
                      {t(
                        "Promovemos com orgulho o selo Made in Europe e o Made In Mercosur, porque por trás de cada produto existe uma história, uma região e um talento que merece ir longe.",
                        "We proudly promote the Made in Europe and Made In Mercosur seals, because behind every product there is a story, a region, and a talent that deserves to go far.",
                        "Promocionamos con orgullo el sello Made in Europe y el Made In Mercosur, porque detrás de cada producto hay una historia, una región y un talento que merece llegar lejos."
                      )}
                    </p>
                 </motion.div>
              </div>

              <motion.div {...fadeInUp} transition={{ delay: 0.4 }} className="p-10 md:p-14 bg-gradient-to-br from-[var(--color-navy)] to-[var(--color-navy-mid)] rounded-[2.5rem] text-white relative overflow-hidden shadow-2xl mt-8">
                 <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--color-gold)]/10 blur-[80px] rounded-full -mr-20 -mt-20 pointer-events-none" />
                 <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/10 blur-[80px] rounded-full -ml-20 -mb-20 pointer-events-none" />
                 
                 <div className="relative z-10 flex flex-col items-center text-center space-y-8">
                    <Image src="/logo-mia-white.png" alt="Made In Atlantic" width={180} height={60} className="object-contain opacity-90" />
                    <p className="text-2xl md:text-3xl font-display font-medium max-w-2xl leading-snug">
                      {t(
                        "Por isso somos Made In Atlantic. Apostamos no Corredor Atlântico.",
                        "That is why we are Made In Atlantic. We bet on the Atlantic Corridor.",
                        "Por eso somos Made In Atlantic. Apostamos por el Corredor Atlántico."
                      )}
                    </p>
                    <a href="/#oportunidades" className="btn-premium group flex items-center gap-3 !bg-[var(--color-gold)] !text-[var(--color-navy)] hover:scale-105 transition-transform font-bold mt-4">
                      <span>{t("Visite nossa seção 'Países'", "Visit our 'Countries' section", "Visite nuestra sección “Países”")}</span>
                      <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                    </a>
                 </div>
              </motion.div>
           </div>
        </div>
      </section>

      {/* 3. O que é EU-Mercosur Ready (A Linha de Negócio) */}
      <section className="py-24 md:py-32 bg-[var(--color-navy)] relative overflow-hidden border-t border-white/5">
        <div className="absolute inset-0 opacity-10 bg-gradient-to-tr from-[var(--color-gold)]/5 to-transparent pointer-events-none" />
        <div className="container-custom relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div {...fadeInUp} className="space-y-10">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-[var(--color-gold)]/10 rounded-full border border-[var(--color-gold)]/20">
                  <Target size={14} className="text-[var(--color-gold)]" />
                  <span className="text-[var(--color-gold)] font-bold text-[10px] uppercase tracking-widest">{t("O Ecossistema", "The Ecosystem", "El Ecosistema")}</span>
                </div>
                <h2 className="text-4xl md:text-6xl font-display font-bold text-white leading-tight">EU-Mercosur Ready</h2>
              </div>
              
              <div className="space-y-8 text-lg text-gray-300 font-body leading-relaxed">
                <p className="text-white font-medium text-xl">
                  {t(
                    "EU-Mercosur Ready é o ecossistema criado pela Made In Atlantic para conectar empresas dos dois lados do Atlântico com importadores, distribuidores e compradores qualificados.",
                    "EU-Mercosur Ready is the ecosystem created by Made In Atlantic to connect companies on both sides of the Atlantic with qualified importers, distributors, and buyers.",
                    "EU-Mercosur Ready es el ecosistema creado por Made In Atlantic para conectar empresas de ambos lados del Atlántico con importadores, distribuidores y compradores calificados."
                  )}
                </p>
                <p>
                  {t(
                    "As empresas que completam o processo de preparação comercial, regulatório, homologação e adequação ao mercado de destino, passam a integrar esse o ecossistema curado, visível para compradores e parceiros ativos no corredor EU-Mercosur.",
                    "Companies that complete the commercial, regulatory, homologation, and market adaptation process join this curated ecosystem, visible to buyers and active partners in the EU-Mercosur corridor.",
                    "Las empresas que completan el proceso de preparación comercial, regulatorio, homologación y adecuación al mercado de destino, pasan a integrar este ecosistema curado, visible para compradores y socios activos en el corredor EU-Mercosur."
                  )}
                </p>
                <div className="flex items-center gap-5 p-8 bg-white/5 rounded-[2rem] border border-white/10 backdrop-blur-xl shadow-2xl">
                   <div className="p-3 bg-[var(--color-gold)]/10 rounded-2xl">
                    <Users className="text-[var(--color-gold)]" size={32} />
                   </div>
                   <p className="text-sm md:text-base font-medium text-gray-200">
                     {t(
                       "Para importadores, distribuidores e compradores, EU-Mercosur Ready é o ponto de entrada: um espaço onde encontram fornecedores verificados, prontos para operar, acompanhados pela equipe Made In Atlantic no terreno.",
                       "For importers, distributors, and buyers, EU-Mercosur Ready is the entry point: a space where they find verified suppliers, ready to operate and accompanied by the Made In Atlantic team on the ground.",
                       "Para importadores, distribuidores y compradores, EU-Mercosur Ready es el punto de entrada: un espacio donde encuentran proveedores verificados, listos para operar y acompañados por el equipo de Made In Atlantic en el terreno."
                     )}
                   </p>
                </div>
              </div>
            </motion.div>


            <motion.div 
               initial={{ opacity: 0, scale: 0.95 }}
               whileInView={{ opacity: 1, scale: 1 }}
               whileHover={{ scale: 1.02, y: -10 }}
               transition={{ duration: 0.5, ease: "easeOut" as any }}
               className="relative group max-w-lg mx-auto"
             >
               {/* Brilho de Fundo Dinâmico */}
               <div className="absolute inset-0 bg-[var(--color-gold)] rounded-full blur-[100px] opacity-10 group-hover:opacity-25 transition-opacity duration-700" />
               
               <div className="relative flex flex-col items-center justify-center text-center space-y-10">
                <div className="relative flex flex-col items-center justify-center text-center">
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.8 }}
                    className="relative w-72 h-72 md:w-[400px] md:h-[400px] drop-shadow-[0_0_50px_rgba(200,148,58,0.4)]"
                  >
                    <Image src="/logo-mercosur.png" alt="EU-Mercosur Ready Logo" fill className="object-contain" />
                  </motion.div>
                </div>

                 <div className="space-y-4 relative z-10">
                   <p className="text-gray-300 text-lg max-w-md mx-auto leading-relaxed opacity-90">
                     {t(
                       <>Sua empresa está preparada para o Corredor UE-Mercosul?<br /><br />Oferecemos o suporte local necessário para impulsionar seus negócios.</>,
                       <>Is your company ready for the EU-Mercosur Corridor?<br /><br />We offer the local support necessary to boost your business.</>,
                       <>¿Está su empresa preparada para el Corredor UE-Mercosur?<br /><br />Ofrecemos el soporte local necesario para impulsar sus negocios.</>
                     )}
                   </p>
                 </div>
               </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* 4. CTA Final */}
      <section className="py-24 md:py-32 bg-[#fcfaf7] relative overflow-hidden border-t border-gray-100">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto text-center space-y-16">
            <motion.div {...fadeInUp} className="space-y-6">
            </motion.div>

            {/* CTAs Diferenciados - Sugestão Adicional */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-8">
              <motion.div 
                 whileHover={{ y: -10 }}
                 className="group p-10 bg-white rounded-[2.5rem] border border-gray-100 shadow-xl flex flex-col items-center text-center space-y-8 relative overflow-hidden h-full"
               >
                 <div className="absolute top-0 left-0 w-full h-2 bg-blue-600" />
                 <div className="w-20 h-20 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-110 transition-transform duration-500 shrink-0">
                   <TrendingUp size={40} />
                 </div>
                 <div className="space-y-4 flex-1 flex flex-col justify-center">
                   <h4 className="text-2xl font-display font-bold text-[var(--color-navy)] leading-tight">{t("Sou empresa exportadora", "I am an exporting company", "Soy empresa exportadora")}</h4>
                   <p className="text-gray-600 text-sm leading-relaxed">{t("Leve sua marca para o outro lado do atlântico com o serviço BDaaS.", "Take your brand to the other side of the Atlantic with the BDaaS service.", "Lleve su marca al otro lado del Atlántico con el servicio BDaaS.")}</p>
                 </div>
                 <Link href="/solicitar-cadastro" className="btn-premium w-full group/btn flex items-center justify-center mt-auto !bg-[var(--color-navy)] text-white">
                   <span>{t("Ativar Serviço BDaaS", "Activate BDaaS Service", "Activar Servicio BDaaS")}</span>
                   <ArrowRight size={18} className="ml-2 group-hover/btn:translate-x-1 transition-transform" />
                 </Link>
               </motion.div>

              <motion.div 
                 whileHover={{ y: -10 }}
                 className="group p-10 bg-white rounded-[2.5rem] border border-gray-100 shadow-xl flex flex-col items-center text-center space-y-8 relative overflow-hidden h-full"
               >
                 <div className="absolute top-0 left-0 w-full h-2 bg-[var(--color-gold)]" />
                 <div className="w-20 h-20 rounded-2xl bg-[var(--color-gold)]/10 text-[var(--color-gold)] flex items-center justify-center group-hover:scale-110 transition-transform duration-500 shrink-0">
                   <Globe2 size={40} />
                 </div>
                 <div className="space-y-4 flex-1 flex flex-col justify-center">
                   <h4 className="text-2xl font-display font-bold text-[var(--color-navy)] leading-tight">{t("Sou importador / comprador", "I am an importer / buyer", "Soy importador / comprador")}</h4>
                   <p className="text-gray-600 text-sm leading-relaxed">{t("Explore o ecossistema de empresas verificadas no diretório EU-Mercosur Ready.", "Explore the ecosystem of verified companies in the EU-Mercosur Ready directory.", "Explore el ecosistema de empresas verificadas en el directorio EU-Mercosur Ready.")}</p>
                 </div>
                 <Link href="/" className="btn-premium w-full group/btn flex items-center justify-center !bg-[var(--color-gold)] !text-[var(--color-navy)] mt-auto font-bold">
                   <span>{t("Explorar Diretório", "Explore Directory", "Explorar Directorio")}</span>
                   <ArrowRight size={18} className="ml-2 group-hover/btn:translate-x-1 transition-transform" />
                 </Link>
               </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Branding */}
      <section className="py-20 border-t border-white/5 bg-[var(--color-navy)]">
        <div className="container-custom flex flex-col items-center space-y-8">
           <div className="flex items-center gap-6 opacity-60 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-700">
             <Image src="/logo-made-in-atlantic.avif" alt="Made In Atlantic" width={150} height={50} className="object-contain" />
             <div className="w-[1px] h-8 bg-white/20" />
             <div className="flex items-center justify-center p-2">
                <Image src="/logo-mercosur.png" alt="Logo" width={150} height={150} className="object-contain" />
             </div>
           </div>

        </div>
      </section>
    </div>
  )
}

// app/(public)/empresa/[slug]/page.tsx
export const revalidate = 0

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { 
  Globe, 
  MapPin, 
  Mail, 
  Phone, 
  Link2,
  Star,
  ChevronLeft,
  ShieldCheck,
  Zap,
  TrendingUp,
  Award,
  ArrowRight,
  Shield,
  Link as LinkIcon,
  Leaf,
  Search,
  PlayCircle,
  FileText,
  CheckCircle2,
  Users,
  DollarSign,
  Ship,
  Calendar,
  Tags,
  Building2,
  Info
} from 'lucide-react'
import prisma from '@/lib/prisma'
import { cn, translateEmployeesRange } from '@/lib/utils'
import { ProductGallery } from '@/components/public/ProductGallery'
import { CompanyNavigation } from '@/components/public/CompanyNavigation'
import { FloatingContact } from '@/components/public/FloatingContact'
import { incrementCompanyView } from '@/lib/actions/analytics'
import { SafeImage } from '@/components/public/SafeImage'
import { cookies } from 'next/headers'
import { Metadata } from 'next'
import { getSettings } from '@/lib/actions/settings'
import { countriesData } from '@/lib/countries-data'

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const cookieStore = await cookies()
  const language = cookieStore.get('mr-language')?.value || 'pt'
  
  const company = await prisma.company.findUnique({
    where: { slug },
    select: { 
      name: true, 
      shortDescription: true, 
      shortDescription_en: true, 
      shortDescription_es: true,
      logoUrl: true 
    }
  })
 
  const t = (pt: string, en?: string | null, es?: string | null) => {
    if (language === 'en' && en) return en
    if (language === 'es' && es) return es
    return pt
  }

  if (!company) return { title: t('Empresa não encontrada', 'Company not found', 'Empresa no encontrada') }


  const description = t(company.shortDescription, company.shortDescription_en, company.shortDescription_es)

  return {
    title: `${company.name} | ${t('Perfil Corporativo B2B', 'B2B Corporate Profile', 'Perfil Corporativo B2B')}`,
    description: description,
    openGraph: {
      title: `${company.name} - ${t('Conexão EU-Mercosul', 'EU-Mercosur Connection', 'Conexión EU-Mercosur')}`,
      description: description,
      images: company.logoUrl ? [company.logoUrl] : [],
    }
  }
}

export default async function CompanyProfilePage({ params }: PageProps) {
  const { slug } = await params
  const cookieStore = await cookies()
  const language = cookieStore.get('mr-language')?.value || 'pt'
  
  const t = (pt: string, en?: string | null, es?: string | null) => {
    if (language === 'en' && en) return en
    if (language === 'es' && es) return es
    return pt
  }
  
  const company = await prisma.company.findUnique({
    where: { slug },
    select: {
      id: true,
      name: true,
      slug: true,
      logoUrl: true,
      bannerUrl: true,
      logoColor: true,
      country: true,
      countryCode: true,
      region: true,
      city: true,
      foundedYear: true,
      employeesRange: true,
      shortDescription: true,
      shortDescription_en: true,
      shortDescription_es: true,
      fullDescription: true,
      fullDescription_en: true,
      fullDescription_es: true,
      videoUrl: true,
      certifications: true,
      targetMarkets: true,
      secondarySectors: true,
      website: true,
      email: true,
      phone: true,
      whatsapp: true,
      linkedin: true,
      instagram: true,
      facebook: true,
      twitter: true,
      auditStatus: true,
      keywords: true,
      status: true,
      sector: {
        select: {
          id: true,
          name: true,
          name_en: true,
          name_es: true,
          slug: true
        }
      },
      products: {
        take: 10
      },
      reviews: {
        orderBy: {
          date: 'desc'
        }
      }
    }
  })

  if (!company) {
    notFound()
  }

  // Buscar configurações para o WhatsApp de suporte
  const settingsResult = await getSettings()
  const consultantWhatsapp = settingsResult.settings?.['CONTACT_WHATSAPP'] || '5511999999999'

  // Analytics reativado para gerar métricas de tração
  await incrementCompanyView(company.id)

  const initials = company.name.substring(0, 2).toUpperCase()
  
  // Cálculo de anos de mercado
  const yearsInMarket = company.foundedYear 
    ? new Date().getFullYear() - company.foundedYear 
    : null

  const countryInfo = countriesData.find(c => c.id === company.countryCode)
  const translatedCountry = countryInfo ? t(countryInfo.name, countryInfo.name_en, countryInfo.name_es) : company.country

  const mockStats = [
    { label: t('País de Origem', 'Country of Origin', 'País de Origen'), value: translatedCountry, icon: 'globe' },
    { label: t('Tamanho da Equipe', 'Team Size', 'Tamaño del Equipo'), value: translateEmployeesRange(company.employeesRange, language), icon: 'users' },
    { label: t('Tempo de Mercado', 'Time in Market', 'Tiempo en el Mercado'), value: yearsInMarket ? `${yearsInMarket} ${t('Anos', 'Years', 'Años')}` : null, icon: 'trending' },
    { label: t('Cidade Sede', 'Headquarters', 'Sede'), value: company.city, icon: 'map' },
  ].filter(stat => stat.value && stat.value !== 'N/D' && stat.value !== 'N/A')

  const navItems = [
    { id: 'sobre', label: t('Sobre', 'About', 'Sobre') },
    { id: 'produtos', label: t('Produtos', 'Products', 'Productos') },
    { id: 'reviews', label: t('Avaliações', 'Reviews', 'Reseñas') },
    { id: 'contato', label: t('Contato', 'Contact', 'Contacto') },
  ]

  return (
    <main className="min-h-screen bg-white pb-20">
      {/* Hero Section Cinematográfica */}
      <section className="relative h-[60vh] min-h-[400px] w-full overflow-hidden">
        {company.bannerUrl ? (
          <SafeImage 
            src={company.bannerUrl} 
            alt={company.name}
            fill
            className="object-cover"
            priority
            fallbackSrc="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=1200"
          />
        ) : (
          <div className="absolute inset-0 bg-[var(--color-navy)] opacity-90" />
        )}
        
        {/* Overlay Gradiente - Ajustado para proteger o texto */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
        
        {/* Conteúdo do Hero */}
        <div className="absolute inset-0 flex flex-col justify-end pt-32">
          <div className="container-custom pb-8 md:pb-12">
            <div className="flex flex-col md:flex-row items-start md:items-end gap-6 md:gap-10">
              {/* Logo Flutuante - Alinhamento Refinado */}
              <div className="relative w-28 h-28 md:w-44 md:h-44 bg-white rounded-[var(--radius-lg)] p-4 md:p-6 shadow-[0_20px_50px_rgba(0,0,0,0.3)] border border-white/20 z-10 flex items-center justify-center -mb-4 md:-mb-12 transition-transform hover:scale-105 duration-500">
                {company.logoUrl ? (
                  <div className="relative w-full h-full overflow-hidden">
                    <SafeImage 
                      src={company.logoUrl} 
                      alt={company.name} 
                      fill 
                      className="object-contain"
                      fallbackIcon={<Building2 className="text-gray-200" size={54} />}
                    />
                  </div>
                ) : (
                  <div 
                    className="w-full h-full rounded-[var(--radius-md)] flex items-center justify-center text-white text-4xl md:text-5xl font-bold shadow-inner"
                    style={{ backgroundColor: company.logoColor }}
                  >
                    {initials}
                  </div>
                )}
              </div>
              
              {/* Título e Info Rápida - Hierarquia Melhorada */}
              <div className="flex-1 text-left z-10 w-full">
                <div className="flex flex-wrap items-center gap-2 mb-2 md:mb-4">
                  <span className={cn(
                    "px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-[0.2em] text-white shadow-sm border border-white/20",
                    company.region === 'EU' ? "bg-[var(--color-eu)]" : "bg-[var(--color-mercosul)]"
                  )}>
                    {company.region}
                  </span>
                  <span className="text-white text-[10px] md:text-xs font-bold bg-black/40 backdrop-blur-md border border-white/10 px-2.5 py-1 rounded-md flex items-center gap-1.5 shadow-lg">
                    <MapPin size={12} className="text-[var(--color-gold)]" /> {translatedCountry}
                  </span>
                </div>

                <div className="flex flex-col md:flex-row md:items-end gap-x-6 gap-y-3 mb-2">
                  <h1 className="text-3xl md:text-5xl font-display font-black text-white drop-shadow-[0_10px_40px_rgba(0,0,0,0.6)] leading-[1.1] tracking-tighter">
                    {company.name}
                  </h1>
                  
                  {company.auditStatus !== 'NONE' && (
                    <div className={cn(
                      "group relative flex items-center gap-2 bg-emerald-500/90 text-white px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-[0.2em] shadow-2xl border border-emerald-400/40 backdrop-blur-md md:mb-1 cursor-help transition-all hover:bg-emerald-600",
                    )}>
                      <ShieldCheck size={14} /> 
                      {t('Verificada', 'Verified', 'Verificada')}

                      {/* Tooltip Explicativo */}
                      <div className="absolute bottom-full left-0 mb-4 w-64 p-4 bg-white/95 backdrop-blur-xl border border-white/20 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.3)] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50 pointer-events-none">
                        <div className="flex items-center gap-2 mb-2 text-emerald-600">
                          <ShieldCheck size={16} />
                          <span className="text-[10px] font-black uppercase tracking-widest">{t('Auditoria KYB Ativa', 'Active KYB Audit', 'Auditoría KYB Activa')}</span>
                        </div>
                        <p className="text-[11px] text-[var(--color-navy)] font-medium leading-relaxed normal-case tracking-normal">
                          {t(
                            'Esta empresa passou por um processo rigoroso de verificação de documentos legais, reputação comercial e conformidade operacional, garantindo total segurança para negociações internacionais.',
                            'This company has undergone a rigorous process of verifying legal documents, commercial reputation, and operational compliance, ensuring total security for international negotiations.',
                            'Esta empresa ha pasado por un riguroso proceso de verificación de documentos legales, reputación comercial y cumplimiento operativo, garantizando total seguridad para las negociaciones internacionales.'
                          )}
                        </p>
                        {/* Triângulo do Tooltip */}
                        <div className="absolute top-full left-6 -mt-1 border-8 border-transparent border-t-white/95" />
                      </div>
                    </div>
                  )}
                </div>

              </div>

              {/* Botão Voltar - Estilo Minimalista */}
              <Link 
                href="/" 
                className="hidden md:flex items-center gap-2 text-white/70 hover:text-white bg-black/20 hover:bg-black/40 backdrop-blur-md px-6 py-3 rounded-2xl font-bold transition-all border border-white/10 text-xs uppercase tracking-widest"
              >
                <ChevronLeft size={16} /> {t('Empresas', 'Companies', 'Empresas')}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Sumário da Empresa - Posicionamento para Legibilidade Máxima */}
      <div className="bg-white border-b border-gray-100">
        <div className="container-custom py-10 md:py-16">
          <div className="max-w-4xl">
            <h2 className="text-[var(--color-gold)] text-[10px] md:text-xs font-black uppercase tracking-[0.3em] mb-4">
              {t('Visão Geral', 'Corporate Overview', 'Visión General')}
            </h2>
            <p className="text-lg md:text-2xl text-[var(--color-navy)] font-display font-medium leading-[1.4] md:leading-[1.3] italic opacity-90">
              "{t(company.shortDescription, (company as any).shortDescription_en, (company as any).shortDescription_es)}"
            </p>
          </div>
        </div>
      </div>

      {/* Barra de Certificações Flutuante */}
      {company.certifications && (
        <div className="container-custom relative z-20 -mt-8">
          <div className="bg-white/80 backdrop-blur-xl border border-white/20 shadow-2xl rounded-2xl p-6 flex flex-wrap items-center justify-center gap-8 md:gap-16">
            {(company.certifications as string[]).map((cert: string, idx: number) => (
              <div key={idx} className="flex items-center gap-3 hover:scale-105 transition-all">
                <CheckCircle2 size={18} className="text-[var(--color-gold)]" />
                <span className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--color-navy)]">{cert}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Navegação Sticky Interna */}
      <CompanyNavigation items={navItems} />

      {/* Grid de Conteúdo Principal */}
      <section className="container-custom mt-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          
          {/* Coluna da Esquerda (Conteúdo) */}
          <div className="lg:col-span-8 space-y-16">
            
            {/* Sobre a Empresa */}
            <div id="sobre" className="scroll-mt-40 space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-[var(--color-gold-light)] flex items-center justify-center text-[var(--color-gold)]">
                  <Award size={24} />
                </div>
                <h2 className="text-3xl font-display font-bold text-[var(--color-navy)]">{t('Sobre a Empresa', 'About the Company', 'Sobre la Empresa')}</h2>
              </div>
              <p className="text-lg text-[var(--color-text-muted)] leading-relaxed font-body whitespace-pre-wrap">
                {t(company.fullDescription, (company as any).fullDescription_en, (company as any).fullDescription_es)}
              </p>
              {(company as any).videoUrl && (
                <div className="mt-8 rounded-2xl overflow-hidden border border-[var(--color-border)] shadow-lg relative aspect-video bg-black/5 group cursor-pointer flex items-center justify-center">
                  {/* Lógica simples para extrair ID do Youtube e montar iframe. */}
                  {((company as any).videoUrl as string).includes('youtube.com') || ((company as any).videoUrl as string).includes('youtu.be') ? (
                      <iframe 
                        className="w-full h-full absolute inset-0"
                        src={`https://www.youtube.com/embed/${((company as any).videoUrl as string).match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^"&?\/\s]{11})/)?.[1]}`} 
                        title={t('Vídeo Institucional', 'Institutional Video', 'Video Institucional')}
                        frameBorder="0" 
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                        allowFullScreen
                      />
                    ) : (
                      <a href={(company as any).videoUrl} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center gap-3 text-[var(--color-navy)] hover:text-[var(--color-gold)] transition-colors">
                        <PlayCircle size={48} />
                        <span className="font-bold text-sm">{t('Assistir Vídeo Institucional', 'Watch Institutional Video', 'Ver Video Institucional')}</span>
                      </a>
                    )}
                </div>
              )}
            </div>
            
            {/* Galeria de Produtos / Serviços */}
            {company.products && company.products.length > 0 && (
              <div id="produtos" className="scroll-mt-40 space-y-8">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-[var(--color-gold-light)] flex items-center justify-center text-[var(--color-gold)]">
                      <Zap size={24} />
                    </div>
                    <h2 className="text-3xl font-display font-bold text-[var(--color-navy)]">
                      {t('Produtos em Destaque', 'Featured Products', 'Productos Destacados')}
                    </h2>
                  </div>
                </div>
                
                <ProductGallery 
                  products={company.products.slice(0, 3)} 
                  companyName={company.name}
                  companySlug={slug}
                  useLink={true}
                />

                {company.products.length > 3 && (
                  <div className="flex justify-center pt-4">
                    <Link 
                      href={`/empresa/${slug}/catalogo`}
                      className="group flex items-center gap-3 px-8 py-4 bg-white border-2 border-[var(--color-navy)] text-[var(--color-navy)] rounded-2xl font-display font-bold hover:bg-[var(--color-navy)] hover:text-white transition-all shadow-md"
                    >
                      {t('Conhecer mais produtos e serviços', 'Learn more about products and services', 'Conocer más productos y servicios')}
                      <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                )}
              </div>
            )}

            {/* Reviews / Testemunhos */}
            {company.reviews && company.reviews.length > 0 && (
              <div id="reviews" className="scroll-mt-40 space-y-8">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-[var(--color-gold-light)] flex items-center justify-center text-[var(--color-gold)]">
                    <Star size={24} />
                  </div>
                  <h2 className="text-3xl font-display font-bold text-[var(--color-navy)]">
                    {t('O que dizem os parceiros', 'What partners say', 'Lo que dicen los socios')}
                  </h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {(company.reviews as any[]).map((review: any) => (
                    <div key={review.id} className="p-8 rounded-[var(--radius-lg)] bg-[var(--color-bg-alt)] border border-[var(--color-border)] space-y-4">
                      <div className="flex items-center justify-between">
                        <h4 className="font-bold text-[var(--color-navy)] font-display">{review.author}</h4>
                        <div className="flex gap-0.5">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star 
                              key={i} 
                              size={12} 
                              fill={i < review.rating ? "var(--color-gold)" : "none"} 
                              stroke={i < review.rating ? "var(--color-gold)" : "#CBD5E1"} 
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-[var(--color-text-muted)] italic font-body">"{review.comment}"</p>
                      <span className="text-[10px] text-gray-400 font-medium uppercase tracking-widest">{new Date(review.date).toLocaleDateString(language === 'pt' ? 'pt-BR' : language === 'es' ? 'es' : 'en-US', { month: 'long', year: 'numeric' })}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Seção de Encerramento B2B */}
            <div className="bg-[var(--color-navy)] rounded-[2.5rem] p-12 text-center space-y-8 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
              <div className="relative z-10 space-y-4">
                <h2 className="text-3xl md:text-4xl font-display font-bold text-white">
                  {t('Pronto para expandir seus negócios?', 'Ready to expand your business?', '¿Listo para expandir su negocio?')}
                </h2>
                <p className="text-white/70 max-w-xl mx-auto font-body">
                  {t(
                    `Inicie uma conversa direta com a equipe da ${company.name} e explore oportunidades de parceria internacional.`,
                    `Start a direct conversation with ${company.name}'s team and explore international partnership opportunities.`,
                    `Inicie una conversación directa con el equipo de ${company.name} y explore oportunidades de asociación internacional.`
                  )}
                </p>
              </div>
              <div className="relative z-10 flex flex-col md:flex-row items-center justify-center gap-4">
                {(company.whatsapp || company.phone) && (
                  <a 
                    href={`https://wa.me/${(company.whatsapp || company.phone || '').replace(/\D/g, '')}?text=${encodeURIComponent(t(
                      `Olá! Gostaria de solicitar uma cotação para a ${company.name} através da plataforma EU-Mercosur Ready.`,
                      `Hello! I would like to request a quote for ${company.name} through the EU-Mercosur Ready platform.`,
                      `¡Hola! Me gustaría solicitar uma cotización para ${company.name} a través de la plataforma EU-Mercosur Ready.`
                    ))}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-[var(--color-gold)] text-[var(--color-navy)] px-10 py-5 rounded-2xl font-display font-black hover:scale-105 transition-all shadow-xl inline-block"
                  >
                    {t('Solicitar Cotação Agora', 'Request Quote Now', 'Solicitar Cotización Ahora')}
                  </a>
                )}
                <a 
                  href={`https://wa.me/${consultantWhatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(t(
                    `Olá! Gostaria de falar com um consultor sobre a empresa ${company.name} na plataforma EU-Mercosur Ready.`,
                    `Hello! I would like to speak with a consultant about the company ${company.name} on the EU-Mercosur Ready platform.`,
                    `¡Hola! Me gustaría hablar con un consultor sobre la empresa ${company.name} en la plataforma EU-Mercosur Ready.`
                  ))}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white/10 text-white backdrop-blur-md border border-white/20 px-10 py-5 rounded-2xl font-display font-bold hover:bg-white/20 transition-all inline-block"
                >
                  {t('Falar com Consultor', 'Speak with Consultant', 'Hablar con un Consultor')}
                </a>
              </div>
              <p className="relative z-10 text-[10px] text-white/40 uppercase tracking-[0.3em] font-bold">
                {t('Transação Segura', 'Secure Transaction', 'Transacción Segura')} • EU-Mercosur Ready Protocol
              </p>
            </div>
          </div>

          {/* Coluna da Direita (Info & Sidebar) */}
          <aside className="lg:col-span-4 space-y-8">
            
            {/* Bloco de Métricas - Estilo Grade Visual */}
            {mockStats && (
              <div className="grid grid-cols-2 gap-4">
                {mockStats.map((stat, idx) => {
                  const getIcon = (iconName: string, value?: string) => {
                    // Lógica especial para setor de Agronegócio
                    if (iconName === 'zap' && value?.toLowerCase().includes('agro')) return Leaf
                    
                    switch(iconName) {
                      case 'users': return Users
                      case 'dollar': return DollarSign
                      case 'ship': return Ship
                      case 'calendar': return Calendar
                      case 'award': return Award
                      case 'globe': return Globe
                      case 'trending': return TrendingUp
                      case 'zap': return Zap
                      case 'shield': return ShieldCheck
                      case 'map': return MapPin
                      default: return Info
                    }
                  }
                  const StatIcon = getIcon(stat.icon, stat.value as string)
                  const isVerification = stat.label === 'Verificação KYB'
                  const getVerificationColor = (val: string) => {
                    if (val === 'Ouro') return 'text-amber-500'
                    if (val === 'Prata') return 'text-gray-400'
                    return 'text-orange-700'
                  }

                  return (
                    <div key={idx} className="p-4 md:p-6 rounded-[var(--radius-lg)] bg-white border border-[var(--color-border)] shadow-sm hover:border-[var(--color-gold)] transition-all duration-300 group flex flex-col items-center text-center space-y-4 min-h-[180px] justify-center overflow-hidden">
                      <div className={cn(
                        "w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center transition-all duration-300 group-hover:scale-110 shadow-sm shrink-0",
                        isVerification ? "bg-amber-50 text-amber-600" : "text-[var(--color-navy)] group-hover:bg-[var(--color-gold)] group-hover:text-white"
                      )}>
                        <StatIcon size={24} />
                      </div>
                      <div className="space-y-1 w-full flex-1 flex flex-col justify-center">
                        <span className={cn(
                          "font-display font-black leading-tight block px-2 break-words",
                          (stat.value as string).length > 20 ? "text-xs" : (stat.value as string).length > 12 ? "text-sm" : "text-lg",
                          isVerification ? getVerificationColor(stat.value as string) : "text-[var(--color-navy)]"
                        )}>
                          {stat.value}
                        </span>
                        <p className="text-[10px] text-[var(--color-text-muted)] font-bold uppercase tracking-widest leading-tight mt-1">{stat.label}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}

            {/* Tipo de Negócio e Mercados */}
            {(company.sector || ((company as any).targetMarkets && (company as any).targetMarkets.length > 0)) && (
              <div className="p-8 rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-white space-y-6">
                {company.sector && (
                  <>
                    <div className="flex items-center gap-3 text-[var(--color-navy)]">
                      <Building2 size={20} className="text-[var(--color-gold)]" />
                      <h3 className="text-xl font-display font-bold">{t('Tipo de Negócio', 'Business Type', 'Tipo de Negocio')}</h3>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <span className="px-3 py-1.5 bg-[var(--color-navy-light)] text-white rounded-lg text-[10px] font-bold uppercase tracking-wider">
                        {t(company.sector.name, company.sector.name_en, company.sector.name_es)}
                      </span>
                      {(company as any).secondarySectors && ((company as any).secondarySectors as string[]).map((sec, idx) => (
                        <span key={idx} className="px-3 py-1.5 border border-[var(--color-border)] text-[var(--color-text-muted)] rounded-lg text-[10px] font-bold uppercase tracking-wider cursor-default">
                          {sec}
                        </span>
                      ))}
                    </div>
                  </>
                )}

                {(company as any).targetMarkets && ((company as any).targetMarkets as string[]).length > 0 && (
                  <div className="pt-4 border-t border-[var(--color-border)] space-y-4">
                    <div className="flex items-center gap-3 text-[var(--color-navy)]">
                      <Globe size={20} className="text-[var(--color-gold)]" />
                      <h3 className="text-sm font-display font-bold uppercase tracking-widest text-[var(--color-text-muted)]">{t('Mercados Alvo de Exportação', 'Target Export Markets', 'Mercados Objetivo de Exportación')}</h3>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {((company as any).targetMarkets as string[]).map((market, idx) => (
                        <span key={idx} className="px-3 py-1 bg-gray-50 border border-[var(--color-border)] text-[var(--color-navy)] rounded-full text-xs font-medium flex items-center gap-2">
                          <MapPin size={12} className="text-[var(--color-gold)]" />
                          {market}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Informações de Contato */}
            <div id="contato" className="scroll-mt-40 p-8 rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-white space-y-8 premium-shadow hover-lift transition-all duration-300">
              <h3 className="text-xl font-display font-bold text-[var(--color-navy)]">{t('Informações de Contato', 'Contact Information', 'Información de Contacto')}</h3>
              
              <div className="space-y-6">
                {company.website && (
                  <a href={company.website} target="_blank" rel="noopener noreferrer" className="flex items-start gap-4 group">
                    <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center text-[var(--color-navy)] group-hover:bg-[var(--color-navy)] group-hover:text-white transition-colors">
                      <Globe size={20} />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-[var(--color-text-muted)] uppercase tracking-tight">{t('Website Oficial', 'Official Website', 'Sitio Web Oficial')}</p>
                      <p className="text-sm font-medium text-[var(--color-navy)] truncate max-w-[200px]">{company.website.replace('https://', '')}</p>
                    </div>
                  </a>
                )}
                
                {(company.city || company.country) && (
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center text-[var(--color-navy)]">
                    <MapPin size={20} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-[var(--color-text-muted)] uppercase tracking-tight">{t('Sede', 'Headquarters', 'Sede')}</p>
                    <p className="text-sm font-medium text-[var(--color-navy)] leading-snug">{[company.city, translatedCountry].filter(Boolean).join(', ')}</p>
                  </div>
                </div>
                )}

                {company.email && (
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center text-[var(--color-navy)]">
                      <Mail size={20} />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-[var(--color-text-muted)] uppercase tracking-tight">{t('E-mail', 'E-mail', 'Correo Electrónico')}</p>
                      <p className="text-sm font-medium text-[var(--color-navy)]">{company.email}</p>
                    </div>
                  </div>
                )}

                {company.phone && (
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center text-[var(--color-navy)]">
                      <Phone size={20} />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-[var(--color-text-muted)] uppercase tracking-tight">{t('Telefone', 'Phone', 'Teléfono')}</p>
                      <p className="text-sm font-medium text-[var(--color-navy)]">{company.phone}</p>
                    </div>
                  </div>
                )}

                {(company as any).whatsapp && (
                  <a href={`https://wa.me/${((company as any).whatsapp as string).replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer" className="flex items-start gap-4 group">
                    <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center text-green-600 group-hover:bg-green-500 group-hover:text-white transition-colors">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-green-600 uppercase tracking-tight">WhatsApp</p>
                      <p className="text-sm font-medium text-[var(--color-navy)] group-hover:text-green-600 transition-colors">{(company as any).whatsapp}</p>
                    </div>
                  </a>
                )}
              </div>

              {/* Redes Sociais */}
              {(company.linkedin || (company as any).instagram || (company as any).facebook || (company as any).twitter) && (
                <div className="flex items-center gap-3 pt-4 border-t border-[var(--color-border)]">
                  {company.linkedin && (
                    <a href={company.linkedin} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full border border-[var(--color-border)] flex items-center justify-center text-[var(--color-text-muted)] hover:bg-[#0077B5] hover:text-white hover:border-[#0077B5] transition-all" title="LinkedIn">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>
                    </a>
                  )}
                  {(company as any).instagram && (
                    <a href={(company as any).instagram} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full border border-[var(--color-border)] flex items-center justify-center text-[var(--color-text-muted)] hover:bg-[#E1306C] hover:text-white hover:border-[#E1306C] transition-all" title="Instagram">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
                    </a>
                  )}
                  {(company as any).facebook && (
                    <a href={(company as any).facebook} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full border border-[var(--color-border)] flex items-center justify-center text-[var(--color-text-muted)] hover:bg-[#1877F2] hover:text-white hover:border-[#1877F2] transition-all" title="Facebook">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
                    </a>
                  )}
                  {(company as any).twitter && (
                    <a href={(company as any).twitter} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full border border-[var(--color-border)] flex items-center justify-center text-[var(--color-text-muted)] hover:bg-black hover:text-white hover:border-black transition-all" title="X (Twitter)">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4l11.733 16h4.267l-11.733 -16z"/><path d="M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772"/></svg>
                    </a>
                  )}
                </div>
              )}
            </div>

            {/* Palavras-Chave (Keywords) */}
            {company.keywords && (
              <div className="p-8 rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-white space-y-6">
                <div className="flex items-center gap-3 text-[var(--color-navy)]">
                  <Tags size={20} className="text-[var(--color-gold)]" />
                  <h3 className="text-xl font-display font-bold">{t('Tags & Atuação', 'Tags & Expertise', 'Tags y Actuación')}</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {(company.keywords as string[]).map((word: string, idx: number) => (
                    <span key={idx} className="px-3 py-1.5 border border-[var(--color-navy)]/20 text-[var(--color-navy)] rounded-full text-[10px] font-medium hover:border-[var(--color-gold)] hover:text-[var(--color-gold)] transition-colors cursor-default">
                      {word}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Certificações */}
            {(company as any).certifications && ((company as any).certifications as string[]).length > 0 && (
              <div className="p-8 rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-bg-alt)] space-y-6">
                <h3 className="text-xl font-display font-bold text-[var(--color-navy)]">{t('Certificações', 'Certifications', 'Certificaciones')}</h3>
                <div className="flex flex-wrap gap-2">
                  {((company as any).certifications as string[]).map((cert: string, idx: number) => (
                    <span key={idx} className="px-3 py-1.5 bg-white border border-[var(--color-border)] rounded-lg text-[10px] font-bold text-[var(--color-navy)] uppercase tracking-wider shadow-sm">
                      {cert}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* CTA Lateral */}
              {(company.whatsapp || company.phone) && (
                <a 
                  href={`https://wa.me/${(company.whatsapp || company.phone || '').replace(/\D/g, '')}?text=${encodeURIComponent(t(
                    `Olá! Gostaria de solicitar uma proposta comercial da ${company.name} através da plataforma EU-Mercosur Ready.`,
                    `Hello! I would like to request a commercial proposal from ${company.name} through the EU-Mercosur Ready platform.`,
                    `¡Hola! Me gustaría solicitar una propuesta comercial de ${company.name} a través de la plataforma EU-Mercosur Ready.`
                  ))}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-[var(--color-gold)] hover:bg-[var(--color-gold-dark)] text-[var(--color-navy)] font-display font-black py-6 rounded-[var(--radius-lg)] shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-3"
                >
                  {t('Solicitar Proposta', 'Request Proposal', 'Solicitar Propuesta')} <ArrowRight size={20} />
                </a>
              )}

          </aside>
        </div>
      </section>
      <FloatingContact 
        phone={company.phone} 
        whatsapp={company.whatsapp}
        email={company.email}
        companyName={company.name} 
        language={language}
      />
    </main>
  )
}

// app/(public)/empresa/[slug]/produto/[productSlug]/page.tsx
import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { 
  ChevronLeft, ChevronRight,
  ShieldCheck, Truck, Package, Globe, Mail, ArrowRight,
  CheckCircle2, Leaf, Zap, MessageSquare
} from 'lucide-react'
import prisma from '@/lib/prisma'
import { ProductGallery } from '@/components/public/ProductGallery'
import { cookies } from 'next/headers'
import { FloatingContact } from '@/components/public/FloatingContact'

interface PageProps {
  params: Promise<{ slug: string; productSlug: string }>
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { slug, productSlug } = await params

  // Buscar empresa do banco de dados
  const company = await prisma.company.findUnique({
    where: { slug },
    include: { 
      products: {
        orderBy: { createdAt: 'desc' }
      }
    }
  })
  
  if (!company) notFound()
  
  // Buscar produto pelo slug OU pelo id (fallback)
  const product = company.products.find(
    (p) => p.slug === productSlug || p.id === productSlug
  )
  
  if (!product) notFound()

  // Detectar idioma no servidor
  const cookieStore = await cookies()
  const lang = cookieStore.get('mr-language')?.value || 'pt'

  // Função auxiliar para tradução no servidor
  const st = (pt: string, en?: string | null, es?: string | null) => {
    if (lang === 'en' && en) return en
    if (lang === 'es' && es) return es
    return pt
  }

  const translatedTitle = st(product.title, product.title_en, product.title_es)
  const translatedDescription = st(product.description, product.description_en, product.description_es)

  // Preparar incoterms como array
  const incotermsArray = product.incoterms 
    ? product.incoterms.split(',').map(s => s.trim())
    : []

  // Produtos relacionados (mesma empresa, excluindo o atual)
  const relatedProducts = company.products
    .filter(p => p.id !== product.id)
    .slice(0, 4)
    .map(p => ({
      ...p,
      title: st(p.title, p.title_en, p.title_es),
      description: st(p.description, p.description_en, p.description_es),
      slug: p.slug || p.id,
      imageUrl: p.imageUrl || '/placeholder-product.png',
      category: p.category || 'Geral',
      incoterms: p.incoterms ? p.incoterms.split(',').map(s => s.trim()) : undefined,
    }))

  return (
    <div className="min-h-screen bg-white pb-20">
      {/* Breadcrumbs & Back Navigation */}
      <div className="bg-gray-50 border-b border-gray-100 pt-32 pb-6">
        <div className="container-custom">
          <nav className="flex items-center gap-4 text-sm font-medium text-gray-500 mb-4">
            <Link href="/" className="hover:text-[var(--color-gold)] transition-colors">Home</Link>
            <ChevronRight size={14} />
            <Link href={`/empresa/${slug}`} className="hover:text-[var(--color-gold)] transition-colors">{company.name}</Link>
            <ChevronRight size={14} />
            <Link href={`/empresa/${slug}/catalogo`} className="hover:text-[var(--color-gold)] transition-colors">
              {st('Catálogo', 'Showcase', 'Escaparate')}
            </Link>
            <ChevronRight size={14} />
            <span className="text-[var(--color-navy)] truncate max-w-[200px]">{translatedTitle}</span>
          </nav>
          
          <Link 
            href={`/empresa/${slug}/catalogo`}
            className="inline-flex items-center gap-2 text-[var(--color-navy)] font-bold hover:text-[var(--color-gold)] transition-colors group"
          >
            <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
            {st('Voltar ao Catálogo', 'Back to Showcase', 'Volver al Escaparate')}
          </Link>
        </div>
      </div>

      <div className="container-custom mt-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Imagem do Produto */}
          <div className="space-y-6">
            <div className="relative aspect-square rounded-[2.5rem] overflow-hidden border border-gray-100 shadow-2xl group">
              {product.imageUrl ? (
                <Image 
                  src={product.imageUrl} 
                  alt={translatedTitle} 
                  fill 
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                />
              ) : (
                <div className="w-full h-full bg-gray-50 flex items-center justify-center">
                  <Package size={80} className="text-gray-200" />
                </div>
              )}
              <div className="absolute top-6 left-6 flex flex-wrap gap-2">
                <span className="px-4 py-2 bg-white/90 backdrop-blur-md rounded-full text-[10px] font-black uppercase tracking-widest text-[var(--color-navy)] shadow-lg">
                  {st(product.category || 'Produto', product.category, product.category)}
                </span>
              </div>
            </div>
            
            {/* Selos dinâmicos */}
            <div className="grid grid-cols-3 gap-4">
              {product.isReadyToShip && (
                <div className="p-4 rounded-2xl bg-blue-50 border border-blue-100 flex flex-col items-center text-center space-y-2">
                  <Truck size={20} className="text-blue-600" />
                  <span className="text-[9px] font-bold uppercase tracking-wider text-blue-700">{st('Pronta Entrega', 'Ready to Ship', 'Pronta Entrega')}</span>
                </div>
              )}
              {product.isCertified && (
                <div className="p-4 rounded-2xl bg-green-50 border border-green-100 flex flex-col items-center text-center space-y-2">
                  <ShieldCheck size={20} className="text-green-600" />
                  <span className="text-[9px] font-bold uppercase tracking-wider text-green-700">{st('Verificado', 'Verified', 'Verificado')}</span>
                </div>
              )}
              {product.isSustainable && (
                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-100 flex flex-col items-center text-center space-y-2">
                  <Leaf size={20} className="text-emerald-600" />
                  <span className="text-[9px] font-bold uppercase tracking-wider text-emerald-700">{st('Sustentável', 'Sustainable', 'Sustentable')}</span>
                </div>
              )}
              {!product.isReadyToShip && !product.isCertified && !product.isSustainable && (
                <>
                  <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100 flex flex-col items-center text-center space-y-2">
                    <ShieldCheck size={20} className="text-[var(--color-gold)]" />
                    <span className="text-[9px] font-bold uppercase tracking-wider">{st('Verificado', 'Verified', 'Verificado')}</span>
                  </div>
                  <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100 flex flex-col items-center text-center space-y-2">
                    <Truck size={20} className="text-[var(--color-gold)]" />
                    <span className="text-[9px] font-bold uppercase tracking-wider">{st('Logística Global', 'Global Logistics', 'Logística Global')}</span>
                  </div>
                  <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100 flex flex-col items-center text-center space-y-2">
                    <Package size={20} className="text-[var(--color-gold)]" />
                    <span className="text-[9px] font-bold uppercase tracking-wider">{st('Altos Padrões', 'High Standards', 'Altos Estándares')}</span>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Detalhes e Compra */}
          <div className="flex flex-col space-y-8">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-[var(--color-gold-pale)] text-[var(--color-gold)] rounded-full text-[10px] font-black uppercase tracking-[0.2em]">
                {st('Oportunidade B2B', 'B2B Opportunity', 'Oportunidad B2B')}
              </div>
              <h1 className="text-4xl md:text-5xl font-display font-bold text-[var(--color-navy)] leading-tight">
                {translatedTitle}
              </h1>

              {/* Selos B2B inline */}
              <div className="flex flex-wrap gap-2">
                {product.isReadyToShip && (
                  <span className="flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-[10px] font-black tracking-wider uppercase border border-blue-100">
                    <Truck size={12} /> {st('Pronta Entrega', 'Ready to Ship', 'Entrega Inmediata')}
                  </span>
                )}
                {product.isLowMOQ && (
                  <span className="flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-600 rounded-full text-[10px] font-black tracking-wider uppercase border border-amber-100">
                    <Zap size={12} /> {st('Baixo MOQ', 'Low MOQ', 'Bajo MOQ')}
                  </span>
                )}
                {product.isCertified && (
                  <span className="flex items-center gap-1.5 px-3 py-1 bg-green-50 text-green-600 rounded-full text-[10px] font-black tracking-wider uppercase border border-green-100">
                    <ShieldCheck size={12} /> {st('Certificado', 'Certified', 'Certificado')}
                  </span>
                )}
                {product.isSustainable && (
                  <span className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-black tracking-wider uppercase border border-emerald-100">
                    <Leaf size={12} /> {st('Sustentável', 'Sustainable', 'Sustentable')}
                  </span>
                )}
              </div>

              <p className="text-lg text-gray-500 font-body leading-relaxed">
                {translatedDescription}
              </p>
            </div>

            {/* Especificações B2B */}
            <div className="bg-gray-50 rounded-3xl p-8 space-y-6 border border-gray-100">
              <h3 className="text-sm font-bold uppercase tracking-widest text-gray-400 border-b border-gray-200 pb-4">
                {st('Ficha Técnica de Exportação', 'Export Data Sheet', 'Ficha Técnica de Exportación')}
              </h3>
              
              <div className="grid grid-cols-2 gap-y-8 gap-x-8">
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                    <Package size={12} className="text-[var(--color-gold)]" />
                    {st('Pedido Mínimo (MOQ)', 'Minimum Order (MOQ)', 'Pedido Mínimo (MOQ)')}
                  </div>
                  <p className="text-[var(--color-navy)] font-bold text-lg leading-none">{product.moq || st('Sob consulta', 'Upon request', 'Bajo consulta')}</p>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                    <Truck size={12} className="text-[var(--color-gold)]" />
                    {st('Porto de Origem', 'Port of Origin', 'Puerto de Origen')}
                  </div>
                  <p className="text-[var(--color-navy)] font-bold text-lg leading-none">{product.portOfOrigin || st('A combinar', 'To be agreed', 'A convenir')}</p>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                    <Zap size={12} className="text-[var(--color-gold)]" />
                    {st('Capacidade Produtiva', 'Production Capacity', 'Capacidad Productiva')}
                  </div>
                  <p className="text-[var(--color-navy)] font-bold text-lg leading-none">{product.productionCapacity || st('Escalável', 'Scalable', 'Escalable')}</p>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                    <CheckCircle2 size={12} className="text-[var(--color-gold)]" />
                    {st('Lead Time Médio', 'Average Lead Time', 'Lead Time Medio')}
                  </div>
                  <p className="text-[var(--color-navy)] font-bold text-lg leading-none">{product.leadTime || st('Consultar prazos', 'Check deadlines', 'Consultar plazos')}</p>
                </div>
                <div className="col-span-2 space-y-2">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{st('Incoterms Suportados', 'Supported Incoterms', 'Incoterms Soportados')}</span>
                  <div className="flex flex-wrap gap-2 pt-1">
                    {incotermsArray.length > 0 ? incotermsArray.map(inc => (
                      <span key={inc} className="px-3 py-1 bg-white border border-gray-200 rounded-lg text-[10px] font-black text-[var(--color-navy)] uppercase">
                        {inc}
                      </span>
                    )) : <span className="text-xs text-gray-400 italic font-medium">{st('A negociar', 'To be negotiated', 'A negociar')}</span>}
                  </div>
                </div>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link 
                href={`/empresa/${slug}#contato`}
                className="flex-1 bg-[var(--color-navy)] text-white text-center py-5 rounded-2xl font-display font-bold hover:bg-[var(--color-navy-light)] transition-all shadow-xl flex items-center justify-center gap-3"
              >
                {st('Solicitar Cotação', 'Request Quote', 'Solicitar Cotización')} <ArrowRight size={20} />
            </Link>
                        {/* WhatsApp Action */}
              {company.whatsapp && (
                <a 
                  href={`https://wa.me/${company.whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(st(`Olá! Gostaria de saber mais sobre o produto: ${translatedTitle}`, `Hi! I would like to know more about the product: ${translatedTitle}`, `¡Hola! Me gustaría saber más sobre o produto: ${translatedTitle}`))}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 px-8 py-5 border-2 border-[#25D366] text-[#25D366] rounded-2xl font-display font-bold hover:bg-[#25D366] hover:text-white transition-all flex items-center justify-center gap-2 group"
                >
                  <MessageSquare size={20} /> 
                  <span className="hidden sm:inline">WhatsApp</span>
                </a>
              )}

              {/* Email Action */}
              {company.email && (
                <a 
                  href={`mailto:${company.email}?subject=${encodeURIComponent(st(`Interesse no produto: ${translatedTitle}`, `Interest in product: ${translatedTitle}`, `Interés en el producto: ${translatedTitle}`))}&body=${encodeURIComponent(st(`Olá, vi seu produto ${translatedTitle} na plataforma EU-Mercosur Ready e gostaria de mais informações.`, `Hello, I saw your product ${translatedTitle} on the EU-Mercosur Ready platform and would like more information.`, `Hola, vi su producto ${translatedTitle} en la plataforma EU-Mercosur Ready y me gustaría más información.`))}`}
                  className="flex-1 px-8 py-5 border-2 border-gray-200 rounded-2xl font-display font-bold text-[var(--color-navy)] hover:border-[var(--color-navy)] transition-all flex items-center justify-center gap-2 group"
                >
                  <Mail size={20} /> 
                  <span className="hidden sm:inline">{st('Enviar E-mail', 'Send Email', 'Enviar Correo')}</span>
                </a>
              )}
            </div>

            {/* Selos de Confiança */}
            <div className="flex items-center gap-6 pt-6 grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all duration-500">
              <Globe size={32} />
              <ShieldCheck size={32} />
              <CheckCircle2 size={32} />
            </div>
          </div>
        </div>
      </div>

      {/* Seção Relacionados */}
      {relatedProducts.length > 0 && (
        <section className="container-custom mt-32 space-y-12">
          <div className="flex items-center justify-between border-b border-gray-100 pb-8">
            <h2 className="text-3xl font-display font-bold text-[var(--color-navy)]">
              {st('Produtos Relacionados', 'Related Products', 'Productos Relacionados')}
            </h2>
            <Link 
              href={`/empresa/${slug}/catalogo`}
              className="text-sm font-bold text-[var(--color-gold)] uppercase tracking-widest hover:underline"
            >
              {st('Ver catálogo completo', 'View full showcase', 'Ver escaparate completo')}
            </Link>
          </div>
          
          <ProductGallery 
            products={relatedProducts} 
            companyName={company.name}
            companySlug={slug}
            useLink={true}
          />
        </section>
      )}

      <FloatingContact 
        phone={company.phone} 
        whatsapp={company.whatsapp}
        email={company.email}
        companyName={company.name} 
        language={lang}
      />
    </div>
  )
}

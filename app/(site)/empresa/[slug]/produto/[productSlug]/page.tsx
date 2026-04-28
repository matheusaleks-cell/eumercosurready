// app/(public)/empresa/[slug]/produto/[productSlug]/page.tsx
import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { 
  ChevronLeft, ChevronRight,
  ShieldCheck, Truck, Package, Globe, Mail, ArrowRight,
  CheckCircle2, Leaf, Zap
} from 'lucide-react'
import prisma from '@/lib/prisma'
import { ProductGallery } from '@/components/public/ProductGallery'

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
            <Link href={`/empresa/${slug}/catalogo`} className="hover:text-[var(--color-gold)] transition-colors">Catálogo</Link>
            <ChevronRight size={14} />
            <span className="text-[var(--color-navy)] truncate max-w-[200px]">{product.title}</span>
          </nav>
          
          <Link 
            href={`/empresa/${slug}/catalogo`}
            className="inline-flex items-center gap-2 text-[var(--color-navy)] font-bold hover:text-[var(--color-gold)] transition-colors group"
          >
            <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
            Voltar ao Catálogo
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
                  alt={product.title} 
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
                  {product.category || 'Produto'}
                </span>
              </div>
            </div>
            
            {/* Selos dinâmicos */}
            <div className="grid grid-cols-3 gap-4">
              {product.isReadyToShip && (
                <div className="p-4 rounded-2xl bg-blue-50 border border-blue-100 flex flex-col items-center text-center space-y-2">
                  <Truck size={20} className="text-blue-600" />
                  <span className="text-[9px] font-bold uppercase tracking-wider text-blue-700">Pronta Entrega</span>
                </div>
              )}
              {product.isCertified && (
                <div className="p-4 rounded-2xl bg-green-50 border border-green-100 flex flex-col items-center text-center space-y-2">
                  <ShieldCheck size={20} className="text-green-600" />
                  <span className="text-[9px] font-bold uppercase tracking-wider text-green-700">Verificado</span>
                </div>
              )}
              {product.isSustainable && (
                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-100 flex flex-col items-center text-center space-y-2">
                  <Leaf size={20} className="text-emerald-600" />
                  <span className="text-[9px] font-bold uppercase tracking-wider text-emerald-700">Sustentável</span>
                </div>
              )}
              {!product.isReadyToShip && !product.isCertified && !product.isSustainable && (
                <>
                  <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100 flex flex-col items-center text-center space-y-2">
                    <ShieldCheck size={20} className="text-[var(--color-gold)]" />
                    <span className="text-[9px] font-bold uppercase tracking-wider">Verificado</span>
                  </div>
                  <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100 flex flex-col items-center text-center space-y-2">
                    <Truck size={20} className="text-[var(--color-gold)]" />
                    <span className="text-[9px] font-bold uppercase tracking-wider">Logística Global</span>
                  </div>
                  <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100 flex flex-col items-center text-center space-y-2">
                    <Package size={20} className="text-[var(--color-gold)]" />
                    <span className="text-[9px] font-bold uppercase tracking-wider">Altos Padrões</span>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Detalhes e Compra */}
          <div className="flex flex-col space-y-8">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-[var(--color-gold-pale)] text-[var(--color-gold)] rounded-full text-[10px] font-black uppercase tracking-[0.2em]">
                Oportunidade B2B
              </div>
              <h1 className="text-4xl md:text-5xl font-display font-bold text-[var(--color-navy)] leading-tight">
                {product.title}
              </h1>

              {/* Selos B2B inline */}
              <div className="flex flex-wrap gap-2">
                {product.isReadyToShip && (
                  <span className="flex items-center gap-1.5 px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-[10px] font-black tracking-wider uppercase border border-blue-100">
                    <Truck size={12} /> Pronta Entrega
                  </span>
                )}
                {product.isLowMOQ && (
                  <span className="flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-600 rounded-full text-[10px] font-black tracking-wider uppercase border border-amber-100">
                    <Zap size={12} /> Baixo MOQ
                  </span>
                )}
                {product.isCertified && (
                  <span className="flex items-center gap-1.5 px-3 py-1 bg-green-50 text-green-600 rounded-full text-[10px] font-black tracking-wider uppercase border border-green-100">
                    <ShieldCheck size={12} /> Certificado
                  </span>
                )}
                {product.isSustainable && (
                  <span className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-black tracking-wider uppercase border border-emerald-100">
                    <Leaf size={12} /> Sustentável
                  </span>
                )}
              </div>

              <p className="text-lg text-gray-500 font-body leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Especificações B2B */}
            <div className="bg-gray-50 rounded-3xl p-8 space-y-6 border border-gray-100">
              <h3 className="text-sm font-bold uppercase tracking-widest text-gray-400 border-b border-gray-200 pb-4">Ficha Técnica de Exportação</h3>
              
              <div className="grid grid-cols-2 gap-y-8 gap-x-8">
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                    <Package size={12} className="text-[var(--color-gold)]" />
                    Pedido Mínimo (MOQ)
                  </div>
                  <p className="text-[var(--color-navy)] font-bold text-lg leading-none">{product.moq || 'Sob consulta'}</p>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                    <Truck size={12} className="text-[var(--color-gold)]" />
                    Porto de Origem
                  </div>
                  <p className="text-[var(--color-navy)] font-bold text-lg leading-none">{product.portOfOrigin || 'A combinar'}</p>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                    <Zap size={12} className="text-[var(--color-gold)]" />
                    Capacidade Produtiva
                  </div>
                  <p className="text-[var(--color-navy)] font-bold text-lg leading-none">{product.productionCapacity || 'Escalável'}</p>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                    <CheckCircle2 size={12} className="text-[var(--color-gold)]" />
                    Lead Time Médio
                  </div>
                  <p className="text-[var(--color-navy)] font-bold text-lg leading-none">{product.leadTime || 'Consultar prazos'}</p>
                </div>
                <div className="col-span-2 space-y-2">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Incoterms Suportados</span>
                  <div className="flex flex-wrap gap-2 pt-1">
                    {incotermsArray.length > 0 ? incotermsArray.map(inc => (
                      <span key={inc} className="px-3 py-1 bg-white border border-gray-200 rounded-lg text-[10px] font-black text-[var(--color-navy)] uppercase">
                        {inc}
                      </span>
                    )) : <span className="text-xs text-gray-400 italic font-medium">A negociar</span>}
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
                Solicitar Cotação <ArrowRight size={20} />
              </Link>
              <button className="px-8 py-5 border-2 border-gray-200 rounded-2xl font-display font-bold text-[var(--color-navy)] hover:border-[var(--color-navy)] transition-all flex items-center justify-center gap-2 group">
                <Mail size={20} /> <span className="hidden sm:inline">Enviar Mensagem</span>
              </button>
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
            <h2 className="text-3xl font-display font-bold text-[var(--color-navy)]">Produtos Relacionados</h2>
            <Link 
              href={`/empresa/${slug}/catalogo`}
              className="text-sm font-bold text-[var(--color-gold)] uppercase tracking-widest hover:underline"
            >
              Ver catálogo completo
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
    </div>
  )
}

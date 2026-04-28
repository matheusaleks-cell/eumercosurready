// app/(public)/empresa/[slug]/catalogo/page.tsx
import React from 'react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ChevronLeft, Package } from 'lucide-react'
import { CatalogContainer } from '@/components/public/CatalogContainer'
import prisma from '@/lib/prisma'

interface PageProps {
  params: Promise<{ slug: string }>
}

export default async function CatalogPage({ params }: PageProps) {
  const { slug } = await params

  // Buscar empresa real do banco de dados
  const company = await prisma.company.findUnique({
    where: { slug },
    include: { 
      products: {
        orderBy: { createdAt: 'desc' }
      }
    }
  })

  if (!company) {
    notFound()
  }

  // Mapear produtos do banco para a interface que o CatalogContainer espera
  const products = company.products.map(p => ({
    ...p,
    slug: p.slug || p.id, // fallback para id se slug não existir
    imageUrl: p.imageUrl || '/placeholder-product.png',
    category: p.category || 'Geral',
    incoterms: p.incoterms ? p.incoterms.split(',').map(s => s.trim()) : undefined,
  }))

  return (
    <div className="min-h-screen bg-[var(--color-cream)] pb-20">
      {/* Header do Catálogo */}
      <div className="bg-[var(--color-navy)] pt-32 pb-16 text-white">
        <div className="container-custom">
          <Link 
            href={`/empresa/${slug}`}
            className="inline-flex items-center gap-2 text-white/60 hover:text-white transition-colors mb-8 group"
          >
            <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
            Voltar ao Perfil
          </Link>
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-[var(--color-gold)]">
                <Package size={24} />
                <span className="text-xs font-black uppercase tracking-[0.3em]">Catálogo Completo</span>
              </div>
              <h1 className="text-4xl md:text-5xl font-display font-bold">
                Produtos & Serviços <br />
                <span className="text-[var(--color-gold)]">{company.name}</span>
              </h1>
            </div>
            
            <div className="text-white/40 text-sm font-medium uppercase tracking-widest pb-2">
              {products.length} Itens Disponíveis
            </div>
          </div>
        </div>
      </div>

      {/* Container do Catálogo com Filtros */}
      <div className="container-custom mt-16">
        <CatalogContainer 
          products={products} 
          companyName={company.name}
          companySlug={slug}
        />
      </div>
      
      {/* Rodapé de Conversão */}
      <div className="container-custom mt-20">
        <div className="bg-[var(--color-navy-mid)] rounded-[2.5rem] p-12 text-center space-y-6 text-white shadow-2xl">
          <h3 className="text-3xl font-display font-bold">Interessado em algum item?</h3>
          <p className="text-white/60 max-w-xl mx-auto font-body">
            Nossa equipe comercial está pronta para enviar uma cotação personalizada e discutir prazos de entrega e condições de frete.
          </p>
          <div className="flex justify-center pt-4">
            <Link 
              href={`/empresa/${slug}#contato`}
              className="bg-[var(--color-gold)] text-[var(--color-navy)] px-10 py-5 rounded-2xl font-display font-black hover:scale-105 transition-all shadow-xl"
            >
              Solicitar Cotação Geral
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

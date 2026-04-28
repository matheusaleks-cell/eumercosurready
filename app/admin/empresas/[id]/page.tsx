import React from 'react'
import prisma from '@/lib/prisma'
import CompanyTabs from '@/components/admin/CompanyTabs'
import { ArrowLeft, ExternalLink } from 'lucide-react'
import Link from 'next/link'
import { notFound } from 'next/navigation'

export default async function EditarEmpresaPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const company = await prisma.company.findUnique({
    where: { id },
    include: { products: true }
  })

  if (!company) notFound()

  const sectors = await prisma.sector.findMany({
    orderBy: { name: 'asc' },
    select: { id: true, name: true }
  })

  return (
    <div className="max-w-7xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-2 duration-700">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-gray-100 pb-8">
        <div className="space-y-1">
          <Link 
            href="/admin/empresas" 
            className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2 hover:text-[var(--color-navy)] transition-colors mb-4"
          >
            <ArrowLeft size={14} />
            Voltar para Listagem
          </Link>
          <div className="flex items-center gap-4">
            <h1 className="text-4xl font-bold text-[var(--color-navy)] tracking-tight">
              {company.name}
            </h1>
            <Link 
              href={`/empresa/${company.slug}`} 
              target="_blank" 
              className="p-2.5 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 hover:border-[var(--color-gold)] transition-all shadow-sm group"
              title="Ver na Plataforma Pública"
            >
              <ExternalLink size={18} className="text-gray-400 group-hover:text-[var(--color-gold)] transition-colors" />
            </Link>
          </div>
          <p className="text-sm text-gray-500 font-body max-w-2xl">
            Gestão estratégica de perfil corporativo. Atualize dados institucionais ou gerencie o portfólio de produtos e serviços disponíveis na vitrine internacional.
          </p>
        </div>
      </div>

      {/* Interface de Abas */}
      <CompanyTabs sectors={sectors} company={company} />
    </div>
  )
}

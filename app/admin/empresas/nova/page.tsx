import React from 'react'
export const dynamic = 'force-dynamic'
import prisma from '@/lib/prisma'
import CompanyForm from '@/components/admin/CompanyForm'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default async function NovaEmpresaPage() {
  const sectors = await prisma.sector.findMany({
    orderBy: { name: 'asc' },
    select: { id: true, name: true }
  })

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-700">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <Link 
            href="/admin/empresas" 
            className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2 hover:text-[var(--color-navy)] transition-colors mb-2"
          >
            <ArrowLeft size={14} />
            Voltar para Listagem
          </Link>
          <h1 className="text-3xl font-bold text-[var(--color-navy)]">
            Cadastrar Nova Empresa
          </h1>
          <p className="text-sm text-gray-500 font-body">
            Preencha os dados abaixo seguindo o padrão de autoridade B2B da plataforma.
          </p>
        </div>
      </div>

      {/* Grid com Formulário */}
      <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
        <CompanyForm sectors={sectors} />
      </div>
    </div>
  )
}

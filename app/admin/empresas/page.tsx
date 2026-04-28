import React from 'react'
import prisma from '@/lib/prisma'
import Link from 'next/link'
import { CompanyManager } from '@/components/admin/CompanyManager'
import { countriesList } from '@/lib/countries-list'
import { Plus } from 'lucide-react'

export default async function EmpresasAdminPage() {
  const sectors = await prisma.sector.findMany({
    orderBy: { name: 'asc' },
    select: { id: true, name: true }
  })

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-700">
      {/* Header com Ações */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-navy)] flex items-center gap-2">
            Gestão de Vitrines
          </h1>
          <p className="text-sm text-gray-500 font-body">Gerencie as empresas e produtos da plataforma.</p>
        </div>
        <Link 
          href="/admin/empresas/nova"
          className="flex items-center gap-2 px-6 py-3 bg-[var(--color-navy)] text-white rounded-xl font-bold hover:bg-[#002266] transition-all shadow-lg shadow-blue-900/20"
        >
          <Plus size={18} />
          Nova Empresa
        </Link>
      </div>

      {/* Componente de Gestão com Filtros e Paginação */}
      <CompanyManager initialSectors={sectors} initialCountries={countriesList} />
    </div>
  )
}

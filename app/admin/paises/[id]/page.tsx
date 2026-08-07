import React from 'react'
export const dynamic = 'force-dynamic'
import prisma from '@/lib/prisma'
import CountryForm from '@/components/admin/CountryForm'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { CountrySector } from '@/types'

export default async function EditarPaisPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const country = await prisma.country.findUnique({ where: { id } })

  if (!country) notFound()

  const initialData = {
    ...country,
    sectors: (country.sectors as unknown as CountrySector[] | null) || [],
  }

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-700">
      <div className="space-y-1">
        <Link
          href="/admin/paises"
          className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2 hover:text-[var(--color-navy)] transition-colors mb-2"
        >
          <ArrowLeft size={14} />
          Voltar para Listagem
        </Link>
        <h1 className="text-3xl font-bold text-[var(--color-navy)]">
          {country.name}
        </h1>
        <p className="text-sm text-gray-500 font-body">
          Gerencie os dados básicos e o perfil público exibido em /pais/{country.slug}.
        </p>
      </div>

      <CountryForm initialData={initialData} />
    </div>
  )
}

import React from 'react'
export const dynamic = 'force-dynamic'
import CountryForm from '@/components/admin/CountryForm'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function NovoPaisPage() {
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
          Cadastrar Novo País
        </h1>
        <p className="text-sm text-gray-500 font-body">
          Preencha os dados básicos e, se desejar, complete o perfil público exibido em /pais.
        </p>
      </div>

      <CountryForm />
    </div>
  )
}

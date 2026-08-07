'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { toast } from 'sonner'
import { Flag, Plus, Trash2, Pencil, Zap, FileStack, AlertCircle, CheckCircle2, Search, Power } from 'lucide-react'
import {
  getCountries,
  deleteCountry,
  toggleCountryActive,
  seedInitialCountries,
  migrateLegacyCountryProfiles,
} from '@/lib/actions/countries'
import { cn } from '@/lib/utils'
import type { Country } from '@/types'

const GROUP_LABELS: Record<string, string> = {
  EU: 'União Europeia',
  MERCOSUL: 'Mercosul',
  GUEST: 'Países Convidados',
}

interface CountriesListProps {
  initialCountries: Country[]
}

export default function CountriesList({ initialCountries }: CountriesListProps) {
  const [countries, setCountries] = useState<Country[]>(initialCountries)
  const [refreshing, setRefreshing] = useState(false)
  const [seeding, setSeeding] = useState(false)
  const [migrating, setMigrating] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [message, setMessage] = useState({ type: '', text: '' })
  const [deletingId, setDeletingId] = useState<string | null>(null)

  async function loadCountries() {
    setRefreshing(true)
    const result = await getCountries()
    if (result.success) {
      setCountries((result.countries as Country[]) || [])
    }
    setRefreshing(false)
  }

  async function handleDelete(id: string) {
    if (deletingId !== id) {
      setDeletingId(id)
      return
    }
    setDeletingId(null)
    const toastId = toast.loading('Removendo país...')
    const result = await deleteCountry(id)
    if (result.success) {
      loadCountries()
      toast.success('País removido!', { id: toastId })
    } else {
      toast.error(result.error || 'Erro ao remover', { id: toastId })
    }
  }

  async function handleToggleActive(country: Country) {
    const toastId = toast.loading(country.active ? 'Desativando...' : 'Ativando...')
    const result = await toggleCountryActive(country.id, !country.active)
    if (result.success) {
      loadCountries()
      toast.success(country.active ? 'País desativado.' : 'País ativado.', { id: toastId })
    } else {
      toast.error(result.error || 'Erro ao alterar status', { id: toastId })
    }
  }

  async function handleSeed() {
    setSeeding(true)
    const result = await seedInitialCountries()
    if (result.success) {
      loadCountries()
      setMessage({ type: 'success', text: 'Base de países (UE/Mercosul) sincronizada com sucesso!' })
    } else {
      setMessage({ type: 'error', text: result.error || 'Erro ao popular base' })
    }
    setSeeding(false)
  }

  async function handleMigrateProfiles() {
    setMigrating(true)
    const result = await migrateLegacyCountryProfiles()
    if (result.success) {
      loadCountries()
      setMessage({ type: 'success', text: `Perfis legados importados! ${result.updated ?? 0} país(es) atualizado(s).` })
    } else {
      setMessage({ type: 'error', text: result.error || 'Erro ao importar perfis legados' })
    }
    setMigrating(false)
  }

  const filteredCountries = countries.filter(c =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.code.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-6 admin-theme animate-in fade-in duration-500">
      {/* Header Compacto */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold text-[var(--color-navy)] flex items-center gap-2">
            <Flag className="text-[var(--color-gold)]" size={24} />
            Gerenciamento de Países
          </h1>
          <p className="text-xs text-gray-500">Controle os países disponíveis, seus grupos (UE / Mercosul / Convidados) e o perfil público exibido em /pais.</p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={handleSeed}
            disabled={seeding}
            className="flex items-center gap-2 px-3 py-2 bg-amber-50 text-amber-700 border border-amber-200 text-[10px] font-black uppercase tracking-widest hover:bg-amber-100 transition-all disabled:opacity-50"
          >
            <Zap size={14} />
            Sincronizar Base
          </button>
          <button
            onClick={handleMigrateProfiles}
            disabled={migrating}
            title="Importa descrição, economia, setores e comércio exterior dos dados legados para países que ainda não têm perfil preenchido"
            className="flex items-center gap-2 px-3 py-2 bg-blue-50 text-blue-700 border border-blue-200 text-[10px] font-black uppercase tracking-widest hover:bg-blue-100 transition-all disabled:opacity-50"
          >
            <FileStack size={14} />
            Importar Perfis Legados
          </button>
          <Link
            href="/admin/paises/novo"
            className="flex items-center gap-2 px-4 py-2 bg-[var(--color-navy)] text-white text-[10px] font-black uppercase tracking-widest hover:bg-[#002266] transition-all"
          >
            <Plus size={14} />
            Novo País
          </Link>
        </div>
      </div>

      {message.text && (
        <div className={cn(
          "p-3 rounded flex items-center gap-3 text-[11px] font-bold",
          message.type === 'success' ? "bg-green-50 text-green-700 border border-green-200" : "bg-red-50 text-red-700 border border-red-200"
        )}>
          {message.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
          {message.text}
        </div>
      )}

      {/* Busca e Tabela Técnica */}
      <div className="bg-white border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-3 border-b border-gray-100 flex flex-wrap items-center justify-between gap-2 bg-gray-50/50">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
            <input
              type="text"
              placeholder="Filtrar base..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-8 pr-4 py-1.5 bg-white border border-gray-200 text-[11px] focus:outline-none"
            />
          </div>
          <div className="text-[10px] font-bold text-gray-400 uppercase">
            Total: {filteredCountries.length} Países
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-100/80 border-b border-gray-200">
                <th className="px-4 py-2 text-[9px] font-black text-gray-500 uppercase tracking-widest w-12 text-center">Bandeira</th>
                <th className="px-4 py-2 text-[9px] font-black text-gray-500 uppercase tracking-widest">Nome / Código</th>
                <th className="px-4 py-2 text-[9px] font-black text-gray-500 uppercase tracking-widest">Grupo</th>
                <th className="px-4 py-2 text-[9px] font-black text-gray-500 uppercase tracking-widest text-center">DDI</th>
                <th className="px-4 py-2 text-[9px] font-black text-gray-500 uppercase tracking-widest text-center">Perfil</th>
                <th className="px-4 py-2 text-[9px] font-black text-gray-500 uppercase tracking-widest text-center">Status</th>
                <th className="px-4 py-2 text-[9px] font-black text-gray-500 uppercase tracking-widest text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {refreshing ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan={7} className="px-4 py-4"><div className="h-3 bg-gray-50 rounded w-full"></div></td>
                  </tr>
                ))
              ) : filteredCountries.map((country) => (
                <tr key={country.id} className={cn("hover:bg-blue-50/20 transition-colors group", !country.active && "opacity-40")}>
                  <td className="px-4 py-2 text-center">
                    <div className="flex justify-center">
                      {country.flagUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={country.flagUrl} alt={country.name} className="w-6 h-4 object-cover rounded-sm border border-gray-100" />
                      ) : (
                        <Flag size={16} className="text-gray-300" />
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-2">
                    <div className="font-bold text-xs text-gray-900 leading-tight">{country.name}</div>
                    <div className="text-[10px] text-gray-400 font-mono tracking-tighter">{country.code}</div>
                  </td>
                  <td className="px-4 py-2">
                    <span className="text-[10px] font-black text-gray-600 bg-gray-100 px-1.5 py-0.5 rounded uppercase">
                      {GROUP_LABELS[country.group] || country.group}
                    </span>
                  </td>
                  <td className="px-4 py-2 text-center text-[10px] text-gray-500">+{country.ddi}</td>
                  <td className="px-4 py-2 text-center">
                    {country.description ? (
                      <span className="text-[9px] font-black text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded uppercase">Completo</span>
                    ) : (
                      <span className="text-[9px] font-black text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded uppercase">Pendente</span>
                    )}
                  </td>
                  <td className="px-4 py-2 text-center">
                    <button
                      onClick={() => handleToggleActive(country)}
                      title={country.active ? 'Desativar' : 'Ativar'}
                      className={cn("p-1.5 transition-all", country.active ? "text-emerald-500 hover:text-emerald-700" : "text-gray-300 hover:text-gray-500")}
                    >
                      <Power size={14} />
                    </button>
                  </td>
                  <td className="px-4 py-2 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Link
                        href={`/admin/paises/${country.id}`}
                        className="p-1.5 text-gray-400 hover:text-[var(--color-navy)] transition-all"
                        title="Editar"
                      >
                        <Pencil size={14} />
                      </Link>
                      {deletingId === country.id ? (
                        <>
                          <span className="text-[10px] text-red-500 font-bold mr-1">Confirmar?</span>
                          <button
                            onClick={() => handleDelete(country.id)}
                            className="p-1.5 text-red-500 hover:text-red-700 transition-all"
                            title="Confirmar exclusão"
                          >
                            <Trash2 size={14} />
                          </button>
                          <button
                            onClick={() => setDeletingId(null)}
                            className="p-1.5 text-gray-400 hover:text-gray-600 transition-all text-[10px] font-bold"
                            title="Cancelar"
                          >
                            ✕
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() => handleDelete(country.id)}
                          className="p-1.5 text-gray-400 hover:text-red-500 transition-all"
                          title="Excluir (clique para confirmar)"
                        >
                          <Trash2 size={14} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

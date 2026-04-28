'use client'

import React, { useState, useEffect } from 'react'
import { Search, Filter, Building2, Eye, Edit, ChevronLeft, ChevronRight, ShieldCheck, Trash2, AlertTriangle } from 'lucide-react'
import Link from 'next/link'
import { getCompanies, deleteCompany } from '@/lib/actions/companies'
import { cn, translateEmployeesRange } from '@/lib/utils'
import { toast } from 'sonner'

interface CompanyManagerProps {
  initialSectors: any[]
  initialCountries: any[]
}

export function CompanyManager({ initialSectors, initialCountries }: CompanyManagerProps) {
  const [companies, setCompanies] = useState<any[]>([])
  const [total, setTotal] = useState(0)
  const [pages, setPages] = useState(1)
  const [loading, setLoading] = useState(true)
  
  // States para filtros
  const [search, setSearch] = useState('')
  const [sectorId, setSectorId] = useState('ALL')
  const [status, setStatus] = useState('ALL')
  const [region, setRegion] = useState('ALL')
  const [countryCode, setCountryCode] = useState('ALL')
  const [page, setPage] = useState(1)
  const limit = 10

  useEffect(() => {
    const timer = setTimeout(() => {
      loadCompanies()
    }, 300) // Debounce para busca
    return () => clearTimeout(timer)
  }, [search, sectorId, status, region, countryCode, page])

  async function loadCompanies() {
    setLoading(true)
    const result = await getCompanies({
      page,
      limit,
      search,
      sectorId,
      status,
      region,
      countryCode
    })

    if (result.success) {
      setCompanies(result.companies || [])
      setTotal(result.total || 0)
      setPages(result.pages || 1)
    }
    setLoading(false)
  }

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= pages) {
      setPage(newPage)
    }
  }

  const handleDelete = async (id: string, name: string) => {
    if (confirm(`Tem certeza que deseja excluir a empresa "${name}"? Esta ação não pode ser desfeita.`)) {
      try {
        const result = await deleteCompany(id)
        if (result.success) {
          toast.success('Empresa excluída com sucesso!')
          loadCompanies()
        } else {
          toast.error(result.error || 'Erro ao excluir empresa')
        }
      } catch (error) {
        toast.error('Erro crítico ao excluir empresa')
      }
    }
  }

  return (
    <div className="space-y-6">
      {/* Barra de Filtros */}
      <div className="flex flex-col lg:flex-row gap-4 items-start">
        <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm grid grid-cols-1 md:grid-cols-5 gap-3 flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text"
              placeholder="Buscar por nome ou slug..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="w-full pl-12 pr-4 py-2 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-gold)]/20 focus:border-[var(--color-gold)] transition-all"
            />
          </div>

          <select 
            value={sectorId}
            onChange={(e) => { setSectorId(e.target.value); setPage(1); }}
            className="bg-gray-50 border border-gray-100 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-gold)]/20 transition-all"
          >
            <option value="ALL">Todos os Setores</option>
            {initialSectors.map(s => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>

          <select 
            value={status}
            onChange={(e) => { setStatus(e.target.value); setPage(1); }}
            className="bg-gray-50 border border-gray-100 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-gold)]/20 transition-all"
          >
            <option value="ALL">Todos os Status</option>
            <option value="ACTIVE">Ativo</option>
            <option value="FEATURED">Destaque</option>
            <option value="PENDING">Pendente</option>
            <option value="INACTIVE">Inativo</option>
            <option value="DRAFT">Rascunho</option>
          </select>

          <select 
            value={region}
            onChange={(e) => { setRegion(e.target.value); setCountryCode('ALL'); setPage(1); }}
            className="bg-gray-50 border border-gray-100 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-gold)]/20 transition-all"
          >
            <option value="ALL">Todas as Regiões</option>
            <option value="EU">União Europeia</option>
            <option value="MERCOSUL">Mercosul</option>
          </select>

          <select 
            value={countryCode}
            onChange={(e) => { setCountryCode(e.target.value); setPage(1); }}
            className="bg-gray-50 border border-gray-100 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-gold)]/20 transition-all"
          >
            <option value="ALL">Todos os Países</option>
            {initialCountries
              .filter(c => region === 'ALL' || c.bloc.toUpperCase() === region)
              .sort((a, b) => a.name.localeCompare(b.name))
              .map(c => (
                <option key={c.code} value={c.code}>{c.name}</option>
              ))
            }
          </select>
        </div>

        <button 
          onClick={async () => {
            const { exportCompaniesToCSV } = await import('@/lib/actions/export')
            const result = await exportCompaniesToCSV()
            if (result.success && result.csv) {
              const blob = new Blob([result.csv], { type: 'text/csv' })
              const url = window.URL.createObjectURL(blob)
              const a = document.createElement('a')
              a.setAttribute('hidden', '')
              a.setAttribute('href', url)
              a.setAttribute('download', 'empresas-plataforma.csv')
              document.body.appendChild(a)
              a.click()
              document.body.removeChild(a)
            }
          }}
          className="bg-white border border-gray-200 p-4 rounded-2xl hover:bg-gray-50 transition-all flex items-center gap-2 text-xs font-bold text-gray-500 shadow-sm"
          title="Exportar base para CSV"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Exportar
        </button>
      </div>

      {/* Tabela */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Empresa</th>
                <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Setor / Origem</th>
                <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-center">KYB / Auditoria</th>
                <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-center">Status</th>
                <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan={5} className="px-6 py-6"><div className="h-4 bg-gray-100 rounded w-full"></div></td>
                  </tr>
                ))
              ) : companies.length > 0 ? (
                companies.map((company) => (
                  <tr key={company.id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gray-100 overflow-hidden border border-gray-200 flex-shrink-0 flex items-center justify-center">
                          {company.logoUrl ? (
                            <img 
                              src={company.logoUrl} 
                              className="w-full h-full object-cover" 
                              onError={(e) => {
                                (e.target as HTMLImageElement).style.display = 'none';
                                const parent = (e.target as HTMLImageElement).parentElement;
                                if (parent) {
                                  const fallback = document.createElement('div');
                                  fallback.className = "w-full h-full flex items-center justify-center text-xs font-bold text-gray-400";
                                  fallback.innerText = company.name.substring(0, 2).toUpperCase();
                                  parent.appendChild(fallback);
                                }
                              }}
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-xs font-bold text-gray-400">
                              {company.name.substring(0, 2).toUpperCase()}
                            </div>
                          )}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-bold text-sm text-[var(--color-navy)]">{company.name}</p>
                            <div className="flex items-center gap-1">
                              <span 
                                title={company.shortDescription_en ? "Tradução EN Completa" : "Tradução EN Pendente"}
                                className={cn(
                                  "text-[10px] transition-all",
                                  company.shortDescription_en ? "opacity-100 filter-none" : "opacity-20 grayscale"
                                )}
                              >
                                🇺🇸
                              </span>
                              <span 
                                title={company.shortDescription_es ? "Tradução ES Completa" : "Tradução ES Pendente"}
                                className={cn(
                                  "text-[10px] transition-all",
                                  company.shortDescription_es ? "opacity-100 filter-none" : "opacity-20 grayscale"
                                )}
                              >
                                🇪🇸
                              </span>
                            </div>
                          </div>
                          <p className="text-[10px] text-gray-400 uppercase tracking-tight">{company.slug}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-xs font-bold text-gray-700">{company.sector?.name || 'Sem Setor'}</p>
                      <p className="text-[10px] text-gray-400 flex items-center gap-1">
                        {company.country} ({company.region}) • {translateEmployeesRange(company.employeesRange, 'pt')}
                      </p>
                    </td>
                    <td className="px-6 py-4 text-center">
                      {company.auditStatus && company.auditStatus !== 'NONE' ? (
                        <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-600 border border-emerald-100 text-[9px] font-black uppercase tracking-widest shadow-sm">
                          <ShieldCheck size={10} />
                          Verificada
                        </div>
                      ) : (
                        <span className="text-[9px] text-gray-400 font-bold uppercase">Não Verificada</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={cn(
                        "px-2 py-1 rounded-md text-[10px] font-bold uppercase",
                        company.status === 'ACTIVE' ? 'bg-green-50 text-green-600' :
                        company.status === 'PENDING' ? 'bg-amber-50 text-amber-600' :
                        company.status === 'DRAFT' ? 'bg-purple-50 text-purple-600' :
                        company.status === 'FEATURED' ? 'bg-blue-50 text-blue-600' :
                        'bg-gray-50 text-gray-600'
                      )}>
                        {company.status === 'ACTIVE' ? 'Ativo' :
                         company.status === 'PENDING' ? 'Pendente' :
                         company.status === 'INACTIVE' ? 'Inativo' :
                         company.status === 'DRAFT' ? 'Rascunho' :
                         company.status === 'FEATURED' ? 'Destaque' : company.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Link href={`/empresa/${company.slug}`} target="_blank" className="p-2 text-gray-400 hover:text-[var(--color-navy)] hover:bg-blue-50 rounded-lg transition-all">
                          <Eye size={16} />
                        </Link>
                        <Link href={`/admin/empresas/${company.id}`} className="p-2 text-gray-400 hover:text-[var(--color-gold)] hover:bg-amber-50 rounded-lg transition-all">
                          <Edit size={16} />
                        </Link>
                        <button 
                          onClick={() => handleDelete(company.id, company.name)}
                          className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="py-20 text-center space-y-4">
                    <Building2 size={48} className="mx-auto text-gray-100" />
                    <p className="text-gray-400 text-sm">Nenhuma empresa corresponde aos filtros.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Paginação */}
        {pages > 1 && (
          <div className="p-4 border-t border-gray-100 flex items-center justify-between bg-gray-50/30">
            <p className="text-xs text-gray-500">
              Mostrando <span className="font-bold text-gray-900">{companies.length}</span> de <span className="font-bold text-gray-900">{total}</span> empresas
            </p>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => handlePageChange(page - 1)}
                disabled={page === 1 || loading}
                className="p-2 border border-gray-200 rounded-lg hover:bg-white disabled:opacity-30 transition-all"
              >
                <ChevronLeft size={16} />
              </button>
              <div className="flex items-center gap-1">
                {Array.from({ length: pages }).map((_, i) => {
                  const p = i + 1
                  if (p === 1 || p === pages || (p >= page - 1 && p <= page + 1)) {
                    return (
                      <button
                        key={p}
                        onClick={() => handlePageChange(p)}
                        className={cn(
                          "w-8 h-8 rounded-lg text-xs font-bold transition-all",
                          page === p ? "bg-[var(--color-navy)] text-white" : "hover:bg-white text-gray-500 border border-transparent hover:border-gray-100"
                        )}
                      >
                        {p}
                      </button>
                    )
                  }
                  if (p === page - 2 || p === page + 2) return <span key={p} className="text-gray-300">...</span>
                  return null
                })}
              </div>
              <button 
                onClick={() => handlePageChange(page + 1)}
                disabled={page === pages || loading}
                className="p-2 border border-gray-200 rounded-lg hover:bg-white disabled:opacity-30 transition-all"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

'use client'

import React, { useEffect, useState } from 'react'
import { toast } from 'sonner'
import {
  MessageSquare,
  Search,
  CheckCircle2,
  XCircle,
  Clock,
  ExternalLink,
  Mail,
  Globe
} from 'lucide-react'
import { getRequests, updateRequestStatus } from '@/lib/actions/requests'
import { cn } from '@/lib/utils'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

export default function SolicitacoesPage() {
  const [requests, setRequests] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('ALL')
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    loadRequests()
  }, [])

  async function loadRequests() {
    setLoading(true)
    const result = await getRequests()
    if (result.success) {
      setRequests(result.requests || [])
    }
    setLoading(false)
  }

  async function handleStatusUpdate(id: string, status: 'APPROVED' | 'REJECTED') {
    const label = status === 'APPROVED' ? 'aprovada' : 'recusada'
    const toastId = toast.loading(`Marcando como ${label}...`)
    const result = await updateRequestStatus(id, status)
    if (result.success) {
      toast.success(`Solicitação ${label} com sucesso.`, { id: toastId })
      loadRequests()
    } else {
      toast.error(result.error || 'Erro ao atualizar status', { id: toastId })
    }
  }

  const filteredRequests = requests.filter(req => {
    const matchesFilter = filter === 'ALL' || req.status === filter
    const matchesSearch = req.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         req.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         req.responsibleName.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesFilter && matchesSearch
  })

  const stats = {
    pending: requests.filter(r => r.status === 'PENDING').length,
    approved: requests.filter(r => r.status === 'APPROVED').length,
    rejected: requests.filter(r => r.status === 'REJECTED').length,
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-navy)] flex items-center gap-3 font-sans">
            <MessageSquare className="text-[var(--color-gold)]" size={28} />
            Solicitações de Ingresso
          </h1>
          <p className="text-gray-500 mt-1 font-sans">Gerencie os pedidos de novas empresas que desejam entrar no Ecossistema.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text"
              placeholder="Buscar empresa, email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-gold)]/20 focus:border-[var(--color-gold)] transition-all min-w-[280px]"
            />
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center text-amber-600">
            <Clock size={24} />
          </div>
          <div>
            <div className="text-2xl font-bold text-gray-900 leading-none">{stats.pending}</div>
            <div className="text-xs text-gray-500 mt-1 uppercase tracking-wider font-bold">Pendentes</div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center text-green-600">
            <CheckCircle2 size={24} />
          </div>
          <div>
            <div className="text-2xl font-bold text-gray-900 leading-none">{stats.approved}</div>
            <div className="text-xs text-gray-500 mt-1 uppercase tracking-wider font-bold">Aprovadas</div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center text-red-600">
            <XCircle size={24} />
          </div>
          <div>
            <div className="text-2xl font-bold text-gray-900 leading-none">{stats.rejected}</div>
            <div className="text-xs text-gray-500 mt-1 uppercase tracking-wider font-bold">Recusadas</div>
          </div>
        </div>
      </div>

      {/* Filters & Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-50 flex items-center justify-between bg-gray-50/50">
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setFilter('ALL')}
              className={cn(
                "px-4 py-1.5 rounded-lg text-xs font-bold transition-all",
                filter === 'ALL' ? "bg-[var(--color-navy)] text-white" : "text-gray-500 hover:bg-gray-200"
              )}
            >
              Todos
            </button>
            <button 
              onClick={() => setFilter('PENDING')}
              className={cn(
                "px-4 py-1.5 rounded-lg text-xs font-bold transition-all",
                filter === 'PENDING' ? "bg-amber-500 text-white" : "text-gray-500 hover:bg-gray-200"
              )}
            >
              Pendentes
            </button>
            <button 
              onClick={() => setFilter('APPROVED')}
              className={cn(
                "px-4 py-1.5 rounded-lg text-xs font-bold transition-all",
                filter === 'APPROVED' ? "bg-green-600 text-white" : "text-gray-500 hover:bg-gray-200"
              )}
            >
              Aprovadas
            </button>
          </div>
          <div className="text-xs text-gray-400 font-medium italic">
            Mostrando {filteredRequests.length} de {requests.length} solicitações
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-white border-b border-gray-100">
                <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Empresa / Contato</th>
                <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Setor / País</th>
                <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Data</th>
                <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest">Status</th>
                <th className="px-6 py-4 text-[10px] font-bold text-gray-400 uppercase tracking-widest text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan={5} className="px-6 py-8"><div className="h-4 bg-gray-100 rounded w-full"></div></td>
                  </tr>
                ))
              ) : filteredRequests.length > 0 ? (
                filteredRequests.map((req) => (
                  <tr key={req.id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-[var(--color-navy)] font-bold shrink-0">
                          {req.companyName.charAt(0)}
                        </div>
                        <div>
                          <div className="font-bold text-gray-900 text-sm">{req.companyName}</div>
                          <div className="text-xs text-gray-500 flex items-center gap-1">
                            <Mail size={12} className="text-gray-400" />
                            {req.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="space-y-1">
                        <div className="text-xs font-bold text-gray-700 bg-gray-100 px-2 py-0.5 rounded inline-block">
                          {req.sector}
                        </div>
                        <div className="text-xs text-gray-500 flex items-center gap-1 lowercase first-letter:uppercase">
                          <Globe size={12} className="text-gray-400" />
                          {req.countryCode}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="text-xs text-gray-600">
                        {format(new Date(req.createdAt), "dd 'de' MMM, yyyy", { locale: ptBR })}
                      </div>
                      <div className="text-[10px] text-gray-400">
                        {format(new Date(req.createdAt), "HH:mm", { locale: ptBR })}
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <span className={cn(
                        "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
                        req.status === 'PENDING' ? "bg-amber-100 text-amber-700" :
                        req.status === 'APPROVED' ? "bg-green-100 text-green-700" :
                        "bg-red-100 text-red-700"
                      )}>
                        {req.status === 'PENDING' ? 'Pendente' :
                         req.status === 'APPROVED' ? 'Aprovada' : 'Recusada'}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {req.status === 'PENDING' && (
                          <>
                            <button 
                              onClick={() => handleStatusUpdate(req.id, 'APPROVED')}
                              className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-all"
                              title="Aprovar"
                            >
                              <CheckCircle2 size={18} />
                            </button>
                            <button 
                              onClick={() => handleStatusUpdate(req.id, 'REJECTED')}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all"
                              title="Recusar"
                            >
                              <XCircle size={18} />
                            </button>
                          </>
                        )}
                        <button 
                          onClick={() => window.open(`/admin/solicitacoes/${req.id}`, '_self')}
                          className="p-2 text-gray-400 hover:text-[var(--color-gold)] hover:bg-amber-50 rounded-lg transition-all"
                          title="Ver Detalhes"
                        >
                          <ExternalLink size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-20 text-center text-gray-400">
                    <MessageSquare size={48} className="mx-auto mb-4 opacity-10" />
                    <p className="font-bold">Nenhuma solicitação encontrada</p>
                    <p className="text-sm">Ajuste os filtros ou aguarde novos pedidos.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

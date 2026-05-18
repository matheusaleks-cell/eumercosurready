'use client'

import React, { useEffect, useState, use } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import {
  ArrowLeft,
  Building2,
  Globe,
  Mail,
  Phone,
  Calendar,
  User as UserIcon,
  CheckCircle2,
  XCircle,
  Clock,
  ExternalLink,
  ShieldCheck,
  MessageSquare
} from 'lucide-react'
import { getRequestById, updateRequestStatus, promoteToCompany } from '@/lib/actions/requests'
import { cn } from '@/lib/utils'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

interface PageProps {
  params: Promise<{ id: string }>
}

export default function RequestDetailPage({ params }: PageProps) {
  const { id } = use(params)
  const router = useRouter()
  const [request, setRequest] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(false)
  const [pendingAction, setPendingAction] = useState<'APPROVED' | 'REJECTED' | null>(null)

  useEffect(() => {
    loadRequest()
  }, [id])

  async function loadRequest() {
    setLoading(true)
    const result = await getRequestById(id)
    if (result.success) {
      setRequest(result.request)
    } else {
      router.push('/admin/solicitacoes')
    }
    setLoading(false)
  }

  async function handleStatusUpdate(status: 'APPROVED' | 'REJECTED') {
    setActionLoading(true)
    setPendingAction(null)

    if (status === 'APPROVED') {
      const toastId = toast.loading('Criando empresa...')
      const result = await promoteToCompany(id) as any
      if (result.success && result.companyId) {
        toast.success('Empresa criada como rascunho! Redirecionando...', { id: toastId })
        router.push(`/admin/empresas/${result.companyId}`)
      } else {
        toast.error(result.error || 'Erro ao aprovar solicitação', { id: toastId })
        setActionLoading(false)
      }
    } else {
      const toastId = toast.loading('Recusando solicitação...')
      const result = await updateRequestStatus(id, 'REJECTED')
      if (result.success) {
        toast.success('Solicitação recusada.', { id: toastId })
        loadRequest()
      } else {
        toast.error(result.error || 'Erro ao recusar solicitação', { id: toastId })
      }
      setActionLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
        <div className="w-12 h-12 border-4 border-[var(--color-gold)]/20 border-t-[var(--color-gold)] rounded-full animate-spin" />
        <p className="text-gray-500 font-medium">Carregando detalhes...</p>
      </div>
    )
  }

  if (!request) return null

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      {/* Top Bar */}
      <div className="flex items-center justify-between">
        <button 
          onClick={() => router.push('/admin/solicitacoes')}
          className="group flex items-center gap-2 text-gray-500 hover:text-[var(--color-navy)] transition-colors font-bold text-sm"
        >
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          Voltar para Lista
        </button>

        <div className={cn(
          "px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest flex items-center gap-2 shadow-sm",
          request.status === 'PENDING' ? "bg-amber-100 text-amber-700 border border-amber-200" :
          request.status === 'APPROVED' ? "bg-green-100 text-green-700 border border-green-200" :
          "bg-red-100 text-red-700 border border-red-200"
        )}>
          {request.status === 'PENDING' && <Clock size={14} />}
          {request.status === 'APPROVED' && <CheckCircle2 size={14} />}
          {request.status === 'REJECTED' && <XCircle size={14} />}
          {request.status === 'PENDING' ? 'Aguardando Análise' :
           request.status === 'APPROVED' ? 'Solicitação Aprovada' : 'Solicitação Recusada'}
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Business Info */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 space-y-8">
            <div className="flex items-start gap-6 border-b border-gray-50 pb-8">
              <div className="w-20 h-20 bg-[var(--color-navy)] text-[var(--color-gold)] rounded-2xl flex items-center justify-center text-3xl font-black shrink-0 shadow-lg shadow-blue-900/20">
                {request.companyName.charAt(0)}
              </div>
              <div className="space-y-1">
                <h1 className="text-3xl font-bold text-[var(--color-navy)]">{request.companyName}</h1>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <span className="bg-gray-100 px-3 py-1 rounded-full font-bold text-[var(--color-navy)]">
                    {request.sector}
                  </span>
                  <span className="flex items-center gap-1">
                    <Globe size={14} />
                    {request.country} ({request.countryCode})
                  </span>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="space-y-3">
                <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                  <MessageSquare size={14} className="text-[var(--color-gold)]" />
                  Descrição do Negócio & Objetivos
                </h3>
                <div className="bg-gray-50/50 rounded-2xl p-6 text-gray-700 leading-relaxed font-body whitespace-pre-wrap border border-gray-100">
                  {request.description}
                </div>
              </div>

              {request.message && (
                <div className="space-y-3">
                  <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
                    <ExternalLink size={14} className="text-[var(--color-gold)]" />
                    Informações Adicionais (Links)
                  </h3>
                  <div className="bg-amber-50/30 rounded-2xl p-6 text-gray-600 text-sm font-body whitespace-pre-wrap border border-amber-100/50">
                    {request.message}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Contact & Actions */}
        <div className="space-y-8">
          {/* Contact Card */}
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 space-y-6">
            <h3 className="text-xs font-black text-[var(--color-navy)] uppercase tracking-widest border-b border-gray-50 pb-4">
              Dados de Contato
            </h3>
            
            <div className="space-y-5">
              <div className="flex items-start gap-4 group">
                <div className="p-2.5 bg-blue-50 text-blue-600 rounded-xl group-hover:bg-blue-600 group-hover:text-white transition-all">
                  <UserIcon size={18} />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter leading-none mb-1">Responsável</p>
                  <p className="text-sm font-bold text-gray-900">{request.responsibleName}</p>
                </div>
              </div>

              <div className="flex items-start gap-4 group">
                <div className="p-2.5 bg-purple-50 text-purple-600 rounded-xl group-hover:bg-purple-600 group-hover:text-white transition-all">
                  <Mail size={18} />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter leading-none mb-1">E-mail Corporativo</p>
                  <p className="text-sm font-bold text-gray-900">{request.email}</p>
                </div>
              </div>

              <div className="flex items-start gap-4 group">
                <div className="p-2.5 bg-green-50 text-green-600 rounded-xl group-hover:bg-green-600 group-hover:text-white transition-all">
                  <Phone size={18} />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter leading-none mb-1">Telefone / WhatsApp</p>
                  <p className="text-sm font-bold text-gray-900">{request.phone || 'Não informado'}</p>
                </div>
              </div>

              {request.website && (
                <div className="flex items-start gap-4 group">
                  <div className="p-2.5 bg-amber-50 text-amber-600 rounded-xl group-hover:bg-amber-600 group-hover:text-white transition-all">
                    <Globe size={18} />
                  </div>
                  <div className="overflow-hidden">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter leading-none mb-1">Website Oficial</p>
                    <a href={request.website.startsWith('http') ? request.website : `https://${request.website}`} target="_blank" className="text-sm font-bold text-blue-600 hover:underline truncate block">
                      {request.website}
                    </a>
                  </div>
                </div>
              )}

              <div className="flex items-start gap-4">
                <div className="p-2.5 bg-gray-50 text-gray-500 rounded-xl">
                  <Calendar size={18} />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter leading-none mb-1">Recebida em</p>
                  <p className="text-sm font-bold text-gray-900">
                    {format(new Date(request.createdAt), "dd 'de' MMMM 'às' HH:mm", { locale: ptBR })}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Card */}
          <div className="bg-[var(--color-navy)] rounded-3xl p-8 shadow-2xl shadow-blue-900/40 text-white space-y-6">
            <h3 className="text-xs font-black text-white/40 uppercase tracking-widest flex items-center gap-2">
              <ShieldCheck size={16} className="text-[var(--color-gold)]" />
              Decisão de Curadoria
            </h3>

            {request.status === 'PENDING' ? (
              <div className="grid grid-cols-1 gap-3">
                {pendingAction === 'APPROVED' ? (
                  <div className="bg-green-500/20 border border-green-500/40 rounded-2xl p-4 space-y-3">
                    <p className="text-sm font-bold text-center">Confirmar aprovação?</p>
                    <p className="text-[11px] text-white/60 text-center">Isso criará um rascunho de perfil para esta empresa.</p>
                    <div className="flex gap-2">
                      <button
                        disabled={actionLoading}
                        onClick={() => handleStatusUpdate('APPROVED')}
                        className="flex-1 py-3 bg-green-500 hover:bg-green-600 text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                      >
                        <CheckCircle2 size={16} />
                        {actionLoading ? 'Aguarde...' : 'Confirmar'}
                      </button>
                      <button
                        disabled={actionLoading}
                        onClick={() => setPendingAction(null)}
                        className="flex-1 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl font-bold text-sm transition-all disabled:opacity-50"
                      >
                        Cancelar
                      </button>
                    </div>
                  </div>
                ) : pendingAction === 'REJECTED' ? (
                  <div className="bg-red-500/20 border border-red-500/40 rounded-2xl p-4 space-y-3">
                    <p className="text-sm font-bold text-center">Confirmar recusa?</p>
                    <div className="flex gap-2">
                      <button
                        disabled={actionLoading}
                        onClick={() => handleStatusUpdate('REJECTED')}
                        className="flex-1 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                      >
                        <XCircle size={16} />
                        {actionLoading ? 'Aguarde...' : 'Confirmar'}
                      </button>
                      <button
                        disabled={actionLoading}
                        onClick={() => setPendingAction(null)}
                        className="flex-1 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl font-bold text-sm transition-all disabled:opacity-50"
                      >
                        Cancelar
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <button
                      disabled={actionLoading}
                      onClick={() => setPendingAction('APPROVED')}
                      className="w-full py-4 bg-green-500 hover:bg-green-600 text-white rounded-2xl font-bold flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                    >
                      <CheckCircle2 size={18} />
                      Aprovar & Criar Rascunho
                    </button>
                    <button
                      disabled={actionLoading}
                      onClick={() => setPendingAction('REJECTED')}
                      className="w-full py-4 bg-white/10 hover:bg-red-500 text-white rounded-2xl font-bold flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                    >
                      <XCircle size={18} />
                      Recusar Pedido
                    </button>
                  </>
                )}
              </div>
            ) : (
              <div className="text-center py-4 px-4 bg-white/5 rounded-2xl border border-white/10">
                <p className="text-sm font-medium text-white/60">
                  Esta solicitação foi {request.status === 'APPROVED' ? 'aprovada' : 'recusada'} em:
                </p>
                <p className="font-bold mt-1">
                  {request.reviewedAt ? format(new Date(request.reviewedAt), "dd/MM/yyyy 'às' HH:mm") : '--/--/----'}
                </p>
                {request.reviewedBy && (
                  <p className="text-xs text-[var(--color-gold)] mt-2">Por: {request.reviewedBy.name}</p>
                )}
              </div>
            )}

            <p className="text-[10px] text-white/40 leading-relaxed text-center italic">
              Ao aprovar, a empresa será criada como RASCUNHO e você será levado para completar o perfil dela.
            </p>
          </div>
        </div>

      </div>
    </div>
  )
}

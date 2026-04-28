import { 
  Building2, 
  MessageSquare, 
  Users, 
  Globe, 
  TrendingUp, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  ArrowRight,
  MoreHorizontal,
  Star,
  Eye,
  Inbox,
  Zap,
  Plus,
  Package,
  ArrowUpRight
} from 'lucide-react'
import { getDashboardStats, getTopCompanies } from '@/lib/actions/analytics'
import prisma from '@/lib/prisma'
import Link from 'next/link'
import { cn } from '@/lib/utils'

export default async function DashboardPage() {
  const statsData = await getDashboardStats()
  const topCompanies = await getTopCompanies(5)
  
  // Buscar solicitações pendentes reais
  let pendingRequests: any[] = []
  try {
    pendingRequests = await prisma.contactRequest.findMany({
      where: { status: 'PENDING' },
      orderBy: { createdAt: 'desc' },
      take: 5
    })
  } catch (e) {
    console.error("Erro ao buscar solicitações:", e)
  }

  // Buscar atividades recentes (Empresas e Produtos)
  let recentCompanies: any[] = []
  let recentProducts: any[] = []
  let totalProducts = 0

  try {
    recentCompanies = await prisma.company.findMany({ 
      orderBy: { createdAt: 'desc' }, 
      take: 3, 
      include: { sector: true } 
    })
    recentProducts = await prisma.product.findMany({ 
      orderBy: { createdAt: 'desc' }, 
      take: 3, 
      include: { company: true } 
    })
    totalProducts = await prisma.product.count()
  } catch (e) {
    console.error("Erro ao buscar atividades recentes:", e)
  }

  const stats = [
    { 
      label: 'Empresas Ativas', 
      value: statsData.totalCompanies.toString(), 
      change: '+14%', 
      icon: Building2, 
      color: 'bg-blue-50 text-blue-600',
      link: '/admin/empresas?status=ACTIVE'
    },
    { 
      label: 'Solicitações', 
      value: statsData.pendingRequests.toString().padStart(2, '0'), 
      change: 'Novos', 
      icon: MessageSquare, 
      color: 'bg-amber-50 text-amber-600',
      link: '/admin/solicitacoes'
    },
    { 
      label: 'Catálogo B2B', 
      value: totalProducts.toString(), 
      change: 'Produtos', 
      icon: Package, 
      color: 'bg-green-50 text-green-600',
      link: '/admin/produtos'
    },
    { 
      label: 'Setores Ativos', 
      value: statsData.activeSectors.toString(), 
      change: 'Global', 
      icon: Globe, 
      color: 'bg-purple-50 text-purple-600',
      link: '/admin/setores'
    }
  ]

  return (
    <div className="space-y-6 admin-theme animate-in fade-in slide-in-from-bottom-2 duration-700">
      {/* Header com Ações Rápidas */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-[var(--color-navy)] flex items-center gap-2">
            Dashboard Operacional
          </h1>
          <p className="text-xs text-gray-500">Gestão de inteligência comercial e curadoria B2B.</p>
        </div>
        
        <div className="flex items-center gap-2">
          <Link href="/admin/solicitacoes" className="px-3 py-1.5 bg-amber-50 text-amber-700 border border-amber-200 text-[10px] font-black uppercase tracking-widest hover:bg-amber-100 transition-all flex items-center gap-2">
            <Zap size={14} /> Review Pendente
          </Link>
          <Link href="/admin/empresas/nova" className="px-3 py-1.5 bg-[var(--color-navy)] text-white text-[10px] font-black uppercase tracking-widest hover:bg-[#002266] transition-all flex items-center gap-2">
            <Plus size={14} /> Nova Empresa
          </Link>
        </div>
      </div>

      {/* Grid de Stats Compacto */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <Link href={stat.link} key={i} className="bg-white p-5 border border-gray-100 shadow-sm hover:border-[var(--color-gold)] transition-all group">
            <div className="flex items-start justify-between">
              <div className={cn("p-2 rounded mb-3", stat.color)}>
                <stat.icon size={18} />
              </div>
              <div className="flex items-center gap-1 text-[9px] font-bold text-green-600">
                <TrendingUp size={10} />
                {stat.change}
              </div>
            </div>
            <div className="space-y-0.5">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{stat.label}</p>
              <p className="text-2xl font-black text-[var(--color-navy)]">{stat.value}</p>
            </div>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Lado Esquerdo: Fila e Atividades */}
        <div className="lg:col-span-8 space-y-6">
          {/* Fila de Auditoria */}
          <div className="bg-white border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-gray-50 flex items-center justify-between bg-gray-50/50">
              <h3 className="text-xs font-black uppercase tracking-widest text-[var(--color-navy)] flex items-center gap-2">
                <AlertCircle size={14} className="text-amber-500" />
                Fila de Auditoria Prioritária
              </h3>
              <Link href="/admin/solicitacoes" className="text-[10px] font-bold text-[var(--color-gold)] hover:underline uppercase">Ver Todas</Link>
            </div>
            
            <div className="min-h-[200px]">
              {pendingRequests.length > 0 ? (
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-gray-50/30 border-b border-gray-50">
                      <th className="px-4 py-2 text-[9px] font-black text-gray-400 uppercase tracking-widest">Empresa</th>
                      <th className="px-4 py-2 text-[9px] font-black text-gray-400 uppercase tracking-widest">Setor</th>
                      <th className="px-4 py-2 text-[9px] font-black text-gray-400 uppercase tracking-widest text-right">Ação</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {pendingRequests.map((req) => (
                      <tr key={req.id} className="hover:bg-gray-50/50 transition-colors group">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <div className="w-7 h-7 bg-gray-100 rounded text-[var(--color-navy)] flex items-center justify-center text-[10px] font-black">
                              {req.companyName.charAt(0)}
                            </div>
                            <div>
                              <p className="font-bold text-xs text-[var(--color-navy)]">{req.companyName}</p>
                              <p className="text-[9px] text-gray-400 uppercase">{req.country}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-[9px] font-bold text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded">{req.sector || 'N/A'}</span>
                        </td>
                        <td className="px-4 py-3 text-right">
                           <Link href={`/admin/solicitacoes/${req.id}`} className="inline-flex items-center gap-1 text-[9px] font-black uppercase tracking-widest text-amber-600 hover:text-amber-700">
                             Auditar <ArrowRight size={10} />
                           </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-gray-300">
                  <Inbox size={32} className="mb-2 opacity-20" />
                  <p className="text-[10px] font-black uppercase tracking-widest">Tudo em dia</p>
                </div>
              )}
            </div>
          </div>

          {/* Atividades Recentes */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <div className="bg-white border border-gray-100 shadow-sm p-4 space-y-4">
                <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400 flex items-center gap-2">
                  <Building2 size={12} /> Últimos Cadastros
                </h4>
                <div className="space-y-3">
                  {recentCompanies.map(c => (
                    <div key={c.id} className="flex items-center justify-between group">
                       <div className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                          <span className="text-xs font-bold text-[var(--color-navy)] group-hover:text-[var(--color-gold)] transition-colors">{c.name}</span>
                       </div>
                       <span className="text-[9px] text-gray-400">{(c as any).sector?.name || 'Misto'}</span>
                    </div>
                  ))}
                </div>
             </div>
             <div className="bg-white border border-gray-100 shadow-sm p-4 space-y-4">
                <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400 flex items-center gap-2">
                  <Package size={12} /> Novos Produtos
                </h4>
                <div className="space-y-3">
                  {recentProducts.map(p => (
                    <div key={p.id} className="flex items-center justify-between group">
                       <div className="flex items-center gap-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                          <span className="text-xs font-bold text-[var(--color-navy)] group-hover:text-[var(--color-gold)] transition-colors line-clamp-1">{p.title}</span>
                       </div>
                       <span className="text-[9px] text-gray-400">{(p as any).company?.name}</span>
                    </div>
                  ))}
                </div>
             </div>
          </div>
        </div>

        {/* Lado Direito: Ranking e Metas */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white p-5 border border-gray-100 shadow-sm space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-black uppercase tracking-widest text-[var(--color-navy)] flex items-center gap-2">
                <TrendingUp size={14} className="text-[var(--color-gold)]" />
                Destaques de Audiência
              </h3>
              <span className="text-[9px] font-black text-gray-400">TOP 5</span>
            </div>
            
            <div className="space-y-3">
              {topCompanies.map((company, index) => (
                <div key={company.id} className="flex items-center justify-between p-2 hover:bg-gray-50 transition-colors border-l-2 border-transparent hover:border-[var(--color-gold)]">
                  <div className="flex items-center gap-3">
                    <span className="text-[10px] font-black text-gray-300">0{index + 1}</span>
                    <div>
                      <p className="text-xs font-bold text-[var(--color-navy)]">{company.name}</p>
                      <p className="text-[9px] text-gray-400 uppercase">{(company as any).sector?.name || 'Misto'}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-[var(--color-navy)] font-black text-[10px]">
                    <Eye size={10} className="text-[var(--color-gold)]" />
                    {company.views}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Card de Meta B2B */}
          <div className="bg-[var(--color-navy)] p-5 border border-[var(--color-gold)]/30 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-20 transition-opacity">
              <Globe size={80} className="text-white" />
            </div>
            <div className="relative z-10 space-y-4">
               <div className="flex items-center justify-between">
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-white/60">Meta de Expansão</h4>
                  <Star size={12} className="text-[var(--color-gold)]" />
               </div>
               <div className="space-y-1">
                  <div className="flex items-end justify-between">
                    <p className="text-2xl font-black text-white">{statsData.totalCompanies}<span className="text-xs text-white/30 font-normal"> / 200</span></p>
                    <p className="text-[10px] font-bold text-[var(--color-gold)]">{Math.floor((statsData.totalCompanies / 200) * 100)}%</p>
                  </div>
                  <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-[var(--color-gold)] transition-all duration-1000" 
                      style={{ width: `${(statsData.totalCompanies / 200) * 100}%` }}
                    />
                  </div>
               </div>
               <p className="text-[9px] text-white/40 leading-relaxed font-body">
                 Faltam {200 - statsData.totalCompanies} empresas validadas para atingir a meta do trimestre.
               </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

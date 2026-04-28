import React from 'react'
export const dynamic = 'force-dynamic'
import { getUsers, deleteUser, toggleUserStatus } from '@/lib/actions/users'
import { 
  Users, 
  UserPlus, 
  Shield, 
  ShieldCheck, 
  Trash2, 
  Power, 
  Clock,
  MoreVertical
} from 'lucide-react'
import Link from 'next/link'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { cn } from '@/lib/utils'

export default async function UsuariosPage() {
  const result = await getUsers()
  const users = result.users || []

  return (
    <div className="space-y-6 admin-theme animate-in fade-in slide-in-from-bottom-2 duration-700">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-[var(--color-navy)] flex items-center gap-2">
            <Users size={20} className="text-[var(--color-gold)]" />
            Gestão de Equipe
          </h1>
          <p className="text-xs text-gray-500">Administradores e editores com acesso ao painel.</p>
        </div>
        
        <Link 
          href="/admin/usuarios/novo" 
          className="px-4 py-2 bg-[var(--color-navy)] text-white text-[10px] font-black uppercase tracking-widest hover:bg-[#002266] transition-all flex items-center gap-2 shadow-sm"
        >
          <UserPlus size={14} /> Convidar Membro
        </Link>
      </div>

      {/* Tabela Técnica */}
      <div className="bg-white border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-gray-50/50 border-b border-gray-100">
              <th className="px-6 py-3 text-[10px] font-black text-gray-400 uppercase tracking-widest">Usuário</th>
              <th className="px-6 py-3 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Nível</th>
              <th className="px-6 py-3 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">Status</th>
              <th className="px-6 py-3 text-[10px] font-black text-gray-400 uppercase tracking-widest">Último Acesso</th>
              <th className="px-6 py-3 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {users.length > 0 ? (
              users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50/30 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded bg-gray-100 text-[var(--color-navy)] flex items-center justify-center text-[10px] font-black">
                        {user.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-xs font-bold text-[var(--color-navy)]">{user.name}</p>
                        <p className="text-[10px] text-gray-400">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={cn(
                      "inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest",
                      user.role === 'SUPER_ADMIN' ? "bg-purple-50 text-purple-600" : "bg-blue-50 text-blue-600"
                    )}>
                      {user.role === 'SUPER_ADMIN' ? <ShieldCheck size={10} /> : <Shield size={10} />}
                      {user.role === 'SUPER_ADMIN' ? 'Super Admin' : 'Editor'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={cn(
                      "inline-flex items-center gap-1 px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-widest",
                      user.active ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"
                    )}>
                      <div className={cn("w-1 h-1 rounded-full", user.active ? "bg-green-500" : "bg-red-500")} />
                      {user.active ? 'Ativo' : 'Inativo'}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-[10px] text-gray-500">
                      <Clock size={12} />
                      {user.lastLogin 
                        ? format(new Date(user.lastLogin), "dd/MM/yy HH:mm")
                        : "Nunca acessou"
                      }
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      {/* Note: In a real app, these would be Server Actions triggered by buttons */}
                      <button className="p-1.5 text-gray-400 hover:text-[var(--color-navy)] transition-colors">
                        <Power size={14} />
                      </button>
                      <button className="p-1.5 text-gray-400 hover:text-red-500 transition-colors">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-gray-400 text-xs italic">
                  Nenhum usuário adicional cadastrado.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

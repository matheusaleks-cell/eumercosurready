'use client'

import React, { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { getUsers, deleteUser, toggleUserStatus } from '@/lib/actions/users'
import {
  Users,
  UserPlus,
  Shield,
  ShieldCheck,
  Trash2,
  Power,
  Clock,
} from 'lucide-react'
import Link from 'next/link'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { cn } from '@/lib/utils'

export default function UsuariosPage() {
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [pendingDelete, setPendingDelete] = useState<string | null>(null)

  useEffect(() => {
    loadUsers()
  }, [])

  async function loadUsers() {
    setLoading(true)
    const result = await getUsers()
    setUsers(result.users || [])
    setLoading(false)
  }

  async function handleToggle(id: string, currentActive: boolean) {
    const toastId = toast.loading(currentActive ? 'Desativando usuário...' : 'Ativando usuário...')
    const result = await toggleUserStatus(id, !currentActive)
    if (result.success) {
      toast.success(currentActive ? 'Usuário desativado.' : 'Usuário ativado.', { id: toastId })
      loadUsers()
    } else {
      toast.error(result.error || 'Erro ao alterar status', { id: toastId })
    }
  }

  async function handleDelete(id: string) {
    if (pendingDelete !== id) {
      setPendingDelete(id)
      return
    }
    setPendingDelete(null)
    const toastId = toast.loading('Removendo usuário...')
    const result = await deleteUser(id)
    if (result.success) {
      toast.success('Usuário removido.', { id: toastId })
      loadUsers()
    } else {
      toast.error(result.error || 'Erro ao remover usuário', { id: toastId })
    }
  }

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

      {/* Tabela */}
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
            {loading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <tr key={i} className="animate-pulse">
                  <td colSpan={5} className="px-6 py-5">
                    <div className="h-4 bg-gray-100 rounded w-full" />
                  </td>
                </tr>
              ))
            ) : users.length > 0 ? (
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
                        ? format(new Date(user.lastLogin), "dd/MM/yy HH:mm", { locale: ptBR })
                        : "Nunca acessou"}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {pendingDelete === user.id ? (
                        <>
                          <span className="text-[10px] text-red-500 font-bold">Confirmar?</span>
                          <button
                            onClick={() => handleDelete(user.id)}
                            className="p-1.5 text-red-500 hover:text-red-700 transition-colors"
                            title="Confirmar exclusão"
                          >
                            <Trash2 size={14} />
                          </button>
                          <button
                            onClick={() => setPendingDelete(null)}
                            className="p-1.5 text-gray-400 hover:text-gray-600 text-[10px] font-bold"
                          >
                            ✕
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => handleToggle(user.id, user.active)}
                            className={cn(
                              "p-1.5 transition-colors",
                              user.active
                                ? "text-gray-400 hover:text-amber-500"
                                : "text-gray-400 hover:text-green-500"
                            )}
                            title={user.active ? 'Desativar usuário' : 'Ativar usuário'}
                          >
                            <Power size={14} />
                          </button>
                          <button
                            onClick={() => handleDelete(user.id)}
                            className="p-1.5 text-gray-400 hover:text-red-500 transition-colors"
                            title="Excluir usuário (clique para confirmar)"
                          >
                            <Trash2 size={14} />
                          </button>
                        </>
                      )}
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

'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createUser } from '@/lib/actions/users'
import { 
  ArrowLeft, 
  UserPlus, 
  Save, 
  Shield, 
  Mail, 
  Lock, 
  User as UserIcon,
  AlertCircle
} from 'lucide-react'
import Link from 'next/link'

export default function NovoUsuarioPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const formData = new FormData(e.currentTarget)
    const data = {
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      password: formData.get('password') as string,
      role: formData.get('role') as any,
    }

    if (!data.name || !data.email || !data.password) {
      setError('Por favor, preencha todos os campos.')
      setLoading(false)
      return
    }

    const result = await createUser(data)
    if (result.success) {
      router.push('/admin/usuarios')
    } else {
      setError(result.error || 'Erro ao criar usuário.')
      setLoading(false)
    }
  }

  const inputClasses = "w-full bg-white border border-gray-200 rounded px-4 py-2 text-sm focus:outline-none focus:border-[var(--color-gold)] transition-all pl-10"
  const labelClasses = "block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-1.5 ml-1"

  return (
    <div className="max-w-xl mx-auto space-y-8 admin-theme animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header */}
      <div className="space-y-1">
        <Link 
          href="/admin/usuarios" 
          className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2 hover:text-[var(--color-navy)] transition-colors mb-4"
        >
          <ArrowLeft size={14} /> Voltar para Lista
        </Link>
        <h1 className="text-2xl font-bold text-[var(--color-navy)] flex items-center gap-2">
          <UserPlus size={24} className="text-[var(--color-gold)]" />
          Convidar Novo Administrador
        </h1>
        <p className="text-xs text-gray-500 font-body">Defina as credenciais e o nível de acesso do novo membro.</p>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-100 rounded-xl flex items-center gap-3 text-red-600 text-xs font-bold animate-in zoom-in-95">
          <AlertCircle size={18} />
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white p-8 border border-gray-100 shadow-sm space-y-6">
        <div className="space-y-4">
          <div className="space-y-1">
            <label className={labelClasses}>Nome Completo</label>
            <div className="relative">
              <UserIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input name="name" className={inputClasses} placeholder="Ex: João Silva" required />
            </div>
          </div>

          <div className="space-y-1">
            <label className={labelClasses}>E-mail de Acesso</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input name="email" type="email" className={inputClasses} placeholder="joao@empresa.com" required />
            </div>
          </div>

          <div className="space-y-1">
            <label className={labelClasses}>Senha Temporária</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <input name="password" type="password" className={inputClasses} placeholder="••••••••" required />
            </div>
          </div>

          <div className="space-y-1">
            <label className={labelClasses}>Nível de Acesso</label>
            <div className="relative">
              <Shield className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
              <select name="role" className={cn(inputClasses, "appearance-none cursor-pointer")} required>
                <option value="EDITOR">Editor (Gestão de Empresas/Setores)</option>
                <option value="SUPER_ADMIN">Super Admin (Acesso Total)</option>
              </select>
            </div>
          </div>
        </div>

        <div className="pt-4 flex gap-3">
          <button 
            type="button" 
            onClick={() => router.back()}
            className="flex-1 py-3 text-[10px] font-black uppercase tracking-widest text-gray-500 hover:text-gray-700 transition-colors"
          >
            Cancelar
          </button>
          <button 
            type="submit" 
            disabled={loading}
            className="flex-1 py-3 bg-[var(--color-navy)] text-white text-[10px] font-black uppercase tracking-widest hover:bg-[#002266] transition-all flex items-center justify-center gap-2 shadow-lg disabled:opacity-50"
          >
            {loading ? <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save size={14} />}
            {loading ? 'Criando...' : 'Salvar Usuário'}
          </button>
        </div>
      </form>

      <div className="p-4 bg-amber-50 border border-amber-100 rounded-xl">
        <p className="text-[10px] text-amber-700 leading-relaxed font-medium">
          <strong>Aviso de Segurança:</strong> O novo usuário poderá acessar o painel imediatamente após o cadastro. Certifique-se de enviar as credenciais de forma segura.
        </p>
      </div>
    </div>
  )
}

'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { loginAction } from '@/lib/actions/auth'
import Image from 'next/image'
import { Lock, User, ChevronRight, AlertCircle, Loader2, CheckCircle2 } from 'lucide-react'

export default function LoginPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const result = await loginAction({ username, password })
      
      if (result?.error) {
        setError(result.error)
        setLoading(false)
      } else {
        // Se não retornou erro, o redirect já está acontecendo via Server Action
        setSuccess(true)
      }
    } catch (err) {
      // O redirect lança um erro que deve ser ignorado ou tratado pelo Next.js
      if (err instanceof Error && err.message === 'NEXT_REDIRECT') {
        setSuccess(true)
        return
      }
      console.error('Erro no login:', err)
      setError('Falha na autenticação.')
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#050B14] relative overflow-hidden px-4 font-sans" suppressHydrationWarning>
      {/* Background Decor - Mais Premium e Sutil */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-[-15%] left-[-10%] w-[40%] h-[60%] bg-[#C8943A]/15 blur-[140px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-15%] right-[-10%] w-[50%] h-[70%] bg-blue-600/10 blur-[140px] rounded-full animate-pulse" style={{ animationDelay: '1s' }} />
        
        {/* Grid pattern overlay */}
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(#C8943A 0.5px, transparent 0.5px)', backgroundSize: '32px 32px' }} />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="w-full max-w-md relative z-10"
      >
        <div className="text-center mb-10">
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="inline-flex items-center justify-center relative w-24 h-24 mb-8 bg-gradient-to-b from-white/10 to-white/5 rounded-3xl p-5 backdrop-blur-2xl border border-white/20 shadow-[0_20px_50px_rgba(0,0,0,0.3)] group"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-[#C8943A]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-3xl" />
            <Image 
              src="/logo-mercosur.png" 
              alt="EU-Mercosur Ready" 
              fill 
              sizes="96px"
              className="object-contain p-4 drop-shadow-2xl transition-transform duration-700 group-hover:scale-110"
              priority
            />
          </motion.div>
          
          <h1 className="text-4xl font-black text-white tracking-tighter leading-none mb-4">
            Portal de <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#C8943A] to-[#E5B566]">Controle</span>
          </h1>
          
          <div className="flex items-center justify-center gap-4 mb-2">
            <div className="h-[1px] w-8 bg-gradient-to-r from-transparent to-[#C8943A]/40" />
            <p className="text-[#C8943A] text-[11px] uppercase tracking-[0.5em] font-black">
              Strategic Platform
            </p>
            <div className="h-[1px] w-8 bg-gradient-to-l from-transparent to-[#C8943A]/40" />
          </div>
          <p className="text-gray-500 text-[9px] uppercase tracking-widest font-bold opacity-60">
            Governança & Administração B2B
          </p>
        </div>

        <div className="bg-[#0A1628]/60 backdrop-blur-3xl border border-white/[0.08] p-8 md:p-12 rounded-[3rem] shadow-[0_40px_80px_-20px_rgba(0,0,0,0.8)] relative group overflow-hidden">
          {/* Success Overlay */}
          {success && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="absolute inset-0 z-50 bg-[#0A1628] flex flex-col items-center justify-center text-center p-8"
            >
              <motion.div
                initial={{ scale: 0, rotate: -45 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", damping: 12 }}
                className="w-20 h-20 rounded-full bg-green-500/20 border border-green-500/50 flex items-center justify-center mb-6 text-green-500"
              >
                <CheckCircle2 size={40} />
              </motion.div>
              <h2 className="text-2xl font-black text-white mb-2">Acesso Autorizado</h2>
              <p className="text-gray-400 text-sm">Bem-vindo de volta à Strategic Platform.</p>
              <div className="mt-8 flex items-center gap-2">
                <Loader2 className="animate-spin text-[#C8943A]" size={16} />
                <span className="text-[10px] text-[#C8943A] font-black uppercase tracking-widest">Carregando painel...</span>
              </div>
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8 relative z-10">
            {error && (
              <motion.div 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-2xl flex items-center gap-3 text-xs font-semibold"
              >
                <div className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center shrink-0">
                   <AlertCircle size={16} />
                </div>
                {error}
              </motion.div>
            )}

            <div className="space-y-6">
              <div className="space-y-2.5">
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] ml-1">Credencial de Acesso</label>
                <div className="relative group/field">
                  <User className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within/field:text-[#C8943A] transition-colors" size={18} />
                  <input 
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    placeholder="Nome de usuário"
                    className="w-full bg-white/[0.03] border border-white/[0.08] rounded-2xl py-5 pl-14 pr-6 text-white focus:outline-none focus:ring-2 focus:ring-[#C8943A]/20 focus:border-[#C8943A]/50 transition-all placeholder:text-gray-700 text-sm font-medium"
                    suppressHydrationWarning
                  />
                </div>
              </div>

              <div className="space-y-2.5">
                <label className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] ml-1">Chave de Segurança</label>
                <div className="relative group/field">
                  <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within/field:text-[#C8943A] transition-colors" size={18} />
                  <input 
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="••••••••••••"
                    className="w-full bg-white/[0.03] border border-white/[0.08] rounded-2xl py-5 pl-14 pr-6 text-white focus:outline-none focus:ring-2 focus:ring-[#C8943A]/20 focus:border-[#C8943A]/50 transition-all placeholder:text-gray-700 text-sm font-medium"
                    suppressHydrationWarning
                  />
                </div>
              </div>
            </div>

            <button 
              type="submit"
              disabled={loading}
              className="w-full py-5 bg-gradient-to-r from-[#C8943A] to-[#E5B566] text-[#050B14] rounded-2xl font-black text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-3 group/btn hover:shadow-[0_15px_30px_-5px_rgba(200,148,58,0.4)] transition-all active:scale-[0.98] disabled:opacity-50"
              suppressHydrationWarning
            >
              {loading ? (
                <div className="flex items-center gap-3">
                  <Loader2 className="animate-spin" size={20} />
                  <span>Validando...</span>
                </div>
              ) : (
                <>
                  <span>Autenticar Usuário</span>
                  <ChevronRight size={18} className="group-hover/btn:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          <div className="mt-12 pt-8 border-t border-white/[0.05] text-center">
            <p className="text-gray-600 text-[9px] font-black uppercase tracking-[0.3em] opacity-40">
              Ambiente Seguro & Monitorado
            </p>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center gap-4">
           <div className="h-[1px] w-24 bg-gradient-to-r from-transparent via-white/10 to-transparent" />
           <p className="text-center text-gray-700 text-[9px] uppercase tracking-[0.5em] font-black opacity-30">
            © 2026 EU-Mercosur Ready | B2B Operations
          </p>
        </div>
      </motion.div>
    </main>
  )
}

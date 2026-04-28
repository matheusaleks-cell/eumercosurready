'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Lock, ShieldCheck, AlertCircle, Loader2, Save } from 'lucide-react'
import { updateAdminPassword } from '@/lib/actions/auth'

export function ForcePasswordChange({ username }: { username: string }) {
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres.')
      return
    }

    if (password !== confirmPassword) {
      setError('As senhas não coincidem.')
      return
    }

    setLoading(true)
    try {
      const result = await updateAdminPassword(password)
      if (result.success) {
        setSuccess(true)
        setTimeout(() => {
          window.location.reload()
        }, 2000)
      } else {
        setError(result.error || 'Erro ao atualizar senha.')
      }
    } catch (err) {
      setError('Erro crítico ao atualizar senha.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-[#0B1F3A]/90 backdrop-blur-md"
        />
        
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          className="relative w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl overflow-hidden border border-gray-100"
        >
          {/* Header */}
          <div className="bg-[var(--color-navy)] p-8 text-center text-white relative">
            <div className="absolute top-0 left-0 w-full h-full bg-[var(--color-gold)]/5" />
            <div className="relative z-10">
              <div className="w-16 h-16 bg-[var(--color-gold)] rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-yellow-500/20">
                <ShieldCheck size={32} className="text-[var(--color-navy)]" />
              </div>
              <h2 className="text-xl font-display font-bold">Segurança Obrigatória</h2>
              <p className="text-blue-200/60 text-xs mt-1 uppercase tracking-widest font-bold">Olá, {username}</p>
            </div>
          </div>

          {/* Body */}
          <div className="p-8">
            <p className="text-sm text-gray-500 mb-8 text-center leading-relaxed">
              Para garantir a integridade da plataforma, é necessário que você altere sua senha inicial antes de prosseguir.
            </p>

            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <div className="p-4 bg-red-50 border border-red-100 rounded-xl text-red-600 text-xs flex items-center gap-2">
                  <AlertCircle size={16} />
                  {error}
                </div>
              )}

              {success ? (
                <div className="p-8 text-center space-y-4">
                  <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto">
                    <Save size={24} />
                  </div>
                  <p className="text-green-600 font-bold">Senha atualizada com sucesso!</p>
                  <p className="text-xs text-gray-400 italic">Reiniciando sessão...</p>
                </div>
              ) : (
                <>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Nova Senha</label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                      <input 
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        placeholder="Mínimo 6 caracteres"
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3.5 pl-12 pr-4 text-sm focus:outline-none focus:border-[var(--color-gold)] transition-all"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest ml-1">Confirmar Senha</label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                      <input 
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        placeholder="Repita a nova senha"
                        className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3.5 pl-12 pr-4 text-sm focus:outline-none focus:border-[var(--color-gold)] transition-all"
                      />
                    </div>
                  </div>

                  <button 
                    type="submit"
                    disabled={loading}
                    className="w-full py-4 bg-[var(--color-navy)] text-white rounded-xl font-bold text-sm hover:bg-[#002266] transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-900/10"
                  >
                    {loading ? (
                      <Loader2 className="animate-spin" size={20} />
                    ) : (
                      <>
                        <Save size={18} />
                        Salvar e Acessar Painel
                      </>
                    )}
                  </button>
                </>
              )}
            </form>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}

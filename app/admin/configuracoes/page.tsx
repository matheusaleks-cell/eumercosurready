'use client'

import React, { useEffect, useState } from 'react'
import { getSettings, updateSettings } from '@/lib/actions/settings'
import { 
  Settings, Save, Mail, Globe, Bell, Info, 
  CheckCircle2, Search, Palette, Share2, Zap
} from 'lucide-react'
import { cn } from '@/lib/utils'

export default function ConfiguracoesPage() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [success, setSuccess] = useState(false)
  const [settings, setSettings] = useState<Record<string, string>>({})

  useEffect(() => {
    async function load() {
      const result = await getSettings()
      if (result.success && result.settings) {
        setSettings(result.settings)
      }
      setLoading(false)
    }
    load()
  }, [])

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSaving(true)
    setSuccess(false)

    const formData = new FormData(e.currentTarget)
    const data: Record<string, string> = {}
    formData.forEach((value, key) => {
      data[key] = value as string
    })

    const result = await updateSettings(data)
    if (result.success) {
      setSuccess(true)
      setTimeout(() => setSuccess(false), 3000)
    } else {
      alert('Erro ao salvar configurações')
    }
    setSaving(false)
  }

  const inputClasses = "w-full bg-white border border-gray-200 rounded px-4 py-2 text-sm focus:outline-none focus:border-[var(--color-gold)] transition-all pl-10"
  const labelClasses = "block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1.5 ml-1"

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <div className="w-10 h-10 border-4 border-gray-100 border-t-[var(--color-gold)] rounded-full animate-spin" />
        <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Sincronizando Sistema...</p>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 admin-theme animate-in fade-in slide-in-from-bottom-2 duration-700 pb-20">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-[var(--color-navy)] flex items-center gap-2">
            <Settings size={22} className="text-[var(--color-gold)]" />
            Configurações Globais
          </h1>
          <p className="text-xs text-gray-500">Controle total da inteligência e visual da plataforma.</p>
        </div>
      </div>

      {success && (
        <div className="p-4 bg-green-50 border border-green-100 rounded-xl flex items-center gap-3 text-green-700 text-xs font-bold animate-in zoom-in-95">
          <CheckCircle2 size={18} />
          Configurações aplicadas com sucesso em todo o site!
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* SEO & Meta-dados */}
        <div className="bg-white p-8 border border-gray-100 shadow-sm space-y-6">
          <div className="flex items-center gap-2 pb-2 border-b border-gray-50 mb-4">
            <Search size={14} className="text-blue-500" />
            <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-400">SEO & Indexação (Google)</h3>
          </div>
          <div className="grid grid-cols-1 gap-6">
            <div className="space-y-1">
              <label className={labelClasses}>Título SEO da Plataforma</label>
              <div className="relative">
                <Globe className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-300" size={16} />
                <input name="META_TITLE" defaultValue={settings['META_TITLE']} className={inputClasses} placeholder="Ex: EU-Mercosur Ready | B2B Business Showcase" />
              </div>
            </div>
            <div className="space-y-1">
              <label className={labelClasses}>Descrição SEO (Meta Description)</label>
              <textarea name="META_DESCRIPTION" defaultValue={settings['META_DESCRIPTION']} className="w-full bg-white border border-gray-200 rounded px-4 py-2 text-sm focus:outline-none focus:border-[var(--color-gold)] transition-all min-h-[80px]" placeholder="Breve descrição para aparecer no Google..." />
            </div>
          </div>
        </div>

        {/* Branding & Visual */}
        <div className="bg-white p-8 border border-gray-100 shadow-sm space-y-6">
          <div className="flex items-center gap-2 pb-2 border-b border-gray-50 mb-4">
            <Palette size={14} className="text-purple-500" />
            <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-400">Identidade & Branding</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1">
              <label className={labelClasses}>Cor Primária (Navy)</label>
              <div className="flex gap-2">
                <input type="color" name="PRIMARY_COLOR" defaultValue={settings['PRIMARY_COLOR'] || '#0B1F3A'} className="h-9 w-12 rounded border-gray-200 cursor-pointer" />
                <input defaultValue={settings['PRIMARY_COLOR'] || '#0B1F3A'} className={inputClasses.replace('pl-10', 'px-3')} readOnly />
              </div>
            </div>
            <div className="space-y-1">
              <label className={labelClasses}>Cor Secundária (Gold)</label>
              <div className="flex gap-2">
                <input type="color" name="SECONDARY_COLOR" defaultValue={settings['SECONDARY_COLOR'] || '#C8943A'} className="h-9 w-12 rounded border-gray-200 cursor-pointer" />
                <input defaultValue={settings['SECONDARY_COLOR'] || '#C8943A'} className={inputClasses.replace('pl-10', 'px-3')} readOnly />
              </div>
            </div>
          </div>
        </div>

        {/* Regras de Negócio */}
        <div className="bg-white p-8 border border-gray-100 shadow-sm space-y-6">
          <div className="flex items-center gap-2 pb-2 border-b border-gray-50 mb-4">
            <Zap size={14} className="text-amber-500" />
            <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-400">Inteligência Operacional</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1">
              <label className={labelClasses}>Modo de Operação</label>
              <select name="MAINTENANCE_MODE" defaultValue={settings['MAINTENANCE_MODE']} className={cn(inputClasses, "pl-4")}>
                <option value="false">Plataforma Online</option>
                <option value="true">Modo Manutenção (Privado)</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className={labelClasses}>Aprovação de Cadastros</label>
              <select name="AUTO_APPROVE" defaultValue={settings['AUTO_APPROVE']} className={cn(inputClasses, "pl-4")}>
                <option value="false">Curadoria Manual (Recomendado)</option>
                <option value="true">Aprovação Automática (DRAFT)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Redes Sociais */}
        <div className="bg-white p-8 border border-gray-100 shadow-sm space-y-6">
          <div className="flex items-center gap-2 pb-2 border-b border-gray-50 mb-4">
            <Share2 size={14} className="text-green-500" />
            <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-400">Canais Sociais da Plataforma</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1">
              <label className={labelClasses}>LinkedIn URL</label>
              <input name="SOCIAL_LINKEDIN" defaultValue={settings['SOCIAL_LINKEDIN']} className={inputClasses.replace('pl-10', 'px-4')} placeholder="https://linkedin.com/company/..." />
            </div>
            <div className="space-y-1">
              <label className={labelClasses}>Instagram URL</label>
              <input name="SOCIAL_INSTAGRAM" defaultValue={settings['SOCIAL_INSTAGRAM']} className={inputClasses.replace('pl-10', 'px-4')} placeholder="https://instagram.com/..." />
            </div>
            <div className="space-y-1">
              <label className={labelClasses}>Facebook URL</label>
              <input name="SOCIAL_FACEBOOK" defaultValue={settings['SOCIAL_FACEBOOK']} className={inputClasses.replace('pl-10', 'px-4')} placeholder="https://facebook.com/..." />
            </div>
            <div className="space-y-1">
              <label className={labelClasses}>X (Twitter) URL</label>
              <input name="SOCIAL_TWITTER" defaultValue={settings['SOCIAL_TWITTER']} className={inputClasses.replace('pl-10', 'px-4')} placeholder="https://x.com/..." />
            </div>
          </div>
        </div>

        {/* Analytics */}
        <div className="bg-white p-8 border border-gray-100 shadow-sm space-y-6">
          <div className="flex items-center gap-2 pb-2 border-b border-gray-50 mb-4">
            <Bell size={14} className="text-red-500" />
            <h3 className="text-[10px] font-black uppercase tracking-widest text-gray-400">Métricas & Notificações</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1">
              <label className={labelClasses}>Google Analytics ID (G-XXXX)</label>
              <input name="GOOGLE_ANALYTICS_ID" defaultValue={settings['GOOGLE_ANALYTICS_ID']} className={inputClasses.replace('pl-10', 'px-4')} placeholder="G-XXXXXXXXXX" />
            </div>
            <div className="space-y-1">
              <label className={labelClasses}>WhatsApp de Suporte/Consultoria</label>
              <input name="CONTACT_WHATSAPP" defaultValue={settings['CONTACT_WHATSAPP']} className={inputClasses.replace('pl-10', 'px-4')} placeholder="Ex: 5511999999999" />
            </div>
            <div className="space-y-1">
              <label className={labelClasses}>E-mail de Alertas</label>
              <input name="NOTIFICATION_EMAIL" defaultValue={settings['NOTIFICATION_EMAIL']} className={inputClasses.replace('pl-10', 'px-4')} placeholder="admin@madeinatlantic.com" />
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-4 sticky bottom-8">
          <button 
            type="submit" 
            disabled={saving}
            className="px-12 py-4 bg-[var(--color-navy)] text-white text-[10px] font-black uppercase tracking-widest hover:bg-[#002266] transition-all flex items-center justify-center gap-3 shadow-2xl disabled:opacity-50 border-2 border-white/10"
          >
            {saving ? <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save size={16} />}
            {saving ? 'Sincronizando...' : 'Publicar Alterações Globais'}
          </button>
        </div>
      </form>
    </div>
  )
}

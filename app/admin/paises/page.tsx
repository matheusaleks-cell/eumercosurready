'use client'

import React, { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { Flag, Plus, Trash2, Pencil, Zap, AlertCircle, CheckCircle2, Search, Power, Loader2, ImagePlus } from 'lucide-react'
import {
  getCountries,
  createCountry,
  updateCountry,
  deleteCountry,
  toggleCountryActive,
  seedInitialCountries,
} from '@/lib/actions/countries'
import { uploadImage } from '@/lib/actions/upload'
import { cn } from '@/lib/utils'
import type { Country } from '@/types'

const GROUP_LABELS: Record<string, string> = {
  EU: 'União Europeia',
  MERCOSUL: 'Mercosul',
  GUEST: 'Países Convidados',
}

const emptyForm = {
  code: '',
  name: '',
  name_en: '',
  name_es: '',
  group: 'GUEST' as 'EU' | 'MERCOSUL' | 'GUEST',
  ddi: '',
  order: 0,
  flagUrl: '',
}

export default function CountriesPage() {
  const [countries, setCountries] = useState<Country[]>([])
  const [loading, setLoading] = useState(true)
  const [isAdding, setIsAdding] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [message, setMessage] = useState({ type: '', text: '' })
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const [form, setForm] = useState(emptyForm)
  const [flagPreview, setFlagPreview] = useState('')
  const [isUploadingFlag, setIsUploadingFlag] = useState(false)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    loadCountries()
  }, [])

  async function loadCountries() {
    setLoading(true)
    const result = await getCountries()
    if (result.success) {
      setCountries((result.countries as Country[]) || [])
    }
    setLoading(false)
  }

  function openCreateForm() {
    setForm(emptyForm)
    setFlagPreview('')
    setEditingId(null)
    setIsAdding(true)
  }

  function openEditForm(country: Country) {
    setForm({
      code: country.code,
      name: country.name,
      name_en: country.name_en || '',
      name_es: country.name_es || '',
      group: country.group,
      ddi: country.ddi,
      order: country.order,
      flagUrl: country.flagUrl || '',
    })
    setFlagPreview(country.flagUrl || '')
    setEditingId(country.id)
    setIsAdding(true)
  }

  function closeForm() {
    setIsAdding(false)
    setEditingId(null)
    setForm(emptyForm)
    setFlagPreview('')
  }

  async function handleFlagChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onloadend = () => setFlagPreview(reader.result as string)
    reader.readAsDataURL(file)

    setIsUploadingFlag(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      const result = await uploadImage(formData)
      if (result.success && result.url) {
        setForm(prev => ({ ...prev, flagUrl: result.url as string }))
      } else {
        setMessage({ type: 'error', text: result.error || 'Falha no upload da bandeira' })
        setFlagPreview(form.flagUrl)
      }
    } catch (err) {
      console.error('Upload error:', err)
      setMessage({ type: 'error', text: 'Erro crítico no upload da bandeira' })
      setFlagPreview(form.flagUrl)
    } finally {
      setIsUploadingFlag(false)
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setMessage({ type: '', text: '' })
    setSaving(true)

    const payload = {
      code: form.code,
      name: form.name,
      name_en: form.name_en || undefined,
      name_es: form.name_es || undefined,
      group: form.group,
      ddi: form.ddi,
      flagUrl: form.flagUrl || undefined,
      order: Number(form.order) || 0,
    }

    const result = editingId
      ? await updateCountry(editingId, payload)
      : await createCountry(payload)

    if (result.success) {
      closeForm()
      loadCountries()
      setMessage({ type: 'success', text: editingId ? 'País atualizado com sucesso!' : 'País criado com sucesso!' })
    } else {
      setMessage({ type: 'error', text: result.error || 'Erro ao salvar país' })
    }
    setSaving(false)
  }

  async function handleDelete(id: string) {
    if (deletingId !== id) {
      setDeletingId(id)
      return
    }
    setDeletingId(null)
    const toastId = toast.loading('Removendo país...')
    const result = await deleteCountry(id)
    if (result.success) {
      loadCountries()
      toast.success('País removido!', { id: toastId })
    } else {
      toast.error(result.error || 'Erro ao remover', { id: toastId })
    }
  }

  async function handleToggleActive(country: Country) {
    const toastId = toast.loading(country.active ? 'Desativando...' : 'Ativando...')
    const result = await toggleCountryActive(country.id, !country.active)
    if (result.success) {
      loadCountries()
      toast.success(country.active ? 'País desativado.' : 'País ativado.', { id: toastId })
    } else {
      toast.error(result.error || 'Erro ao alterar status', { id: toastId })
    }
  }

  async function handleSeed() {
    setLoading(true)
    const result = await seedInitialCountries()
    if (result.success) {
      loadCountries()
      setMessage({ type: 'success', text: 'Base de países (UE/Mercosul) sincronizada com sucesso!' })
    } else {
      setMessage({ type: 'error', text: result.error || 'Erro ao popular base' })
    }
    setLoading(false)
  }

  const filteredCountries = countries.filter(c =>
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.code.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-6 admin-theme animate-in fade-in duration-500">
      {/* Header Compacto */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-[var(--color-navy)] flex items-center gap-2">
            <Flag className="text-[var(--color-gold)]" size={24} />
            Gerenciamento de Países
          </h1>
          <p className="text-xs text-gray-500">Controle os países disponíveis e seus grupos (UE / Mercosul / Convidados).</p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleSeed}
            disabled={loading}
            className="flex items-center gap-2 px-3 py-2 bg-amber-50 text-amber-700 border border-amber-200 text-[10px] font-black uppercase tracking-widest hover:bg-amber-100 transition-all"
          >
            <Zap size={14} />
            Sincronizar Base
          </button>
          <button
            onClick={openCreateForm}
            className="flex items-center gap-2 px-4 py-2 bg-[var(--color-navy)] text-white text-[10px] font-black uppercase tracking-widest hover:bg-[#002266] transition-all"
          >
            <Plus size={14} />
            Novo País
          </button>
        </div>
      </div>

      {message.text && (
        <div className={cn(
          "p-3 rounded flex items-center gap-3 text-[11px] font-bold",
          message.type === 'success' ? "bg-green-50 text-green-700 border border-green-200" : "bg-red-50 text-red-700 border border-red-200"
        )}>
          {message.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
          {message.text}
        </div>
      )}

      {/* Formulário Compacto */}
      {isAdding && (
        <form onSubmit={handleSubmit} className="bg-white p-5 border border-gray-200 space-y-5 animate-in slide-in-from-top-2">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <h2 className="text-xs font-black uppercase tracking-widest text-gray-400">
              {editingId ? 'Editar País' : 'Novo Registro de País'}
            </h2>
            <button type="button" onClick={closeForm} className="text-[10px] font-bold text-gray-400 hover:text-red-500">FECHAR</button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="text-[9px] font-black text-gray-400 uppercase tracking-tighter ml-1">Nome (PT)</label>
              <input
                required
                value={form.name}
                onChange={(e) => setForm(prev => ({ ...prev, name: e.target.value }))}
                className="w-full bg-gray-50 border border-gray-200 px-3 py-1.5 text-xs focus:outline-none focus:border-[var(--color-gold)]"
                placeholder="Ex: Chile"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[9px] font-black text-gray-400 uppercase tracking-tighter ml-1">Nome (EN)</label>
              <input
                value={form.name_en}
                onChange={(e) => setForm(prev => ({ ...prev, name_en: e.target.value }))}
                className="w-full bg-gray-50 border border-gray-200 px-3 py-1.5 text-xs focus:outline-none focus:border-[var(--color-gold)]"
                placeholder="Ex: Chile"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[9px] font-black text-gray-400 uppercase tracking-tighter ml-1">Nome (ES)</label>
              <input
                value={form.name_es}
                onChange={(e) => setForm(prev => ({ ...prev, name_es: e.target.value }))}
                className="w-full bg-gray-50 border border-gray-200 px-3 py-1.5 text-xs focus:outline-none focus:border-[var(--color-gold)]"
                placeholder="Ex: Chile"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="space-y-1">
              <label className="text-[9px] font-black text-gray-400 uppercase tracking-tighter ml-1">Código ISO</label>
              <input
                required
                maxLength={2}
                value={form.code}
                onChange={(e) => setForm(prev => ({ ...prev, code: e.target.value.toUpperCase() }))}
                className="w-full bg-gray-50 border border-gray-200 px-3 py-1.5 text-xs uppercase focus:outline-none focus:border-[var(--color-gold)]"
                placeholder="Ex: CL"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[9px] font-black text-gray-400 uppercase tracking-tighter ml-1">Grupo</label>
              <select
                value={form.group}
                onChange={(e) => setForm(prev => ({ ...prev, group: e.target.value as 'EU' | 'MERCOSUL' | 'GUEST' }))}
                className="w-full bg-gray-50 border border-gray-200 px-3 py-1.5 text-xs focus:outline-none focus:border-[var(--color-gold)]"
              >
                <option value="EU">União Europeia</option>
                <option value="MERCOSUL">Mercosul</option>
                <option value="GUEST">Países Convidados</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className="text-[9px] font-black text-gray-400 uppercase tracking-tighter ml-1">DDI</label>
              <input
                required
                value={form.ddi}
                onChange={(e) => setForm(prev => ({ ...prev, ddi: e.target.value }))}
                className="w-full bg-gray-50 border border-gray-200 px-3 py-1.5 text-xs focus:outline-none focus:border-[var(--color-gold)]"
                placeholder="Ex: 56"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[9px] font-black text-gray-400 uppercase tracking-tighter ml-1">Ordem</label>
              <input
                type="number"
                value={form.order}
                onChange={(e) => setForm(prev => ({ ...prev, order: Number(e.target.value) }))}
                className="w-full bg-gray-50 border border-gray-200 px-3 py-1.5 text-xs focus:outline-none focus:border-[var(--color-gold)]"
              />
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center gap-3">
              <label className="relative w-16 h-16 border border-dashed border-gray-300 rounded flex items-center justify-center bg-gray-50 cursor-pointer overflow-hidden hover:border-[var(--color-gold)] transition-all">
                {isUploadingFlag ? (
                  <Loader2 size={18} className="animate-spin text-gray-400" />
                ) : flagPreview ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={flagPreview} alt="Bandeira" className="w-full h-full object-cover" />
                ) : (
                  <ImagePlus size={18} className="text-gray-300" />
                )}
                <input type="file" accept="image/*" onChange={handleFlagChange} className="hidden" />
              </label>
              <span className="text-[10px] text-gray-400 max-w-[160px]">Clique no quadro para enviar a bandeira (JPEG, PNG, WebP, GIF ou AVIF, até 5MB)</span>
            </div>
            <button
              type="submit"
              disabled={saving || isUploadingFlag}
              className="px-6 py-2 bg-[var(--color-gold)] text-white text-[10px] font-black uppercase tracking-widest hover:bg-[#b88d4d] transition-all disabled:opacity-50"
            >
              {saving ? 'Salvando...' : 'Salvar Registro'}
            </button>
          </div>
        </form>
      )}

      {/* Busca e Tabela Técnica */}
      <div className="bg-white border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-3 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
          <div className="relative w-64">
            <Search className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
            <input
              type="text"
              placeholder="Filtrar base..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-8 pr-4 py-1.5 bg-white border border-gray-200 text-[11px] focus:outline-none"
            />
          </div>
          <div className="text-[10px] font-bold text-gray-400 uppercase">
            Total: {filteredCountries.length} Países
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-100/80 border-b border-gray-200">
                <th className="px-4 py-2 text-[9px] font-black text-gray-500 uppercase tracking-widest w-12 text-center">Bandeira</th>
                <th className="px-4 py-2 text-[9px] font-black text-gray-500 uppercase tracking-widest">Nome / Código</th>
                <th className="px-4 py-2 text-[9px] font-black text-gray-500 uppercase tracking-widest">Grupo</th>
                <th className="px-4 py-2 text-[9px] font-black text-gray-500 uppercase tracking-widest text-center">DDI</th>
                <th className="px-4 py-2 text-[9px] font-black text-gray-500 uppercase tracking-widest text-center">Status</th>
                <th className="px-4 py-2 text-[9px] font-black text-gray-500 uppercase tracking-widest text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan={6} className="px-4 py-4"><div className="h-3 bg-gray-50 rounded w-full"></div></td>
                  </tr>
                ))
              ) : filteredCountries.map((country) => (
                <tr key={country.id} className={cn("hover:bg-blue-50/20 transition-colors group", !country.active && "opacity-40")}>
                  <td className="px-4 py-2 text-center">
                    <div className="flex justify-center">
                      {country.flagUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={country.flagUrl} alt={country.name} className="w-6 h-4 object-cover rounded-sm border border-gray-100" />
                      ) : (
                        <Flag size={16} className="text-gray-300" />
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-2">
                    <div className="font-bold text-xs text-gray-900 leading-tight">{country.name}</div>
                    <div className="text-[10px] text-gray-400 font-mono tracking-tighter">{country.code}</div>
                  </td>
                  <td className="px-4 py-2">
                    <span className="text-[10px] font-black text-gray-600 bg-gray-100 px-1.5 py-0.5 rounded uppercase">
                      {GROUP_LABELS[country.group] || country.group}
                    </span>
                  </td>
                  <td className="px-4 py-2 text-center text-[10px] text-gray-500">+{country.ddi}</td>
                  <td className="px-4 py-2 text-center">
                    <button
                      onClick={() => handleToggleActive(country)}
                      title={country.active ? 'Desativar' : 'Ativar'}
                      className={cn("p-1.5 transition-all", country.active ? "text-emerald-500 hover:text-emerald-700" : "text-gray-300 hover:text-gray-500")}
                    >
                      <Power size={14} />
                    </button>
                  </td>
                  <td className="px-4 py-2 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => openEditForm(country)}
                        className="p-1.5 text-gray-400 hover:text-[var(--color-navy)] transition-all"
                        title="Editar"
                      >
                        <Pencil size={14} />
                      </button>
                      {deletingId === country.id ? (
                        <>
                          <span className="text-[10px] text-red-500 font-bold mr-1">Confirmar?</span>
                          <button
                            onClick={() => handleDelete(country.id)}
                            className="p-1.5 text-red-500 hover:text-red-700 transition-all"
                            title="Confirmar exclusão"
                          >
                            <Trash2 size={14} />
                          </button>
                          <button
                            onClick={() => setDeletingId(null)}
                            className="p-1.5 text-gray-400 hover:text-gray-600 transition-all text-[10px] font-bold"
                            title="Cancelar"
                          >
                            ✕
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() => handleDelete(country.id)}
                          className="p-1.5 text-gray-400 hover:text-red-500 transition-all"
                          title="Excluir (clique para confirmar)"
                        >
                          <Trash2 size={14} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

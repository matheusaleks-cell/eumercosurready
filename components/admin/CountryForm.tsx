'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import {
  Flag, Globe, Sparkles, BarChart3, Briefcase, Loader2, ImagePlus,
  Plus, Trash2, Save, ArrowLeft, Info
} from 'lucide-react'
import { createCountry, updateCountry } from '@/lib/actions/countries'
import { uploadImage } from '@/lib/actions/upload'
import { translateSingleText } from '@/lib/actions/translation'
import { cn } from '@/lib/utils'
import type { Country, CountrySector } from '@/types'

interface CountryFormProps {
  initialData?: Country
}

type TabId = 'basico' | 'perfil' | 'economia' | 'setores'

const inputClasses = "w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[var(--color-gold)] transition-all"
const textareaClasses = cn(inputClasses, "min-h-[90px] resize-y")
const labelClasses = "flex items-center gap-2 text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2 ml-1"

function emptyForm(initialData?: Country) {
  return {
    code: initialData?.code || '',
    name: initialData?.name || '',
    name_en: initialData?.name_en || '',
    name_es: initialData?.name_es || '',
    group: (initialData?.group || 'GUEST') as 'EU' | 'MERCOSUL' | 'GUEST',
    ddi: initialData?.ddi || '',
    order: initialData?.order ?? 0,
    flagUrl: initialData?.flagUrl || '',

    description: initialData?.description || '',
    description_en: initialData?.description_en || '',
    description_es: initialData?.description_es || '',
    highlight: initialData?.highlight || '',
    highlight_en: initialData?.highlight_en || '',
    highlight_es: initialData?.highlight_es || '',
    ctaTitle: initialData?.ctaTitle || '',
    ctaTitle_en: initialData?.ctaTitle_en || '',
    ctaTitle_es: initialData?.ctaTitle_es || '',
    ctaDescription: initialData?.ctaDescription || '',
    ctaDescription_en: initialData?.ctaDescription_en || '',
    ctaDescription_es: initialData?.ctaDescription_es || '',

    gdp: initialData?.gdp || '',
    growth: initialData?.growth || '',
    mainSector: initialData?.mainSector || '',
    mainSector_en: initialData?.mainSector_en || '',
    mainSector_es: initialData?.mainSector_es || '',
    taxRate: initialData?.taxRate || '',

    sectors: (initialData?.sectors || []) as CountrySector[],
    naturalRiches: initialData?.naturalRiches || [],
    naturalRiches_en: initialData?.naturalRiches_en || [],
    naturalRiches_es: initialData?.naturalRiches_es || [],
    exports: initialData?.exports || [],
    exports_en: initialData?.exports_en || [],
    exports_es: initialData?.exports_es || [],
    imports: initialData?.imports || [],
    imports_en: initialData?.imports_en || [],
    imports_es: initialData?.imports_es || [],
  }
}

function TagListEditor({ label, values, onChange, placeholder }: {
  label: string
  values: string[]
  onChange: (next: string[]) => void
  placeholder?: string
}) {
  const [draft, setDraft] = useState('')

  function addItem() {
    const value = draft.trim()
    if (!value) return
    if (values.length >= 20) return
    onChange([...values, value])
    setDraft('')
  }

  return (
    <div className="space-y-2">
      <label className={labelClasses}>{label}</label>
      <div className="flex gap-2">
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addItem() } }}
          className={inputClasses}
          placeholder={placeholder || 'Digite e pressione Enter'}
        />
        <button type="button" onClick={addItem} className="shrink-0 px-3 rounded-xl bg-gray-100 text-gray-500 hover:bg-gray-200 transition-all">
          <Plus size={16} />
        </button>
      </div>
      {values.length > 0 && (
        <div className="flex flex-wrap gap-2 pt-1">
          {values.map((item, index) => (
            <span key={`${item}-${index}`} className="inline-flex items-center gap-2 px-3 py-1.5 bg-gray-50 border border-gray-200 rounded-lg text-xs text-gray-700">
              {item}
              <button type="button" onClick={() => onChange(values.filter((_, i) => i !== index))} className="text-gray-400 hover:text-red-500">
                <Trash2 size={12} />
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  )
}

export default function CountryForm({ initialData }: CountryFormProps) {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<TabId>('basico')
  const [form, setForm] = useState(emptyForm(initialData))
  const [flagPreview, setFlagPreview] = useState(initialData?.flagUrl || '')
  const [isUploadingFlag, setIsUploadingFlag] = useState(false)
  const [saving, setSaving] = useState(false)
  const [isTranslatingAll, setIsTranslatingAll] = useState(false)
  const [error, setError] = useState('')

  const tabs: { id: TabId; label: string; description: string; icon: typeof Flag }[] = [
    { id: 'basico', label: 'Dados Básicos', description: 'Identificação, bandeira e bloco', icon: Flag },
    { id: 'perfil', label: 'Perfil Público', description: 'Descrição, destaque e CTA', icon: Sparkles },
    { id: 'economia', label: 'Economia', description: 'PIB, crescimento e setor principal', icon: BarChart3 },
    { id: 'setores', label: 'Setores & Comércio', description: 'Setores, riquezas e balança comercial', icon: Briefcase },
  ]

  function set<K extends keyof ReturnType<typeof emptyForm>>(field: K, value: ReturnType<typeof emptyForm>[K]) {
    setForm(prev => ({ ...prev, [field]: value }))
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
        set('flagUrl', result.url as string)
      } else {
        toast.error(result.error || 'Falha no upload da bandeira')
        setFlagPreview(form.flagUrl)
      }
    } catch (err) {
      console.error('Upload error:', err)
      toast.error('Erro crítico no upload da bandeira')
      setFlagPreview(form.flagUrl)
    } finally {
      setIsUploadingFlag(false)
    }
  }

  function addSector() {
    if (form.sectors.length >= 10) return
    set('sectors', [...form.sectors, { title: '', description: '' }])
  }

  function updateSector(index: number, patch: Partial<CountrySector>) {
    set('sectors', form.sectors.map((s, i) => (i === index ? { ...s, ...patch } : s)))
  }

  function removeSector(index: number) {
    set('sectors', form.sectors.filter((_, i) => i !== index))
  }

  async function translateArrayField(
    source: string[],
    targetEmpty: boolean,
    targetLang: 'en-US' | 'es'
  ): Promise<string[] | null> {
    if (source.length === 0 || !targetEmpty) return null
    const translated: string[] = []
    for (const item of source) {
      const res = await translateSingleText(item, targetLang)
      translated.push(res.success ? (res.text || item) : item)
      if (!res.success) toast.error(res.error || 'Erro na tradução')
    }
    return translated
  }

  async function handleTranslateAll() {
    setIsTranslatingAll(true)
    try {
      const simpleFields: [keyof typeof form, keyof typeof form, keyof typeof form][] = [
        ['description', 'description_en', 'description_es'],
        ['highlight', 'highlight_en', 'highlight_es'],
        ['ctaTitle', 'ctaTitle_en', 'ctaTitle_es'],
        ['ctaDescription', 'ctaDescription_en', 'ctaDescription_es'],
        ['mainSector', 'mainSector_en', 'mainSector_es'],
      ]

      for (const [ptKey, enKey, esKey] of simpleFields) {
        const source = form[ptKey] as string
        if (!source) continue

        if (!form[enKey]) {
          const res = await translateSingleText(source, 'en-US')
          if (res.success) set(enKey, (res.text || '') as any)
          else toast.error(res.error || 'Erro na tradução')
        }
        if (!form[esKey]) {
          const res = await translateSingleText(source, 'es')
          if (res.success) set(esKey, (res.text || '') as any)
          else toast.error(res.error || 'Erro na tradução')
        }
      }

      if (form.sectors.length > 0) {
        const newSectors = [...form.sectors]
        for (let i = 0; i < newSectors.length; i++) {
          const s = { ...newSectors[i] }
          if (s.title && !s.title_en) {
            const res = await translateSingleText(s.title, 'en-US')
            if (res.success) s.title_en = res.text || ''
          }
          if (s.title && !s.title_es) {
            const res = await translateSingleText(s.title, 'es')
            if (res.success) s.title_es = res.text || ''
          }
          if (s.description && !s.description_en) {
            const res = await translateSingleText(s.description, 'en-US')
            if (res.success) s.description_en = res.text || ''
          }
          if (s.description && !s.description_es) {
            const res = await translateSingleText(s.description, 'es')
            if (res.success) s.description_es = res.text || ''
          }
          newSectors[i] = s
        }
        set('sectors', newSectors)
      }

      const naturalRiches_en = await translateArrayField(form.naturalRiches, form.naturalRiches_en.length === 0, 'en-US')
      if (naturalRiches_en) set('naturalRiches_en', naturalRiches_en)
      const naturalRiches_es = await translateArrayField(form.naturalRiches, form.naturalRiches_es.length === 0, 'es')
      if (naturalRiches_es) set('naturalRiches_es', naturalRiches_es)

      const exports_en = await translateArrayField(form.exports, form.exports_en.length === 0, 'en-US')
      if (exports_en) set('exports_en', exports_en)
      const exports_es = await translateArrayField(form.exports, form.exports_es.length === 0, 'es')
      if (exports_es) set('exports_es', exports_es)

      const imports_en = await translateArrayField(form.imports, form.imports_en.length === 0, 'en-US')
      if (imports_en) set('imports_en', imports_en)
      const imports_es = await translateArrayField(form.imports, form.imports_es.length === 0, 'es')
      if (imports_es) set('imports_es', imports_es)

      toast.success('Tradução automática concluída!')
    } finally {
      setIsTranslatingAll(false)
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError('')
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

      description: form.description || undefined,
      description_en: form.description_en || undefined,
      description_es: form.description_es || undefined,
      highlight: form.highlight || undefined,
      highlight_en: form.highlight_en || undefined,
      highlight_es: form.highlight_es || undefined,
      ctaTitle: form.ctaTitle || undefined,
      ctaTitle_en: form.ctaTitle_en || undefined,
      ctaTitle_es: form.ctaTitle_es || undefined,
      ctaDescription: form.ctaDescription || undefined,
      ctaDescription_en: form.ctaDescription_en || undefined,
      ctaDescription_es: form.ctaDescription_es || undefined,

      gdp: form.gdp || undefined,
      growth: form.growth || undefined,
      mainSector: form.mainSector || undefined,
      mainSector_en: form.mainSector_en || undefined,
      mainSector_es: form.mainSector_es || undefined,
      taxRate: form.taxRate || undefined,

      sectors: form.sectors.filter(s => s.title.trim() && s.description.trim()),
      naturalRiches: form.naturalRiches,
      naturalRiches_en: form.naturalRiches_en,
      naturalRiches_es: form.naturalRiches_es,
      exports: form.exports,
      exports_en: form.exports_en,
      exports_es: form.exports_es,
      imports: form.imports,
      imports_en: form.imports_en,
      imports_es: form.imports_es,
    }

    try {
      const result = initialData
        ? await updateCountry(initialData.id, payload)
        : await createCountry(payload)

      if (result.success) {
        toast.success(initialData ? 'País atualizado com sucesso!' : 'País criado com sucesso!')
        router.push('/admin/paises')
        router.refresh()
      } else {
        setError(result.error || 'Erro ao salvar país')
        toast.error(result.error || 'Erro ao salvar país')
      }
    } catch (err: any) {
      console.error('Erro ao salvar país:', err)
      setError('Erro de conexão ou no servidor')
      toast.error('Erro de conexão ou no servidor')
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={() => router.push('/admin/paises')}
          className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2 hover:text-[var(--color-navy)] transition-colors"
        >
          <ArrowLeft size={14} />
          Voltar para Listagem
        </button>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleTranslateAll}
            disabled={isTranslatingAll || saving}
            title="Traduz automaticamente os campos em PT que ainda não têm versão EN/ES (não sobrescreve traduções já preenchidas)"
            className="flex items-center gap-2 px-4 py-2.5 bg-blue-50 text-blue-600 rounded-xl font-bold text-[10px] uppercase tracking-widest hover:bg-blue-100 transition-all disabled:opacity-50 border border-blue-100 group"
          >
            {isTranslatingAll ? (
              <div className="w-3 h-3 border-2 border-blue-600/30 border-t-blue-600 rounded-full animate-spin" />
            ) : (
              <Sparkles size={14} className="group-hover:rotate-12 transition-transform" />
            )}
            {isTranslatingAll ? 'Traduzindo...' : 'Traduzir Tudo (IA)'}
          </button>
          <button
            type="submit"
            disabled={saving || isUploadingFlag || isTranslatingAll}
            className="flex items-center gap-2 px-6 py-2.5 bg-[var(--color-gold)] text-white text-xs font-black uppercase tracking-widest rounded-xl hover:bg-[#b88d4d] transition-all disabled:opacity-50"
          >
            {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
            {saving ? 'Salvando...' : 'Salvar País'}
          </button>
        </div>
      </div>

      {error && (
        <div className="p-3 rounded-xl flex items-center gap-3 text-xs font-bold bg-red-50 text-red-700 border border-red-200">
          <Info size={16} />
          {error}
        </div>
      )}

      {/* Tab Navigation */}
      <div className="flex flex-wrap gap-3 p-1 bg-gray-100/50 rounded-2xl border border-gray-200/60 w-fit">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id
          const Icon = tab.icon
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                "relative flex items-center gap-3 px-5 py-3 rounded-xl transition-all duration-300 group",
                isActive
                  ? "bg-white text-[var(--color-navy)] shadow-sm border border-gray-200"
                  : "text-gray-500 hover:text-gray-700 hover:bg-white/50"
              )}
            >
              <div className={cn(
                "p-2 rounded-lg transition-colors",
                isActive ? "bg-[var(--color-navy)] text-white" : "bg-gray-200 text-gray-400 group-hover:bg-gray-300 group-hover:text-gray-500"
              )}>
                <Icon size={16} />
              </div>
              <div className="text-left">
                <p className="text-xs font-bold leading-tight">{tab.label}</p>
                <p className="text-[10px] opacity-60 font-medium leading-tight">{tab.description}</p>
              </div>
              {isActive && (
                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-8 h-1 bg-[var(--color-gold)] rounded-full" />
              )}
            </button>
          )
        })}
      </div>

      <div className="bg-white p-6 md:p-10 rounded-[2rem] border border-gray-100 shadow-sm animate-in fade-in slide-in-from-bottom-2 duration-300">
        {activeTab === 'basico' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className={labelClasses}>Nome (PT)</label>
                <input required value={form.name} onChange={(e) => set('name', e.target.value)} className={inputClasses} placeholder="Ex: Chile" />
              </div>
              <div>
                <label className={labelClasses}>Nome (EN)</label>
                <input value={form.name_en} onChange={(e) => set('name_en', e.target.value)} className={inputClasses} placeholder="Ex: Chile" />
              </div>
              <div>
                <label className={labelClasses}>Nome (ES)</label>
                <input value={form.name_es} onChange={(e) => set('name_es', e.target.value)} className={inputClasses} placeholder="Ex: Chile" />
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label className={labelClasses}>Código ISO</label>
                <input required maxLength={2} value={form.code} onChange={(e) => set('code', e.target.value.toUpperCase())} className={cn(inputClasses, "uppercase")} placeholder="Ex: CL" />
              </div>
              <div>
                <label className={labelClasses}>Grupo</label>
                <select value={form.group} onChange={(e) => set('group', e.target.value as 'EU' | 'MERCOSUL' | 'GUEST')} className={inputClasses}>
                  <option value="EU">União Europeia</option>
                  <option value="MERCOSUL">Mercosul</option>
                  <option value="GUEST">Países Convidados</option>
                </select>
              </div>
              <div>
                <label className={labelClasses}>DDI</label>
                <input required value={form.ddi} onChange={(e) => set('ddi', e.target.value)} className={inputClasses} placeholder="Ex: 56" />
              </div>
              <div>
                <label className={labelClasses}>Ordem</label>
                <input type="number" value={form.order} onChange={(e) => set('order', Number(e.target.value))} className={inputClasses} />
              </div>
            </div>

            <div>
              <label className={labelClasses}>Bandeira</label>
              <div className="flex items-center gap-4">
                <label className="relative w-20 h-20 border border-dashed border-gray-300 rounded-xl flex items-center justify-center bg-gray-50 cursor-pointer overflow-hidden hover:border-[var(--color-gold)] transition-all">
                  {isUploadingFlag ? (
                    <Loader2 size={20} className="animate-spin text-gray-400" />
                  ) : flagPreview ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={flagPreview} alt="Bandeira" className="w-full h-full object-cover" />
                  ) : (
                    <ImagePlus size={20} className="text-gray-300" />
                  )}
                  <input type="file" accept="image/*" onChange={handleFlagChange} className="hidden" />
                </label>
                <span className="text-[10px] text-gray-400 max-w-[220px]">Clique no quadro para enviar a bandeira (JPEG, PNG, WebP, GIF ou AVIF, até 5MB)</span>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'perfil' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className={labelClasses}>Descrição (PT)</label>
                <textarea value={form.description} onChange={(e) => set('description', e.target.value)} className={textareaClasses} placeholder="Resumo institucional do país" />
              </div>
              <div>
                <label className={labelClasses}>Descrição (EN)</label>
                <textarea value={form.description_en} onChange={(e) => set('description_en', e.target.value)} className={textareaClasses} />
              </div>
              <div>
                <label className={labelClasses}>Descrição (ES)</label>
                <textarea value={form.description_es} onChange={(e) => set('description_es', e.target.value)} className={textareaClasses} />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className={labelClasses}>Destaque (PT)</label>
                <input value={form.highlight} onChange={(e) => set('highlight', e.target.value)} className={inputClasses} placeholder="Ex: Líder Global em Automação" />
              </div>
              <div>
                <label className={labelClasses}>Destaque (EN)</label>
                <input value={form.highlight_en} onChange={(e) => set('highlight_en', e.target.value)} className={inputClasses} />
              </div>
              <div>
                <label className={labelClasses}>Destaque (ES)</label>
                <input value={form.highlight_es} onChange={(e) => set('highlight_es', e.target.value)} className={inputClasses} />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className={labelClasses}>Título do CTA (PT)</label>
                <input value={form.ctaTitle} onChange={(e) => set('ctaTitle', e.target.value)} className={inputClasses} />
              </div>
              <div>
                <label className={labelClasses}>Título do CTA (EN)</label>
                <input value={form.ctaTitle_en} onChange={(e) => set('ctaTitle_en', e.target.value)} className={inputClasses} />
              </div>
              <div>
                <label className={labelClasses}>Título do CTA (ES)</label>
                <input value={form.ctaTitle_es} onChange={(e) => set('ctaTitle_es', e.target.value)} className={inputClasses} />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className={labelClasses}>Descrição do CTA (PT)</label>
                <textarea value={form.ctaDescription} onChange={(e) => set('ctaDescription', e.target.value)} className={textareaClasses} />
              </div>
              <div>
                <label className={labelClasses}>Descrição do CTA (EN)</label>
                <textarea value={form.ctaDescription_en} onChange={(e) => set('ctaDescription_en', e.target.value)} className={textareaClasses} />
              </div>
              <div>
                <label className={labelClasses}>Descrição do CTA (ES)</label>
                <textarea value={form.ctaDescription_es} onChange={(e) => set('ctaDescription_es', e.target.value)} className={textareaClasses} />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'economia' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className={labelClasses}>PIB</label>
                <input value={form.gdp} onChange={(e) => set('gdp', e.target.value)} className={inputClasses} placeholder="Ex: $2.1 Trilhões" />
              </div>
              <div>
                <label className={labelClasses}>Crescimento Estimado</label>
                <input value={form.growth} onChange={(e) => set('growth', e.target.value)} className={inputClasses} placeholder="Ex: +3.0%" />
              </div>
              <div>
                <label className={labelClasses}>Alíquota / Impostos</label>
                <input value={form.taxRate} onChange={(e) => set('taxRate', e.target.value)} className={inputClasses} placeholder="Opcional" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className={labelClasses}>Setor Principal (PT)</label>
                <input value={form.mainSector} onChange={(e) => set('mainSector', e.target.value)} className={inputClasses} placeholder="Ex: Agronegócio & Serviços" />
              </div>
              <div>
                <label className={labelClasses}>Setor Principal (EN)</label>
                <input value={form.mainSector_en} onChange={(e) => set('mainSector_en', e.target.value)} className={inputClasses} />
              </div>
              <div>
                <label className={labelClasses}>Setor Principal (ES)</label>
                <input value={form.mainSector_es} onChange={(e) => set('mainSector_es', e.target.value)} className={inputClasses} />
              </div>
            </div>
          </div>
        )}

        {activeTab === 'setores' && (
          <div className="space-y-10">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className={cn(labelClasses, "mb-0")}>Setores de Destaque</label>
                <button type="button" onClick={addSector} disabled={form.sectors.length >= 10} className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-[var(--color-gold)] hover:text-[#b88d4d] disabled:opacity-40">
                  <Plus size={14} /> Adicionar Setor
                </button>
              </div>

              {form.sectors.length === 0 && (
                <p className="text-xs text-gray-400">Nenhum setor cadastrado ainda.</p>
              )}

              <div className="space-y-4">
                {form.sectors.map((sector, index) => (
                  <div key={index} className="p-5 bg-gray-50/60 border border-gray-200 rounded-2xl space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Setor {index + 1}</span>
                      <button type="button" onClick={() => removeSector(index)} className="text-gray-400 hover:text-red-500">
                        <Trash2 size={14} />
                      </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <input value={sector.title} onChange={(e) => updateSector(index, { title: e.target.value })} className={inputClasses} placeholder="Título (PT)" />
                      <input value={sector.title_en || ''} onChange={(e) => updateSector(index, { title_en: e.target.value })} className={inputClasses} placeholder="Título (EN)" />
                      <input value={sector.title_es || ''} onChange={(e) => updateSector(index, { title_es: e.target.value })} className={inputClasses} placeholder="Título (ES)" />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <textarea value={sector.description} onChange={(e) => updateSector(index, { description: e.target.value })} className={textareaClasses} placeholder="Descrição (PT)" />
                      <textarea value={sector.description_en || ''} onChange={(e) => updateSector(index, { description_en: e.target.value })} className={textareaClasses} placeholder="Descrição (EN)" />
                      <textarea value={sector.description_es || ''} onChange={(e) => updateSector(index, { description_es: e.target.value })} className={textareaClasses} placeholder="Descrição (ES)" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-4 pt-6 border-t border-gray-100">
              <label className={cn(labelClasses, "mb-0")}>Riquezas e Recursos Naturais</label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <TagListEditor label="Português" values={form.naturalRiches} onChange={(v) => set('naturalRiches', v)} />
                <TagListEditor label="Inglês" values={form.naturalRiches_en} onChange={(v) => set('naturalRiches_en', v)} />
                <TagListEditor label="Espanhol" values={form.naturalRiches_es} onChange={(v) => set('naturalRiches_es', v)} />
              </div>
            </div>

            <div className="space-y-4 pt-6 border-t border-gray-100">
              <label className={cn(labelClasses, "mb-0")}>Principais Exportações</label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <TagListEditor label="Português" values={form.exports} onChange={(v) => set('exports', v)} />
                <TagListEditor label="Inglês" values={form.exports_en} onChange={(v) => set('exports_en', v)} />
                <TagListEditor label="Espanhol" values={form.exports_es} onChange={(v) => set('exports_es', v)} />
              </div>
            </div>

            <div className="space-y-4 pt-6 border-t border-gray-100">
              <label className={cn(labelClasses, "mb-0")}>Principais Importações</label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <TagListEditor label="Português" values={form.imports} onChange={(v) => set('imports', v)} />
                <TagListEditor label="Inglês" values={form.imports_en} onChange={(v) => set('imports_en', v)} />
                <TagListEditor label="Espanhol" values={form.imports_es} onChange={(v) => set('imports_es', v)} />
              </div>
            </div>
          </div>
        )}
      </div>
    </form>
  )
}

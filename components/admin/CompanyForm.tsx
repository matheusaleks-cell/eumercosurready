'use client'

import React, { useState } from 'react'
import { createCompany, updateCompany } from '@/lib/actions/companies'
import { uploadImage } from '@/lib/actions/upload'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { 
  Building2, Globe, Tag, Info, Mail, Phone, Globe2, 
  Link2, Check, AlertCircle, Save, Image as ImageIcon,
  Video, Hash, Upload, X, CheckCircle2, MessageSquare, Star, Trash2, Plus,
  Sparkles, Languages, ExternalLink, FlaskConical, ChevronRight
} from 'lucide-react'
import { translateSingleText } from '@/lib/actions/translation'
import { countriesList } from '@/lib/countries-list'
import { cn } from '@/lib/utils'

interface CompanyFormProps {
  sectors: { id: string, name: string }[]
  initialData?: any
}

export default function CompanyForm({ sectors, initialData }: CompanyFormProps) {
  const router = useRouter()
  const [isSaving, setIsSaving] = useState(false)
  const [isUploadingLogo, setIsUploadingLogo] = useState(false)
  const [isUploadingBanner, setIsUploadingBanner] = useState(false)
  const [error, setError] = useState('')
  const [isTranslatingAll, setIsTranslatingAll] = useState(false)
  
  // States para os valores dos campos (para cálculo de progresso em tempo real)
  const [formValues, setFormValues] = useState({
    shortDescription: initialData?.shortDescription || '',
    shortDescription_en: initialData?.shortDescription_en || '',
    shortDescription_es: initialData?.shortDescription_es || '',
    fullDescription: initialData?.fullDescription || '',
    fullDescription_en: initialData?.fullDescription_en || '',
    fullDescription_es: initialData?.fullDescription_es || '',
  })

  // Lógica para telefones internacionais unificados
  const parsePhone = (phoneStr: string) => {
    if (!phoneStr) return { ddi: '55', number: '' }
    
    // Tenta extrair +DDI (RESTO)
    // Formatos possíveis: +55 (11) 99999-9999 ou +351 912345678
    const match = phoneStr.match(/\+(\d+)\s*(.*)/)
    if (match) {
      return { ddi: match[1], number: match[2] }
    }
    return { ddi: '55', number: phoneStr }
  }

  const [whatsappParts, setWhatsappParts] = useState(parsePhone(initialData?.whatsapp))
  const [phoneParts, setPhoneParts] = useState(parsePhone(initialData?.phone))

  // Cálculo de Progresso de Internacionalização
  const calculateProgress = () => {
    const fields = [
      { pt: formValues.shortDescription, en: formValues.shortDescription_en, es: formValues.shortDescription_es },
      { pt: formValues.fullDescription, en: formValues.fullDescription_en, es: formValues.fullDescription_es },
    ]
    
    let totalFields = fields.length * 2 // EN e ES para cada campo PT
    let translatedCount = 0
    
    fields.forEach(f => {
      if (f.en && f.en.trim().length > 2) translatedCount++
      if (f.es && f.es.trim().length > 2) translatedCount++
    })
    
    return Math.round((translatedCount / totalFields) * 100)
  }

  const globalProgress = calculateProgress()

  const handleFieldChange = (field: string, value: string) => {
    setFormValues(prev => ({ ...prev, [field]: value }))
  }

  const handleTranslateAll = async () => {
    if (!formValues.shortDescription && !formValues.fullDescription) {
      alert('Preencha os campos em Português primeiro.')
      return
    }
    
    setIsTranslatingAll(true)
    try {
      // Traduzir Short Description
      if (formValues.shortDescription) {
        if (!formValues.shortDescription_en) {
          const res = await translateSingleText(formValues.shortDescription, 'en-US')
          if (res.success) handleFieldChange('shortDescription_en', res.text || '')
        }
        if (!formValues.shortDescription_es) {
          const res = await translateSingleText(formValues.shortDescription, 'es')
          if (res.success) handleFieldChange('shortDescription_es', res.text || '')
        }
      }
      
      // Traduzir Full Description
      if (formValues.fullDescription) {
        if (!formValues.fullDescription_en) {
          const res = await translateSingleText(formValues.fullDescription, 'en-US')
          if (res.success) handleFieldChange('fullDescription_en', res.text || '')
        }
        if (!formValues.fullDescription_es) {
          const res = await translateSingleText(formValues.fullDescription, 'es')
          if (res.success) handleFieldChange('fullDescription_es', res.text || '')
        }
      }
    } finally {
      setIsTranslatingAll(false)
    }
  }

  const fillTestData = () => {
    // Campos Controlados
    setFormValues({
      shortDescription: 'Líder global em soluções tecnológicas sustentáveis para o agronegócio.',
      shortDescription_en: 'Global leader in sustainable technology solutions for agribusiness.',
      shortDescription_es: 'Líder mundial en soluciones tecnológicas sostenibles para el agronegocio.',
      fullDescription: 'Com mais de 25 anos de experiência, nossa empresa transforma o mercado de exportação através de inovações disruptivas e um compromisso inabalável com a sustentabilidade e a qualidade internacional.',
      fullDescription_en: 'With over 25 years of experience, our company transforms the export market through disruptive innovations and an unwavering commitment to sustainability and international quality.',
      fullDescription_es: 'Con más de 25 años de experiencia, nuestra empresa transforma el mercado de exportación a través de innovaciones disruptivas e un compromiso inquebrantable con la sostenibilidad y la calidad internacional.',
    })
    
    setWhatsappParts({ country: '55', ddd: '11', number: '98888-7777' })
    setPhoneParts({ country: '55', ddd: '11', number: '4004-1234' })
    
    setSelectedRegion('MERCOSUL')
    setSelectedCountry('Brasil')
    setCountryCode('BR')
    setSlugValue('empresa-teste-inovacao-agrotech')

    // Campos Uncontrolled (DOM direto para preenchimento rápido)
    const testData: Record<string, string> = {
      name: 'AgroTech Inovação S.A.',
      website: 'www.agrotech-inovacao.com.br',
      email: 'comercial@agrotech-inovacao.com.br',
      linkedin: 'linkedin.com/company/agrotech-sa',
      instagram: 'instagram.com/agrotech_oficial',
      facebook: 'facebook.com/agrotech',
      twitter: 'x.com/agrotech',
      foundedYear: '1998',
      keywords: 'Tecnologia, Agronegócio, Sustentabilidade, Exportação, IOT',
      certifications: 'ISO 9001, ISO 14001, OEA, GlobalG.A.P',
      targetMarkets: 'Alemanha, França, Holanda, China, Estados Unidos',
      secondarySectors: 'Logística Inteligente, Consultoria Ambiental',
      videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      employeesRange: '201-500',
      auditStatus: 'GOLD'
    }

    Object.entries(testData).forEach(([name, value]) => {
      const el = document.querySelector(`[name="${name}"]`) as HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
      if (el) {
        el.value = value
        // Dispara evento de mudança para qualquer listener que o componente possa ter
        el.dispatchEvent(new Event('change', { bubbles: true }))
      }
    })

    // Feedback visual
    const btn = document.getElementById('btn-test-magic')
    if (btn) {
      btn.classList.add('scale-95', 'bg-emerald-500', 'text-white')
      setTimeout(() => btn.classList.remove('scale-95', 'bg-emerald-500', 'text-white'), 500)
    }
  }
  
  // States para URLs finais e Previews
  const [logoUrl, setLogoUrl] = useState(initialData?.logoUrl || '')
  const [bannerUrl, setBannerUrl] = useState(initialData?.bannerUrl || '')
  const [logoPreview, setLogoPreview] = useState(initialData?.logoUrl || '')
  const [bannerPreview, setBannerPreview] = useState(initialData?.bannerUrl || '')
  
  // State para Reviews (Depoimentos)
  const [reviews, setReviews] = useState<any[]>(initialData?.reviews || [])

  // Dados de Países por Bloco
  const COUNTRIES = {
    MERCOSUL: [
      { name: 'Brasil', code: 'BR' },
      { name: 'Argentina', code: 'AR' },
      { name: 'Paraguai', code: 'PY' },
      { name: 'Uruguai', code: 'UY' },
      { name: 'Bolívia', code: 'BO' },
    ],
    EU: [
      { name: 'Portugal', code: 'PT' },
      { name: 'Espanha', code: 'ES' },
      { name: 'França', code: 'FR' },
      { name: 'Alemanha', code: 'DE' },
      { name: 'Itália', code: 'IT' },
      { name: 'Bélgica', code: 'BE' },
      { name: 'Países Baixos', code: 'NL' },
      { name: 'Luxemburgo', code: 'LU' },
      { name: 'Irlanda', code: 'IE' },
      { name: 'Dinamarca', code: 'DK' },
      { name: 'Grécia', code: 'GR' },
      { name: 'Áustria', code: 'AT' },
      { name: 'Suécia', code: 'SE' },
      { name: 'Finlândia', code: 'FI' },
      { name: 'Polônia', code: 'PL' },
      { name: 'República Tcheca', code: 'CZ' },
      { name: 'Hungria', code: 'HU' },
      { name: 'Eslovênia', code: 'SI' },
      { name: 'Eslováquia', code: 'SK' },
      { name: 'Estônia', code: 'EE' },
      { name: 'Letônia', code: 'LV' },
      { name: 'Lituânia', code: 'LT' },
      { name: 'Chipre', code: 'CY' },
      { name: 'Malta', code: 'MT' },
      { name: 'Bulgária', code: 'BG' },
      { name: 'Romênia', code: 'RO' },
      { name: 'Croácia', code: 'HR' },
    ]
  }

  // States para Localização
  const [selectedRegion, setSelectedRegion] = useState<'MERCOSUL' | 'EU'>(initialData?.region || 'MERCOSUL')
  const [selectedCountry, setSelectedCountry] = useState(initialData?.country || '')
  const [countryCode, setCountryCode] = useState(initialData?.countryCode || '')

  const handleRegionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const region = e.target.value as 'MERCOSUL' | 'EU'
    setSelectedRegion(region)
    setSelectedCountry('')
    setCountryCode('')
  }

  const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const countryName = e.target.value
    setSelectedCountry(countryName)
    const country = (COUNTRIES as any)[selectedRegion].find((c: any) => c.name === countryName)
    if (country) {
      setCountryCode(country.code)
    }
  }

  // State e geração automática de slug
  const [slugValue, setSlugValue] = useState(initialData?.slug || '')

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .substring(0, 80)
  }

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value
    // Só gera slug auto se estiver criando (não editando) ou se o slug estiver vazio
    if (!initialData || slugValue === '' || slugValue === generateSlug(e.target.defaultValue || '')) {
      setSlugValue(generateSlug(name))
    }
  }


  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>, type: 'logo' | 'banner') => {
    const file = e.target.files?.[0]
    if (!file) return

    // Limpa a URL antiga imediatamente
    if (type === 'logo') setLogoUrl('')
    else setBannerUrl('')

    // Feedback visual imediato (local)
    const reader = new FileReader()
    reader.onloadend = () => {
      if (type === 'logo') setLogoPreview(reader.result as string)
      else setBannerPreview(reader.result as string)
    }
    reader.readAsDataURL(file)

    // Upload para o Cloudinary
    if (type === 'logo') setIsUploadingLogo(true)
    else setIsUploadingBanner(true)

    try {
      const formData = new FormData()
      formData.append('file', file)
      
      const result = await uploadImage(formData)
      
      if (result.success && result.url) {
        if (type === 'logo') setLogoUrl(result.url)
        else setBannerUrl(result.url)
      } else {
        setError(result.error || 'Falha no upload da imagem')
        // Reverter preview se falhar
        if (type === 'logo') setLogoPreview(initialData?.logoUrl || '')
        else setBannerPreview(initialData?.bannerUrl || '')
      }
    } catch (err) {
      console.error('Upload error:', err)
      setError('Erro crítico no upload da imagem')
    } finally {
      if (type === 'logo') setIsUploadingLogo(false)
      else setIsUploadingBanner(false)
    }
  }

  const addReview = () => {
    setReviews([
      ...reviews,
      { author: '', rating: 5, comment: '', date: new Date().toISOString().split('T')[0] }
    ])
  }

  const removeReview = (index: number) => {
    setReviews(reviews.filter((_, i) => i !== index))
  }

  const updateReview = (index: number, field: string, value: any) => {
    const updated = [...reviews]
    updated[index] = { ...updated[index], [field]: value }
    setReviews(updated)
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSaving(true)
    setError('')

    const formData = new FormData(e.currentTarget)
    const data = Object.fromEntries(formData.entries())

    const formatUrl = (url: any) => {
      if (!url) return ''
      let str = url as string
      if (str && !str.startsWith('http://') && !str.startsWith('https://')) {
        return `https://${str}`
      }
      return str
    }

    const processedData = {
      ...data,
      website: formatUrl(data.website),
      linkedin: formatUrl(data.linkedin),
      instagram: formatUrl(data.instagram),
      facebook: formatUrl(data.facebook),
      twitter: formatUrl(data.twitter),
      whatsapp: whatsappParts.number ? `+${whatsappParts.ddi} ${whatsappParts.number}` : '',
      phone: phoneParts.number ? `+${phoneParts.ddi} ${phoneParts.number}` : '',
      logoUrl, 
      bannerUrl, 
      country: selectedCountry,
      countryCode,
      keywords: data.keywords ? (data.keywords as string).split(',').map(k => k.trim()).filter(Boolean) : [],
      certifications: data.certifications ? (data.certifications as string).split(',').map(k => k.trim()).filter(Boolean) : [],
      targetMarkets: data.targetMarkets ? (data.targetMarkets as string).split(',').map(k => k.trim()).filter(Boolean) : [],
      secondarySectors: data.secondarySectors ? (data.secondarySectors as string).split(',').map(k => k.trim()).filter(Boolean) : [],
      featured: data.featured === 'on',
      region: selectedRegion,
      auditStatus: data.auditStatus as any,
      foundedYear: data.foundedYear ? Number(data.foundedYear) : null,
      reviews: reviews
    }

    try {
      const result = initialData 
        ? await updateCompany(initialData.id, processedData)
        : await createCompany(processedData)

      if (result.success) {
        toast.success(initialData ? 'Empresa atualizada com sucesso!' : 'Empresa criada com sucesso!')
        router.push('/admin/empresas')
        router.refresh()
      } else {
        const errorMsg = result.error || 'Ocorreu um erro ao salvar'
        setError(errorMsg)
        toast.error(errorMsg)
      }
    } catch (err: any) {
      console.error('Erro detalhado ao salvar:', err)
      const msg = err?.message || 'Erro de conexão ou no servidor'
      setError(`Erro crítico: ${msg}. Verifique o console.`)
      toast.error(`Falha técnica: ${msg}`)
    } finally {
      setIsSaving(false)
    }
  }

  const inputClasses = "w-full bg-white border border-gray-200 rounded-xl pl-4 pr-4 py-3 text-sm focus:outline-none focus:border-[var(--color-gold)] transition-all"
  const labelClasses = "flex items-center gap-2 text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2 ml-1"

  return (
    <form onSubmit={handleSubmit} className="space-y-12 pb-20">
      {error && (
        <div className="p-4 bg-red-50 border border-red-100 rounded-xl flex items-center gap-3 text-red-600 text-sm animate-in fade-in slide-in-from-top-2">
          <AlertCircle size={18} />
          {error}
        </div>
      )}

      {/* BARRA DE SAÚDE GLOBAL (SIGNALER) */}
      <div className="sticky top-4 z-[60] bg-white/90 backdrop-blur-xl border border-gray-200/60 p-4 rounded-2xl shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 animate-in slide-in-from-top-4 duration-500">
        <div className="flex items-center gap-4 flex-1 w-full">
          <div className={cn(
            "w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-colors duration-500",
            globalProgress === 100 ? "bg-emerald-500 text-white" : "bg-[var(--color-gold)] text-white"
          )}>
            {globalProgress === 100 ? <CheckCircle2 size={24} /> : <Languages size={24} />}
          </div>
          <div className="flex-1 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Status de Internacionalização</span>
              <span className={cn("text-xs font-black", globalProgress === 100 ? "text-emerald-600" : "text-[var(--color-gold)]")}>
                {globalProgress}% {globalProgress === 100 ? 'COMPLETO' : 'CONCLUÍDO'}
              </span>
            </div>
            <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
              <div 
                className={cn("h-full transition-all duration-1000 ease-out rounded-full", globalProgress === 100 ? "bg-emerald-500" : "bg-[var(--color-gold)]")}
                style={{ width: `${globalProgress}%` }}
              />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {initialData?.slug && (
            <a 
              href={`/empresa/${initialData.slug}`}
              target="_blank"
              className="hidden md:flex items-center gap-2 px-6 py-3 bg-white border border-gray-200 text-gray-600 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-gray-50 transition-all shadow-sm"
            >
              <ExternalLink size={16} />
              Ver na Vitrine
            </a>
          )}
          <button 
            type="button"
            onClick={handleTranslateAll}
            disabled={isTranslatingAll || globalProgress === 100}
            className={cn(
              "w-full md:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-widest transition-all shadow-lg",
              globalProgress === 100 
                ? "bg-gray-100 text-gray-400 cursor-not-allowed shadow-none" 
                : "bg-blue-600 text-white hover:bg-blue-700 shadow-blue-500/20"
            )}
          >
            {isTranslatingAll ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : <Sparkles size={16} />}
            {isTranslatingAll ? 'Traduzindo...' : globalProgress === 100 ? 'Perfil Internacionalizado' : 'Traduzir campos vazios'}
          </button>
        </div>
      </div>

      {/* SEÇÃO 1: IDENTIDADE E BRANDING */}
      <section className="space-y-6">
        <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
          <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
            <Building2 size={20} />
          </div>
          <div>
            <h2 className="text-lg font-bold text-[var(--color-navy)]">Identidade e Branding</h2>
            <p className="text-xs text-gray-500">Faça o upload do logo e banner oficial da empresa.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* UPLOAD LOGO */}
          <div className="space-y-3">
            <label className={labelClasses}>Logo da Empresa</label>
            <div className="flex items-center gap-6">
              <div className="w-24 h-24 rounded-2xl bg-gray-50 border-2 border-dashed border-gray-200 flex items-center justify-center overflow-hidden shrink-0 relative group">
                {logoPreview ? (
                  <>
                    <img 
                      src={logoPreview} 
                      className="w-full h-full object-contain" 
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                        setLogoPreview('');
                      }}
                    />
                    <button 
                      type="button" 
                      onClick={() => {setLogoPreview(''); setLogoUrl('')}}
                      className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white"
                    >
                      <X size={20} />
                    </button>
                  </>
                ) : (
                  <ImageIcon className="text-gray-300" size={32} />
                )}
              </div>
              <div className="flex-1 space-y-2">
                <label className={cn(
                  "inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-xs font-bold transition-all",
                  logoUrl ? "text-green-600 border-green-200 bg-green-50" : "cursor-pointer hover:bg-gray-50"
                )}>
                  {isUploadingLogo ? (
                    <div className="w-3.5 h-3.5 border-2 border-green-600/30 border-t-green-600 rounded-full animate-spin" />
                  ) : logoUrl ? (
                    <CheckCircle2 size={14} />
                  ) : (
                    <Upload size={14} />
                  )}
                  {isUploadingLogo ? 'Enviando...' : logoUrl ? 'Logo Pronto ✓' : 'Escolher Logo'}
                  <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileChange(e, 'logo')} disabled={isUploadingLogo || isSaving} />
                </label>
                <p className="text-[10px] text-gray-400">Recomendado: PNG ou SVG transparente (400x400px).</p>
                
                <div className="pt-2 flex items-center gap-3">
                  <label className="text-[9px] font-bold text-gray-400 uppercase tracking-tight">Cor da Marca (Avatar)</label>
                  <input 
                    type="color" 
                    name="logoColor"
                    defaultValue={initialData?.logoColor || '#003399'} 
                    className="w-8 h-8 rounded-lg cursor-pointer border-none bg-transparent"
                    title="Cor de fundo quando não houver logo"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* UPLOAD BANNER */}
          <div className="space-y-3">
            <label className={labelClasses}>Banner de Capa</label>
            <div className="space-y-3">
              <div className="w-full h-24 rounded-2xl bg-gray-50 border-2 border-dashed border-gray-200 flex items-center justify-center overflow-hidden relative group">
                {bannerPreview ? (
                  <>
                    <img 
                      src={bannerPreview} 
                      className="w-full h-full object-cover" 
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                        setBannerPreview('');
                      }}
                    />
                    <button 
                      type="button" 
                      onClick={() => {setBannerPreview(''); setBannerUrl('')}}
                      className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white"
                    >
                      <X size={20} />
                    </button>
                  </>
                ) : (
                  <ImageIcon className="text-gray-300" size={32} />
                )}
              </div>
              <div className="flex items-center justify-between">
                <label className={cn(
                  "inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-xs font-bold transition-all",
                  bannerUrl ? "text-green-600 border-green-200 bg-green-50" : "cursor-pointer hover:bg-gray-50"
                )}>
                  {isUploadingBanner ? (
                    <div className="w-3.5 h-3.5 border-2 border-green-600/30 border-t-green-600 rounded-full animate-spin" />
                  ) : bannerUrl ? (
                    <CheckCircle2 size={14} />
                  ) : (
                    <Upload size={14} />
                  )}
                  {isUploadingBanner ? 'Enviando...' : bannerUrl ? 'Banner Pronto ✓' : 'Escolher Banner'}
                  <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileChange(e, 'banner')} disabled={isUploadingBanner || isSaving} />
                </label>
                <p className="text-[10px] text-gray-400">Recomendado: 1200x400px (Máx 10MB).</p>
              </div>
            </div>
          </div>

          <div className="space-y-1">
            <label className={labelClasses}>Nome da Empresa</label>
            <input name="name" defaultValue={initialData?.name} required className={inputClasses} placeholder="Ex: Agrosul Brasil S.A." onChange={handleNameChange} />
          </div>
          <div className="space-y-1">
            <label className={labelClasses}>Slug (URL Amigável) — Gerado Automaticamente</label>
            <input name="slug" value={slugValue} onChange={(e) => setSlugValue(e.target.value)} required className={inputClasses} placeholder="ex: agrosul-brasil" />
          </div>
        </div>
      </section>

      {/* SEÇÃO 2: LOCALIZAÇÃO E CLASSIFICAÇÃO */}
      <section className="space-y-6">
        <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
          <div className="p-2 bg-purple-50 rounded-lg text-purple-600">
            <Globe size={20} />
          </div>
          <div>
            <h2 className="text-lg font-bold text-[var(--color-navy)]">Localização e Setor</h2>
            <p className="text-xs text-gray-500">Segmentação geográfica e de mercado.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-1">
            <label className={labelClasses}>Bloco Econômico</label>
            <select 
              name="region" 
              value={selectedRegion} 
              onChange={handleRegionChange}
              className={inputClasses}
            >
              <option value="MERCOSUL">Mercosul</option>
              <option value="EU">União Europeia</option>
            </select>
          </div>
          <div className="space-y-1">
            <label className={labelClasses}>País</label>
            <select 
              name="country" 
              value={selectedCountry} 
              onChange={handleCountryChange}
              required 
              className={inputClasses}
            >
              <option value="">Selecione o País...</option>
              {(COUNTRIES as any)[selectedRegion].map((c: any) => (
                <option key={c.code} value={c.name}>{c.name}</option>
              ))}
            </select>
          </div>
          <div className="space-y-1">
            <label className={labelClasses}>Código do País (ISO)</label>
            <input 
              name="countryCode" 
              value={countryCode} 
              readOnly
              required 
              className={cn(inputClasses, "bg-gray-50 cursor-not-allowed")} 
              placeholder="Auto-preenchido" 
            />
          </div>
          <div className="space-y-1">
            <label className={labelClasses}>Cidade Principal</label>
            <input name="city" defaultValue={initialData?.city} className={inputClasses} placeholder="Ex: São Paulo" />
          </div>
          <div className="space-y-1 md:col-span-2">
            <label className={labelClasses}>Setor Principal</label>
            <select name="sectorId" defaultValue={initialData?.sectorId} required className={inputClasses}>
              <option value="">Selecione um setor...</option>
              {sectors.map(s => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          </div>
        </div>
      </section>

      {/* SEÇÃO 3: SOBRE E CONTEÚDO */}
      <section className="space-y-6">
        <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
          <div className="p-2 bg-amber-50 rounded-lg text-amber-600">
            <Info size={20} />
          </div>
          <div>
            <h2 className="text-lg font-bold text-[var(--color-navy)]">Conteúdo e Autoridade</h2>
            <p className="text-xs text-gray-500">A alma da empresa e métricas de confiança.</p>
          </div>
        </div>

        <div className="space-y-8">
          {/* Descrição Curta + Traduções */}
          <div className="space-y-4">
              <div className="flex items-center justify-between mb-2 ml-1">
                <label className={labelClasses.replace('mb-2', 'mb-0')}>Slogan / Descrição Curta (PT)</label>
                <span className={cn(
                  "text-[9px] font-bold",
                  formValues.shortDescription.length > 180 ? "text-red-500" : "text-gray-400"
                )}>
                  {formValues.shortDescription.length} / 200
                </span>
              </div>
              <input 
                name="shortDescription" 
                id="shortDescription" 
                value={formValues.shortDescription} 
                onChange={(e) => handleFieldChange('shortDescription', e.target.value)}
                required 
                className={inputClasses} 
                maxLength={200} 
                placeholder="Uma frase de impacto em português..." 
              />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <div className="flex items-center justify-between mb-1 ml-1">
                  <label className={labelClasses.replace('mb-2', 'mb-0')}>Inglês (EN)</label>
                  <span className={cn(
                    "text-[8px] font-black uppercase px-1.5 py-0.5 rounded",
                    formValues.shortDescription_en ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600 animate-pulse"
                  )}>
                    {formValues.shortDescription_en ? 'Traduzido' : 'Pendente'}
                  </span>
                </div>
                <div className="relative">
                  <input 
                    name="shortDescription_en" 
                    id="shortDescription_en" 
                    value={formValues.shortDescription_en} 
                    onChange={(e) => handleFieldChange('shortDescription_en', e.target.value)}
                    className={cn(inputClasses, "pr-12", !formValues.shortDescription_en && "border-amber-200 bg-amber-50/10")} 
                    placeholder="Versão em inglês..." 
                  />
                  <button 
                    type="button"
                    onClick={async (e) => {
                      const btn = e.currentTarget
                      btn.classList.add('animate-pulse')
                      if (!formValues.shortDescription) return
                      const res = await translateSingleText(formValues.shortDescription, 'en-US')
                      if (res.success) {
                        handleFieldChange('shortDescription_en', res.text || '')
                      } else {
                        toast.error(res.error || 'Erro na tradução')
                      }
                      btn.classList.remove('animate-pulse')
                    }}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-blue-50 text-blue-500 hover:bg-blue-100 rounded-lg transition-all border border-blue-100 shadow-sm group/spark"
                    title="Traduzir para Inglês"
                  >
                    <Sparkles size={14} className="group-hover/spark:rotate-12 transition-transform" />
                  </button>
                </div>
              </div>
              <div className="space-y-1">
                <div className="flex items-center justify-between mb-1 ml-1">
                  <label className={labelClasses.replace('mb-2', 'mb-0')}>Espanhol (ES)</label>
                  <span className={cn(
                    "text-[8px] font-black uppercase px-1.5 py-0.5 rounded",
                    formValues.shortDescription_es ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600 animate-pulse"
                  )}>
                    {formValues.shortDescription_es ? 'Traduzido' : 'Pendente'}
                  </span>
                </div>
                <div className="relative">
                  <input 
                    name="shortDescription_es" 
                    id="shortDescription_es" 
                    value={formValues.shortDescription_es} 
                    onChange={(e) => handleFieldChange('shortDescription_es', e.target.value)}
                    className={cn(inputClasses, "pr-12", !formValues.shortDescription_es && "border-amber-200 bg-amber-50/10")} 
                    placeholder="Versão em espanhol..." 
                  />
                  <button 
                    type="button"
                    onClick={async (e) => {
                      const btn = e.currentTarget
                      btn.classList.add('animate-pulse')
                      if (!formValues.shortDescription) return
                      const res = await translateSingleText(formValues.shortDescription, 'es')
                      if (res.success) {
                        handleFieldChange('shortDescription_es', res.text || '')
                      } else {
                        toast.error(res.error || 'Erro na tradução')
                      }
                      btn.classList.remove('animate-pulse')
                    }}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-amber-50 text-amber-500 hover:bg-amber-100 rounded-lg transition-all border border-amber-100 shadow-sm group/spark"
                    title="Traduzir para Espanhol"
                  >
                    <Sparkles size={14} className="group-hover/spark:rotate-12 transition-transform" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Descrição Completa + Traduções */}
          <div className="space-y-4">
            <div className="space-y-1">
              <div className="flex items-center justify-between mb-2 ml-1">
                <label className={labelClasses.replace('mb-2', 'mb-0')}>Descrição Completa (PT)</label>
                <span className="text-[9px] font-bold text-gray-400">
                  {formValues.fullDescription.length} caracteres
                </span>
              </div>
              <textarea 
                name="fullDescription" 
                id="fullDescription" 
                value={formValues.fullDescription} 
                onChange={(e) => handleFieldChange('fullDescription', e.target.value)}
                required 
                className={cn(inputClasses, "min-h-[120px] resize-none")} 
                placeholder="Conte a história e o DNA da empresa..." 
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <div className="flex items-center justify-between mb-1 ml-1">
                  <label className={labelClasses.replace('mb-2', 'mb-0')}>Inglês (EN)</label>
                  <span className={cn(
                    "text-[8px] font-black uppercase px-1.5 py-0.5 rounded",
                    formValues.fullDescription_en ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600 animate-pulse"
                  )}>
                    {formValues.fullDescription_en ? 'Traduzido' : 'Pendente'}
                  </span>
                </div>
                <div className="relative">
                  <textarea 
                    name="fullDescription_en" 
                    id="fullDescription_en" 
                    value={formValues.fullDescription_en} 
                    onChange={(e) => handleFieldChange('fullDescription_en', e.target.value)}
                    className={cn(inputClasses, "min-h-[100px] resize-none pr-12", !formValues.fullDescription_en && "border-amber-200 bg-amber-50/10")} 
                    placeholder="English version..." 
                  />
                  <button 
                    type="button"
                    onClick={async (e) => {
                      const btn = e.currentTarget
                      btn.classList.add('animate-pulse')
                      if (!formValues.fullDescription) return
                      const res = await translateSingleText(formValues.fullDescription, 'en-US')
                      if (res.success) {
                        handleFieldChange('fullDescription_en', res.text || '')
                      } else {
                        toast.error(res.error || 'Erro na tradução')
                      }
                      btn.classList.remove('animate-pulse')
                    }}
                    className="absolute right-2 top-4 p-2 bg-blue-50 text-blue-500 hover:bg-blue-100 rounded-lg transition-all border border-blue-100 shadow-sm group/spark"
                  >
                    <Sparkles size={14} className="group-hover/spark:rotate-12 transition-transform" />
                  </button>
                </div>
              </div>
              <div className="space-y-1">
                <div className="flex items-center justify-between mb-1 ml-1">
                  <label className={labelClasses.replace('mb-2', 'mb-0')}>Espanhol (ES)</label>
                  <span className={cn(
                    "text-[8px] font-black uppercase px-1.5 py-0.5 rounded",
                    formValues.fullDescription_es ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600 animate-pulse"
                  )}>
                    {formValues.fullDescription_es ? 'Traduzido' : 'Pendente'}
                  </span>
                </div>
                <div className="relative">
                  <textarea 
                    name="fullDescription_es" 
                    id="fullDescription_es" 
                    value={formValues.fullDescription_es} 
                    onChange={(e) => handleFieldChange('fullDescription_es', e.target.value)}
                    className={cn(inputClasses, "min-h-[100px] resize-none pr-12", !formValues.fullDescription_es && "border-amber-200 bg-amber-50/10")} 
                    placeholder="Versión en español..." 
                  />
                  <button 
                    type="button"
                    onClick={async (e) => {
                      const btn = e.currentTarget
                      btn.classList.add('animate-pulse')
                      if (!formValues.fullDescription) return
                      const res = await translateSingleText(formValues.fullDescription, 'es')
                      if (res.success) {
                        handleFieldChange('fullDescription_es', res.text || '')
                      } else {
                        toast.error(res.error || 'Erro na tradução')
                      }
                      btn.classList.remove('animate-pulse')
                    }}
                    className="absolute right-2 top-4 p-2 bg-amber-50 text-amber-500 hover:bg-amber-100 rounded-lg transition-all border border-amber-100 shadow-sm group/spark"
                  >
                    <Sparkles size={14} className="group-hover/spark:rotate-12 transition-transform" />
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-1">
              <label className={labelClasses}>Vídeo Institucional (Link YouTube/Vimeo)</label>
              <div className="relative flex items-center">
                <input 
                  name="videoUrl" 
                  defaultValue={initialData?.videoUrl} 
                  className={inputClasses} 
                  style={{ paddingLeft: '3.5rem' }}
                  placeholder="https://youtube.com/..." 
                />
                <div className="absolute left-4 flex items-center pointer-events-none text-gray-400">
                  <Video size={18} />
                </div>
              </div>
            </div>
            <div className="space-y-1">
              <label className={labelClasses}>Palavras-chave (Separadas por vírgula)</label>
              <div className="relative flex items-center">
                <input 
                  name="keywords" 
                  defaultValue={initialData?.keywords?.join(', ')} 
                  className={inputClasses} 
                  style={{ paddingLeft: '3.5rem' }}
                  placeholder="Tech, Exportação, Grãos..." 
                />
                <div className="absolute left-4 flex items-center pointer-events-none text-gray-400">
                  <Hash size={18} />
                </div>
              </div>
            </div>
            <div className="space-y-1">
              <label className={labelClasses}>Status de Verificação KYB</label>
              <select name="auditStatus" defaultValue={initialData?.auditStatus || 'NONE'} className={cn(inputClasses, "font-bold text-[var(--color-navy)]")}>
                <option value="NONE">Aguardando Auditoria</option>
                <option value="GOLD">Empresa Verificada</option>
              </select>
              <p className="text-[10px] text-gray-400 mt-1">Selecione 'Empresa Verificada' após validar a documentação legal.</p>
            </div>
            <div className="space-y-1">
              <label className={labelClasses}>Ano de Fundação</label>
              <input name="foundedYear" type="number" defaultValue={initialData?.foundedYear} className={inputClasses} placeholder="Ex: 1995" />
            </div>
            <div className="space-y-1">
              <label className={labelClasses}>Tamanho da Empresa (Funcionários)</label>
              <select name="employeesRange" defaultValue={initialData?.employeesRange || ''} className={inputClasses}>
                <option value="">Selecione...</option>
                <option value="1-10">1-10 (Micro)</option>
                <option value="11-50">11-50 (Pequena)</option>
                <option value="51-200">51-200 (Média)</option>
                <option value="201-500">201-500 (Média-Grande)</option>
                <option value="500+">500+ (Grande)</option>
              </select>
            </div>
            <div className="space-y-1">
              <label className={labelClasses}>Setores Secundários (Vírgula)</label>
              <div className="relative flex items-center">
                <input 
                  name="secondarySectors" 
                  defaultValue={initialData?.secondarySectors?.join(', ')} 
                  className={inputClasses} 
                  style={{ paddingLeft: '3.5rem' }}
                  placeholder="Logística, Embalagens..." 
                />
                <div className="absolute left-4 flex items-center pointer-events-none text-gray-400">
                  <Hash size={18} />
                </div>
              </div>
            </div>
            <div className="space-y-1">
              <label className={labelClasses}>Certificações B2B (Vírgula)</label>
              <div className="relative flex items-center">
                <input 
                  name="certifications" 
                  defaultValue={initialData?.certifications?.join(', ')} 
                  className={inputClasses} 
                  style={{ paddingLeft: '3.5rem' }}
                  placeholder="ISO 9001, FDA, CE Mark..." 
                />
                <div className="absolute left-4 flex items-center pointer-events-none text-gray-400">
                  <Hash size={18} />
                </div>
              </div>
            </div>
            <div className="space-y-1">
              <label className={labelClasses}>Mercados Alvo de Exportação (Vírgula)</label>
              <div className="relative flex items-center">
                <input 
                  name="targetMarkets" 
                  defaultValue={initialData?.targetMarkets?.join(', ')} 
                  className={inputClasses} 
                  style={{ paddingLeft: '3.5rem' }}
                  placeholder="Europa, EUA, Oriente Médio..." 
                />
                <div className="absolute left-4 flex items-center pointer-events-none text-gray-400">
                  <Globe2 size={18} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SEÇÃO 4: CONTATO */}
      <section className="space-y-6">
        <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
          <div className="p-2 bg-green-50 rounded-lg text-green-600">
            <Mail size={20} />
          </div>
          <div>
            <h2 className="text-lg font-bold text-[var(--color-navy)]">Canais de Negócio</h2>
            <p className="text-xs text-gray-500">Como os leads chegarão até a empresa.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-1">
            <label className={labelClasses}>E-mail Comercial</label>
            <div className="relative flex items-center">
              <input 
                name="email" 
                type="email" 
                defaultValue={initialData?.email} 
                className={inputClasses} 
                style={{ paddingLeft: '3.5rem' }}
                placeholder="comercial@empresa.com" 
              />
              <div className="absolute left-4 flex items-center pointer-events-none text-gray-400">
                <Mail size={18} />
              </div>
            </div>
          </div>
          <div className="space-y-1">
            <label className={labelClasses}>WhatsApp Internacional</label>
            <div className="flex gap-2">
              <div className="relative w-28 shrink-0">
                <select 
                  value={whatsappParts.ddi}
                  onChange={(e) => setWhatsappParts(p => ({ ...p, ddi: e.target.value }))}
                  className={cn(inputClasses, "pl-3 pr-8 appearance-none text-xs")}
                >
                  {countriesList.sort((a,b) => a.name.localeCompare(b.name)).map(c => (
                    <option key={`wa-${c.code}-${c.ddi}`} value={c.ddi}>
                      +{c.ddi} ({c.code})
                    </option>
                  ))}
                </select>
                <ChevronRight className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 rotate-90" size={14} />
              </div>
              <div className="flex-1">
                <input 
                  type="text" 
                  value={whatsappParts.number}
                  onChange={(e) => setWhatsappParts(p => ({ ...p, number: e.target.value }))}
                  className={inputClasses} 
                  placeholder="Número com DDD/Área" 
                />
              </div>
            </div>
          </div>
          <div className="space-y-1">
            <label className={labelClasses}>Site Oficial</label>
            <div className="relative flex items-center">
              <input 
                name="website" 
                type="text" 
                defaultValue={initialData?.website} 
                className={inputClasses} 
                style={{ paddingLeft: '3.5rem' }}
                placeholder="www.empresa.com" 
              />
              <div className="absolute left-4 flex items-center pointer-events-none text-gray-400">
                <Globe2 size={18} />
              </div>
            </div>
          </div>
          <div className="space-y-1">
            <label className={labelClasses}>Telefone Corporativo (Fixo)</label>
            <div className="flex gap-2">
              <div className="relative w-28 shrink-0">
                <select 
                  value={phoneParts.ddi}
                  onChange={(e) => setPhoneParts(p => ({ ...p, ddi: e.target.value }))}
                  className={cn(inputClasses, "pl-3 pr-8 appearance-none text-xs")}
                >
                  {countriesList.sort((a,b) => a.name.localeCompare(b.name)).map(c => (
                    <option key={`ph-${c.code}-${c.ddi}`} value={c.ddi}>
                      +{c.ddi} ({c.code})
                    </option>
                  ))}
                </select>
                <ChevronRight className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 rotate-90" size={14} />
              </div>
              <div className="flex-1">
                <input 
                  type="text" 
                  value={phoneParts.number}
                  onChange={(e) => setPhoneParts(p => ({ ...p, number: e.target.value }))}
                  className={inputClasses} 
                  placeholder="Número com DDD/Área" 
                />
              </div>
            </div>
          </div>
          <div className="space-y-1 md:col-span-3">
            <label className={labelClasses}>LinkedIn da Empresa (URL)</label>
            <div className="relative flex items-center">
              <input 
                name="linkedin" 
                type="text" 
                defaultValue={initialData?.linkedin} 
                className={inputClasses} 
                style={{ paddingLeft: '3.5rem' }}
                placeholder="linkedin.com/company/..." 
              />
              <div className="absolute left-4 flex items-center pointer-events-none text-gray-400">
                <Link2 size={18} />
              </div>
            </div>
          </div>
          <div className="space-y-1">
            <label className={labelClasses}>Instagram da Empresa (URL)</label>
            <div className="relative flex items-center">
              <input 
                name="instagram" 
                type="text" 
                defaultValue={initialData?.instagram} 
                className={inputClasses} 
                style={{ paddingLeft: '3.5rem' }}
                placeholder="instagram.com/..." 
              />
              <div className="absolute left-4 flex items-center pointer-events-none text-gray-400">
                <Link2 size={18} />
              </div>
            </div>
          </div>
          <div className="space-y-1">
            <label className={labelClasses}>Facebook da Empresa (URL)</label>
            <div className="relative flex items-center">
              <input 
                name="facebook" 
                type="text" 
                defaultValue={initialData?.facebook} 
                className={inputClasses} 
                style={{ paddingLeft: '3.5rem' }}
                placeholder="facebook.com/..." 
              />
              <div className="absolute left-4 flex items-center pointer-events-none text-gray-400">
                <Link2 size={18} />
              </div>
            </div>
          </div>
          <div className="space-y-1">
            <label className={labelClasses}>X (Twitter) da Empresa (URL)</label>
            <div className="relative flex items-center">
              <input 
                name="twitter" 
                type="text" 
                defaultValue={initialData?.twitter} 
                className={inputClasses} 
                style={{ paddingLeft: '3.5rem' }}
                placeholder="x.com/..." 
              />
              <div className="absolute left-4 flex items-center pointer-events-none text-gray-400">
                <Link2 size={18} />
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* SEÇÃO 5: DEPOIMENTOS DE PARCEIROS (PROVA SOCIAL) */}
      <section className="space-y-6">
        <div className="flex items-center justify-between border-b border-gray-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-50 rounded-lg text-amber-600">
              <Star size={20} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-[var(--color-navy)]">Depoimentos / Prova Social</h2>
              <p className="text-xs text-gray-500">Adicione o que os parceiros dizem sobre a empresa para aumentar a confiança.</p>
            </div>
          </div>
          <button 
            type="button"
            onClick={addReview}
            className="flex items-center gap-2 px-4 py-2 bg-amber-50 text-amber-600 rounded-xl font-bold text-[10px] uppercase tracking-wider hover:bg-amber-100 transition-colors"
          >
            <Plus size={14} /> Adicionar Depoimento
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {reviews.map((review, index) => (
            <div key={index} className="p-6 rounded-2xl border border-gray-100 bg-gray-50/50 space-y-4 relative group">
              <button 
                type="button"
                onClick={() => removeReview(index)}
                className="absolute top-4 right-4 w-8 h-8 bg-red-50 text-red-500 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-100"
              >
                <Trash2 size={16} />
              </button>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className={labelClasses}>Autor</label>
                  <input 
                    type="text" 
                    value={review.author}
                    onChange={(e) => updateReview(index, 'author', e.target.value)}
                    placeholder="Ex: João Silva"
                    className={inputClasses}
                  />
                </div>
                <div className="space-y-1">
                  <label className={labelClasses}>Avaliação</label>
                  <select 
                    value={review.rating}
                    onChange={(e) => updateReview(index, 'rating', e.target.value)}
                    className={inputClasses}
                  >
                    {[5,4,3,2,1].map(n => (
                      <option key={n} value={n}>{n} Estrelas</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-1">
                <label className={labelClasses}>Data (Opcional)</label>
                <input 
                  type="text" 
                  value={review.date ? (typeof review.date === 'string' ? review.date.split('T')[0] : review.date.toISOString().split('T')[0]) : ''}
                  onChange={(e) => updateReview(index, 'date', e.target.value)}
                  placeholder="2024-04-20"
                  className={inputClasses}
                />
              </div>

              <div className="space-y-1">
                <label className={labelClasses}>Comentário</label>
                <textarea 
                  value={review.comment}
                  onChange={(e) => updateReview(index, 'comment', e.target.value)}
                  placeholder="O depoimento do parceiro..."
                  rows={3}
                  className={cn(inputClasses, "resize-none")}
                />
              </div>
            </div>
          ))}

          {reviews.length === 0 && (
            <div className="md:col-span-2 py-12 text-center border-2 border-dashed border-gray-100 rounded-[2rem]">
              <MessageSquare size={40} className="mx-auto text-gray-200 mb-3" />
              <p className="text-gray-400 font-body italic">Nenhum depoimento cadastrado ainda.</p>
              <button 
                type="button"
                onClick={addReview}
                className="mt-4 text-[var(--color-gold)] font-bold text-xs uppercase underline underline-offset-4"
              >
                Adicionar primeiro depoimento
              </button>
            </div>
          )}
        </div>
      </section>
      {/* SEÇÃO 5: ADMINISTRAÇÃO E CURADORIA (USO INTERNO) */}
      <section className="space-y-6">
        <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
          <div className="p-2 bg-red-50 rounded-lg text-red-600">
            <AlertCircle size={20} />
          </div>
          <div>
            <h2 className="text-lg font-bold text-[var(--color-navy)]">Administração & Curadoria</h2>
            <p className="text-xs text-gray-500">Campos ocultos do público. Visíveis apenas para a equipe da Plataforma.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3 bg-yellow-50 p-4 rounded-xl border border-yellow-200">
            <label className="flex items-center gap-3 cursor-pointer">
              <input 
                type="checkbox" 
                name="featured" 
                defaultChecked={initialData?.featured}
                className="w-5 h-5 rounded border-gray-300 text-[var(--color-gold)] focus:ring-[var(--color-gold)]" 
              />
              <div>
                <span className="block text-sm font-bold text-[var(--color-navy)]">Empresa em Destaque (Featured)</span>
                <span className="block text-xs text-gray-500">Se marcado, esta empresa terá prioridade máxima nos resultados de busca e nas seções "Made In".</span>
              </div>
            </label>
          </div>

          <div className="space-y-1">
            <label className={labelClasses}>Status de Publicação</label>
            <select name="status" defaultValue={initialData?.status || 'PENDING'} className={cn(inputClasses, "font-bold border-blue-200 bg-blue-50/20")}>
              <option value="ACTIVE">ATIVO (Visível na Vitrine)</option>
              <option value="PENDING">PENDENTE (Aguardando Curadoria)</option>
              <option value="DRAFT">RASCUNHO (Não Publicado)</option>
              <option value="INACTIVE">INATIVO (Oculto)</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className={labelClasses}>Notas Internas (CRM)</label>
            <textarea name="internalNotes" defaultValue={initialData?.internalNotes} className={cn(inputClasses, "min-h-[100px] resize-none")} placeholder="Observações sobre contato, negociações..." />
          </div>
          <div className="space-y-1">
            <label className={labelClasses}>Notas de Verificação KYB</label>
            <textarea name="verificationNotes" defaultValue={initialData?.verificationNotes} className={cn(inputClasses, "min-h-[100px] resize-none")} placeholder="Documentos pendentes, links de validação de CNPJ..." />
          </div>
        </div>
      </section>

      {/* FOOTER: BOTÕES DE AÇÃO */}
      <div className="sticky bottom-8 bg-white/80 backdrop-blur-md p-4 rounded-2xl border border-gray-200 shadow-2xl flex items-center justify-between gap-4 z-50">
        <button 
          type="button" 
          onClick={() => router.back()}
          className="px-6 py-3 text-sm font-bold text-gray-500 hover:text-gray-900 transition-colors"
        >
          Descartar Alterações
        </button>

        <div className="flex items-center gap-2">
          <button
            type="button"
            id="btn-test-magic"
            onClick={fillTestData}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-600 rounded-xl font-bold text-[10px] uppercase tracking-wider hover:bg-emerald-100 transition-all border border-emerald-100"
            title="Preencher com dados de teste"
          >
            <FlaskConical size={14} />
            Dados de Teste
          </button>

          <div className="h-8 w-px bg-gray-200 mx-2 hidden md:block" />

          <button 
            type="button"
            onClick={handleTranslateAll}
            disabled={isTranslatingAll}
            className="flex items-center gap-2 px-6 py-2 bg-blue-50 text-blue-600 rounded-xl font-bold text-[10px] uppercase tracking-wider hover:bg-blue-100 transition-all disabled:opacity-50 border border-blue-100 group"
          >
            {isTranslatingAll ? (
              <div className="w-3 h-3 border-2 border-blue-600/30 border-t-blue-600 rounded-full animate-spin" />
            ) : (
              <Sparkles size={14} className="group-hover:rotate-12 transition-transform" />
            )}
            Traduzir Tudo (IA)
          </button>
        </div>

        <button 
          type="submit" 
          disabled={isSaving || isUploadingLogo || isUploadingBanner}
          className="flex items-center gap-2 px-10 py-3 bg-[var(--color-navy)] text-white rounded-xl font-bold hover:bg-[#002266] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-900/20"
        >
          {isSaving ? (
            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <Save size={18} />
          )}
          {isSaving ? 'Salvando...' : (initialData ? 'Salvar Alterações' : 'Publicar Empresa na Vitrine')}
        </button>
      </div>
    </form>
  )
}

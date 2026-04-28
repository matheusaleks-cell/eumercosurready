'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  ClipboardCheck, 
  Users, 
  Award, 
  Send, 
  CheckCircle2, 
  ChevronRight,
  Building2,
  Globe,
  Mail,
  Phone,
  User as UserIcon,
  Search,
  Image as ImageIcon,
  Upload,
  X
} from 'lucide-react'
import { countriesList } from '@/lib/countries-list'
import { createRequest } from '@/lib/actions/requests'
import { uploadImage } from '@/lib/actions/upload'
import { useLanguage } from '@/hooks/use-language'

export default function SolicitarCadastroPage() {
  const [selectedSector, setSelectedSector] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [logoUrl, setLogoUrl] = useState('')
  const [bannerUrl, setBannerUrl] = useState('')
  const [logoPreview, setLogoPreview] = useState('')
  const [bannerPreview, setBannerPreview] = useState('')
  const [isUploadingLogo, setIsUploadingLogo] = useState(false)
  const [isUploadingBanner, setIsUploadingBanner] = useState(false)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>, type: 'logo' | 'banner') => {
    const file = e.target.files?.[0]
    if (!file) return

    if (type === 'logo') setLogoUrl('')
    else setBannerUrl('')

    const reader = new FileReader()
    reader.onloadend = () => {
      if (type === 'logo') setLogoPreview(reader.result as string)
      else setBannerPreview(reader.result as string)
    }
    reader.readAsDataURL(file)

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
        setError(result.error || t('Falha no upload da imagem', 'Image upload failed', 'Falla en la carga de la imagen'))
        if (type === 'logo') setLogoPreview('')
        else setBannerPreview('')
      }
    } catch (err) {
      console.error('Upload error:', err)
      setError(t('Erro crítico no upload da imagem', 'Critical error during image upload', 'Error crítico al cargar la imagen'))
    } finally {
      if (type === 'logo') setIsUploadingLogo(false)
      else setIsUploadingBanner(false)
    }
  }

  // Organização por Bloco Econômico
  const mercosulCountries = countriesList.filter(c => c.bloc === 'Mercosul')
  const euCountries = countriesList.filter(c => c.bloc === 'EU')

  const { t } = useLanguage()

  const steps = [
    {
      id: 1,
      title: t('Envio de Informações', 'Information Submission', 'Envío de Información'),
      description: t('Preencha os dados institucionais da sua empresa para análise prévia.', 'Fill in your company\'s institutional data for preliminary analysis.', 'Complete los datos institucionales de su empresa para un análisis previo.'),
      icon: <ClipboardCheck className="text-[var(--color-gold)]" size={24} />
    },
    {
      id: 2,
      title: t('Entrevista & Alinhamento', 'Interview & Alignment', 'Entrevista y Alineación'),
      description: t('Nosso time entrará em contato para conhecer seu modelo de negócio e objetivos.', 'Our team will contact you to learn about your business model and objectives.', 'Nuestro equipo se pondrá en contacto con usted para conocer seu modelo de negocio y objetivos.'),
      icon: <Users className="text-[var(--color-gold)]" size={24} />
    },
    {
      id: 3,
      title: t('Auditoria & Publicação', 'Audit & Publication', 'Auditoría y Publicación'),
      description: t('Após validação, sua empresa recebe o selo Ready e é publicada na vitrine.', 'After validation, your company receives the Ready seal and is published in the showcase.', 'Tras la validación, su empresa recibe el sello Ready y se publica en el escaparate.'),
      icon: <Award className="text-[var(--color-gold)]" size={24} />
    }
  ]

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    
    const formData = new FormData(e.currentTarget)
    
    // Lógica para o setor 'Outro'
    const sectorSelect = formData.get('sectorSelect') as string
    const sectorOther = formData.get('sectorOther') as string
    const finalSector = sectorSelect === 'outro' ? sectorOther : sectorSelect
    formData.set('sector', finalSector)

    // Adiciona as URLs ao formData
    if (logoUrl) formData.set('logoUrl', logoUrl)
    if (bannerUrl) formData.set('bannerUrl', bannerUrl)

    try {
      const result = await createRequest(formData)

      if (result.success) {
        setLoading(false)
        setSubmitted(true)
        window.scrollTo({ top: 0, behavior: 'smooth' })
      } else {
        setLoading(false)
        setError(result.error || t('Ocorreu um erro ao enviar. Tente novamente.', 'An error occurred while sending. Try again.', 'Ocurreu un error al enviar. Intente de nuevo.'))
      }
    } catch (err: any) {
      console.error('Submission error:', err)
      setLoading(false)
      setError(t('Erro de conexão. Verifique sua internet e tente novamente.', 'Connection error. Check your internet and try again.', 'Error de conexión. Verifique su internet e intente de nuevo.'))
    }
  }

  if (submitted) {
    return (
      <div className="min-h-screen pt-32 pb-20 px-4 bg-[var(--background)]">
        <div className="max-w-3xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-[2rem] p-12 md:p-20 text-center shadow-2xl border border-[var(--color-border)]"
          >
            <div className="flex justify-center mb-8">
              <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center">
                <CheckCircle2 size={64} className="text-green-600" />
              </div>
            </div>
            <h1 className="text-3xl md:text-5xl font-display font-bold text-[var(--color-navy)] mb-6">
              {t('Solicitação Enviada!', 'Request Sent!', '¡Solicitud Enviada!')}
            </h1>
            <p className="text-lg md:text-xl text-[var(--color-text-muted)] font-body mb-10 max-w-xl mx-auto leading-relaxed">
              {t(
                'Obrigado pelo seu interesse. Nossa equipe de curadoria já recebeu seus dados e entrará em contato em até 48h úteis para agendar a entrevista de alinhamento.',
                'Thank you for your interest. Our curation team has received your data and will contact you within 48 business hours to schedule the alignment interview.',
                'Gracias por su interés. Nuestro equipo de curaduría ya ha recibido sus datos y se pondrá en contacto con usted en un plazo de 48 horas hábiles para programar la entrevista de alineación.'
              )}
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <button 
                onClick={() => window.location.href = '/'}
                className="btn-premium"
              >
                <span>{t('Voltar para a Vitrine', 'Back to Showcase', 'Volver al Escaparate')}</span>
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    )
  }

  return (
    <main className="min-h-screen pt-32 pb-20 px-4 md:px-8 bg-[var(--background)]">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-16 items-start">
          
          {/* Lado Esquerdo: Instruções e Explicação */}
          <div className="w-full lg:w-5/12 space-y-12">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h1 className="text-4xl md:text-6xl font-display font-bold text-[var(--color-navy)] leading-tight mb-6">
                {t('Leve sua empresa para o', 'Take your company to the', 'Lleve su empresa al')} <span className="text-[var(--color-gold)]">{t('Próximo Nível', 'Next Level', 'Siguiente Nivel')}</span>
              </h1>
              <p className="text-lg text-[var(--color-text-muted)] font-body leading-relaxed">
                {t(
                  'O EU-Mercosur Ready não é apenas um diretório, é um ecossistema de elite. Entenda nosso processo de admissão projetado para manter a excelência deste Ecossistema.',
                  'EU-Mercosur Ready is not just a directory, it is an elite ecosystem. Understand our admission process designed to maintain this Ecosystem\'s excellence.',
                  'EU-Mercosur Ready no es sólo un directorio, es un ecosistema de élite. Entienda nuestro proceso de admisión diseñado para mantener la excelencia del Hub.'
                )}
              </p>
            </motion.div>

            {/* Steps Visual */}
            <div className="space-y-8 relative">
              {/* Linha conectora vertical */}
              <div className="absolute left-6 top-8 bottom-8 w-[2px] bg-gray-200 z-0 hidden sm:block" />
              
              {steps.map((step, index) => (
                <motion.div 
                  key={step.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 * index }}
                  className="relative z-10 flex gap-6"
                >
                  <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-white border-2 border-[var(--color-gold)] flex items-center justify-center shadow-md">
                    {step.icon}
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold text-[var(--color-navy)]">{step.title}</h3>
                    <p className="text-[var(--color-text-muted)] text-sm leading-relaxed">{step.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Trust Badge */}
            <div className="p-6 bg-white/50 backdrop-blur-sm rounded-2xl border border-gray-100 flex items-center gap-4">
               <div className="w-12 h-12 bg-[var(--color-gold)]/10 rounded-full flex items-center justify-center">
                  <Search className="text-[var(--color-gold)]" size={24} />
               </div>
               <p className="text-xs text-[var(--color-text-muted)] italic leading-snug">
                 {t(
                   '"A curadoria rigorosa garante que você se conectará apenas com players validados e prontos para negócios internacionais."',
                   '"Rigorous curation ensures that you will connect only with validated players ready for international business."',
                   '"La rigurosa curaduría garantiza que usted se conectará únicamente con actores validados y preparados para los negocios internacionales."'
                 )}
               </p>
            </div>
          </div>

          {/* Lado Direito: Formulário */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="w-full lg:w-7/12"
          >
            <div className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-xl border border-gray-100 relative overflow-hidden">
              {/* Decorative Glow */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--color-gold)]/5 blur-[80px] -mr-32 -mt-32" />
              
              <h2 className="text-2xl font-display font-bold text-[var(--color-navy)] mb-8 flex items-center gap-3">
                <Building2 className="text-[var(--color-gold)]" />
                {t('Pedido de Ingresso', 'Entry Request', 'Solicitud de Ingreso')}
              </h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <div className="p-4 bg-red-50 text-red-600 rounded-xl text-sm border border-red-100 mb-6">
                    {error}
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Upload Logo e Banner */}
                  <div className="col-span-1 md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6 pb-6 border-b border-gray-100">
                    <div className="space-y-3">
                      <label className="text-xs font-bold text-[var(--color-navy)] uppercase tracking-wider">{t('Logo da Empresa', 'Company Logo', 'Logotipo de la Empresa')}</label>
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-xl bg-gray-50 border-2 border-dashed border-gray-200 flex items-center justify-center overflow-hidden shrink-0 relative group">
                          {logoPreview ? (
                            <>
                              <img src={logoPreview} className="w-full h-full object-contain p-1" />
                              <button type="button" onClick={() => {setLogoPreview(''); setLogoUrl('')}} className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                                <X size={16} />
                              </button>
                            </>
                          ) : (
                            <ImageIcon className="text-gray-300" size={24} />
                          )}
                        </div>
                        <div className="flex-1">
                          <label className={`inline-flex items-center gap-2 px-4 py-2 border rounded-lg text-xs font-bold transition-all cursor-pointer ${logoUrl ? "text-green-600 border-green-200 bg-green-50" : "bg-white border-gray-200 hover:bg-gray-50 text-[var(--color-navy)]"}`}>
                            {isUploadingLogo ? <div className="w-3.5 h-3.5 border-2 border-green-600/30 border-t-green-600 rounded-full animate-spin" /> : logoUrl ? <CheckCircle2 size={14} /> : <Upload size={14} />}
                            {isUploadingLogo ? t('Enviando...', 'Uploading...', 'Enviando...') : logoUrl ? t('Logo Pronto ✓', 'Logo Ready ✓', 'Logo Listo ✓') : t('Escolher Logo', 'Choose Logo', 'Elegir Logo')}
                            <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileChange(e, 'logo')} disabled={isUploadingLogo || loading} />
                          </label>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <label className="text-xs font-bold text-[var(--color-navy)] uppercase tracking-wider">{t('Banner de Capa (Opcional)', 'Cover Banner (Optional)', 'Banner de Portada (Opcional)')}</label>
                      <div className="space-y-3">
                        <div className="w-full h-16 rounded-xl bg-gray-50 border-2 border-dashed border-gray-200 flex items-center justify-center overflow-hidden relative group">
                          {bannerPreview ? (
                            <>
                              <img src={bannerPreview} className="w-full h-full object-cover" />
                              <button type="button" onClick={() => {setBannerPreview(''); setBannerUrl('')}} className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                                <X size={16} />
                              </button>
                            </>
                          ) : (
                            <ImageIcon className="text-gray-300" size={24} />
                          )}
                        </div>
                        <label className={`inline-flex items-center gap-2 px-4 py-2 border rounded-lg text-xs font-bold transition-all cursor-pointer ${bannerUrl ? "text-green-600 border-green-200 bg-green-50" : "bg-white border-gray-200 hover:bg-gray-50 text-[var(--color-navy)]"}`}>
                          {isUploadingBanner ? <div className="w-3.5 h-3.5 border-2 border-green-600/30 border-t-green-600 rounded-full animate-spin" /> : bannerUrl ? <CheckCircle2 size={14} /> : <Upload size={14} />}
                          {isUploadingBanner ? t('Enviando...', 'Uploading...', 'Enviando...') : bannerUrl ? t('Banner Pronto ✓', 'Banner Ready ✓', 'Banner Listo ✓') : t('Escolher Banner', 'Choose Banner', 'Elegir Banner')}
                          <input type="file" className="hidden" accept="image/*" onChange={(e) => handleFileChange(e, 'banner')} disabled={isUploadingBanner || loading} />
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Nome da Empresa */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-[var(--color-navy)] uppercase tracking-wider">{t('Nome da Empresa', 'Company Name', 'Nombre de la Empresa')}</label>
                    <div className="relative">
                      <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                      <input 
                        name="companyName"
                        type="text" 
                        required
                        placeholder={t('Ex: Tech Solutions S.A.', 'e.g. Tech Solutions Inc.', 'Ej: Tech Solutions S.A.')}
                        className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--color-gold)]/50 focus:border-[var(--color-gold)] transition-all font-body text-sm"
                      />
                    </div>
                  </div>

                  {/* País */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-[var(--color-navy)] uppercase tracking-wider">{t('País sede', 'Headquarters Country', 'País Sede')}</label>
                    <div className="relative">
                      <Globe className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                      <select name="country" required className="w-full pl-12 pr-10 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--color-gold)]/50 focus:border-[var(--color-gold)] transition-all font-body text-sm appearance-none">
                        <option value="">{t('Selecione o país', 'Select country', 'Seleccione el país')}</option>
                        <optgroup label="Mercosul">
                          {mercosulCountries.map(c => (
                            <option key={c.code} value={c.code}>{c.name}</option>
                          ))}
                        </optgroup>
                        <optgroup label="União Europeia">
                          {euCountries.map(c => (
                            <option key={c.code} value={c.code}>{c.name}</option>
                          ))}
                        </optgroup>
                      </select>
                      <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 rotate-90" size={18} />
                    </div>
                  </div>

                  {/* Setor */}
                  <div className="space-y-4 md:col-span-2">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-[var(--color-navy)] uppercase tracking-wider">{t('Setor Econômico', 'Economic Sector', 'Sector Económico')}</label>
                      <select 
                        name="sectorSelect" 
                        required 
                        value={selectedSector}
                        onChange={(e) => setSelectedSector(e.target.value)}
                        className="w-full px-4 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--color-gold)]/50 focus:border-[var(--color-gold)] transition-all font-body text-sm"
                      >
                        <option value="">{t('Selecione o setor', 'Select sector', 'Seleccione el sector')}</option>
                        <option value="Agronegócio">{t('Agronegócio', 'Agribusiness', 'Agronegocios')}</option>
                        <option value="Tecnologia & IA">{t('Tecnologia & IA', 'Technology & AI', 'Tecnología e IA')}</option>
                        <option value="Alimentos & Bebidas">{t('Alimentos & Bebidas', 'Food & Beverage', 'Alimentos y Bebidas')}</option>
                        <option value="Logística & Supply Chain">{t('Logística & Supply Chain', 'Logistics & Supply Chain', 'Logística y Supply Chain')}</option>
                        <option value="Serviços Financeiros">{t('Serviços Financeiros', 'Financial Services', 'Servicios Financieros')}</option>
                        <option value="Construção Civil & Real Estate">{t('Construção Civil & Real Estate', 'Construction & Real Estate', 'Construcción y Real Estate')}</option>
                        <option value="Energias Renováveis">{t('Energias Renováveis', 'Renewable Energy', 'Energías Renovables')}</option>
                        <option value="Saúde & Farmacêutico">{t('Saúde & Farmacêutico', 'Health & Pharmaceutical', 'Salud y Farmacéutico')}</option>
                        <option value="Moda & Têxtil">{t('Moda & Têxtil', 'Fashion & Textile', 'Moda y Textil')}</option>
                        <option value="Turismo & Hospitalidade">{t('Turismo & Hospitalidade', 'Tourism & Hospitality', 'Turismo y Hospitalidad')}</option>
                        <option value="Educação & EdTech">{t('Educação & EdTech', 'Education & EdTech', 'Educación y EdTech')}</option>
                        <option value="outro">{t('Outro (especificar)', 'Other (specify)', 'Otro (especificar)')}</option>
                      </select>
                    </div>

                    {selectedSector === 'outro' && (
                      <motion.div 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-2"
                      >
                        <label className="text-xs font-bold text-[var(--color-gold)] uppercase tracking-wider">{t('Especifique o Setor', 'Specify Sector', 'Especifique el Sector')}</label>
                        <input 
                          name="sectorOther"
                          type="text" 
                          required
                          placeholder={t('Digite o setor da sua empresa', 'Enter your company sector', 'Ingrese el sector de su empresa')}
                          className="w-full px-4 py-4 bg-white border-2 border-[var(--color-gold)]/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--color-gold)]/50 focus:border-[var(--color-gold)] transition-all font-body text-sm shadow-sm"
                        />
                      </motion.div>
                    )}
                  </div>

                  {/* Website */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-[var(--color-navy)] uppercase tracking-wider">{t('Website Principal', 'Main Website', 'Sitio Web Principal')}</label>
                    <input 
                      name="website"
                      type="text" 
                      placeholder={t('www.empresa.com', 'www.company.com', 'www.empresa.com')}
                      className="w-full px-4 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--color-gold)]/50 focus:border-[var(--color-gold)] transition-all font-body text-sm"
                    />
                  </div>
                </div>

                <div className="h-[1px] bg-gray-100 my-8" />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Nome Responsável */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-[var(--color-navy)] uppercase tracking-wider">{t('Nome do Contato', 'Contact Name', 'Nombre de Contacto')}</label>
                    <div className="relative">
                      <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                      <input 
                        name="responsibleName"
                        type="text" 
                        required
                        placeholder={t('Nome Completo', 'Full Name', 'Nombre Completo')}
                        className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--color-gold)]/50 focus:border-[var(--color-gold)] transition-all font-body text-sm"
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-[var(--color-navy)] uppercase tracking-wider">{t('E-mail Corporativo', 'Corporate Email', 'Correo Electrónico Corporativo')}</label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                      <input 
                        name="email"
                        type="email" 
                        required
                        placeholder={t('contato@empresa.com', 'contact@company.com', 'contacto@empresa.com')}
                        className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--color-gold)]/50 focus:border-[var(--color-gold)] transition-all font-body text-sm"
                      />
                    </div>
                  </div>

                  {/* Telefone com DDI, DDD e Número Separados */}
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-xs font-bold text-[var(--color-navy)] uppercase tracking-wider">{t('Telefone / WhatsApp (Obrigatório)', 'Phone / WhatsApp (Required)', 'Teléfono / WhatsApp (Obligatorio)')}</label>
                    <div className="flex gap-3">
                      <div className="relative w-20">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs font-bold">+</span>
                        <input 
                          name="ddi"
                          type="text" 
                          required
                          maxLength={4}
                          placeholder="55"
                          className="w-full pl-6 pr-2 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--color-gold)]/50 focus:border-[var(--color-gold)] transition-all font-body text-sm text-center"
                        />
                      </div>
                      <div className="relative w-20">
                        <input 
                          name="ddd"
                          type="text" 
                          required
                          maxLength={3}
                          placeholder="DDD"
                          className="w-full px-2 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--color-gold)]/50 focus:border-[var(--color-gold)] transition-all font-body text-sm text-center"
                        />
                      </div>
                      <div className="relative flex-1">
                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input 
                          name="phone"
                          type="tel" 
                          required
                          placeholder="99999-9999"
                          className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--color-gold)]/50 focus:border-[var(--color-gold)] transition-all font-body text-sm"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Descrição Curta (Obrigatório para o Banco) */}
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-xs font-bold text-[var(--color-navy)] uppercase tracking-wider">{t('Descrição do Negócio / Objetivos', 'Business Description / Objectives', 'Descripción del Negocio / Objetivos')}</label>
                    <textarea 
                      name="description"
                      required
                      placeholder={t('Conte-nos brevemente sobre sua atuação e o que busca neste Ecossistema...', 'Tell us briefly about your activities and what you are looking for in this Ecosystem...', 'Cuéntenos brevemente sobre sus actividades y lo que busca en este Ecosistema...')}
                      rows={4}
                      className="w-full px-4 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--color-gold)]/50 focus:border-[var(--color-gold)] transition-all font-body text-sm resize-none"
                    ></textarea>
                  </div>
                </div>

                <div className="h-[1px] bg-gray-100 my-8" />

                {/* Redes Sociais */}
                <div className="space-y-6">
                  <label className="text-xs font-bold text-[var(--color-navy)] uppercase tracking-wider flex items-center gap-2">
                    <Globe size={14} className="text-[var(--color-gold)]" />
                    {t('Redes Sociais da Empresa (Opcional)', 'Company Social Media (Optional)', 'Redes Sociales de la Empresa (Opcional)')}
                  </label>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="relative">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 flex items-center justify-center">
                        <svg className="w-4 h-4 text-gray-400 fill-current" viewBox="0 0 24 24">
                          <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                        </svg>
                      </div>
                      <input 
                        name="linkedin"
                        type="text" 
                        placeholder={t('LinkedIn (URL ou link)', 'LinkedIn (URL or link)', 'LinkedIn (URL o enlace)')}
                        className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--color-gold)]/50 focus:border-[var(--color-gold)] transition-all font-body text-sm"
                      />
                    </div>
                    
                    <div className="relative">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 flex items-center justify-center">
                        <svg className="w-4 h-4 text-gray-400 fill-current" viewBox="0 0 24 24">
                          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                        </svg>
                      </div>
                      <input 
                        name="instagram"
                        type="text" 
                        placeholder={t('Instagram (link ou @user)', 'Instagram (link or @user)', 'Instagram (enlace o @user)')}
                        className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--color-gold)]/50 focus:border-[var(--color-gold)] transition-all font-body text-sm"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-4">
                  <button 
                    type="submit" 
                    disabled={loading}
                    className="w-full py-5 bg-[var(--color-navy)] text-white font-bold rounded-2xl hover:bg-black transition-all flex items-center justify-center gap-3 shadow-xl group border border-white/10"
                  >
                    {loading ? (
                      <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        <span>{t('Enviar Pedido de Ingresso', 'Send Entry Request', 'Enviar Solicitud de Ingreso')}</span>
                        <Send size={20} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" />
                      </>
                    )}
                  </button>
                  <p className="text-center text-[10px] text-gray-400 mt-4 uppercase tracking-[0.2em] font-medium">
                    {t(
                      'Ao enviar, você concorda com nossos termos de curadoria e privacidade.',
                      'By sending, you agree to our curation and privacy terms.',
                      'Al enviar, usted acepta nuestros términos de curaduría y privacidad.'
                    )}
                  </p>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </main>
  )
}

'use client'

import React, { useState } from 'react'
import { addProduct, deleteProduct, updateProduct } from '@/lib/actions/products'
import { uploadImage } from '@/lib/actions/upload'
import { 
  Package, Plus, Trash2, CheckCircle2, Truck, Zap, ShieldCheck, Leaf,
  Box, Scale, Clock, X, Save, Upload, Image as ImageIcon, Edit2,
  Sparkles
} from 'lucide-react'
import { translateSingleText } from '@/lib/actions/translation'
import { cn } from '@/lib/utils'
import { toast } from 'react-hot-toast'

interface ProductManagerProps {
  companyId: string
  products: any[]
}

export default function ProductManager({ companyId, products }: ProductManagerProps) {
  const [isAdding, setIsAdding] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [isTranslatingAll, setIsTranslatingAll] = useState(false)
  
  // State para upload de imagem do produto
  const [productImageUrl, setProductImageUrl] = useState('')
  const [productImagePreview, setProductImagePreview] = useState('')
  const [editingProduct, setEditingProduct] = useState<any>(null)
  const [productType, setProductType] = useState<'PRODUCT' | 'SERVICE'>('PRODUCT')

  const handleProductImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setProductImageUrl('') // Limpa a URL antiga imediatamente
    const reader = new FileReader()
    reader.onloadend = () => setProductImagePreview(reader.result as string)
    reader.readAsDataURL(file)

    setIsUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      const result = await uploadImage(formData)
      if (result.success && result.url) {
        setProductImageUrl(result.url)
      } else {
        alert(result.error || 'Erro no upload da imagem')
      }
    } catch (err) {
      console.error('Upload error:', err)
      alert('Erro crítico no upload')
    } finally {
      setIsUploading(false)
    }
  }

  const handleSaveProduct = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSaving(true)

    try {
      const formData = new FormData(e.currentTarget)
      const data = Object.fromEntries(formData.entries())

      // Validação Manual
      if (!data.title) {
        alert('Por favor, informe o título do produto.')
        setIsSaving(false)
        return
      }
      if (!data.description) {
        alert('Por favor, informe a descrição do produto.')
        setIsSaving(false)
        return
      }

      // Validar se a imagem foi carregada se o usuário tentou subir uma
      if (productImagePreview && !productImageUrl && !editingProduct?.imageUrl) {
        alert('Aguarde o upload da imagem terminar antes de salvar.')
        setIsSaving(false)
        return
      }

      const productData = {
        companyId,
        title: data.title as string,
        title_en: data.title_en as string,
        title_es: data.title_es as string,
        description: data.description as string,
        description_en: data.description_en as string,
        description_es: data.description_es as string,
        imageUrl: (data.imageUrl as string) || productImageUrl || editingProduct?.imageUrl || '',
        category: data.category as string,
        isReadyToShip: data.isReadyToShip === 'on',
        isLowMOQ: data.isLowMOQ === 'on',
        isCertified: data.isCertified === 'on',
        isSustainable: data.isSustainable === 'on',
        moq: data.moq as string,
        incoterms: data.incoterms as string,
        leadTime: data.leadTime as string,
        portOfOrigin: data.portOfOrigin as string,
        productionCapacity: data.productionCapacity as string,
        type: productType,
      }

      const result = editingProduct 
        ? await updateProduct(editingProduct.id, productData)
        : await addProduct(productData)

      if (result.success) {
        setIsAdding(false)
        setEditingProduct(null)
        setProductImageUrl('')
        setProductImagePreview('')
        window.location.reload()
      } else {
        alert(result.error)
      }
    } catch (err) {
      console.error('Save error:', err)
      alert('Erro ao salvar produto')
    } finally {
      setIsSaving(false)
    }
  }

  const handleEditClick = (product: any) => {
    setEditingProduct(product)
    setProductImageUrl(product.imageUrl || '')
    setProductImagePreview(product.imageUrl || '')
    setProductType(product.type || 'PRODUCT')
    setIsAdding(true)
    
    // Scroll suave para o formulário
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleCancel = () => {
    setIsAdding(false)
    setEditingProduct(null)
    setProductImageUrl('')
    setProductImagePreview('')
    setProductType('PRODUCT')
    setIsSaving(false)
    setIsUploading(false)
  }

  const handleTranslateAllItems = async () => {
    if (products.length === 0) return
    if (!confirm(`Deseja traduzir automaticamente os títulos e descrições de todos os ${products.length} itens para EN e ES?`)) return
    
    setIsTranslatingAll(true)
    const toastId = toast.loading('Traduzindo catálogo...')
    try {
      let successCount = 0
      for (const product of products) {
        const updates: any = {}
        
        // Título
        if (!product.title_en) {
          const res = await translateSingleText(product.title, 'en-US')
          if (res.success) {
            updates.title_en = res.text
          } else if (res.error === 'DEEPL_API_KEY_MISSING') {
            toast.error('Chave do DeepL não configurada. Verifique o arquivo .env', { id: toastId })
            setIsTranslatingAll(false)
            return
          }
        }
        if (!product.title_es) {
          const res = await translateSingleText(product.title, 'es')
          if (res.success) updates.title_es = res.text
        }
        
        // Descrição
        if (!product.description_en) {
          const res = await translateSingleText(product.description, 'en-US')
          if (res.success) updates.description_en = res.text
        }
        if (!product.description_es) {
          const res = await translateSingleText(product.description, 'es')
          if (res.success) updates.description_es = res.text
        }
        
        if (Object.keys(updates).length > 0) {
          const res = await updateProduct(product.id, { ...product, ...updates, companyId })
          if (res.success) successCount++
        }
      }
      
      toast.success(`${successCount} itens traduzidos com sucesso!`, { id: toastId })
      setTimeout(() => window.location.reload(), 1500)
    } catch (err) {
      console.error('Translate all items error:', err)
      toast.error('Erro ao traduzir o catálogo.', { id: toastId })
    } finally {
      setIsTranslatingAll(false)
    }
  }

  const inputClasses = "w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[var(--color-gold)] transition-all"
  const labelClasses = "block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1.5 ml-1"

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-gray-100 pb-4">
        <div>
          <h2 className="text-lg font-bold text-[var(--color-navy)] flex items-center gap-2">
            <Package size={20} className="text-[var(--color-gold)]" />
            Catálogo de Produtos e Serviços
          </h2>
          <p className="text-xs text-gray-500">Gerencie os itens da vitrine desta empresa.</p>
        </div>
        <div className="flex items-center gap-3">
          {products.length > 0 && !isAdding && (
            <button 
              onClick={handleTranslateAllItems}
              disabled={isTranslatingAll}
              className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg text-xs font-bold hover:bg-blue-100 transition-all disabled:opacity-50"
            >
              {isTranslatingAll ? (
                <div className="w-3.5 h-3.5 border-2 border-blue-600/30 border-t-blue-600 rounded-full animate-spin" />
              ) : <Sparkles size={14} />}
              {isTranslatingAll ? 'Traduzindo...' : 'Traduzir Catálogo'}
            </button>
          )}
          {!isAdding && (
            <button 
              onClick={() => setIsAdding(true)}
              className="flex items-center gap-2 px-4 py-2 bg-[var(--color-gold)] text-white rounded-lg text-sm font-bold hover:bg-[#b88d4d] transition-all"
            >
              <Plus size={18} />
              Adicionar Item
            </button>
          )}
        </div>
      </div>

      {/* FORMULÁRIO DE EDIÇÃO/ADIÇÃO (INLINE) */}
      {isAdding && (
        <form key={editingProduct ? editingProduct.id : 'new'} onSubmit={handleSaveProduct} className="bg-gray-50 p-6 rounded-2xl border border-gray-200 space-y-6 animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-[var(--color-navy)] text-sm">
              {editingProduct ? `Editando: ${editingProduct.title}` : 'Novo Item no Catálogo'}
            </h3>
            <div className="flex bg-white p-1 rounded-xl border border-gray-200 shadow-sm">
              <button 
                type="button" 
                onClick={() => setProductType('PRODUCT')}
                className={cn(
                  "px-4 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all",
                  productType === 'PRODUCT' ? "bg-[var(--color-navy)] text-white shadow-md" : "text-gray-400 hover:text-gray-600"
                )}
              >
                Produto
              </button>
              <button 
                type="button" 
                onClick={() => setProductType('SERVICE')}
                className={cn(
                  "px-4 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all",
                  productType === 'SERVICE' ? "bg-[var(--color-gold)] text-white shadow-md" : "text-gray-400 hover:text-gray-600"
                )}
              >
                Serviço
              </button>
            </div>
            <button type="button" onClick={handleCancel} className="text-gray-400 hover:text-gray-600">
              <X size={20} />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* UPLOAD IMAGEM PRODUTO */}
            <div className="space-y-1 md:col-span-2">
              <label className={labelClasses}>Foto do Produto</label>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-lg bg-white border border-gray-200 flex items-center justify-center overflow-hidden shrink-0">
                  {productImagePreview ? (
                    <img 
                      src={productImagePreview} 
                      className="w-full h-full object-cover" 
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                        setProductImagePreview('');
                      }}
                    />
                  ) : (
                    <ImageIcon className="text-gray-200" size={24} />
                  )}
                </div>
                <label className={cn(
                  "flex-1 flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed rounded-xl text-xs font-bold transition-all cursor-pointer",
                  productImageUrl 
                    ? "bg-green-50 border-green-200 text-green-600" 
                    : "bg-white border-gray-200 text-gray-400 hover:border-[var(--color-gold)] hover:text-[var(--color-gold)]"
                )}>
                  {isUploading ? (
                    <div className="w-4 h-4 border-2 border-green-600/30 border-t-green-600 rounded-full animate-spin" />
                  ) : productImageUrl ? (
                    <CheckCircle2 size={16} />
                  ) : (
                    <Upload size={16} />
                  )}
                  <span>
                    {isUploading ? 'Enviando...' : productImageUrl ? 'Foto Pronta ✓' : 'Carregar Foto'}
                  </span>
                  <input type="file" className="hidden" accept="image/*" onChange={handleProductImageChange} disabled={isUploading || isSaving} />
                </label>
                {/* Campo oculto para garantir que a URL seja enviada no FormData */}
                <input type="hidden" name="imageUrl" value={productImageUrl} />
              </div>
            </div>

            <div className="space-y-4 md:col-span-2">
              <div className="space-y-1">
                <label className={labelClasses}>Título do Produto (PT)</label>
                <input name="title" id="productTitle" defaultValue={editingProduct?.title} className={inputClasses} placeholder="Ex: Soja Orgânica Premium" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1 relative">
                  <label className={labelClasses}>Título em Inglês (EN)</label>
                  <input name="title_en" id="productTitle_en" defaultValue={editingProduct?.title_en} className={cn(inputClasses, "pr-10")} placeholder="English title" />
                  <button 
                    type="button" 
                    onClick={async (e) => {
                      const btn = e.currentTarget
                      const text = (document.getElementById('productTitle') as HTMLInputElement).value
                      if (!text) {
                        toast.error('Preencha o título original primeiro')
                        return
                      }
                      
                      btn.classList.add('animate-spin')
                      const res = await translateSingleText(text, 'en-US')
                      
                      if (res.success) {
                        (document.getElementById('productTitle_en') as HTMLInputElement).value = res.text || ''
                        toast.success('Traduzido!')
                      } else {
                        if (res.error === 'DEEPL_API_KEY_MISSING') {
                          toast.error('Chave do DeepL não configurada')
                        } else {
                          toast.error('Erro na tradução')
                        }
                      }
                      btn.classList.remove('animate-spin')
                    }} 
                    className="absolute right-2 top-[34px] p-2 bg-blue-50 text-blue-500 hover:bg-blue-100 rounded-lg transition-all border border-blue-100 shadow-sm"
                  >
                    <Sparkles size={14} />
                  </button>
                </div>
                <div className="space-y-1 relative">
                  <label className={labelClasses}>Título em Espanhol (ES)</label>
                  <input name="title_es" id="productTitle_es" defaultValue={editingProduct?.title_es} className={cn(inputClasses, "pr-10")} placeholder="Título en español" />
                  <button 
                    type="button" 
                    onClick={async (e) => {
                      const btn = e.currentTarget
                      const text = (document.getElementById('productTitle') as HTMLInputElement).value
                      if (!text) {
                        toast.error('Preencha o título original primeiro')
                        return
                      }
                      
                      btn.classList.add('animate-spin')
                      const res = await translateSingleText(text, 'es')
                      
                      if (res.success) {
                        (document.getElementById('productTitle_es') as HTMLInputElement).value = res.text || ''
                        toast.success('Traduzido!')
                      } else {
                        if (res.error === 'DEEPL_API_KEY_MISSING') {
                          toast.error('Chave do DeepL não configurada')
                        } else {
                          toast.error('Erro na tradução')
                        }
                      }
                      btn.classList.remove('animate-spin')
                    }} 
                    className="absolute right-2 top-[34px] p-2 bg-amber-50 text-amber-500 hover:bg-amber-100 rounded-lg transition-all border border-amber-100 shadow-sm"
                  >
                    <Sparkles size={14} />
                  </button>
                </div>
              </div>
            </div>

            <div className="space-y-1">
              <label className={labelClasses}>Categoria</label>
              <input name="category" defaultValue={editingProduct?.category} className={inputClasses} placeholder="Ex: Grãos" />
            </div>

            <div className="space-y-4 md:col-span-2 pt-2 border-t border-gray-100">
              <div className="space-y-1">
                <label className={labelClasses}>Descrição Curta (PT)</label>
                <textarea name="description" id="productDesc" defaultValue={editingProduct?.description} className={cn(inputClasses, "min-h-[80px] resize-none")} placeholder="Detalhes técnicos e diferenciais..." />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1 relative">
                  <label className={labelClasses}>Descrição em Inglês (EN)</label>
                  <textarea name="description_en" id="productDesc_en" defaultValue={editingProduct?.description_en} className={cn(inputClasses, "min-h-[70px] resize-none pr-10")} placeholder="English description" />
                  <button 
                    type="button" 
                    onClick={async (e) => {
                      const btn = e.currentTarget
                      const text = (document.getElementById('productDesc') as HTMLTextAreaElement).value
                      if (!text) {
                        toast.error('Preencha a descrição original primeiro')
                        return
                      }
                      
                      btn.classList.add('animate-spin')
                      const res = await translateSingleText(text, 'en-US')
                      
                      if (res.success) {
                        (document.getElementById('productDesc_en') as HTMLTextAreaElement).value = res.text || ''
                        toast.success('Traduzido!')
                      } else {
                        if (res.error === 'DEEPL_API_KEY_MISSING') {
                          toast.error('Chave do DeepL não configurada')
                        } else {
                          toast.error('Erro na tradução')
                        }
                      }
                      btn.classList.remove('animate-spin')
                    }} 
                    className="absolute right-2 top-[34px] p-2 bg-blue-50 text-blue-500 hover:bg-blue-100 rounded-lg transition-all border border-blue-100 shadow-sm"
                  >
                    <Sparkles size={14} />
                  </button>
                </div>
                <div className="space-y-1 relative">
                  <label className={labelClasses}>Descrição em Espanhol (ES)</label>
                  <textarea name="description_es" id="productDesc_es" defaultValue={editingProduct?.description_es} className={cn(inputClasses, "min-h-[70px] resize-none pr-10")} placeholder="Descripción en español" />
                  <button 
                    type="button" 
                    onClick={async (e) => {
                      const btn = e.currentTarget
                      const text = (document.getElementById('productDesc') as HTMLTextAreaElement).value
                      if (!text) {
                        toast.error('Preencha a descrição original primeiro')
                        return
                      }
                      
                      btn.classList.add('animate-spin')
                      const res = await translateSingleText(text, 'es')
                      
                      if (res.success) {
                        (document.getElementById('productDesc_es') as HTMLTextAreaElement).value = res.text || ''
                        toast.success('Traduzido!')
                      } else {
                        if (res.error === 'DEEPL_API_KEY_MISSING') {
                          toast.error('Chave do DeepL não configurada')
                        } else {
                          toast.error('Erro na tradução')
                        }
                      }
                      btn.classList.remove('animate-spin')
                    }} 
                    className="absolute right-2 top-[34px] p-2 bg-amber-50 text-amber-500 hover:bg-amber-100 rounded-lg transition-all border border-amber-100 shadow-sm"
                  >
                    <Sparkles size={14} />
                  </button>
                </div>
              </div>
            </div>
          </div>
          {/* BADGES B2B */}
          <div className="space-y-3">
            <label className={labelClasses}>Diferenciais B2B (Selo)</label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { id: 'isReadyToShip', label: 'Pronta Entrega', icon: Truck, color: 'text-blue-600' },
                { id: 'isLowMOQ', label: 'Baixo MOQ', icon: Zap, color: 'text-amber-500' },
                { id: 'isCertified', label: 'Certificado', icon: ShieldCheck, color: 'text-green-600' },
                { id: 'isSustainable', label: 'Sustentável', icon: Leaf, color: 'text-emerald-600' },
              ].map((badge) => (
                <label key={badge.id} className="flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-xl cursor-pointer hover:border-[var(--color-gold)] transition-all">
                  <input 
                    type="checkbox" 
                    name={badge.id} 
                    defaultChecked={editingProduct?.[badge.id]}
                    className="w-4 h-4 rounded border-gray-300 text-[var(--color-gold)] focus:ring-[var(--color-gold)]" 
                  />
                  <div className={cn("flex items-center gap-2 text-xs font-bold", badge.color)}>
                    <badge.icon size={14} />
                    {badge.label}
                  </div>
                </label>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-gray-200">
            <div className="space-y-1">
              <label className={labelClasses}>
                {productType === 'SERVICE' ? 'SLA / Horas Mínimas' : 'MOQ (Qtd Mínima)'}
              </label>
              <div className="relative flex items-center">
                <input name="moq" defaultValue={editingProduct?.moq} className={inputClasses} style={{ paddingLeft: '3.5rem' }} placeholder={productType === 'SERVICE' ? "Ex: 20 horas/mês" : "Ex: 500 Unid."} />
                <div className="absolute left-4 flex items-center justify-center pointer-events-none">
                  <Box className="text-gray-400" size={16} />
                </div>
              </div>
            </div>

            {productType === 'PRODUCT' && (
              <div className="space-y-1 animate-in fade-in zoom-in-95 duration-300">
                <label className={labelClasses}>Incoterms</label>
                <div className="relative flex items-center">
                  <input name="incoterms" defaultValue={editingProduct?.incoterms} className={inputClasses} style={{ paddingLeft: '3.5rem' }} placeholder="Ex: FOB, CIF" />
                  <div className="absolute left-4 flex items-center justify-center pointer-events-none">
                    <Scale className="text-gray-400" size={16} />
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-1">
              <label className={labelClasses}>
                {productType === 'SERVICE' ? 'Prazo de Execução' : 'Lead Time (Prazo)'}
              </label>
              <div className="relative flex items-center">
                <input name="leadTime" defaultValue={editingProduct?.leadTime} className={inputClasses} style={{ paddingLeft: '3.5rem' }} placeholder={productType === 'SERVICE' ? "Ex: 5 dias úteis" : "Ex: 15 dias"} />
                <div className="absolute left-4 flex items-center justify-center pointer-events-none">
                  <Clock className="text-gray-400" size={16} />
                </div>
              </div>
            </div>

            <div className="space-y-1">
              <label className={labelClasses}>
                {productType === 'SERVICE' ? 'Local de Prestação' : 'Porto de Origem'}
              </label>
              <div className="relative flex items-center">
                <input name="portOfOrigin" defaultValue={editingProduct?.portOfOrigin} className={inputClasses} style={{ paddingLeft: '3.5rem' }} placeholder={productType === 'SERVICE' ? "Ex: Global / Remoto" : "Ex: Porto de Santos"} />
                <div className="absolute left-4 flex items-center justify-center pointer-events-none">
                  <Truck className="text-gray-400" size={16} />
                </div>
              </div>
            </div>
            
            <div className="space-y-1">
              <label className={labelClasses}>
                {productType === 'SERVICE' ? 'Capacidade de Atendimento' : 'Capacidade Mensal'}
              </label>
              <div className="relative flex items-center">
                <input name="productionCapacity" defaultValue={editingProduct?.productionCapacity} className={inputClasses} style={{ paddingLeft: '3.5rem' }} placeholder={productType === 'SERVICE' ? "Ex: 10 projetos/mês" : "Ex: 50 Toneladas"} />
                <div className="absolute left-4 flex items-center justify-center pointer-events-none">
                  <Zap className="text-gray-400" size={16} />
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button 
              type="button" 
              onClick={handleCancel}
              className="px-6 py-2.5 text-sm font-bold text-gray-500 hover:text-gray-700 transition-colors"
            >
              Cancelar
            </button>
            <button 
              type="submit" 
              disabled={isSaving || isUploading}
              className="flex items-center gap-2 px-8 py-2.5 bg-[var(--color-navy)] text-white rounded-xl text-sm font-bold hover:bg-[#002266] transition-all disabled:opacity-50 shadow-md"
            >
              {isSaving ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save size={16} />}
              {isSaving ? 'Salvando...' : (editingProduct ? 'Atualizar Item' : 'Salvar Item')}
            </button>
          </div>
        </form>
      )}

      {/* LISTA DE PRODUTOS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {products.length > 0 ? (
          products.map((product) => (
            <div key={product.id} className="bg-white border border-gray-100 rounded-2xl p-4 flex gap-4 hover:shadow-md transition-all group">
              <div className="w-20 h-20 bg-gray-50 rounded-xl overflow-hidden flex-shrink-0 border border-gray-100">
                {product.imageUrl ? (
                  <img 
                    src={product.imageUrl} 
                    alt={product.title} 
                    className="w-full h-full object-cover" 
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://placehold.co/400x400/f3f4f6/9ca3af?text=Sem+Foto';
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-300">
                    <Package size={32} />
                  </div>
                )}
              </div>
              <div className="flex-1 space-y-1">
                <div className="flex items-start justify-between">
                  <h4 className="font-bold text-[var(--color-navy)] text-sm">{product.title}</h4>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button 
                      onClick={() => handleEditClick(product)}
                      className="p-1.5 text-gray-400 hover:text-[var(--color-navy)] hover:bg-gray-100 rounded-lg transition-all"
                      title="Editar"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button 
                      onClick={async () => {
                        if (confirm('Excluir este item?')) {
                          await deleteProduct(product.id, companyId)
                          window.location.reload()
                        }
                      }}
                      className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                      title="Excluir"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
                <p className="text-[10px] text-gray-500 line-clamp-2">{product.description}</p>
                <div className="flex flex-wrap gap-1.5 pt-2">
                  {product.type === 'SERVICE' && <span className="px-1.5 py-0.5 bg-purple-50 text-purple-600 rounded text-[8px] font-bold">SERVIÇO</span>}
                  {product.isReadyToShip && <span className="px-1.5 py-0.5 bg-blue-50 text-blue-600 rounded text-[8px] font-bold">READY</span>}
                  {product.isLowMOQ && <span className="px-1.5 py-0.5 bg-amber-50 text-amber-600 rounded text-[8px] font-bold">MOQ</span>}
                  {product.isCertified && <span className="px-1.5 py-0.5 bg-green-50 text-green-600 rounded text-[8px] font-bold">CERT</span>}
                  {product.isSustainable && <span className="px-1.5 py-0.5 bg-emerald-50 text-emerald-600 rounded text-[8px] font-bold">ECO</span>}
                </div>
              </div>
            </div>
          ))
        ) : !isAdding && (
          <div className="col-span-full py-12 text-center bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
            <Package size={40} className="mx-auto text-gray-300 mb-2 opacity-50" />
            <p className="text-sm font-medium text-gray-400">Nenhum item cadastrado ainda.</p>
            <button 
              onClick={() => setIsAdding(true)}
              className="mt-2 text-xs font-bold text-[var(--color-gold)] hover:underline"
            >
              Começar Catálogo
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

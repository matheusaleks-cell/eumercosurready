'use client'

import React, { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { Tag, Plus, Trash2, Zap, AlertCircle, CheckCircle2, Search } from 'lucide-react'
import { getSectors, createSector, deleteSector, seedInitialSectors } from '@/lib/actions/sectors'
import { cn } from '@/lib/utils'
import { IconRenderer } from '@/components/ui/IconRenderer'

export default function SectorsPage() {
  const [sectors, setSectors] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [isAdding, setIsAdding] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [message, setMessage] = useState({ type: '', text: '' })

  useEffect(() => {
    loadSectors()
  }, [])

  async function loadSectors() {
    setLoading(true)
    const result = await getSectors()
    if (result.success) {
      setSectors(result.sectors || [])
    }
    setLoading(false)
  }

  async function handleAddSector(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setMessage({ type: '', text: '' })
    const formData = new FormData(e.currentTarget)
    const name = formData.get('name') as string
    const icon = formData.get('icon') as string
    const description = formData.get('description') as string

    const result = await createSector({ name, icon, description })
    if (result.success) {
      setIsAdding(false)
      setSelectedIcon('')
      loadSectors()
      setMessage({ type: 'success', text: 'Setor criado com sucesso!' })
    } else {
      setMessage({ type: 'error', text: result.error || 'Erro ao criar setor' })
    }
  }

  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [selectedIcon, setSelectedIcon] = useState('')
  const suggestedIcons = [
    'Building2', 'Briefcase', 'Globe', 'Package', 'Truck', 'Ship', 'Plane', 
    'Cpu', 'Zap', 'Wheat', 'Sprout', 'Activity', 'Scale', 'Gavel', 
    'BarChart3', 'Database', 'ShieldCheck', 'Leaf', 'Mail', 'Smartphone', 'Utensils', 'GraduationCap', 'Sun', 'Settings2', 'Pickaxe', 'Shirt'
  ]

  async function handleDelete(id: string) {
    if (deletingId !== id) {
      setDeletingId(id)
      return
    }
    setDeletingId(null)
    const toastId = toast.loading('Removendo setor...')
    const result = await deleteSector(id)
    if (result.success) {
      loadSectors()
      toast.success('Setor removido!', { id: toastId })
    } else {
      toast.error(result.error || 'Erro ao remover', { id: toastId })
    }
  }

  async function handleSeed() {
    setLoading(true)
    const result = await seedInitialSectors()
    if (result.success) {
      loadSectors()
      setMessage({ type: 'success', text: 'Base de setores sincronizada com sucesso!' })
    } else {
      setMessage({ type: 'error', text: result.error || 'Erro ao popular base' })
    }
    setLoading(false)
  }

  const filteredSectors = sectors.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.slug.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-6 admin-theme animate-in fade-in duration-500">
      {/* Header Compacto */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-[var(--color-navy)] flex items-center gap-2">
            <Tag className="text-[var(--color-gold)]" size={24} />
            Gerenciamento de Setores
          </h1>
          <p className="text-xs text-gray-500">Controle as categorias de mercado do ecossistema.</p>
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
            onClick={() => setIsAdding(true)}
            className="flex items-center gap-2 px-4 py-2 bg-[var(--color-navy)] text-white text-[10px] font-black uppercase tracking-widest hover:bg-[#002266] transition-all"
          >
            <Plus size={14} />
            Novo Setor
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
        <form onSubmit={handleAddSector} className="bg-white p-5 border border-gray-200 space-y-5 animate-in slide-in-from-top-2">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <h2 className="text-xs font-black uppercase tracking-widest text-gray-400">Novo Registro de Setor</h2>
            <button type="button" onClick={() => setIsAdding(false)} className="text-[10px] font-bold text-gray-400 hover:text-red-500">FECHAR</button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="text-[9px] font-black text-gray-400 uppercase tracking-tighter ml-1">Nome</label>
              <input name="name" required className="w-full bg-gray-50 border border-gray-200 px-3 py-1.5 text-xs focus:outline-none focus:border-[var(--color-gold)]" placeholder="Ex: Agronegócio" />
            </div>
            
            <div className="space-y-1">
              <label className="text-[9px] font-black text-gray-400 uppercase tracking-tighter ml-1">Ícone (Lucide)</label>
              <div className="relative">
                <input 
                  name="icon" 
                  value={selectedIcon}
                  onChange={(e) => setSelectedIcon(e.target.value)}
                  required 
                  className="w-full bg-gray-50 border border-gray-200 px-3 py-1.5 text-xs focus:outline-none focus:border-[var(--color-gold)]" 
                  placeholder="Ex: Wheat" 
                />
                {selectedIcon && (
                  <div className="absolute right-2 top-1/2 -translate-y-1/2 text-[var(--color-gold)]">
                    <IconRenderer name={selectedIcon} size={14} />
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[9px] font-black text-gray-400 uppercase tracking-tighter ml-1">Descrição Curta</label>
              <input name="description" className="w-full bg-gray-50 border border-gray-200 px-3 py-1.5 text-xs focus:outline-none focus:border-[var(--color-gold)]" placeholder="Descrição opcional..." />
            </div>
          </div>

          <div className="flex items-center justify-between pt-2">
             <div className="flex flex-wrap gap-1 max-w-lg">
                {suggestedIcons.map(icon => (
                  <button key={icon} type="button" onClick={() => setSelectedIcon(icon)} className={cn("p-1.5 border transition-all", selectedIcon === icon ? "border-[var(--color-gold)] bg-amber-50" : "border-gray-100 bg-gray-50")}>
                    <IconRenderer name={icon} size={14} />
                  </button>
                ))}
             </div>
             <button type="submit" className="px-6 py-2 bg-[var(--color-gold)] text-white text-[10px] font-black uppercase tracking-widest hover:bg-[#b88d4d] transition-all">Salvar Registro</button>
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
            Total: {filteredSectors.length} Categorias
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-100/80 border-b border-gray-200">
                <th className="px-4 py-2 text-[9px] font-black text-gray-500 uppercase tracking-widest w-12 text-center">Ícone</th>
                <th className="px-4 py-2 text-[9px] font-black text-gray-500 uppercase tracking-widest">Nome / Identificador (Slug)</th>
                <th className="px-4 py-2 text-[9px] font-black text-gray-500 uppercase tracking-widest">Descrição</th>
                <th className="px-4 py-2 text-[9px] font-black text-gray-500 uppercase tracking-widest text-center">Empresas</th>
                <th className="px-4 py-2 text-[9px] font-black text-gray-500 uppercase tracking-widest text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan={5} className="px-4 py-4"><div className="h-3 bg-gray-50 rounded w-full"></div></td>
                  </tr>
                ))
              ) : filteredSectors.map((sector) => (
                <tr key={sector.id} className="hover:bg-blue-50/20 transition-colors group">
                  <td className="px-4 py-2 text-center">
                    <div className="flex justify-center text-gray-400 group-hover:text-[var(--color-gold)]">
                      <IconRenderer name={sector.icon} size={18} />
                    </div>
                  </td>
                  <td className="px-4 py-2">
                    <div className="font-bold text-xs text-gray-900 leading-tight">{sector.name}</div>
                    <div className="text-[10px] text-gray-400 font-mono tracking-tighter">{sector.slug}</div>
                  </td>
                  <td className="px-4 py-2">
                    <p className="text-[10px] text-gray-500 line-clamp-1">{sector.description || 'Sem descrição cadastrada.'}</p>
                  </td>
                  <td className="px-4 py-2 text-center">
                    <span className="text-[10px] font-black text-gray-600 bg-gray-100 px-1.5 py-0.5 rounded">
                      {sector._count?.companies || 0}
                    </span>
                  </td>
                  <td className="px-4 py-2 text-right">
                    <div className="flex items-center justify-end gap-1">
                      {deletingId === sector.id ? (
                        <>
                          <span className="text-[10px] text-red-500 font-bold mr-1">Confirmar?</span>
                          <button
                            onClick={() => handleDelete(sector.id)}
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
                          onClick={() => handleDelete(sector.id)}
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

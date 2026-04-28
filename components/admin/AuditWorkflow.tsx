"use client"

import { useState, useTransition } from 'react'
import { AuditStatus } from '@prisma/client'
import { updateAuditStatus } from '@/lib/actions/analytics'
import { 
  Shield, 
  ShieldCheck, 
  ShieldAlert, 
  Check, 
  Loader2,
  X 
} from 'lucide-react'

interface AuditWorkflowProps {
  companyId: string
  currentStatus: AuditStatus
  onSuccess?: () => void
}

export default function AuditWorkflow({ companyId, currentStatus, onSuccess }: AuditWorkflowProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isPending, startTransition] = useTransition()
  const [notes, setNotes] = useState('')

  const handleUpdate = (status: AuditStatus) => {
    startTransition(async () => {
      try {
        await updateAuditStatus(companyId, status, notes)
        setIsOpen(false)
        if (onSuccess) onSuccess()
      } catch (error) {
        alert("Erro ao atualizar auditoria.")
      }
    })
  }

  const statuses = [
    { label: 'Nenhum', value: 'NONE' as AuditStatus, icon: X, color: 'text-gray-400', bg: 'bg-gray-50' },
    { label: 'Bronze (Validado)', value: 'BRONZE' as AuditStatus, icon: Shield, color: 'text-orange-600', bg: 'bg-orange-50' },
    { label: 'Prata (Entrevistado)', value: 'SILVER' as AuditStatus, icon: ShieldAlert, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Ouro (Auditado)', value: 'GOLD' as AuditStatus, icon: ShieldCheck, color: 'text-amber-600', bg: 'bg-amber-50' },
  ]

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="text-[10px] font-bold text-blue-600 hover:underline flex items-center gap-1"
      >
        {isPending ? <Loader2 className="animate-spin" size={10} /> : 'Auditar'}
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-64 bg-white border border-gray-100 shadow-2xl rounded-xl p-4 z-50 animate-in zoom-in-95 duration-200">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Nível de Auditoria</h4>
            <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-gray-600">
              <X size={14} />
            </button>
          </div>

          <div className="space-y-2">
            {statuses.map((s) => (
              <button
                key={s.value}
                onClick={() => handleUpdate(s.value)}
                disabled={isPending}
                className={`w-full flex items-center justify-between p-2 rounded-lg text-xs transition-all ${
                  currentStatus === s.value 
                  ? 'ring-1 ring-offset-1 ring-blue-500 bg-blue-50/50' 
                  : 'hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center gap-2 font-medium text-gray-700">
                  <s.icon size={14} className={s.color} />
                  {s.label}
                </div>
                {currentStatus === s.value && <Check size={12} className="text-blue-500" />}
              </button>
            ))}
          </div>

          <div className="mt-4 pt-4 border-t border-gray-50">
            <textarea
              placeholder="Notas de verificação..."
              className="w-full text-[10px] p-2 bg-gray-50 border-none rounded-lg focus:ring-1 focus:ring-blue-100 min-h-[60px] font-body"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>
        </div>
      )}
    </div>
  )
}

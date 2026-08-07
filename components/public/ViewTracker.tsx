'use client'

import { useEffect } from 'react'
import { incrementCompanyView } from '@/lib/actions/analytics'

/**
 * Dispara a contagem de visualização no cliente, uma vez por montagem.
 * Necessário porque a página de empresa usa ISR (revalidate) por performance —
 * chamar a action direto no corpo do Server Component só contaria 1 view por
 * regeneração de cache, não por visitante real.
 */
export function ViewTracker({ companyId }: { companyId: string }) {
  useEffect(() => {
    incrementCompanyView(companyId).catch(() => {})
  }, [companyId])

  return null
}

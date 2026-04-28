'use client'

import React, { useEffect, useState } from 'react'
import { getRequests } from '@/lib/actions/requests'

export const RequestBadge = () => {
  const [count, setCount] = useState<number | null>(null)

  useEffect(() => {
    async function fetchCount() {
      const result = await getRequests()
      if (result.success) {
        const pending = result.requests?.filter((r: any) => r.status === 'PENDING').length || 0
        setCount(pending)
      }
    }
    fetchCount()
    
    // Opcional: Atualizar a cada X minutos ou via polling se quiser "tempo real" sem Sockets
    const interval = setInterval(fetchCount, 60000) 
    return () => clearInterval(interval)
  }, [])

  if (count === null || count === 0) return null

  return (
    <span className="bg-[#C8943A] text-[#0B1F3A] text-[10px] font-bold px-2 py-0.5 rounded-full animate-pulse">
      {count}
    </span>
  )
}

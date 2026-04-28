'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { useLenis } from 'lenis/react'

export function ScrollReset() {
  const pathname = usePathname()
  const lenis = useLenis()

  useEffect(() => {
    if (lenis) {
      // Força o Lenis a ir para o topo imediatamente ao mudar de rota
      lenis.scrollTo(0, { immediate: true })
    } else {
      // Fallback para scroll padrão do navegador
      window.scrollTo(0, 0)
    }
  }, [pathname, lenis])

  return null
}

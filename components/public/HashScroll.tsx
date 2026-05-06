'use client'

import { useEffect } from 'react'

export function HashScroll() {
  useEffect(() => {
    const hash = window.location.hash
    if (hash) {
      // Usamos um timeout pequeno para garantir que toda a renderização 
      // (inclusive hero height e componentes client-side) tenha finalizado
      setTimeout(() => {
        const element = document.querySelector(hash)
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' })
        }
      }, 500)
    }
  }, [])

  return null
}

'use client'

import { useEffect } from 'react'

export function HashScroll() {
  useEffect(() => {
    const hash = window.location.hash
    if (hash && hash.startsWith('#')) {
      const timer = setTimeout(() => {
        try {
          const element = document.querySelector(hash)
          if (element) {
            element.scrollIntoView({ behavior: 'smooth' })
          }
        } catch (err) {
          console.warn('HashScroll target not found:', err)
        }
      }, 300)
      return () => clearTimeout(timer)
    }
  }, [])

  return null
}

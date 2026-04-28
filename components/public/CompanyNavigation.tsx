'use client'

import React, { useState, useEffect } from 'react'
import { cn } from '@/lib/utils'

interface NavItem {
  id: string
  label: string
}

export const CompanyNavigation = ({ items }: { items: NavItem[] }) => {
  const [activeSection, setActiveSection] = useState('')

  useEffect(() => {
    const handleScroll = () => {
      // Active section logic
      const offsets = items.map(item => {
        const element = document.getElementById(item.id)
        return element ? { id: item.id, offset: element.offsetTop - 160 } : null
      }).filter(Boolean) as { id: string, offset: number }[]

      const current = offsets.reverse().find(section => window.scrollY >= section.offset)
      if (current) setActiveSection(current.id)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [items])

  const scrollTo = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      window.scrollTo({
        top: element.offsetTop - 100,
        behavior: 'smooth'
      })
    }
  }

  return (
    <div className={cn(
      "w-full bg-white/90 backdrop-blur-md border-y border-gray-100 z-40 sticky top-20 shadow-sm transition-all duration-300"
    )}>
      <div className="container-custom py-4 flex items-center justify-center gap-8 md:gap-12">
        {items.map((item) => (
          <button
            key={item.id}
            onClick={() => scrollTo(item.id)}
            className={cn(
              "text-[10px] font-black uppercase tracking-widest transition-all hover:text-[var(--color-gold)]",
              activeSection === item.id ? "text-[var(--color-gold)] border-b-2 border-[var(--color-gold)] pb-1" : "text-[var(--color-navy)]"
            )}
          >
            {item.label}
          </button>
        ))}
      </div>
    </div>
  )
}

'use client'

import React, { useState } from 'react'
import { Search, X } from 'lucide-react'

export const SearchBar = () => {
  const [query, setQuery] = useState('')

  return (
    <div className="relative flex items-center w-full">
      <div className="absolute left-4 text-gray-400">
        <Search size={22} />
      </div>
      
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Buscar empresas por nome, país, setor ou tecnologia..."
        className="w-full pl-12 pr-12 py-4 bg-transparent border-none focus:ring-0 text-[var(--color-text-primary)] text-lg placeholder:text-gray-400 font-body"
      />
      
      {query && (
        <button 
          onClick={() => setQuery('')}
          className="absolute right-4 p-1 rounded-full hover:bg-gray-100 text-gray-400 transition-colors"
        >
          <X size={20} />
        </button>
      )}
    </div>
  )
}

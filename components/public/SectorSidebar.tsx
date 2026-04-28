// components/public/SectorSidebar.tsx
import React from 'react'

export const SectorSidebar = () => {
  const sectors = [
    { id: '1', name: 'Tecnologia', icon: '💻', count: 8 },
    { id: '2', name: 'Agronegócio', icon: '🌾', count: 12 },
    { id: '3', name: 'Energia', icon: '⚡', count: 5 },
    { id: '4', name: 'Logística', icon: '🚢', count: 7 },
    { id: '5', name: 'Financeiro', icon: '📊', count: 4 },
    { id: '6', name: 'Saúde', icon: '🏥', count: 6 },
    { id: '7', name: 'Indústria', icon: '🏭', count: 10 },
    { id: '8', name: 'Jurídico', icon: '⚖️', count: 3 },
  ]

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-display font-bold text-[var(--color-navy)] uppercase tracking-wider">
        Sectores
      </h3>
      
      <div className="bg-white rounded-[var(--radius-lg)] border border-[var(--color-border)] overflow-hidden">
        <div className="flex flex-col">
          {sectors.map((sector) => (
            <button
              key={sector.id}
              className="group flex items-center justify-between px-4 py-3 hover:bg-[var(--color-cream)] transition-all duration-200 border-b border-[var(--color-border)] last:border-0"
            >
              <div className="flex items-center gap-3">
                <span className="text-xl grayscale group-hover:grayscale-0 transition-all">{sector.icon}</span>
                <span className="font-body text-[var(--color-text-muted)] group-hover:text-[var(--color-navy)] font-medium">
                  {sector.name}
                </span>
              </div>
              <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full group-hover:bg-[var(--color-navy)] group-hover:text-white transition-colors">
                {sector.count}
              </span>
            </button>
          ))}
        </div>
      </div>
      
      <div className="p-6 bg-gradient-to-br from-[var(--color-navy)] to-[var(--color-navy-mid)] rounded-[var(--radius-lg)] text-white">
        <h4 className="font-display font-bold mb-2">Sua empresa aqui?</h4>
        <p className="text-sm text-gray-300 font-body mb-4">
          Faça parte da maior rede B2B Europa-Mercosul.
        </p>
        <button className="w-full py-2 bg-[var(--color-gold)] text-[var(--color-navy)] font-bold rounded-[var(--radius-md)] text-sm hover:bg-[var(--color-gold-light)] transition-colors">
          Solicitar Cadastro
        </button>
      </div>
    </div>
  )
}

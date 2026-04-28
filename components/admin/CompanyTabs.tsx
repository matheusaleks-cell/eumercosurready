'use client'

import React, { useState } from 'react'
import { Building2, Package, LayoutDashboard } from 'lucide-react'
import { cn } from '@/lib/utils'
import CompanyForm from './CompanyForm'
import ProductManager from './ProductManager'

interface CompanyTabsProps {
  sectors: { id: string, name: string }[]
  company: any
}

export default function CompanyTabs({ sectors, company }: CompanyTabsProps) {
  const [activeTab, setActiveTab] = useState<'info' | 'products'>('info')

  const tabs = [
    {
      id: 'info',
      label: 'Informações da Empresa',
      icon: Building2,
      description: 'Dados gerais, localização e branding'
    },
    {
      id: 'products',
      label: 'Catálogo de Produtos',
      icon: Package,
      description: 'Gerenciamento da vitrine de itens'
    }
  ]

  return (
    <div className="space-y-8">
      {/* Tab Navigation */}
      <div className="flex flex-wrap gap-4 p-1 bg-gray-100/50 rounded-2xl border border-gray-200/60 w-fit">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id
          const Icon = tab.icon
          
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={cn(
                "relative flex items-center gap-3 px-6 py-3.5 rounded-xl transition-all duration-300 group",
                isActive 
                  ? "bg-white text-[var(--color-navy)] shadow-sm border border-gray-200" 
                  : "text-gray-500 hover:text-gray-700 hover:bg-white/50"
              )}
            >
              <div className={cn(
                "p-2 rounded-lg transition-colors",
                isActive ? "bg-[var(--color-navy)] text-white" : "bg-gray-200 text-gray-400 group-hover:bg-gray-300 group-hover:text-gray-500"
              )}>
                <Icon size={18} />
              </div>
              <div className="text-left">
                <p className="text-sm font-bold leading-tight">{tab.label}</p>
                <p className="text-[10px] opacity-60 font-medium leading-tight">{tab.description}</p>
              </div>
              
              {isActive && (
                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-8 h-1 bg-[var(--color-gold)] rounded-full shadow-[0_0_8px_rgba(200,148,58,0.4)]" />
              )}
            </button>
          )
        })}
      </div>

      {/* Tab Content */}
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
        {activeTab === 'info' ? (
          <div className="bg-white p-8 md:p-12 rounded-[2.5rem] border border-gray-100 shadow-sm">
            <CompanyForm sectors={sectors} initialData={company} />
          </div>
        ) : (
          <div className="bg-white p-8 md:p-12 rounded-[2.5rem] border border-gray-100 shadow-sm min-h-[600px]">
            <ProductManager companyId={company.id} products={company.products} />
          </div>
        )}
      </div>
    </div>
  )
}

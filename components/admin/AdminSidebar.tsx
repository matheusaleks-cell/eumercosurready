'use client'

import React, { useState } from 'react'
import { LayoutDashboard, Building2, MessageSquare, Tag, Flag, Users, Settings, LogOut, Menu, X } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { signOut, useSession } from 'next-auth/react'
import { RequestBadge } from '@/components/admin/RequestBadge'
import { ForcePasswordChange } from '@/components/admin/ForcePasswordChange'
import { cn } from '@/lib/utils'

export function AdminSidebar() {
  const { data: session } = useSession()
  const needsPasswordChange = (session?.user as any)?.needsPasswordChange
  const username = (session?.user as any)?.username || 'Admin'
  const [isMobileOpen, setIsMobileOpen] = useState(false)

  const menuItems = [
    { label: 'Dashboard', icon: LayoutDashboard, href: '/admin/dashboard' },
    { label: 'Empresas', icon: Building2, href: '/admin/empresas' },
    { label: 'Solicitações', icon: MessageSquare, href: '/admin/solicitacoes', dynamicBadge: true },
    { label: 'Setores', icon: Tag, href: '/admin/setores' },
    { label: 'Países', icon: Flag, href: '/admin/paises' },
    { label: 'Usuários', icon: Users, href: '/admin/usuarios' },
    { label: 'Configurações', icon: Settings, href: '/admin/configuracoes' },
  ]

  return (
    <>
      {/* Botão hambúrguer — só em mobile */}
      <button
        onClick={() => setIsMobileOpen(true)}
        className="md:hidden fixed top-4 left-4 z-40 p-2.5 bg-[#0B1F3A] text-white rounded-lg shadow-lg"
        aria-label="Abrir menu"
      >
        <Menu size={20} />
      </button>

      {/* Backdrop — só em mobile, quando aberto */}
      {isMobileOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      <aside className={cn(
        "w-64 bg-[#0B1F3A] text-white flex flex-col shrink-0 fixed inset-y-0 left-0 z-50 transition-transform duration-300 md:static md:translate-x-0",
        isMobileOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="p-6">
            <div className="flex items-center justify-between mb-2 md:mb-0">
              <div className="relative w-32 h-16 overflow-hidden rounded">
                <Image
                  src="/logo-mia-white.png"
                  alt="Made In Atlantic"
                  fill
                  sizes="128px"
                  className="object-contain"
                />
              </div>
              <button
                onClick={() => setIsMobileOpen(false)}
                className="md:hidden p-2 text-gray-300 hover:text-white"
                aria-label="Fechar menu"
              >
                <X size={20} />
              </button>
            </div>

          <nav className="space-y-1">
            {menuItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => setIsMobileOpen(false)}
                className="flex items-center justify-between px-4 py-3 rounded-lg hover:bg-white/10 transition-colors text-gray-300 hover:text-white"
              >
                <div className="flex items-center gap-3">
                  <item.icon size={20} />
                  <span className="text-sm font-medium">{item.label}</span>
                </div>
                {item.dynamicBadge ? (
                  <RequestBadge />
                ) : (item as any).badge && (
                  <span className="bg-[#C8943A] text-[#0B1F3A] text-[10px] font-bold px-2 py-0.5 rounded-full">
                    {(item as any).badge}
                  </span>
                )}
              </Link>
            ))}
          </nav>
        </div>

        <div className="mt-auto p-6 border-t border-white/10">
          <button
            onClick={() => signOut({ callbackUrl: '/admin/login' })}
            className="flex items-center gap-3 text-gray-400 hover:text-white transition-colors w-full px-4 py-2"
          >
            <LogOut size={20} />
            <span className="text-sm font-medium">Sair</span>
          </button>
        </div>
      </aside>

      {needsPasswordChange && <ForcePasswordChange username={username} />}
    </>
  )
}

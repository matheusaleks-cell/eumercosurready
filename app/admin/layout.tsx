'use client'

import { useSession } from 'next-auth/react'
import { AdminSidebar } from '@/components/admin/AdminSidebar'
import { Toaster } from 'sonner'
import { usePathname } from 'next/navigation'
import { Inter } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["300", "400", "500", "600", "700"],
});

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const { data: session, status } = useSession()
  
  // Se estiver carregando a sessão, mostra um estado neutro
  if (status === 'loading') return null

  // Define se é página de login: 
  // 1. Pelo caminho físico /admin/login
  // 2. Se não houver sessão ativa (o middleware já garante que o conteúdo será o login)
  const isLoginPage = pathname === '/admin/login' || !session

  return (
    <div className={`${inter.variable} antialiased font-sans bg-gray-50 admin-theme min-h-screen`}>
      {isLoginPage ? (
        children
      ) : (
        <div className="flex min-h-screen">
          <AdminSidebar />

          {/* Main Content */}
          <main className="flex-1 overflow-auto">
            <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8 sticky top-0 z-10">
              <div className="text-sm text-gray-500 font-medium font-sans">
                Painel Administrativo
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right font-sans">
                  <div className="text-sm font-bold text-gray-900 leading-none">Super Admin</div>
                  <div className="text-xs text-gray-500">Administrador</div>
                </div>
                <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
              </div>
            </header>
            
            <div className="p-8 max-w-7xl mx-auto font-sans">
              {children}
            </div>
          </main>
        </div>
      )}
      <Toaster position="top-right" richColors theme="light" />
    </div>
  )
}

// middleware.ts
import { auth } from '@/lib/auth'
import { NextResponse } from 'next/server'

export default auth((req) => {
  const { nextUrl } = req
  const isLoggedIn = !!req.auth
  const hostname = req.headers.get('host') || ''
  
  // Detecção de subdomínio admin
  const isAdminSubdomain = hostname.startsWith('admin.')
  const isMainAdminPath = nextUrl.pathname.startsWith('/admin')
  const isLoginPage = nextUrl.pathname === '/admin/login'

  // 1. Lógica de Subdomínio: Se estiver no admin.madeinatlantic.com
  if (isAdminSubdomain) {
    // Se o usuário tentar acessar a raiz do subdomínio, manda para o dashboard ou login
    if (nextUrl.pathname === '/' || nextUrl.pathname === '') {
      return NextResponse.rewrite(new URL(isLoggedIn ? '/admin/empresas' : '/admin/login', nextUrl))
    }
    
    // Se não estiver logado e não for página de login, manda pro login (no próprio subdomínio)
    if (!isLoggedIn && !isLoginPage) {
      return NextResponse.rewrite(new URL('/admin/login', nextUrl))
    }

    // Rewrite interno: admin.site.com/qualquer-coisa -> /admin/qualquer-coisa
    // Nota: Se a rota já começar com /admin, não duplicamos
    const targetPath = isMainAdminPath ? nextUrl.pathname : `/admin${nextUrl.pathname}`
    return NextResponse.rewrite(new URL(targetPath, nextUrl))
  }

  // 2. Lógica de Caminho Padrão: site.com/admin
  if (isMainAdminPath) {
    if (!isLoggedIn && !isLoginPage) {
      return NextResponse.redirect(new URL('/admin/login', nextUrl))
    }
    if (isLoggedIn && isLoginPage) {
      return NextResponse.redirect(new URL('/admin/empresas', nextUrl))
    }
  }

  return NextResponse.next()
})

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - todos os arquivos na pasta public (png, svg, etc)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|avif|mp4|ico)).*)',
  ],
}



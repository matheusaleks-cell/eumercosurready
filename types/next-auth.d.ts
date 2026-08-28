// types/next-auth.d.ts
// Module augmentation: estende os tipos padrão do Auth.js/NextAuth com os campos
// que lib/auth.ts realmente coloca na sessão/token (id, username, role,
// needsPasswordChange), eliminando a necessidade de `as any` em todo lugar
// que lê `session.user`.
//
// Session/User/JWT são declarados em @auth/core (next-auth v5 os re-exporta),
// então a augmentation precisa mirar esses módulos para o merge funcionar.

import type { AdminRole } from '@prisma/client'

declare module '@auth/core/types' {
  interface User {
    id: string
    username: string
    role: AdminRole
    needsPasswordChange: boolean
  }

  interface Session {
    user: User
  }
}

declare module '@auth/core/jwt' {
  interface JWT {
    id: string
    username: string
    role: AdminRole
    needsPasswordChange: boolean
  }
}

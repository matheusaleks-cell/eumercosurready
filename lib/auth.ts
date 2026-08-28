import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"
import prisma from "@/lib/prisma"

export const { handlers, auth, signIn, signOut } = NextAuth({
  // SEM adapter — obrigatório para Credentials + JWT funcionar corretamente
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        username: { label: "Usuário", type: "text" },
        password: { label: "Senha", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) return null

        const user = await prisma.adminUser.findUnique({
          where: { username: credentials.username as string }
        })

        if (!user || !user.active) return null

        const isPasswordValid = await bcrypt.compare(
          credentials.password as string,
          user.passwordHash
        )

        if (!isPasswordValid) return null

        prisma.adminUser.update({
          where: { id: user.id },
          data: { lastLogin: new Date() }
        }).catch(() => {})

        return {
          id: user.id,
          name: user.name,
          username: user.username,
          email: user.email,
          role: user.role,
          needsPasswordChange: user.needsPasswordChange,
          image: null,
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.username = user.username
        token.role = user.role
        token.needsPasswordChange = user.needsPasswordChange
      }
      return token
    },
    async session({ session, token }) {
      session.user.id = token.id
      session.user.username = token.username
      session.user.role = token.role
      session.user.needsPasswordChange = token.needsPasswordChange
      return session
    },
  },
  // Sessão de admin expira em 8h de inatividade (em vez do padrão de 30 dias),
  // reduzindo a janela útil de um cookie de sessão roubado/vazado.
  session: { strategy: "jwt", maxAge: 8 * 60 * 60 },
  secret: process.env.AUTH_SECRET,
  trustHost: true,
  pages: {
    signIn: "/admin/login",
  },
})

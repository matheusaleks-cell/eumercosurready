import type { NextAuthConfig } from "next-auth"
import Credentials from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"
import prisma from "@/lib/prisma"

export const authConfig = {
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

        return { 
          id: user.id, 
          name: user.name, 
          username: user.username,
          email: user.email,
          role: user.role,
          needsPasswordChange: user.needsPasswordChange,
        } as any
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.username = (user as any).username
        token.role = (user as any).role
        token.needsPasswordChange = (user as any).needsPasswordChange
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        (session.user as any).id = token.id
        (session.user as any).username = token.username
        (session.user as any).role = token.role
        (session.user as any).needsPasswordChange = token.needsPasswordChange
      }
      return session
    },
  },
  session: { strategy: "jwt" },
  pages: {
    signIn: "/admin/login",
  },
} satisfies NextAuthConfig

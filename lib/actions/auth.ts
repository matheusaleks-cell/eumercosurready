'use server'

import prisma from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { auth, signIn, signOut } from '@/lib/auth'
import { revalidatePath } from 'next/cache'
import { AuthError } from 'next-auth'
import { z } from 'zod'
import { headers } from 'next/headers'

const loginSchema = z.object({
  username: z.string().min(1).max(80),
  password: z.string().min(1).max(128),
})

// In-memory rate limiter: max 10 attempts per IP per 15 minutes
const loginAttempts = new Map<string, { count: number; resetAt: number }>()
const MAX_ATTEMPTS = 10
const WINDOW_MS = 15 * 60 * 1000

function checkRateLimit(ip: string): boolean {
  const now = Date.now()
  const entry = loginAttempts.get(ip)
  if (!entry || now > entry.resetAt) {
    loginAttempts.set(ip, { count: 1, resetAt: now + WINDOW_MS })
    return true
  }
  if (entry.count >= MAX_ATTEMPTS) return false
  entry.count++
  return true
}

export async function loginAction(values: unknown) {
  const headersList = await headers()
  const ip = headersList.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown'

  if (!checkRateLimit(ip)) {
    return { error: 'Muitas tentativas. Aguarde 15 minutos e tente novamente.' }
  }

  const parsed = loginSchema.safeParse(values)
  if (!parsed.success) {
    return { error: 'Dados de acesso inválidos.' }
  }

  try {
    await signIn('credentials', {
      username: parsed.data.username,
      password: parsed.data.password,
      redirectTo: '/admin/dashboard',
    })
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: 'Credenciais inválidas ou erro no servidor.' }
    }
    throw error
  }
}

export async function logoutAction() {
  await signOut({ redirectTo: '/admin/login' })
}

const passwordSchema = z.string().min(8, 'Senha deve ter no mínimo 8 caracteres').max(128)

export async function updateAdminPassword(password: string) {
  const session = await auth()

  if (!session?.user?.id) {
    return { success: false, error: 'Não autorizado' }
  }

  const parsed = passwordSchema.safeParse(password)
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message }
  }

  try {
    const passwordHash = await bcrypt.hash(password, 12)
    
    await prisma.adminUser.update({
      where: { id: session.user.id as string },
      data: {
        passwordHash,
        needsPasswordChange: false
      }
    })

    revalidatePath('/admin')
    return { success: true }
  } catch (err) {
    console.error('Update password error:', err)
    return { success: false, error: 'Erro ao atualizar senha' }
  }
}

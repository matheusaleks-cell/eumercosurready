'use server'

import prisma from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { auth, signIn, signOut } from '@/lib/auth'
import { revalidatePath } from 'next/cache'
import { AuthError } from 'next-auth'
import { z } from 'zod'
import { checkRateLimit, getClientIp } from '@/lib/rate-limit'
import { logAudit } from '@/lib/audit'

const loginSchema = z.object({
  username: z.string().min(1).max(80),
  password: z.string().min(1).max(128),
})

const LOGIN_MAX_ATTEMPTS = 10
const LOGIN_WINDOW_MS = 15 * 60 * 1000

export async function loginAction(values: unknown) {
  const ip = await getClientIp()

  if (!checkRateLimit(`login:${ip}`, LOGIN_MAX_ATTEMPTS, LOGIN_WINDOW_MS)) {
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

export async function updateAdminPassword(currentPassword: string, newPassword: string) {
  const session = await auth()

  if (!session?.user?.id) {
    return { success: false, error: 'Não autorizado' }
  }

  const parsed = passwordSchema.safeParse(newPassword)
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message }
  }

  try {
    const user = await prisma.adminUser.findUnique({
      where: { id: session.user.id as string }
    })
    if (!user) {
      return { success: false, error: 'Usuário não encontrado' }
    }

    const isCurrentValid = await bcrypt.compare(currentPassword || '', user.passwordHash)
    if (!isCurrentValid) {
      return { success: false, error: 'Senha atual incorreta.' }
    }

    const passwordHash = await bcrypt.hash(newPassword, 12)

    await prisma.adminUser.update({
      where: { id: session.user.id as string },
      data: {
        passwordHash,
        needsPasswordChange: false
      }
    })

    revalidatePath('/admin')
    await logAudit({ action: 'user.password_change', entityType: 'AdminUser', entityId: session.user.id as string })
    return { success: true }
  } catch (err) {
    console.error('Update password error:', err)
    return { success: false, error: 'Erro ao atualizar senha' }
  }
}

'use server'

import prisma from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { auth, signIn, signOut } from '@/lib/auth'
import { revalidatePath } from 'next/cache'
import { AuthError } from 'next-auth'

export async function loginAction(values: any) {
  try {
    await signIn('credentials', {
      username: values.username,
      password: values.password,
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

export async function updateAdminPassword(password: string) {
  const session = await auth()
  
  if (!session?.user?.id) {
    return { success: false, error: 'Não autorizado' }
  }

  try {
    const passwordHash = await bcrypt.hash(password, 10)
    
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

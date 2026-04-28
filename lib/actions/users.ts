"use server"

import prisma from "@/lib/prisma"
import { AdminRole } from "@prisma/client"
import bcrypt from "bcryptjs"
import { revalidatePath } from "next/cache"
import { auth } from "@/lib/auth"

export async function getUsers() {
  const session = await auth()
  if (!session) return { success: false, error: "Não autorizado" }

  try {
    const users = await prisma.adminUser.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        active: true,
        createdAt: true,
        lastLogin: true,
      }
    })
    return { success: true, users }
  } catch (error) {
    console.error("Erro ao buscar usuários:", error)
    return { success: false, error: "Falha ao buscar usuários" }
  }
}

export async function createUser(data: {
  name: string
  email: string
  password: string
  role: AdminRole
}) {
  const session = await auth()
  if (!session || (session.user as any).role !== 'SUPER_ADMIN') {
    return { success: false, error: "Não autorizado. Apenas Super Admins podem criar usuários." }
  }

  try {
    // Verificar se já existe
    const existing = await prisma.adminUser.findUnique({
      where: { email: data.email }
    })

    if (existing) {
      return { success: false, error: "Este e-mail já está cadastrado." }
    }

    const salt = await bcrypt.genSalt(10)
    const passwordHash = await bcrypt.hash(data.password, salt)

    await prisma.adminUser.create({
      data: {
        name: data.name,
        email: data.email,
        username: data.email.split('@')[0], // Fallback username
        passwordHash,
        role: data.role,
        active: true
      }
    })

    revalidatePath("/admin/usuarios")
    return { success: true }
  } catch (error) {
    console.error("Erro ao criar usuário:", error)
    return { success: false, error: "Falha ao criar usuário" }
  }
}

export async function deleteUser(id: string) {
  const session = await auth()
  if (!session || (session.user as any).role !== 'SUPER_ADMIN') {
    return { success: false, error: "Não autorizado. Apenas Super Admins podem deletar usuários." }
  }

  try {
    // Evitar que o usuário se delete
    if ((session.user as any).id === id) {
      return { success: false, error: "Você não pode deletar sua própria conta." }
    }
    
    await prisma.adminUser.delete({
      where: { id }
    })

    revalidatePath("/admin/usuarios")
    return { success: true }
  } catch (error) {
    console.error("Erro ao deletar usuário:", error)
    return { success: false, error: "Falha ao deletar usuário" }
  }
}

export async function toggleUserStatus(id: string, active: boolean) {
  const session = await auth()
  if (!session || (session.user as any).role !== 'SUPER_ADMIN') {
    return { success: false, error: "Não autorizado" }
  }

  try {
    await prisma.adminUser.update({
      where: { id },
      data: { active }
    })
    revalidatePath("/admin/usuarios")
    return { success: true }
  } catch (error) {
    console.error("Erro ao alterar status do usuário:", error)
    return { success: false, error: "Falha ao alterar status" }
  }
}

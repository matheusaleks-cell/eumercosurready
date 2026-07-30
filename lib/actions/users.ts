"use server"

import prisma from "@/lib/prisma"
import { AdminRole } from "@prisma/client"
import bcrypt from "bcryptjs"
import { revalidatePath } from "next/cache"
import { auth } from "@/lib/auth"
import { logAudit } from "@/lib/audit"

export async function getUsers() {
  const session = await auth()
  if (!session || (session.user as any).role !== 'SUPER_ADMIN') {
    return { success: false, error: "Não autorizado. Apenas Super Admins podem visualizar usuários." }
  }

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
  username: string
  email: string
  password: string
  role: AdminRole
}) {
  const session = await auth()
  if (!session || (session.user as any).role !== 'SUPER_ADMIN') {
    return { success: false, error: "Não autorizado. Apenas Super Admins podem criar usuários." }
  }

  try {
    // Verificar se já existe e-mail
    const existingEmail = await prisma.adminUser.findUnique({
      where: { email: data.email }
    })

    if (existingEmail) {
      return { success: false, error: "Este e-mail já está cadastrado." }
    }

    // Verificar se já existe username
    const existingUsername = await prisma.adminUser.findUnique({
      where: { username: data.username.toLowerCase() }
    })

    if (existingUsername) {
      return { success: false, error: "Este nome de usuário já está em uso." }
    }

    const salt = await bcrypt.genSalt(10)
    const passwordHash = await bcrypt.hash(data.password, salt)

    const created = await prisma.adminUser.create({
      data: {
        name: data.name,
        email: data.email,
        username: data.username.toLowerCase(),
        passwordHash,
        role: data.role,
        active: true
      }
    })

    revalidatePath("/admin/usuarios")
    await logAudit({ action: 'user.create', entityType: 'AdminUser', entityId: created.id, details: `${created.username} (${created.role})` })
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
    
    const deleted = await prisma.adminUser.delete({
      where: { id }
    })

    revalidatePath("/admin/usuarios")
    await logAudit({ action: 'user.delete', entityType: 'AdminUser', entityId: id, details: deleted.username })
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
    await logAudit({ action: active ? 'user.activate' : 'user.deactivate', entityType: 'AdminUser', entityId: id })
    return { success: true }
  } catch (error) {
    console.error("Erro ao alterar status do usuário:", error)
    return { success: false, error: "Falha ao alterar status" }
  }
}

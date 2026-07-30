import prisma from '@/lib/prisma'
import { auth } from '@/lib/auth'

/**
 * Grava uma entrada no log de auditoria. Nunca lança erro — uma falha ao
 * registrar o log não deve impedir a ação administrativa de completar.
 */
export async function logAudit(params: {
  action: string
  entityType: string
  entityId?: string | null
  details?: string
}) {
  try {
    const session = await auth()
    const admin = session?.user as { id?: string; name?: string; username?: string } | undefined

    await prisma.auditLog.create({
      data: {
        action: params.action,
        entityType: params.entityType,
        entityId: params.entityId || null,
        adminId: admin?.id || null,
        adminName: admin?.name || admin?.username || null,
        details: params.details,
      }
    })
  } catch (err) {
    console.error('Falha ao gravar log de auditoria:', err)
  }
}

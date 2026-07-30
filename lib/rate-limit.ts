import { headers } from 'next/headers'

/**
 * Limitador em memória, por processo. Reinicia caso o servidor reinicie e não é
 * compartilhado entre múltiplas instâncias — suficiente para o volume atual da
 * plataforma, mas para produção multi-instância considere um backend compartilhado
 * (ex: Upstash Redis).
 */
const buckets = new Map<string, { count: number; resetAt: number }>()

/** Limpeza periódica para não crescer indefinidamente em memória. */
function sweep(now: number) {
  for (const [key, entry] of buckets) {
    if (now > entry.resetAt) buckets.delete(key)
  }
}

let lastSweep = 0

export function checkRateLimit(key: string, maxAttempts: number, windowMs: number): boolean {
  const now = Date.now()

  if (now - lastSweep > windowMs) {
    sweep(now)
    lastSweep = now
  }

  const entry = buckets.get(key)
  if (!entry || now > entry.resetAt) {
    buckets.set(key, { count: 1, resetAt: now + windowMs })
    return true
  }
  if (entry.count >= maxAttempts) return false
  entry.count++
  return true
}

/**
 * Obtém o IP do requisitante a partir de x-forwarded-for.
 * Assume que a plataforma roda atrás de um proxy confiável (ex: Vercel) que
 * sobrescreve esse header na borda — em um deploy self-hosted sem proxy confiável
 * este header pode ser forjado pelo próprio cliente, permitindo contornar o limite.
 */
export async function getClientIp(): Promise<string> {
  const headersList = await headers()
  const ip = headersList.get('x-forwarded-for')?.split(',')[0]?.trim()
  return ip || headersList.get('x-real-ip') || 'unknown'
}

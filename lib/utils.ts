import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function translateEmployeesRange(range: string | null | undefined, language: string) {
  if (!range) return range

  const t = (pt: string, en: string, es: string) => {
    if (language === 'en') return en
    if (language === 'es') return es
    return pt
  }

  // Limpar possíveis textos legados
  const cleanRange = range.replace(' Funcionários', '').replace(' Employees', '').replace(' Empleados', '')

  if (cleanRange === '1-10') return `${cleanRange} (${t('Micro', 'Micro', 'Micro')})`
  if (cleanRange === '11-50') return `${cleanRange} (${t('Pequena', 'Small', 'Pequeña')})`
  if (cleanRange === '51-200') return `${cleanRange} (${t('Média', 'Medium', 'Mediana')})`
  if (cleanRange === '201-500') return `${cleanRange} (${t('Média-Grande', 'Medium-Large', 'Mediana-Grande')})`
  if (cleanRange === '500+') return `${cleanRange} (${t('Grande', 'Large', 'Grande')})`

  return range.replace('Funcionários', t('Funcionários', 'Employees', 'Empleados'))
}

export function formatDate(date: Date | string) {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(date))
}

export function slugify(text: string) {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-") // Substitui espaços por -
    .replace(/[^\w-]+/g, "") // Remove caracteres não alfanuméricos
    .replace(/--+/g, "-") // Substitui múltiplos - por um único
}

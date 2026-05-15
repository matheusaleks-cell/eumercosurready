// lib/constants.ts

// Países disponíveis com código e bloco
export const COUNTRIES = [
  // União Europeia
  { code: 'PT', name: 'Portugal', flagPath: '/flags/Portugal.png', region: 'EU' },
  { code: 'ES', name: 'Espanha', flagPath: '/flags/Espanha.svg', region: 'EU' },
  { code: 'DE', name: 'Alemanha', flagPath: '/flags/Alemanha.png', region: 'EU' },
  { code: 'FR', name: 'França', flagPath: '/flags/Franca.png', region: 'EU' },
  { code: 'IT', name: 'Itália', flagPath: '/flags/Italia.png', region: 'EU' },
  { code: 'NL', name: 'Países Baixos', flagPath: '/flags/PaisesBaixos.png', region: 'EU' },
  { code: 'BE', name: 'Bélgica', flagPath: '/flags/Belgica.png', region: 'EU' },
  { code: 'PL', name: 'Polônia', flagPath: '/flags/Polonia.png', region: 'EU' },
  { code: 'SE', name: 'Suécia', flagPath: '/flags/Suecia.png', region: 'EU' },
  { code: 'AT', name: 'Áustria', flagPath: '/flags/Austria.png', region: 'EU' },
  // Mercosul
  { code: 'BR', name: 'Brasil', flagPath: '/flags/Brasil.png', region: 'MERCOSUL' },
  { code: 'AR', name: 'Argentina', flagPath: '/flags/Argentina.png', region: 'MERCOSUL' },
  { code: 'UY', name: 'Uruguai', flagPath: '/flags/Uruguai.png', region: 'MERCOSUL' },
  { code: 'PY', name: 'Paraguai', flagPath: '/flags/Paraguai.png', region: 'MERCOSUL' },
  { code: 'CL', name: 'Chile', flagPath: '/flags/Chile.png', region: 'MERCOSUL' },
  { code: 'BO', name: 'Bolívia', flagPath: '/flags/Bolivia.png', region: 'MERCOSUL' },
]

// Setores padrão (seed)
export const DEFAULT_SECTORS = [
  { name: 'Tecnologia', slug: 'tecnologia', icon: '💻', order: 1 },
  { name: 'Agronegócio', slug: 'agronegocio', icon: '🌾', order: 2 },
  { name: 'Alimentos & Bebidas', slug: 'alimentos-bebidas', icon: '🍷', order: 3 },
  { name: 'Financeiro', slug: 'financeiro', icon: '📊', order: 4 },
  { name: 'Logística', slug: 'logistica', icon: '🚢', order: 5 },
  { name: 'Saúde', slug: 'saude', icon: '🏥', order: 6 },
  { name: 'Energia', slug: 'energia', icon: '⚡', order: 7 },
  { name: 'Jurídico', slug: 'juridico', icon: '⚖️', order: 8 },
  { name: 'Indústria', slug: 'industria', icon: '🏭', order: 9 },
  { name: 'Educação', slug: 'educacao', icon: '🎓', order: 10 },
  { name: 'Turismo', slug: 'turismo', icon: '✈️', order: 11 },
  { name: 'Moda & Design', slug: 'moda-design', icon: '👗', order: 12 },
]

// Opções de porte
export const EMPLOYEES_RANGE_OPTIONS = [
  '1–10', '10–50', '50–200', '200–500', '500+'
]

export const STATUS_COLORS: Record<string, { bg: string; text: string; label: string }> = {
  ACTIVE:   { bg: '#DCFCE7', text: '#16A34A', label: 'Ativo' },
  INACTIVE: { bg: '#F3F4F6', text: '#6B7280', label: 'Inativo' },
  PENDING:  { bg: '#FEF3C7', text: '#D97706', label: 'Pendente' },
  DRAFT:    { bg: '#F3E8FF', text: '#9333EA', label: 'Rascunho' },
  FEATURED: { bg: '#FEF0C7', text: '#C8943A', label: 'Destaque' },
}

export const REQUEST_STATUS_COLORS: Record<string, { bg: string; text: string; label: string }> = {
  PENDING:  { bg: '#FEF3C7', text: '#D97706', label: 'Pendente' },
  APPROVED: { bg: '#DCFCE7', text: '#16A34A', label: 'Aprovada' },
  REJECTED: { bg: '#FEE2E2', text: '#DC2626', label: 'Recusada' },
}

export const REGION_COLORS: Record<string, { bg: string; text: string; label: string }> = {
  EU:       { bg: '#E6ECFF', text: '#003399', label: 'União Europeia' },
  MERCOSUL: { bg: '#E0F5F3', text: '#009688', label: 'Mercosul' },
}

// types/index.ts

export type Region = 'EU' | 'MERCOSUL' | 'GUEST'

export type CompanyStatus = 'ACTIVE' | 'INACTIVE' | 'PENDING' | 'DRAFT' | 'FEATURED'

export type AdminRole = 'SUPER_ADMIN' | 'EDITOR'

export type RequestStatus = 'PENDING' | 'APPROVED' | 'REJECTED'

export interface Company {
  id: string
  name: string
  slug: string
  logoUrl?: string
  logoColor: string
  country: string
  countryCode: string
  city?: string
  region: Region
  sectorId: string
  sector: Sector
  secondarySectors: string[]
  employeesRange?: string
  shortDescription: string
  fullDescription: string
  foundedYear?: number
  certifications: string[]
  productsServices: string[]
  targetMarkets: string[]
  email?: string
  phone?: string
  whatsapp?: string
  website?: string
  linkedin?: string
  status: CompanyStatus
  featured: boolean
  internalNotes?: string
  createdAt: string
  updatedAt: string
  publishedAt?: string
}

export interface Sector {
  id: string
  name: string
  slug: string
  icon: string
  description?: string
  active: boolean
  order: number
  _count?: { companies: number }
}

export interface CountrySector {
  title: string
  title_en?: string | null
  title_es?: string | null
  description: string
  description_en?: string | null
  description_es?: string | null
}

export interface Country {
  id: string
  code: string
  name: string
  name_en?: string | null
  name_es?: string | null
  slug: string
  group: Region
  ddi: string
  flagUrl?: string | null
  order: number
  active: boolean

  description?: string | null
  description_en?: string | null
  description_es?: string | null
  highlight?: string | null
  highlight_en?: string | null
  highlight_es?: string | null
  ctaTitle?: string | null
  ctaTitle_en?: string | null
  ctaTitle_es?: string | null
  ctaDescription?: string | null
  ctaDescription_en?: string | null
  ctaDescription_es?: string | null

  gdp?: string | null
  growth?: string | null
  mainSector?: string | null
  mainSector_en?: string | null
  mainSector_es?: string | null
  taxRate?: string | null

  sectors?: CountrySector[] | null

  naturalRiches: string[]
  naturalRiches_en: string[]
  naturalRiches_es: string[]

  exports: string[]
  exports_en: string[]
  exports_es: string[]
  imports: string[]
  imports_en: string[]
  imports_es: string[]
}

export interface ContactRequest {
  id: string
  companyName: string
  country: string
  sector: string
  responsibleName: string
  email: string
  phone?: string
  website?: string
  description: string
  message?: string
  status: RequestStatus
  rejectionReason?: string
  reviewedAt?: string
  reviewedBy?: AdminUser
  createdAt: string
}

export interface AdminUser {
  id: string
  name: string
  email: string
  role: AdminRole
  active: boolean
  createdAt: string
  lastLogin?: string
}

// Tipos para filtros de busca
export interface CompanyFilters {
  search?: string
  region?: Region | 'all'
  sectorId?: string
  status?: CompanyStatus
  page?: number
  perPage?: number
  orderBy?: 'name' | 'createdAt' | 'country'
  orderDir?: 'asc' | 'desc'
}

// Tipos para API responses
export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  perPage: number
  totalPages: number
}

export interface DashboardStats {
  totalCompanies: number
  euCompanies: number
  mercosulCompanies: number
  pendingRequests: number
  featuredCompanies: number
  companiesByStatus: { status: CompanyStatus; _count: number }[]
  companiesBySector: { sector: Sector; _count: number }[]
  companiesByCountry: { country: string; countryCode: string; _count: number }[]
  recentCompanies: Company[]
  recentRequests: ContactRequest[]
}

// types/index.ts

export type Region = 'EU' | 'MERCOSUL'

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

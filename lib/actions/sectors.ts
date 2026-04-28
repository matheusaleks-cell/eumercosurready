'use server'

import prisma from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { auth } from '@/lib/auth'

export async function getSectors() {
  const session = await auth()
  if (!session) return { success: false, error: 'Não autorizado' }

  try {
    const sectors = await prisma.sector.findMany({
      orderBy: { name: 'asc' },
      include: {
        _count: {
          select: { companies: true }
        }
      }
    })
    return { success: true, sectors }
  } catch (error) {
    return { success: false, error: 'Falha ao buscar setores' }
  }
}

export async function createSector(data: { name: string, icon: string, description?: string }) {
  const session = await auth()
  if (!session) return { success: false, error: 'Não autorizado' }

  try {
    const slug = data.name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, '-')
    
    const sector = await prisma.sector.create({
      data: {
        name: data.name,
        slug,
        icon: data.icon,
        description: data.description,
      }
    })

    revalidatePath('/admin/setores')
    return { success: true, sector }
  } catch (error) {
    return { success: false, error: 'Falha ao criar setor' }
  }
}

export async function deleteSector(id: string) {
  const session = await auth()
  if (!session) return { success: false, error: 'Não autorizado' }

  try {
    await prisma.sector.delete({
      where: { id }
    })
    revalidatePath('/admin/setores')
    return { success: true }
  } catch (error) {
    return { success: false, error: 'Falha ao excluir setor. Verifique se existem empresas vinculadas.' }
  }
}

// Função para popular setores iniciais (Seed)
export async function seedInitialSectors() {
  const session = await auth()
  if (!session || (session.user as any).role !== 'SUPER_ADMIN') {
    return { success: false, error: 'Não autorizado' }
  }

  const initialSectors = [
    { name: 'Agronegócio', icon: 'Wheat', description: 'Produção agrícola, pecuária e insumos.' },
    { name: 'Alimentos & Bebidas', icon: 'Utensils', description: 'Processamento, embalagem e distribuição de alimentos.' },
    { name: 'Construção Civil & Real Estate', icon: 'Building2', description: 'Infraestrutura, engenharia e mercado imobiliário.' },
    { name: 'Educação & EdTech', icon: 'GraduationCap', description: 'Ensino superior, cursos técnicos e tecnologia educacional.' },
    { name: 'Energia', icon: 'Zap', description: 'Energias renováveis, petróleo e gás.' },
    { name: 'Energias Renováveis', icon: 'Sun', description: 'Energia solar, eólica, biomassa e hidrogênio verde.' },
    { name: 'Financeiro', icon: 'BarChart3', description: 'Bancos, Fintechs, Investimentos e Meios de Pagamento.' },
    { name: 'Indústria', icon: 'Factory', description: 'Manufatura, processamento e bens de capital.' },
    { name: 'Indústria Manufatureira', icon: 'Settings2', description: 'Produção em larga escala e processos industriais.' },
    { name: 'Jurídico', icon: 'Scale', description: 'Consultoria legal, direito internacional e compliance.' },
    { name: 'Logística', icon: 'Truck', description: 'Transporte marítimo, aéreo, rodoviário e armazenagem.' },
    { name: 'Logística & Supply Chain', icon: 'Package', description: 'Gestão de cadeia de suprimentos e distribuição global.' },
    { name: 'Mineração & Metais', icon: 'Pickaxe', description: 'Extração mineral e processamento de metais.' },
    { name: 'Moda & Têxtil', icon: 'Shirt', description: 'Confecção, tecidos e indústria da moda.' },
    { name: 'Saúde', icon: 'Activity', description: 'Farmacêutica, equipamentos médicos e biotecnologia.' },
    { name: 'Tecnologia', icon: 'Cpu', description: 'Software, Hardware, IA e Serviços de TI.' },
  ]

  try {
    for (const s of initialSectors) {
      const slug = s.name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, '-')
      
      await prisma.sector.upsert({
        where: { name: s.name },
        update: {
          icon: s.icon,
          description: s.description,
          slug
        },
        create: {
          name: s.name,
          slug,
          icon: s.icon,
          description: s.description
        }
      })
    }
    revalidatePath('/admin/setores')
    return { success: true }
  } catch (error) {
    console.error('Seed error:', error)
    return { success: false, error: 'Falha ao sincronizar setores. Verifique o console.' }
  }
}

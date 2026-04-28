// lib/companies-data.ts

export interface CompanyReview {
  id: string
  userName: string
  rating: number
  comment: string
  date: string
}

export interface Product {
  id?: string
  title: string
  slug?: string | null
  category?: string | null
  description: string
  imageUrl?: string | null
  moq?: string | null
  incoterms?: string[] | string | null
  portOfOrigin?: string | null
  productionCapacity?: string | null
  leadTime?: string | null
  isReadyToShip?: boolean
  isLowMOQ?: boolean
  isCertified?: boolean
  isSustainable?: boolean
}

export interface CompanyStat {
  label: string
  value: string
  icon: 'users' | 'dollar' | 'ship' | 'calendar' | 'award' | 'globe' | 'trending' | 'zap' | 'shield'
}

export interface Company {
  id: string
  name: string
  slug: string
  logoUrl?: string
  logoColor: string
  bannerUrl?: string
  country: string
  countryCode: string
  region: 'EU' | 'MERCOSUL'
  shortDescription: string
  fullDescription: string
  sector: { name: string }
  website: string
  address: string
  email?: string
  phone?: string
  socialLinks: {
    linkedin?: string
    instagram?: string
    facebook?: string
    twitter?: string
  }
  rating: number
  reviews: CompanyReview[]
  stats?: CompanyStat[]
  products?: Product[]
  certifications?: string[]
  values?: { title: string; description: string; icon: string }[]
  globalPresence?: string[]
  videoUrl?: string
  businessType?: string[]
  keywords?: string[]
  verificationLevel?: 'Bronze' | 'Prata' | 'Ouro' | 'BRONZE' | 'SILVER' | 'GOLD'
  featured?: boolean
}

export const companiesData: Company[] = [
  {
    id: '1',
    name: 'TechLisboa',
    slug: 'techlisboa',
    country: 'Portugal',
    countryCode: 'PT',
    region: 'EU',
    logoColor: '#003399',
    bannerUrl: 'https://images.unsplash.com/photo-1512756290469-ec264b7fbf87?auto=format&fit=crop&q=80&w=2000',
    sector: { name: 'Tecnologia' },
    shortDescription: 'Desenvolvimento de software especializado em logística e sistemas financeiros para o mercado europeu.',
    fullDescription: 'A TechLisboa desenvolve software e sistemas de gestão (SaaS) com foco na integração entre os mercados europeu e sul-americano. Fundada em 2018, a empresa entrega ferramentas de automação e processamento de dados para empresas de médio porte que buscam exportar serviços digitais.',
    website: 'https://techlisboa.pt',
    address: 'Avenida da Liberdade, 110, 1269-001 Lisboa, Portugal',
    email: 'contact@techlisboa.pt',
    phone: '+351 21 000 0000',
    socialLinks: {
      linkedin: 'https://linkedin.com/company/techlisboa',
      instagram: 'https://instagram.com/techlisboa',
      twitter: 'https://twitter.com/techlisboa'
    },
    rating: 4.8,
    reviews: [
      { id: 'r1', userName: 'Carlos Mendes', rating: 5, comment: 'Excelente parceria estratégica no setor de IA.', date: '2024-03-10' },
      { id: 'r2', userName: 'Ana Silva', rating: 4, comment: 'Ótimos prazos de entrega e suporte técnico.', date: '2024-02-15' }
    ],
    stats: [
      { label: 'Anos de Mercado', value: '6+', icon: 'calendar' },
      { label: 'Projetos Entregues', value: '200+', icon: 'award' },
      { label: 'Países Atendidos', value: '12', icon: 'globe' },
      { label: 'Verificação KYB', value: 'Ouro', icon: 'shield' }
    ],
    verificationLevel: 'Ouro',
    products: [
      { 
        title: 'IA para Logística', 
        slug: 'ia-para-logistica',
        category: 'Software',
        description: 'Algoritmos preditivos para otimização de rotas transatlânticas.',
        imageUrl: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=800',
        moq: '1 licença enterprise',
        incoterms: ['DDP', 'SaaS'],
        productionCapacity: 'Customização ilimitada',
        leadTime: '2-4 semanas',
        isReadyToShip: true,
        isLowMOQ: true
      },
      { 
        title: 'ERP Transfronteiriço', 
        slug: 'erp-transfronteirico',
        category: 'Software',
        description: 'Sistema de gestão integrado com regulações fiscais EU-Mercosul.',
        imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800',
        moq: 'A partir de 50 usuários',
        incoterms: ['SaaS'],
        productionCapacity: '10 implantações/mês',
        leadTime: '4-8 semanas'
      },
      { 
        title: 'Cybersecurity Audit', 
        slug: 'cybersecurity-audit',
        category: 'Segurança',
        description: 'Auditoria completa de segurança digital para conformidade GDPR.',
        imageUrl: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=800',
        moq: '1 auditoria',
        incoterms: ['Service'],
        productionCapacity: '4 auditorias/mês',
        leadTime: '2-4 semanas',
        isLowMOQ: true
      },
      { 
        title: 'Blockchain for Supply Chain', 
        slug: 'blockchain-supply-chain',
        category: 'Blockchain',
        description: 'Solução de rastreabilidade imutável para cadeias de suprimentos complexas.',
        imageUrl: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&q=80&w=800',
        moq: 'Contrato anual',
        incoterms: ['SaaS'],
        productionCapacity: 'Unlimited',
        leadTime: 'Instalação em 2 semanas'
      },
      { 
        title: 'SaaS Customizado para Exportação', 
        slug: 'saas-customizado-exportacao',
        category: 'Software',
        description: 'Desenvolvimento sob medida para fluxos de exportação complexos.',
        imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800',
        moq: 'Sob consulta',
        incoterms: ['SaaS'],
        productionCapacity: '2 projetos/trimestre',
        leadTime: '3-6 meses'
      }
    ],
    certifications: ['ISO 27001', 'GDPR Compliant', 'PME Líder 2023'],
    values: [
      { title: 'Inovação Radical', description: 'Buscamos o estado da arte em cada linha de código.', icon: 'Zap' },
      { title: 'Conectividade', description: 'Unindo mercados através de pontas digitais sólidas.', icon: 'Link' },
      { title: 'Segurança', description: 'Proteção de dados como prioridade absoluta em SaaS.', icon: 'Shield' }
    ],
    globalPresence: ['Portugal', 'Brasil', 'Alemanha', 'Espanha', 'Angola'],
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    businessType: ['Desenvolvedor de Software', 'Consultoria Tech'],
    keywords: ['SaaS', 'Logística IA', 'Fintech', 'ERP Transfronteiriço', 'API Integration']
  },
  {
    id: '2',
    name: 'AgroSul Brasil',
    slug: 'agrosul-brasil',
    country: 'Brasil',
    countryCode: 'BR',
    region: 'MERCOSUL',
    logoColor: '#009688',
    bannerUrl: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&q=80&w=2000',
    sector: { name: 'Agronegócio' },
    shortDescription: 'Exportadora brasileira de soja e milho com foco em rastreabilidade e agricultura de precisão.',
    fullDescription: 'Com 20 anos de operação, a AgroSul Brasil exporta soja e milho para o mercado internacional, utilizando sistemas de monitoramento via satélite para garantir a origem dos grãos. A empresa atende aos requisitos de sustentabilidade da União Europeia, assegurando zero desmatamento em sua cadeia de fornecimento.',
    website: 'https://agrosulbrasil.com.br',
    address: 'Rodovia BR-163, KM 745, Sorriso - MT, Brasil',
    email: 'comercial@agrosul.com.br',
    phone: '+55 66 3500 0000',
    socialLinks: {
      linkedin: 'https://linkedin.com/company/agrosul-brasil',
      facebook: 'https://facebook.com/agrosulbrasil'
    },
    rating: 4.9,
    reviews: [
      { id: 'r3', userName: 'Jean Dupont', rating: 5, comment: 'Padrão de qualidade excepcional para exportação europeia.', date: '2024-01-20' }
    ],
    stats: [
      { label: 'Anos de Mercado', value: '15+', icon: 'calendar' },
      { label: 'Produção Anual', value: '1.2M Ton', icon: 'award' },
      { label: 'Países Atendidos', value: '18', icon: 'globe' },
      { label: 'Verificação KYB', value: 'Prata', icon: 'shield' }
    ],
    verificationLevel: 'Ouro',
    featured: true,
    products: [
      { 
        title: 'Grãos Rastreáveis', 
        slug: 'graos-rastreaveis',
        category: 'Grãos',
        description: 'Soja e milho com certificação de origem e zero desmatamento.',
        imageUrl: 'https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?auto=format&fit=crop&q=80&w=800',
        moq: '500 toneladas',
        incoterms: ['FOB', 'CIF'],
        portOfOrigin: 'Porto de Santos, Brasil',
        productionCapacity: '10 sistemas/mês',
        leadTime: '30 dias',
        isReadyToShip: true
      },
      { 
        title: 'Farelo de Soja High-Protein', 
        slug: 'farelo-soja-high-protein',
        category: 'Derivados',
        description: 'Farelo de soja premium para nutrição animal de alta performance.',
        imageUrl: 'https://images.unsplash.com/photo-1599549114757-192663994d5b?auto=format&fit=crop&q=80&w=800',
        moq: '200 toneladas',
        incoterms: ['FOB'],
        portOfOrigin: 'Porto de Paranaguá, Brasil',
        productionCapacity: '50.000 ton/mês',
        leadTime: '20 dias'
      },
      { 
        title: 'Consultoria de Exportação Agro', 
        slug: 'consultoria-exportacao-agro',
        category: 'Serviços',
        description: 'Assessoria completa para novos produtores acessarem o mercado europeu.',
        imageUrl: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&q=80&w=800',
        moq: 'Consultoria Mensal',
        incoterms: ['Service'],
        productionCapacity: '5 clientes/mês',
        leadTime: 'Início imediato'
      },
      { 
        title: 'Tecnologia de Precisão', 
        slug: 'tecnologia-precisao',
        category: 'Tecnologia',
        description: 'Sistemas de monitoramento via satélite para grandes culturas.',
        imageUrl: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?auto=format&fit=crop&q=80&w=800',
        moq: '1 sistema (mín. 1000 hectares)',
        incoterms: ['EXW', 'FCA'],
        productionCapacity: '20 implementações/mês',
        leadTime: '10-20 dias'
      }
    ],
    certifications: ['RTRS Certified', 'ISO 14001', 'EcoVadis Gold'],
    values: [
      { title: 'Sustentabilidade', description: 'Produção com respeito absoluto à biodiversidade.', icon: 'Leaf' },
      { title: 'Rastreabilidade', description: 'Do campo ao porto com total transparência.', icon: 'Search' },
      { title: 'Produtividade', description: 'Máximo rendimento com mínimo impacto ambiental.', icon: 'TrendingUp' }
    ],
    globalPresence: ['Brasil', 'China', 'Holanda', 'França', 'Egito'],
    businessType: ['Produtor Agrícola', 'Exportador', 'Trading Company'],
    keywords: ['Soja Rastreável', 'Milho Non-GMO', 'Sustentabilidade', 'Agro de Precisão', 'Exportação Grãos']
  },
  {
    id: '3',
    name: 'NordLogistics',
    slug: 'nordlogistics',
    verificationLevel: 'SILVER',
    country: 'Alemanha',
    countryCode: 'DE',
    region: 'EU',
    logoColor: '#1A3558',
    bannerUrl: 'https://images.unsplash.com/photo-1494412519320-aa613dfb7738?auto=format&fit=crop&q=80&w=2000',
    sector: { name: 'Logística' },
    shortDescription: 'Eficiência logística europeia. Gestão de cadeia de suprimentos e transporte internacional.',
    fullDescription: 'A NordLogistics oferece uma malha logística integrada em toda a União Europeia, com terminais inteligentes nos portos de Hamburgo e Roterdã. Nosso diferencial é a integração via API com sistemas de ERP, garantindo visibilidade em tempo real para os importadores do Mercosul.',
    website: 'https://nordlogistics.de',
    address: 'HafenCity, Am Sandtorkai 48, 20457 Hamburg, Alemanha',
    socialLinks: {
      linkedin: 'https://linkedin.com/company/nordlogistics'
    },
    rating: 4.7,
    reviews: [
      { id: 'r4', userName: 'Roberto Ortiz', rating: 4, comment: 'Serviço pontual e infraestrutura de transporte bem organizada.', date: '2024-03-05' }
    ],
    stats: [
      { label: 'Frota Própria', value: '500+', icon: 'ship' },
      { label: 'Centros Logísticos', value: '15', icon: 'globe' },
      { label: 'Carga/Mês', value: '50k ton', icon: 'trending' }
    ],
    products: [
      { 
        title: 'Transporte Intermodal', 
        slug: 'transporte-intermodal',
        category: 'Logística',
        description: 'Soluções integradas de mar, terra e ar com baixa emissão de CO2.',
        imageUrl: 'https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&q=80&w=800'
      }
    ]
  },
  {
    id: '4',
    name: 'Pampa Carnes',
    slug: 'pampa-carnes',
    country: 'Argentina',
    countryCode: 'AR',
    region: 'MERCOSUL',
    logoColor: '#C8943A',
    bannerUrl: 'https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&q=80&w=2000',
    sector: { name: 'Alimentos & Bebidas' },
    shortDescription: 'Carnes premium da Patagônia. Produção e exportação de carnes bovinas de alta qualidade.',
    fullDescription: 'Herdeira da tradição gaúcha argentina, a Pampa Carnes exporta os cortes mais nobres da Patagônia para os principais restaurantes da Europa. Nosso gado é criado a pasto, garantindo sabores únicos e certificação orgânica para mercados exigentes.',
    website: 'https://pampacarnes.com.ar',
    address: 'Av. Corrientes 1234, C1043 Buenos Aires, Argentina',
    socialLinks: {
      instagram: 'https://instagram.com/pampacarnes',
      facebook: 'https://facebook.com/pampacarnes'
    },
    rating: 4.6,
    reviews: [
      { id: 'r5', userName: 'Gerrit Bosch', rating: 5, comment: 'Melhor carne argentina que já importamos.', date: '2024-02-28' }
    ]
  },
  {
    id: '5',
    name: 'Iberfinance',
    slug: 'iberfinance',
    country: 'Espanha',
    countryCode: 'ES',
    region: 'EU',
    logoColor: '#2A4A72',
    bannerUrl: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=2000',
    sector: { name: 'Financeiro' },
    shortDescription: 'Soluções financeiras transatlânticas. Consultoria focada em investimentos internacionais.',
    fullDescription: 'A Iberfinance é especializada em assessoria financeira de fusões e aquisições (M&A) entre empresas da América Latina e Europa. Temos escritórios em Madrid e São Paulo para suavizar a complexidade regulatória e cambial entre os dois blocos.',
    website: 'https://iberfinance.es',
    address: 'Paseo de la Castellana, 200, 28046 Madrid, Espanha',
    socialLinks: {
      linkedin: 'https://linkedin.com/company/iberfinance'
    },
    rating: 4.9,
    reviews: [
      { id: 'r6', userName: 'Eduardo Lima', rating: 5, comment: 'Consultoria fundamental para nossa expansão na Europa.', date: '2024-03-15' }
    ]
  },
  {
    id: '6',
    name: 'MedTech Uruguay',
    slug: 'medtech-uruguay',
    country: 'Uruguai',
    countryCode: 'UY',
    region: 'MERCOSUL',
    logoColor: '#009688',
    bannerUrl: 'https://images.unsplash.com/photo-1504813184591-01572f98c85f?auto=format&fit=crop&q=80&w=2000',
    sector: { name: 'Saúde' },
    shortDescription: 'Serviços digitais de saúde e telemedicina com validação técnica em centros de pesquisa europeus.',
    fullDescription: 'Especializada em HealthTech, a MedTech Uruguay opera sistemas de diagnóstico remoto e telemedicina. Através de parcerias com institutos de Berlim, a empresa valida protocolos de atendimento digital para exportação de serviços de saúde para o Mercosul.',
    website: 'https://medtech.uy',
    address: 'WTC Free Zone, Dr. Luis Bonavita 1294, Montevideo, Uruguai',
    socialLinks: {
      linkedin: 'https://linkedin.com/company/medtech-uruguay',
      instagram: 'https://instagram.com/medtechuy'
    },
    rating: 4.8,
    reviews: [
      { id: 'r7', userName: 'Hans Müller', rating: 5, comment: 'Tecnologia de ponta com um custo-benefício incrível.', date: '2024-03-01' }
    ]
  },
  {
    id: '7',
    name: 'GreenEnergy EU',
    slug: 'greenenergy-eu',
    country: 'Dinamarca',
    countryCode: 'DK',
    region: 'EU',
    logoColor: '#4CAF50',
    bannerUrl: 'https://images.unsplash.com/photo-1466611653911-95282fc3656b?auto=format&fit=crop&q=80&w=2000',
    sector: { name: 'Energia' },
    shortDescription: 'Líder em soluções de energia eólica e renováveis na Escandinávia.',
    fullDescription: 'A GreenEnergy EU fornece tecnologia de turbinas eólicas e sistemas de armazenamento de energia para mercados emergentes. Estamos expandindo para o Brasil para apoiar a transição energética do Mercosul.',
    website: 'https://greenenergy.dk',
    address: 'Vesterbrogade 12, 1620 Copenhagen, Dinamarca',
    socialLinks: {
      linkedin: 'https://linkedin.com/company/greenenergy-eu'
    },
    rating: 5.0,
    reviews: [
      { id: 'r8', userName: 'Olaf Jensen', rating: 5, comment: 'Tecnologia excepcional e compromisso ambiental.', date: '2024-04-01' }
    ]
  },
  {
    id: '8',
    name: 'Vinhos do Vale',
    slug: 'vinhos-do-vale',
    country: 'Brasil',
    countryCode: 'BR',
    region: 'MERCOSUL',
    logoColor: '#673AB7',
    bannerUrl: 'https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?auto=format&fit=crop&q=80&w=2000',
    sector: { name: 'Alimentos & Bebidas' },
    shortDescription: 'Vinhos premium do Vale dos Vinhedos. O melhor brinde brasileiro para a Europa.',
    fullDescription: 'Produzimos vinhos de alta gama com reconhecimento internacional. Nossa vinícola utiliza métodos tradicionais combinados com tecnologia moderna de fermentação.',
    website: 'https://vinhosdovale.com.br',
    address: 'Bento Gonçalves, Rio Grande do Sul, Brasil',
    socialLinks: {
      instagram: 'https://instagram.com/vinhosdovale'
    },
    rating: 4.7,
    reviews: [
      { id: 'r9', userName: 'Marco Polo', rating: 4, comment: 'Excelentes vinhos, competem com os europeus.', date: '2024-03-22' }
    ]
  },
  {
    id: '9',
    name: 'EuroConsult France',
    slug: 'euroconsult-france',
    country: 'França',
    countryCode: 'FR',
    region: 'EU',
    logoColor: '#3F51B5',
    bannerUrl: 'https://images.unsplash.com/photo-1454165833767-131435bb4496?auto=format&fit=crop&q=80&w=2000',
    sector: { name: 'Financeiro' },
    shortDescription: 'Assessoria em exportação e regulação para o mercado europeu.',
    fullDescription: 'A EuroConsult auxilia empresas do Mercosul a navegarem pelas complexas normas aduaneiras e sanitárias da União Europeia. Especialistas em conformidade e licenciamento.',
    website: 'https://euroconsult.fr',
    address: 'Rue de la Paix, Paris, França',
    socialLinks: {
      linkedin: 'https://linkedin.com/company/euroconsult'
    },
    rating: 4.8,
    reviews: [
      { id: 'r10', userName: 'Lucie Berger', rating: 5, comment: 'Conhecimento profundo das normas da UE.', date: '2024-02-10' }
    ]
  },
  {
    id: '10',
    name: 'BioSeeds Brazil',
    slug: 'bioseeds-brazil',
    country: 'Brasil',
    countryCode: 'BR',
    region: 'MERCOSUL',
    logoColor: '#2E7D32',
    bannerUrl: 'https://images.unsplash.com/photo-1625246333195-78d9c38ad449?auto=format&fit=crop&q=80&w=2000',
    sector: { name: 'Agronegócio' },
    shortDescription: 'Biotecnologia aplicada ao campo para safras resilientes.',
    fullDescription: 'A BioSeeds foca em pesquisa e desenvolvimento de sementes adaptadas a climas extremos, garantindo segurança alimentar em escala global. Parceira de institutos europeus de biotecnologia.',
    website: 'https://bioseeds.com.br',
    address: 'Polo Tecnológico, Ribeirão Preto - SP, Brasil',
    socialLinks: {
      linkedin: 'https://linkedin.com/company/bioseeds-br'
    },
    rating: 4.9,
    reviews: [
      { id: 'r11', userName: 'Stefan Koch', rating: 5, comment: 'Sementes de altíssima qualidade técnica.', date: '2024-04-15' }
    ]
  },
  {
    id: '11',
    name: 'Alentejo Oils',
    slug: 'alentejo-oils',
    country: 'Portugal',
    countryCode: 'PT',
    region: 'EU',
    logoColor: '#827717',
    bannerUrl: 'https://images.unsplash.com/photo-1474979266404-7eaacabc88c5?auto=format&fit=crop&q=80&w=2000',
    sector: { name: 'Alimentos & Bebidas' },
    shortDescription: 'O azeite mais puro do Alentejo para a mesa sul-americana.',
    fullDescription: 'Especializada em azeites extra virgens de baixa acidez, a Alentejo Oils combina métodos de prensa a frio milenares com logística moderna para exportação para o Mercosul.',
    website: 'https://alentejo-oils.pt',
    address: 'Évora, Alentejo, Portugal',
    socialLinks: {
      instagram: 'https://instagram.com/alentejooils'
    },
    rating: 4.7,
    reviews: [
      { id: 'r12', userName: 'Mariana Costa', rating: 4, comment: 'Sabor autêntico e embalagens premium.', date: '2024-03-30' }
    ]
  },
  {
    id: '12',
    name: 'Buenos Aires Fintech',
    slug: 'ba-fintech',
    country: 'Argentina',
    countryCode: 'AR',
    region: 'MERCOSUL',
    logoColor: '#01579B',
    bannerUrl: 'https://images.unsplash.com/photo-1551288049-bbbda536ad0a?auto=format&fit=crop&q=80&w=2000',
    sector: { name: 'Financeiro' },
    shortDescription: 'Plataforma de liquidação e pagamentos para transações comerciais entre América Latina e Europa.',
    fullDescription: 'A Buenos Aires Fintech opera um sistema de liquidação para transações B2B internacionais. A plataforma reduz custos operacionais e o tempo de compensação de câmbio para empresas exportadoras do Mercosul.',
    website: 'https://bafintech.ar',
    address: 'Puerto Madero, Buenos Aires, Argentina',
    socialLinks: {
      linkedin: 'https://linkedin.com/company/ba-fintech'
    },
    rating: 4.6,
    reviews: [
      { id: 'r13', userName: 'Diego Gonzalez', rating: 5, comment: 'Transações rápidas e custo imbatível.', date: '2024-04-10' }
    ]
  }
]

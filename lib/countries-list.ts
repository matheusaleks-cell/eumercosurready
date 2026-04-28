// lib/countries-list.ts

export interface Country {
  code: string;
  name: string;
  name_en?: string;
  name_es?: string;
  bloc: 'EU' | 'Mercosul';
}

export const countriesList: Country[] = [
  // Mercosul
  { code: 'AR', name: 'Argentina', name_en: 'Argentina', name_es: 'Argentina', bloc: 'Mercosul' },
  { code: 'BO', name: 'Bolívia', name_en: 'Bolivia', name_es: 'Bolivia', bloc: 'Mercosul' },
  { code: 'BR', name: 'Brasil', name_en: 'Brazil', name_es: 'Brasil', bloc: 'Mercosul' },
  { code: 'PY', name: 'Paraguai', name_en: 'Paraguay', name_es: 'Paraguay', bloc: 'Mercosul' },
  { code: 'UY', name: 'Uruguai', name_en: 'Uruguay', name_es: 'Uruguay', bloc: 'Mercosul' },
  
  // União Europeia
  { code: 'DE', name: 'Alemanha', name_en: 'Germany', name_es: 'Alemania', bloc: 'EU' },
  { code: 'AT', name: 'Áustria', name_en: 'Austria', name_es: 'Austria', bloc: 'EU' },
  { code: 'BE', name: 'Bélgica', name_en: 'Belgium', name_es: 'Bélgica', bloc: 'EU' },
  { code: 'BG', name: 'Bulgária', name_en: 'Bulgaria', name_es: 'Bulgaria', bloc: 'EU' },
  { code: 'CY', name: 'Chipre', name_en: 'Cyprus', name_es: 'Chipre', bloc: 'EU' },
  { code: 'HR', name: 'Croácia', name_en: 'Croatia', name_es: 'Croacia', bloc: 'EU' },
  { code: 'DK', name: 'Dinamarca', name_en: 'Denmark', name_es: 'Dinamarca', bloc: 'EU' },
  { code: 'SK', name: 'Eslováquia', name_en: 'Slovakia', name_es: 'Eslovaquia', bloc: 'EU' },
  { code: 'SI', name: 'Eslovênia', name_en: 'Slovenia', name_es: 'Eslovenia', bloc: 'EU' },
  { code: 'ES', name: 'Espanha', name_en: 'Spain', name_es: 'España', bloc: 'EU' },
  { code: 'EE', name: 'Estônia', name_en: 'Estonia', name_es: 'Estonia', bloc: 'EU' },
  { code: 'FI', name: 'Finlândia', name_en: 'Finland', name_es: 'Finlandia', bloc: 'EU' },
  { code: 'FR', name: 'França', name_en: 'France', name_es: 'Francia', bloc: 'EU' },
  { code: 'GR', name: 'Grécia', name_en: 'Greece', name_es: 'Grecia', bloc: 'EU' },
  { code: 'HU', name: 'Hungria', name_en: 'Hungary', name_es: 'Hungría', bloc: 'EU' },
  { code: 'IE', name: 'Irlanda', name_en: 'Ireland', name_es: 'Irlanda', bloc: 'EU' },
  { code: 'IT', name: 'Itália', name_en: 'Italy', name_es: 'Italia', bloc: 'EU' },
  { code: 'LV', name: 'Letônia', name_en: 'Latvia', name_es: 'Letonia', bloc: 'EU' },
  { code: 'LT', name: 'Lituânia', name_en: 'Lithuania', name_es: 'Lituania', bloc: 'EU' },
  { code: 'LU', name: 'Luxemburgo', name_en: 'Luxembourg', name_es: 'Luxemburgo' , bloc: 'EU' },
  { code: 'MT', name: 'Malta', name_en: 'Malta', name_es: 'Malta', bloc: 'EU' },
  { code: 'NL', name: 'Países Baixos', name_en: 'Netherlands', name_es: 'Países Bajos', bloc: 'EU' },
  { code: 'PL', name: 'Polônia', name_en: 'Poland', name_es: 'Polonia', bloc: 'EU' },
  { code: 'PT', name: 'Portugal', name_en: 'Portugal', name_es: 'Portugal', bloc: 'EU' },
  { code: 'CZ', name: 'República Tcheca', name_en: 'Czech Republic', name_es: 'República Checa', bloc: 'EU' },
  { code: 'RO', name: 'Romênia', name_en: 'Romania', name_es: 'Rumanía', bloc: 'EU' },
  { code: 'SE', name: 'Suécia', name_en: 'Sweden', name_es: 'Suecia', bloc: 'EU' }
];

// lib/countries-list.ts

export interface Country {
  code: string;
  name: string;
  name_en?: string;
  name_es?: string;
  bloc: 'EU' | 'Mercosul';
  ddi: string;
}

export const countriesList: Country[] = [
  // Mercosul
  { code: 'AR', name: 'Argentina', name_en: 'Argentina', name_es: 'Argentina', bloc: 'Mercosul', ddi: '54' },
  { code: 'BO', name: 'Bolívia', name_en: 'Bolivia', name_es: 'Bolivia', bloc: 'Mercosul', ddi: '591' },
  { code: 'BR', name: 'Brasil', name_en: 'Brazil', name_es: 'Brasil', bloc: 'Mercosul', ddi: '55' },
  { code: 'PY', name: 'Paraguai', name_en: 'Paraguay', name_es: 'Paraguay', bloc: 'Mercosul', ddi: '595' },
  { code: 'UY', name: 'Uruguai', name_en: 'Uruguay', name_es: 'Uruguay', bloc: 'Mercosul', ddi: '598' },
  
  // União Europeia
  { code: 'DE', name: 'Alemanha', name_en: 'Germany', name_es: 'Alemania', bloc: 'EU', ddi: '49' },
  { code: 'AT', name: 'Áustria', name_en: 'Austria', name_es: 'Austria', bloc: 'EU', ddi: '43' },
  { code: 'BE', name: 'Bélgica', name_en: 'Belgium', name_es: 'Bélgica', bloc: 'EU', ddi: '32' },
  { code: 'BG', name: 'Bulgária', name_en: 'Bulgaria', name_es: 'Bulgaria', bloc: 'EU', ddi: '359' },
  { code: 'CY', name: 'Chipre', name_en: 'Cyprus', name_es: 'Chipre', bloc: 'EU', ddi: '357' },
  { code: 'HR', name: 'Croácia', name_en: 'Croatia', name_es: 'Croacia', bloc: 'EU', ddi: '385' },
  { code: 'DK', name: 'Dinamarca', name_en: 'Denmark', name_es: 'Dinamarca', bloc: 'EU', ddi: '45' },
  { code: 'SK', name: 'Eslováquia', name_en: 'Slovakia', name_es: 'Eslovaquia', bloc: 'EU', ddi: '421' },
  { code: 'SI', name: 'Eslovênia', name_en: 'Slovenia', name_es: 'Eslovenia', bloc: 'EU', ddi: '386' },
  { code: 'ES', name: 'Espanha', name_en: 'Spain', name_es: 'España', bloc: 'EU', ddi: '34' },
  { code: 'EE', name: 'Estônia', name_en: 'Estonia', name_es: 'Estonia', bloc: 'EU', ddi: '372' },
  { code: 'FI', name: 'Finlândia', name_en: 'Finland', name_es: 'Finlandia', bloc: 'EU', ddi: '358' },
  { code: 'FR', name: 'França', name_en: 'France', name_es: 'Francia', bloc: 'EU', ddi: '33' },
  { code: 'GR', name: 'Grécia', name_en: 'Greece', name_es: 'Grecia', bloc: 'EU', ddi: '30' },
  { code: 'HU', name: 'Hungria', name_en: 'Hungary', name_es: 'Hungría', bloc: 'EU', ddi: '36' },
  { code: 'IE', name: 'Irlanda', name_en: 'Ireland', name_es: 'Irlanda', bloc: 'EU', ddi: '353' },
  { code: 'IT', name: 'Itália', name_en: 'Italy', name_es: 'Italia', bloc: 'EU', ddi: '39' },
  { code: 'LV', name: 'Letônia', name_en: 'Latvia', name_es: 'Letonia', bloc: 'EU', ddi: '371' },
  { code: 'LT', name: 'Lituânia', name_en: 'Lithuania', name_es: 'Lituania', bloc: 'EU', ddi: '370' },
  { code: 'LU', name: 'Luxemburgo', name_en: 'Luxembourg', name_es: 'Luxemburgo' , bloc: 'EU', ddi: '352' },
  { code: 'MT', name: 'Malta', name_en: 'Malta', name_es: 'Malta', bloc: 'EU', ddi: '356' },
  { code: 'NL', name: 'Países Baixos', name_en: 'Netherlands', name_es: 'Países Bajos', bloc: 'EU', ddi: '31' },
  { code: 'PL', name: 'Polônia', name_en: 'Poland', name_es: 'Polonia', bloc: 'EU', ddi: '48' },
  { code: 'PT', name: 'Portugal', name_en: 'Portugal', name_es: 'Portugal', bloc: 'EU', ddi: '351' },
  { code: 'CZ', name: 'República Tcheca', name_en: 'Czech Republic', name_es: 'República Checa', bloc: 'EU', ddi: '420' },
  { code: 'RO', name: 'Romênia', name_en: 'Romania', name_es: 'Rumanía', bloc: 'EU', ddi: '40' },
  { code: 'SE', name: 'Suécia', name_en: 'Sweden', name_es: 'Suecia', bloc: 'EU', ddi: '46' }
];

import * as deepl from 'deepl-node';

const authKey = process.env.DEEPL_API_KEY || '';
const translator = authKey ? new deepl.Translator(authKey) : null;

export type TargetLanguage = 'pt-BR' | 'es' | 'en-US';

export async function translateText(text: string, targetLang: TargetLanguage, sourceLang: deepl.SourceLanguageCode = 'pt') {
  if (!authKey) {
    console.warn('DeepL API Key não configurada. Retornando texto original.');
    return text;
  }

  if (!text || text.trim() === '') return '';

  try {
    // Configurações otimizadas para B2B: tom formal e preservação de estrutura
    const options: deepl.TranslateTextOptions = {
      tagHandling: 'html',
    };

    // A opção formality só é suportada por alguns idiomas (DE, FR, IT, ES, NL, PL, PT-BR, PT-PT, RU).
    // Inglês (EN-US/EN-GB) NÃO suporta.
    if (targetLang === 'es' || targetLang === 'pt-BR') {
      options.formality = 'more';
    }

    const result = await translator!.translateText(text, sourceLang, targetLang, options);
    return result.text;
  } catch (error: any) {
    console.error('DeepL Translation Error:', error);
    
    // Tratamento de erro amigável para limites de cota
    if (error.message?.includes('limit exceeded')) {
      console.error('Cota do DeepL excedida.');
    }
    
    return text;
  }
}

export default translator;

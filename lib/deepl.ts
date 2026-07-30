import * as deepl from 'deepl-node';

const authKey = process.env.DEEPL_API_KEY || '';
const translator = authKey ? new deepl.Translator(authKey) : null;

export type TargetLanguage = 'pt-BR' | 'es' | 'en-US';

/** Lançado quando a tradução não pôde ser realizada (chave ausente, cota excedida, erro de API).
 *  Os chamadores devem tratar esse erro explicitamente e NUNCA persistir o texto original
 *  como se fosse a tradução final — isso "prende" o campo para sempre como não-traduzido. */
export class TranslationUnavailableError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'TranslationUnavailableError';
  }
}

export async function translateText(text: string, targetLang: TargetLanguage, sourceLang: deepl.SourceLanguageCode = 'pt'): Promise<string> {
  if (!text || text.trim() === '') return '';

  if (!translator) {
    throw new TranslationUnavailableError('DEEPL_API_KEY_MISSING');
  }

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

    const result = await translator.translateText(text, sourceLang, targetLang, options);
    return result.text;
  } catch (error: any) {
    console.error('DeepL Translation Error:', error);
    throw new TranslationUnavailableError(error?.message || 'DEEPL_REQUEST_FAILED');
  }
}

export default translator;

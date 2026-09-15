import type { Dictionary } from '@/content/dictionary';
import { DICTIONARY } from '@/content/dictionary';
import type { Lang, LocalizedText } from '@/types/i18n';

/** 初期レンダリングは常に ja 固定（設計書 §4-3）。サーバー・クライアントで不整合を起こさないため。 */
export const DEFAULT_LANG: Lang = 'ja';

export const LANG_STORAGE_KEY = 'portfolio-wafu:lang';

export function isLang(value: string | null): value is Lang {
  return value === 'ja' || value === 'en';
}

export function pickText(text: LocalizedText, lang: Lang): string {
  return text[lang];
}

export function getDictionary(lang: Lang): Dictionary {
  return DICTIONARY[lang];
}

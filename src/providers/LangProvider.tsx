'use client';

import { createContext, useEffect, useSyncExternalStore, type ReactNode } from 'react';
import type { Lang } from '@/types/i18n';
import { getLangServerSnapshot, getLangSnapshot, setLang, subscribeToLang } from '@/lib/langStore';

export interface LangContextValue {
  readonly lang: Lang;
  readonly setLang: (lang: Lang) => void;
}

export const LangContext = createContext<LangContextValue | null>(null);

/**
 * 単一ルート + 辞書 + クライアント状態方式（設計書 §4）。
 * 初期表示は常に ja。localStorage の適用は `lib/langStore.ts` の
 * `useSyncExternalStore` 経由でマウント後にのみ反映され、ハイドレーション不整合を
 * 起こさない（§4-3）。
 */
export function LangProvider({ children }: { children: ReactNode }) {
  const lang = useSyncExternalStore(subscribeToLang, getLangSnapshot, getLangServerSnapshot);

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  return <LangContext.Provider value={{ lang, setLang }}>{children}</LangContext.Provider>;
}

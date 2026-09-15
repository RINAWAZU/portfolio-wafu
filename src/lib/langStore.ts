import type { Lang } from '@/types/i18n';
import { DEFAULT_LANG, LANG_STORAGE_KEY, isLang } from './i18n';

/**
 * `lang` の実体を localStorage と同期する小さな外部ストア。
 *
 * 設計書 §4-3 は「初期レンダリングは常に ja」「localStorage の適用はマウント後の
 * useEffect 内でのみ」を要求している。`useSyncExternalStore` はこの要求を
 * 満たす React 公式の仕組みで、`useEffect` 内で直接 `setState` するパターンは
 * cascading re-render を招くとして eslint-plugin-react-hooks（React Compiler 対応版）
 * が禁止しているため、こちらに寄せている。
 *
 * - サーバー描画・ハイドレーション直後は必ず `getServerSnapshot`（= ja）が使われる。
 * - ハイドレーション完了後、React が自動的に `getSnapshot` を再評価し、
 *   localStorage に保存された言語と異なれば再レンダリングする。
 *   このタイミングで初めて localStorage を読む＝実質的に「マウント後」の適用になる。
 */

let currentLang: Lang = DEFAULT_LANG;
let hasHydratedFromStorage = false;
const listeners = new Set<() => void>();

/**
 * localStorage へのアクセスは必ず try/catch で包むこと。
 * Cookie・サイトデータを全ブロックした設定や一部の埋め込み文脈では、
 * 読み書きどころか `window.localStorage` に触れるだけで `SecurityError` を投げる。
 * `getLangSnapshot` は `useSyncExternalStore` の getSnapshot として**レンダリング中に**
 * 呼ばれるため、ここで例外が漏れると `LangProvider` 配下＝サイト全体が白画面になる。
 */
export function getLangSnapshot(): Lang {
  if (!hasHydratedFromStorage) {
    // 失敗しても既定値で動き続ける。フラグは成否に関わらず立て、毎レンダリングでの再試行を防ぐ。
    hasHydratedFromStorage = true;
    try {
      const stored = window.localStorage.getItem(LANG_STORAGE_KEY);
      currentLang = isLang(stored) ? stored : DEFAULT_LANG;
    } catch {
      currentLang = DEFAULT_LANG;
    }
  }
  return currentLang;
}

export function getLangServerSnapshot(): Lang {
  return DEFAULT_LANG;
}

export function setLang(next: Lang): void {
  currentLang = next;
  hasHydratedFromStorage = true;
  try {
    window.localStorage.setItem(LANG_STORAGE_KEY, next);
  } catch {
    // 保存できない環境でも、そのセッション中の切替は動く（永続化だけを諦める）。
  }
  listeners.forEach((listener) => listener());
}

export function subscribeToLang(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

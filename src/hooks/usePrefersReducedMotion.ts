'use client';

import { useSyncExternalStore } from 'react';

const QUERY = '(prefers-reduced-motion: reduce)';

function subscribe(callback: () => void): () => void {
  const mediaQuery = window.matchMedia(QUERY);
  mediaQuery.addEventListener('change', callback);
  return () => mediaQuery.removeEventListener('change', callback);
}

function getSnapshot(): boolean {
  return window.matchMedia(QUERY).matches;
}

function getServerSnapshot(): boolean {
  // サーバーでは判定不可能。通常モーションを既定とする。
  return false;
}

/**
 * `prefers-reduced-motion: reduce` を統一的に判定する唯一のフック（設計書 §9-5）。
 *
 * ブラウザの MediaQueryList という外部システムを購読するため、
 * `useEffect` 内での `setState` ではなく `useSyncExternalStore` を使う
 * （effect 内で直接 setState するとカスケード再レンダリングを招くため）。
 */
export function usePrefersReducedMotion(): boolean {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

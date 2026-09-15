'use client';

import { useEffect, useRef, useState, type RefObject } from 'react';

export interface UseInViewOnceResult<T extends HTMLElement> {
  readonly ref: RefObject<T | null>;
  readonly inView: boolean;
}

/**
 * IntersectionObserver で「1度だけ」進入を検知する（設計書 §9-2）。
 *
 * 初期値は true（＝可視）にしている。SSR された HTML を可視のまま保つことで
 * JS 無効時にコンテンツが消えず、LCP も悪化しない。マウント後、実際に画面外だった
 * 要素だけを false にして観測を始める（初回の IntersectionObserver コールバックで判定）。
 */
export function useInViewOnce<T extends HTMLElement>(): UseInViewOnceResult<T> {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(true);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    let hasRevealed = false;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          hasRevealed = true;
          setInView(true);
          observer.disconnect();
        } else if (!hasRevealed) {
          setInView(false);
        }
      },
      { rootMargin: '0px 0px -15% 0px', threshold: 0 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return { ref, inView };
}

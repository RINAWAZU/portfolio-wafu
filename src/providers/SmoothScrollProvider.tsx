'use client';

import Lenis from 'lenis';
import { useEffect, useMemo, useRef, type ReactNode } from 'react';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import { ScrollProgressContext, type ScrollProgress, type ScrollSubscriber } from '@/hooks/useScrollProgress';

/**
 * ページ全体の慣性スクロール（lerp 0.08）を提供し、季節演出のスクロール値の
 * 供給源も兼ねる（設計書 §2-2, §8-1, T13）。
 *
 * `prefers-reduced-motion: reduce` のときは Lenis を初期化せず、ネイティブスクロールに
 * 戻す（§9-5）。どちらのモードでも `useScrollProgress()` は同じインターフェースを返す。
 *
 * Context の値そのもの（getScrollY / subscribe という関数の組）は初回レンダリングで
 * 固定し、以後変化させない。スクロールのたびに変わるのは購読者へのコールバック引数
 * （scrollY の数値）だけであり、Context の再配布（＝ツリー全体の再レンダリング）は
 * 発生しない（§5-3, §11）。
 */
export function SmoothScrollProvider({ children }: { children: ReactNode }) {
  const prefersReducedMotion = usePrefersReducedMotion();
  const scrollYRef = useRef(0);
  const subscribersRef = useRef(new Set<ScrollSubscriber>());

  // レンダー中に ref.current を直接読まない（react-hooks/refs）。
  // クロージャに ref オブジェクトそのものを閉じ込め、実際の .current 読み書きは
  // すべて後で呼ばれるコールバック内に閉じる。空配列の useMemo により、
  // このオブジェクト自体は初回レンダリングで固定され、以後作り直されない。
  const contextValue = useMemo<ScrollProgress>(
    () => ({
      getScrollY: () => scrollYRef.current,
      subscribe: (subscriber) => {
        subscribersRef.current.add(subscriber);
        return () => {
          subscribersRef.current.delete(subscriber);
        };
      },
    }),
    [],
  );

  useEffect(() => {
    const notify = (scrollY: number) => {
      scrollYRef.current = scrollY;
      subscribersRef.current.forEach((subscriber) => subscriber(scrollY));
    };

    if (prefersReducedMotion) {
      let ticking = false;
      const onNativeScroll = () => {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(() => {
          notify(window.scrollY);
          ticking = false;
        });
      };
      window.addEventListener('scroll', onNativeScroll, { passive: true });
      notify(window.scrollY);
      return () => window.removeEventListener('scroll', onNativeScroll);
    }

    const lenis = new Lenis({ lerp: 0.08 });
    const onLenisScroll = (instance: Lenis) => notify(instance.scroll);
    lenis.on('scroll', onLenisScroll);
    // 初期値を1回流す。ブラウザのスクロール位置復元でページ途中から再読込されたとき、
    // 最初の scroll イベントが来るまで季節が初期値（新緑）のままになるのを防ぐ
    // （価セクションで再読込すると紅葉のはずが新緑で表示されていた）。
    notify(lenis.scroll);

    let rafId = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, [prefersReducedMotion]);

  return <ScrollProgressContext.Provider value={contextValue}>{children}</ScrollProgressContext.Provider>;
}

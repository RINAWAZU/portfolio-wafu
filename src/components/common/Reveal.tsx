'use client';

import { createElement, type ReactNode } from 'react';
import { useInViewOnce } from '@/hooks/useInViewOnce';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';

export interface RevealProps {
  readonly children: ReactNode;
  /** ms。段階表示（短冊・プラン・年表）用。80ms刻み・最大5段まで（設計書 §9-2） */
  readonly delay?: number;
  readonly as?: 'div' | 'li' | 'section';
  /**
   * ラッパー自身に付けるクラス。`Reveal` は要素を1つ増やすため、
   * グリッド／フレックスの子を包むときは**元の子が持っていたレイアウト用クラスを
   * ここへ移す**こと。移さないとラッパー側がレイアウト項目になり配置が崩れる。
   */
  readonly className?: string;
}

/**
 * 進入時に「下から24px + opacity 0→1」（設計書 §9-2）。
 * SSR された HTML は可視のままにし、ハイドレーション後に画面外の要素だけを隠して
 * 観測を始める（`useInViewOnce` 側の責務）。
 */
export function Reveal({ children, delay = 0, as = 'div', className = '' }: RevealProps) {
  const { ref, inView } = useInViewOnce<HTMLElement>();
  const prefersReducedMotion = usePrefersReducedMotion();

  const transitionClass = prefersReducedMotion
    ? 'transition-opacity duration-300 ease-out'
    : 'transition-[opacity,transform] duration-[1.2s] ease-slow';
  const hiddenClass = prefersReducedMotion ? 'opacity-0' : 'opacity-0 translate-y-6';

  // 3種類のタグを1つの変数で扱うため、JSX ではなく createElement で組み立てる
  // （JSX の intrinsic 要素は要素ごとに ref 型が異なり、動的なタグ名と両立しないため）。
  return createElement(
    as,
    {
      ref,
      className: `${className} ${transitionClass} ${inView ? 'translate-y-0 opacity-100' : hiddenClass}`.trim(),
      style: delay ? { transitionDelay: `${delay}ms` } : undefined,
    },
    children,
  );
}

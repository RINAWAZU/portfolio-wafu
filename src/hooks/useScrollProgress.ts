'use client';

import { createContext, useContext } from 'react';

export type ScrollSubscriber = (scrollY: number) => void;

/**
 * Lenis の有無に関わらず同じインターフェースでスクロール値を供給する（設計書 §6-1, T13）。
 * `subscribe` は rAF に同期して呼ばれる。React state は経由しない
 * （呼び出し側が setState すると毎フレーム再レンダリングが走ってしまうため）。
 */
export interface ScrollProgress {
  readonly getScrollY: () => number;
  readonly subscribe: (subscriber: ScrollSubscriber) => () => void;
}

export const ScrollProgressContext = createContext<ScrollProgress | null>(null);

export function useScrollProgress(): ScrollProgress {
  const context = useContext(ScrollProgressContext);
  if (!context) {
    throw new Error('useScrollProgress must be used within SmoothScrollProvider');
  }
  return context;
}

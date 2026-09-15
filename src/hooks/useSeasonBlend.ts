'use client';

import { useSyncExternalStore } from 'react';
import { getDominantSeason, getSeasonBlend, subscribeToDominantSeason } from '@/lib/seasonRuntime';
import type { SeasonBlend } from '@/types/season';

/**
 * 季節の「支配的な値（離散）」を購読するフック。
 *
 * 更新はページ全体で最大3回（設計書 §11）。SeasonController が rAF 内で計算した
 * SeasonBlend を publish しており、このフックは dominant が変わった時だけ
 * 再レンダリングされる（useSyncExternalStore の snapshot 比較を dominant 単体で行うため）。
 *
 * 毎フレーム変化する連続値（t）が必要な場面はここでは想定していない。
 * 滑らかな値は CSS 変数（--season-op-* / --season-glow 等）を直接参照すること。
 */
export function useSeasonBlend(): SeasonBlend {
  useSyncExternalStore(subscribeToDominantSeason, getDominantSeason, getDominantSeason);
  return getSeasonBlend();
}

import type { Season, SeasonBlend } from '@/types/season';

/**
 * 季節の「支配的な値（離散）」だけを外部から購読可能にする小さなストア。
 *
 * 連続値（t、opacity 4本、glow/beam/filter）は React の外（CSS カスタムプロパティ）で
 * 完結させ、この store には触れさせない（設計書 §5-3, §11）。
 * ここで扱うのは「ラベル表示用に dominant が変わった」という、ページ全体で
 * 最大3回しか起きないイベントだけ。SeasonController が唯一の書き込み手（publish）で、
 * useSeasonBlend が唯一の読み手（subscribe）。
 */

const INITIAL_BLEND: SeasonBlend = { from: 'spring', to: 'spring', t: 0, dominant: 'spring' };

let currentBlend: SeasonBlend = INITIAL_BLEND;
const dominantListeners = new Set<() => void>();

export function getSeasonBlend(): SeasonBlend {
  return currentBlend;
}

export function getDominantSeason(): Season {
  return currentBlend.dominant;
}

/** SeasonController から毎フレーム呼ばれる。dominant が変わったときだけ購読者に通知する。 */
export function publishSeasonBlend(blend: SeasonBlend): void {
  const dominantChanged = blend.dominant !== currentBlend.dominant;
  currentBlend = blend;
  if (dominantChanged) {
    dominantListeners.forEach((listener) => listener());
  }
}

export function subscribeToDominantSeason(listener: () => void): () => void {
  dominantListeners.add(listener);
  return () => dominantListeners.delete(listener);
}

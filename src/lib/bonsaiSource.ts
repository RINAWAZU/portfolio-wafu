import type { Season } from '@/types/season';

export type BonsaiAsset =
  | { readonly kind: 'image'; readonly layers: Readonly<Record<Season, string>>; readonly alt: string }
  | { readonly kind: 'model'; readonly src: string };

/**
 * 差し替え境界（設計書 §6-3）。
 *
 * ① 初期実装（現在）: 4季節すべてが同じ静止画を指す。4レイヤーの重ね合わせ構造・
 *    クロスフェード機構はここで完成させておき、季節差は CSS 変数
 *   （--season-filter / --season-glow / --season-beam）が担う（§5-4）。
 * ② 季節別静止画が4枚揃ったら、このマップの4パスを差し替えるだけでよい。
 * ③ GLB + R3F 化のときは `{ kind: 'model', src }` を返すよう分岐を1つ追加し、
 *    `BonsaiVisual` 側にも分岐を1つ追加する。
 */
export function resolveBonsaiAsset(): BonsaiAsset {
  const front = '/assets/bonsai/front.webp';
  return {
    kind: 'image',
    layers: {
      spring: front,
      summer: front,
      autumn: front,
      winter: front,
    },
    alt: '',
  };
}

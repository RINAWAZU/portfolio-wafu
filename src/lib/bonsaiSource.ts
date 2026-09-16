import type { Season } from '@/types/season';

export type BonsaiAsset =
  | { readonly kind: 'image'; readonly layers: Readonly<Record<Season, string>>; readonly alt: string }
  | { readonly kind: 'model'; readonly src: string };

/**
 * 差し替え境界（設計書 §6-3）。
 *
 * ① 初期実装: 4季節すべてが同じ静止画を指す（`image`）。
 * ② 季節別静止画が4枚揃ったら、そのマップの4パスを差し替えるだけでよい。
 * ③ 現在（F03）: GLB + R3F の 3D 実装（`model`）。
 *
 * 素材は写真から起こした浮き彫り（レリーフ）で、正面固定で額装して見せる。
 * 正面 / 側面 / 背面の 3 点を同じ手順で最適化済みなので、見せ方を変えたくなったら
 * 下の 1 行を `bonsai-side.glb` / `bonsai-back.glb` に差し替えるだけでよい。
 *
 * 季節差は静止画実装と同じく CSS の `--season-filter` が担い、3D 側は
 * CSS では出せない立体の陰影（斜光）だけを受け持つ（§5-4）。
 */
export function resolveBonsaiAsset(): BonsaiAsset {
  return { kind: 'model', src: '/assets/bonsai/bonsai-front.glb' };
}

/**
 * 静止画へ戻すときの実装。3D が重い端末向けのフォールバックとして残す。
 * （現状どこからも呼んでいない。切り戻しは resolveBonsaiAsset の返り値を差し替える）
 */
export function resolveBonsaiImageAsset(): Extract<BonsaiAsset, { kind: 'image' }> {
  const front = '/assets/bonsai/front.webp';
  return {
    kind: 'image',
    layers: { spring: front, summer: front, autumn: front, winter: front },
    alt: '',
  };
}

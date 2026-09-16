import type { Season } from '@/types/season';

export type BonsaiAsset =
  | { readonly kind: 'image'; readonly layers: Readonly<Record<Season, string>>; readonly alt: string }
  | { readonly kind: 'model'; readonly src: string };

/**
 * 差し替え境界（設計書 §6-3）。
 *
 * ① 初期実装: 4季節すべてが同じ静止画を指す（`image`）。
 * ② 季節別静止画が4枚揃ったら、そのマップの4パスを差し替えるだけでよい。
 * ③ F03 で GLB + R3F の 3D 実装（`model`）に切り替えたが、2026-09-16 の実機確認で
 *    サイト全体の質感を下げていると判断し、静止画に戻した。
 *    素材が写真1枚から起こした浮き彫り板で、テクスチャを持てず色を頂点に焼き込む
 *    しかないため、精細化しても和風トンマナの中で浮いてしまうのが理由。
 *    3D 実装（BonsaiModel / 最適化済み GLB 3点）はそのまま残してあるので、
 *    下の return を `resolveBonsaiModelAsset()` に差し替えれば 3D に戻る。
 */
export function resolveBonsaiAsset(): BonsaiAsset {
  return resolveBonsaiImageAsset();
}

/** 3D 実装（F03）。正面 / 側面 / 背面の 3 点を最適化済み。 */
export function resolveBonsaiModelAsset(): Extract<BonsaiAsset, { kind: 'model' }> {
  return { kind: 'model', src: '/assets/bonsai/bonsai-front.glb' };
}

/** 現行の静止画実装。4季節すべてが同じ画像を指す（季節差は --season-filter が担う）。 */
export function resolveBonsaiImageAsset(): Extract<BonsaiAsset, { kind: 'image' }> {
  const front = '/assets/bonsai/front.webp';
  return {
    kind: 'image',
    layers: { spring: front, summer: front, autumn: front, winter: front },
    alt: '',
  };
}

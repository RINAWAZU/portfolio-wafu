import { resolveBonsaiAsset } from '@/lib/bonsaiSource';
import { BonsaiImage } from './BonsaiImage';

/**
 * 差し替え境界。中身の実装を選ぶだけ（設計書 §6-3）。
 *
 * 後日 GLB + R3F に差し替えるときは、ここに
 * `next/dynamic(() => import('./BonsaiModel'), { ssr: false })` の分岐を1つ追加する。
 * `BonsaiFigure` 以上の呼び出し側は変更しない。
 */
export function BonsaiVisual() {
  const asset = resolveBonsaiAsset();

  if (asset.kind === 'model') {
    // 後日（F03）: next/dynamic で BonsaiModel を ssr:false で読み込む
    return null;
  }

  return <BonsaiImage asset={asset} />;
}

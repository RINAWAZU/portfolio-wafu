import { resolveBonsaiAsset } from '@/lib/bonsaiSource';
import { BonsaiImage } from './BonsaiImage';
import { BonsaiModelLoader } from './BonsaiModelLoader';

/**
 * 差し替え境界。中身の実装を選ぶだけ（設計書 §6-3）。
 * BonsaiFigure 以上の呼び出し側はこのファイルの分岐を知らない。
 */
export function BonsaiVisual() {
  const asset = resolveBonsaiAsset();

  if (asset.kind === 'model') {
    return <BonsaiModelLoader src={asset.src} />;
  }

  return <BonsaiImage asset={asset} />;
}

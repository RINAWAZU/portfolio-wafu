import Image from 'next/image';
import type { BonsaiAsset } from '@/lib/bonsaiSource';
import type { Season } from '@/types/season';

const SEASONS: readonly Season[] = ['spring', 'summer', 'autumn', 'winter'];

export interface BonsaiImageProps {
  readonly asset: Extract<BonsaiAsset, { kind: 'image' }>;
}

/**
 * 静止画実装（初期）。4つの季節レイヤーを重ね、`--season-op-*` でクロスフェードする。
 * JS はレイヤーの存在を知らない ─ SeasonController が documentElement に
 * 数値を書き込むだけで、合成はブラウザのコンポジタが担当する（§5-3, §6-3）。
 *
 * モーション（呼吸）は「中身」の責務としてここに置く。マスク・光の帯・キャプションは
 * 「額縁」（BonsaiFigure）の責務であり、ここでは扱わない。
 */
export function BonsaiImage({ asset }: BonsaiImageProps) {
  return (
    <div className="bonsai-breathe relative h-full w-full" style={{ filter: 'var(--season-filter)' }}>
      {SEASONS.map((season) => (
        <Image
          key={season}
          src={asset.layers[season]}
          alt={asset.alt}
          fill
          // 序で最初に見えるのは新緑の1枚だけ。4枚すべてを priority にすると、
          // F01（季節別4枚への差し替え）でパスを変えた瞬間に初期転送が4倍になる（設計書 §13-2）。
          // 差し替えるだけで済むはずの後日フェーズに性能の地雷を残さないため、今のうちに分けておく。
          priority={season === 'spring'}
          loading={season === 'spring' ? undefined : 'lazy'}
          sizes="(min-width: 768px) 34vw, 70vw"
          className="object-cover"
          style={{ opacity: `var(--season-op-${season})`, willChange: 'opacity' }}
        />
      ))}
    </div>
  );
}

'use client';

import type { CSSProperties, ReactNode } from 'react';
import { useLang } from '@/hooks/useLang';

export interface TategakiProps {
  readonly children: ReactNode;
  /** `vertical-rl` 適用時の行送り方向の長さ(実質的な「高さ」)。横書きへ縮退時は使わない */
  readonly height?: string;
  readonly className?: string;
}

/**
 * 縦書き。`writing-mode` を書いてよい唯一の場所（設計書 §4-4, §6-2）。
 * `ja` かつ `md` 以上でのみ縦書きを適用し、`en` またはモバイルでは横書きへ縮退する。
 *
 * `height` は `md:` 以上・`ja` のときだけ CSS 変数経由で適用する。無条件に適用すると
 * 横書きに縮退したモバイル/EN で意味のない縦長の空白ボックスができてしまう
 * (SideNav の教訓と同種の「幅・高さが本当に収まるか」の罠)。
 */
export function Tategaki({ children, height, className = '' }: TategakiProps) {
  const { lang } = useLang();
  const vertical = lang === 'ja';
  const verticalClass = vertical ? 'md:[writing-mode:vertical-rl]' : '';
  const heightClass = height && vertical ? 'md:h-[var(--tategaki-h)]' : '';
  const style = height && vertical ? ({ '--tategaki-h': height } as CSSProperties) : undefined;

  return (
    <div className={`${verticalClass} ${heightClass} ${className}`.trim()} style={style}>
      {children}
    </div>
  );
}

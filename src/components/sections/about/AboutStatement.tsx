'use client';

import { Tategaki } from '@/components/common/Tategaki';
import { useLang } from '@/hooks/useLang';
import { getDictionary } from '@/lib/i18n';

/**
 * 我の3行ステートメント。デスクトップ(ja)は縦書き(lh 2.4 / tracking .14em)、
 * モバイル・EN は横書きへ縮退する(ハイファイ §14 T18 / `Tategaki` に委譲)。
 *
 * 高さ 520px は右の写真の高さと対になる値（`AboutProfile` 参照）。
 * 見出しとの間隔は `About` 側のグリッドが持つ（右ブロックと開始位置を揃えるため）。
 *
 * `md:w-fit`: `vertical-rl` は右端から左へ流れるため、ブロックを幅いっぱいに広げると
 * 文字がブロックの右端に張り付く。内容幅に縮めることで左端から並ぶ。
 *
 * 当初は `xl` 以上で `w-full` に戻し、仕様書 §5.3 の「左に余白を大きく取り、文字を
 * 右に寄せる」非対称構成にしていた。しかし実機確認で、右カラムの写真+紹介文と合わせて
 * 我セクションのブロックが軒並み右端に寄って見える（2026-09-16 社長指摘）ため、
 * 全幅で `w-fit` に統一し、縦書きを左端に置く構成へ変更した。
 */
export function AboutStatement() {
  const { lang } = useLang();
  const [line1, line2, line3] = getDictionary(lang).about.statement;

  return (
    <Tategaki
      height="520px"
      className="font-mincho text-[clamp(1.25rem,1.9vw,1.75rem)] font-semibold leading-[2.4] tracking-vert text-gofun md:w-fit"
    >
      <span className="block">{line1}</span>
      <span className="block">{line2}</span>
      <span className="block">{line3}</span>
    </Tategaki>
  );
}

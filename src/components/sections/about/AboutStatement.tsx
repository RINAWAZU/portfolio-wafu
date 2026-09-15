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
 * `md:w-fit`: 1カラム表示のときブロックがコンテンツ幅いっぱいに広がると、
 * `vertical-rl` は右端から流れるため文字が画面の右端まで飛んで左に大きな空白ができる。
 * 内容幅に縮めて見出しの真下に置く。2カラムになる `xl` 以上では列幅いっぱいに戻し、
 * 仕様書 §5.3 の「左に余白を大きく取り、文字を右に寄せる」非対称構成にする。
 *
 * `xl` 側が `w-auto` ではなく `w-full` なのは、縦書きでは `width` が行方向ではなく
 * **ブロック方向**になり、`auto` が「内容の列数ぶんに縮む」挙動になるため。
 * グリッド項目だったときは stretch で伸びていたが、`Reveal` で1段包んだ時点で
 * 内容幅に縮んで文字が左へ寄ってしまった（実測 416px → 197px）。
 */
export function AboutStatement() {
  const { lang } = useLang();
  const [line1, line2, line3] = getDictionary(lang).about.statement;

  return (
    <Tategaki
      height="520px"
      className="font-mincho text-[clamp(1.25rem,1.9vw,1.75rem)] font-semibold leading-[2.4] tracking-vert text-gofun md:w-fit xl:w-full"
    >
      <span className="block">{line1}</span>
      <span className="block">{line2}</span>
      <span className="block">{line3}</span>
    </Tategaki>
  );
}

'use client';

import { useLang } from '@/hooks/useLang';
import { useSeasonBlend } from '@/hooks/useSeasonBlend';
import { SEASON_LABEL } from '@/content/dictionary';
import { BonsaiVisual } from './BonsaiVisual';

/**
 * 額縁。マスク・光の帯・季節キャプションは画像でも3Dでも共通の意匠であり、
 * 中身の実装（BonsaiVisual）に依存しない（設計書 §6-3）。
 * サイズは `--bonsai-w` を外部（BonsaiStage）から与えられる。
 *
 * アクセシビリティ（§13-4）: 盆栽そのものは装飾なので画像とマスク・光の帯を
 * aria-hidden にする。季節キャプションは情報なので、意図的に aria-hidden の
 * スコープの外（隣接する兄弟要素）に置いている。祖先に aria-hidden を掛けると
 * 子要素が aria-hidden="false" を持っていても支援技術からは隠れたままになるため、
 * 「装飾部分にだけ aria-hidden を付ける」方式を取っている。
 */
export function BonsaiFigure() {
  const { lang } = useLang();
  const { dominant } = useSeasonBlend();

  return (
    <div className="relative">
      <div
        aria-hidden="true"
        // 幅の遷移は BonsaiStage の位置・不透明度と同じ 1.6s・同じ曲線に揃える。
        // 長さがずれると「縮んでから移動する」ように見え、一連の動きに感じられない。
        className="aspect-[158/248] w-[var(--bonsai-w)] transition-[width] duration-[1.6s] ease-[cubic-bezier(0.65,0,0.35,1)] [mask-image:radial-gradient(ellipse_at_50%_55%,black_55%,transparent_82%)] [-webkit-mask-image:radial-gradient(ellipse_at_50%_55%,black_55%,transparent_82%)]"
      >
        <BonsaiVisual />
        <div
          className="absolute -inset-x-[14%] bottom-[8%] h-px"
          style={{
            background: 'linear-gradient(90deg, transparent, var(--season-beam) 30%, var(--season-beam) 70%, transparent)',
          }}
        />
      </div>
      <p className="absolute bottom-[-24px] left-0 whitespace-nowrap font-mono text-[10px] tracking-[.2em] text-kincha">
        BONSAI · {SEASON_LABEL[dominant][lang]}
      </p>
    </div>
  );
}

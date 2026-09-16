import type { SkillLevel } from '@/types/content';

export interface SkillLevelBarProps {
  readonly level: SkillLevel;
}

const MAX_LEVEL = 5;

/** `▮▮▮▮▯` の5段階表示(設計書 §6-4)。 */
export function SkillLevelBar({ level }: SkillLevelBarProps) {
  const filled = '▮'.repeat(level);
  const empty = '▯'.repeat(MAX_LEVEL - level);

  // 色は真朱。金茶を生成（和紙）面に乗せると実測 1.96:1 で目盛りがほぼ見えない。
  // 読み上げには sr-only の「4 / 5」があるが、目で見る側はこの目盛りが唯一の手がかりなので
  // 非テキストの 3:1 を満たす必要がある（真朱で 5.51:1）。
  // `shrink-0`: 5段階の目盛りは意味を持つ固定幅。狭い画面で縮めて折り返させない。
  return (
    <span className="inline-flex shrink-0 items-center gap-1">
      <span aria-hidden="true" className="font-mono text-xs tracking-[.1em] text-shinshu">
        {filled}
        {empty}
      </span>
      <span className="sr-only">{`${level} / ${MAX_LEVEL}`}</span>
    </span>
  );
}

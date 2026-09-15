import type { SkillLevel } from '@/types/content';

export interface SkillLevelBarProps {
  readonly level: SkillLevel;
}

const MAX_LEVEL = 5;

/** `▮▮▮▮▯` の5段階表示(設計書 §6-4)。 */
export function SkillLevelBar({ level }: SkillLevelBarProps) {
  const filled = '▮'.repeat(level);
  const empty = '▯'.repeat(MAX_LEVEL - level);

  // `shrink-0`: 5段階の目盛りは意味を持つ固定幅。狭い画面で縮めて折り返させない。
  return (
    <span className="inline-flex shrink-0 items-center gap-1">
      <span aria-hidden="true" className="font-mono text-xs tracking-[.1em] text-kincha">
        {filled}
        {empty}
      </span>
      <span className="sr-only">{`${level} / ${MAX_LEVEL}`}</span>
    </span>
  );
}

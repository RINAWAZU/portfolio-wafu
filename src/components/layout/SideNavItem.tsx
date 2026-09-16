import { BrushGlyph, type BrushChar } from '@/components/common/BrushGlyph';
import type { SectionId } from '@/types/content';

export interface SideNavItemProps {
  readonly id: SectionId;
  readonly glyph: BrushChar;
  readonly latin: string;
  readonly active: boolean;
  /** 生成面（明るい和紙背景）に重なっているか。非アクティブ時の文字色を反転させる。 */
  readonly onKinari: boolean;
}

export function SideNavItem({ id, glyph, latin, active, onKinari }: SideNavItemProps) {
  const inactiveTextClass = onKinari ? 'text-sumi/60' : 'text-gofun/60';
  // 現在地の緑は面ごとに明度を変える。原色 #4f7a5a は墨面 2.87:1 / 生成面 3.57:1 で
  // どちらも足りず、「今どこにいるか」が読み取れない（T27 実測）。
  const activeClass = onKinari
    ? 'border-matsuba-on-kinari text-matsuba-on-kinari'
    : 'border-matsuba-on-dark text-matsuba-on-dark';

  return (
    <a
      href={`#${id}`}
      aria-current={active ? 'true' : undefined}
      className={`border-r pr-1.5 font-latin text-[11px] tracking-latin transition-colors duration-[0.4s] ease-out ${
        active ? activeClass : `border-transparent ${inactiveTextClass}`
      }`}
    >
      <BrushGlyph char={glyph} className="text-[15px] tracking-normal" />
      <span className="side-nav-latin hidden lg:inline">&nbsp;{latin}</span>
    </a>
  );
}

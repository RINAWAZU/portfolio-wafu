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

  return (
    <a
      href={`#${id}`}
      aria-current={active ? 'true' : undefined}
      className={`border-r pr-1.5 font-latin text-[11px] tracking-latin transition-colors duration-[0.4s] ease-out ${
        active ? 'border-matsuba-bright text-matsuba-bright' : `border-transparent ${inactiveTextClass}`
      }`}
    >
      <BrushGlyph char={glyph} className="text-[15px] tracking-normal" />
      <span className="side-nav-latin hidden lg:inline">&nbsp;{latin}</span>
    </a>
  );
}

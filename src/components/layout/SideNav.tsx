'use client';

import { BrushGlyph, type BrushChar } from '@/components/common/BrushGlyph';
import { SideNavItem } from './SideNavItem';
import { useActiveSection } from '@/hooks/useActiveSection';
import { useOnKinari } from '@/hooks/useOnKinari';
import type { SectionId } from '@/types/content';

const NAV_ITEMS: ReadonlyArray<{ readonly id: SectionId; readonly glyph: BrushChar; readonly latin: string }> = [
  { id: 'prologue', glyph: '序', latin: 'PROLOGUE' },
  { id: 'about', glyph: '我', latin: 'ABOUT' },
  { id: 'works', glyph: '作', latin: 'WORKS' },
  { id: 'skills', glyph: '技', latin: 'SKILLS' },
  { id: 'career', glyph: '歴', latin: 'CAREER' },
  { id: 'pricing', glyph: '価', latin: 'PRICING' },
  { id: 'contact', glyph: '結', latin: 'CONTACT' },
];

/**
 * 左固定の縦ナビ。現在地表示（設計書 §6-2, §13-4）。`useActiveSection` を内部に閉じる。
 * 生成面（明るい和紙背景）に重なっている間は、胡粉色の文字が背景に同化するため墨色へ切り替える。
 * 面の判定は `useOnKinari` に集約している（固定レイヤーごとに書き写さないこと）。
 */
export function SideNav() {
  const active = useActiveSection();
  const onKinari = useOnKinari();

  return (
    <nav
      aria-label="セクション"
      className={`fixed inset-y-0 left-0 z-[20] flex w-nav flex-col items-center border-r py-9 transition-colors duration-[0.4s] ease-out ${
        onKinari ? 'border-hairline-dark' : 'border-hairline'
      }`}
    >
      <a href="#prologue" className={`transition-colors duration-[0.4s] ease-out ${onKinari ? 'text-sumi' : 'text-gofun'}`}>
        <BrushGlyph char="麟" animate="wipe" className="text-[44px] leading-none" />
      </a>
      {/*
        ハイファイ原本（和風リメイク ハイファイ）に合わせ、ラベル列は
        `writing-mode: vertical-rl` で縦流しにする。これにより和文グリフ＋
        （縦回転した）欧文ラベルの幅が 96px の縦ナビ幅に収まる。
        `flex`（row のまま）と組み合わせることで、行内軸＝縦方向に沿って
        7項目が上から下へ並ぶ（`flex-col` にすると軸がずれて崩れるので使わない）。
      */}
      <div className="mt-14 flex gap-[26px] [writing-mode:vertical-rl]">
        {NAV_ITEMS.map((item) => (
          <SideNavItem key={item.id} {...item} active={active === item.id} onKinari={onKinari} />
        ))}
      </div>
    </nav>
  );
}

import type { ReactNode } from 'react';
import type { SectionId } from '@/types/content';
import { WashiOverlay } from './WashiOverlay';

export type SectionSurface = 'wood' | 'works' | 'washi';

const SURFACE_CLASS: Record<SectionSurface, string> = {
  // 'wood' はあえて背景を持たない。layout.tsx の WoodBackdrop（固定1枚）を透過させることで
  // 「同じ床の上を移動している」感覚を作るため（設計書 §9-3）。
  wood: '',
  works: 'surface-works',
  // 生成面は面ごと文字色を墨へ反転させる。body の既定色は胡粉（墨面向けのほぼ白）であり、
  // 色を明示し忘れた子孫が生成り背景に同化して読めなくなるため、面の側で基準色を定める。
  washi: 'surface-washi text-sumi',
};

export interface SectionProps {
  readonly id: SectionId;
  readonly surface: SectionSurface;
  readonly children: ReactNode;
  /** セクション上端の罫線。先頭セクション（序）だけ false にする */
  readonly divider?: boolean;
}

/**
 * 面の種別・上下余白・id・max-width・左ナビ分のオフセットを一枚岩で管理する（設計書 §6-2）。
 * `id` は季節アンカーの実測対象でもあるため、`SectionId` 型以外の値を入れないこと。
 */
export function Section({ id, surface, children, divider = true }: SectionProps) {
  return (
    <section
      id={id}
      className={`relative py-section-sm pr-6 pl-[calc(var(--spacing-nav)+24px)] md:py-section md:pr-12 md:pl-[160px] ${
        divider ? 'border-t border-hairline' : ''
      } ${SURFACE_CLASS[surface]}`}
    >
      {surface === 'washi' && <WashiOverlay />}
      <div className="relative mx-auto max-w-page">{children}</div>
    </section>
  );
}

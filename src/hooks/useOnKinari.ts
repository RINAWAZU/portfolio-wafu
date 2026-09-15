'use client';

import { useActiveSection } from './useActiveSection';
import type { SectionId } from '@/types/content';

/**
 * 生成（和紙）面の背景を持つセクション。TOKENS.md「技・歴・価 生成」に一致し、
 * `Section` の `surface="washi"` と同じ判定基準。
 */
export const KINARI_SECTIONS: ReadonlySet<SectionId> = new Set(['skills', 'career', 'pricing']);

/**
 * 「いま画面に出ているセクションが明るい生成面か」を返す。
 *
 * `position: fixed` で全セクションの上に居座る要素（縦ナビ・EN/JP切替・盆栽）は、
 * 背景の明暗が変わっても自分の色を変えないと、明るい面で同化するか暗い面で沈む。
 * この判定を各コンポーネントに書き写すと必ず取りこぼしが出る（実際に `SideNav` だけ
 * 対応して `LangSwitch` が取り残され、生成面で 1.16:1 まで落ちていた）ため、
 * 固定レイヤーは全てこのフックを使うこと。
 */
export function useOnKinari(): boolean {
  return KINARI_SECTIONS.has(useActiveSection());
}

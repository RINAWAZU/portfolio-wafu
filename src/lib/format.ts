import type { Plan } from '@/types/content';

/** 69800 → '¥69,800'（設計書 §7-1: 価格は整数で持ち、表示側で整形する）。 */
export function formatYen(price: number): string {
  return `¥${price.toLocaleString('ja-JP')}`;
}

/**
 * プラン1件の価格表示。制作は「¥69,800〜」、保守は「¥9,800/月〜」。
 * 「〜」は下限であることを示すもので、全プラン共通で付ける（ワイヤーフレーム #3a）。
 */
export function formatPlanPrice(plan: Plan): string {
  const suffix = plan.unit === 'month' ? '/月〜' : '〜';
  return `${formatYen(plan.price)}${suffix}`;
}

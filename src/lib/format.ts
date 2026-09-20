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

/**
 * URL の末尾セグメントから `@handle` 表記を導く（結の外部リンクと作の GitHub 導線が共用）。
 * ラベルとは別にハンドル文字列を持たせると URL との二重管理になるため、URL から導く。
 */
export function handleFromHref(href: string): string {
  try {
    const url = new URL(href);
    const last = url.pathname.replace(/\/$/, '').split('/').pop();
    return last ? `@${last}` : href;
  } catch {
    return href;
  }
}

import type { Plan } from '@/types/content';
import { useLang } from '@/hooks/useLang';
import { formatPlanPrice } from '@/lib/format';
import { pickText } from '@/lib/i18n';

export interface PlanCompactRowProps {
  readonly plan: Plan;
}

/**
 * 保守プラン1行(設計書 §6-4)。`highlight` は金茶の薄面。
 *
 * 外側・内側とも `flex-wrap` にすること。EN のプラン名＋バッジ（'Standard' +
 * 'Recommended'）は和文より横に長く、狭い画面では1行に収まらずに価格を枠外へ
 * 押し出していた（2026-09-20 実測: 320px で 49px、360px で 9px はみ出し。JP は余裕あり）。
 * 収まらないときはバッジと価格を下の行へ落とす。
 */
export function PlanCompactRow({ plan }: PlanCompactRowProps) {
  const { lang } = useLang();

  return (
    <div
      className={`flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1 border-b border-hairline-dark px-4 py-3 last:border-b-0 ${
        plan.highlight ? 'bg-kincha/[0.12]' : ''
      }`}
    >
      <span className="flex flex-wrap items-baseline gap-x-2 font-mincho text-sm font-semibold text-sumi">
        {pickText(plan.name, lang)}
        {plan.badge && (
          <span className="font-mono text-[9px] tracking-[.1em] text-shinshu">{pickText(plan.badge, lang)}</span>
        )}
      </span>
      <span className="font-mincho text-base text-sumi">{formatPlanPrice(plan)}</span>
    </div>
  );
}

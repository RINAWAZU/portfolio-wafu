import type { Plan } from '@/types/content';
import { useLang } from '@/hooks/useLang';
import { formatPlanPrice } from '@/lib/format';
import { pickText } from '@/lib/i18n';

export interface PlanCompactRowProps {
  readonly plan: Plan;
}

/** 保守プラン1行(設計書 §6-4)。`highlight` は金茶の薄面。 */
export function PlanCompactRow({ plan }: PlanCompactRowProps) {
  const { lang } = useLang();

  return (
    <div
      className={`flex items-baseline justify-between gap-3 border-b border-hairline-dark px-4 py-3 last:border-b-0 ${
        plan.highlight ? 'bg-kincha/[0.12]' : ''
      }`}
    >
      <span className="flex items-baseline gap-2 font-mincho text-sm font-semibold text-sumi">
        {pickText(plan.name, lang)}
        {plan.badge && (
          <span className="font-mono text-[9px] tracking-[.1em] text-shinshu">{pickText(plan.badge, lang)}</span>
        )}
      </span>
      <span className="font-mincho text-base text-sumi">{formatPlanPrice(plan)}</span>
    </div>
  );
}

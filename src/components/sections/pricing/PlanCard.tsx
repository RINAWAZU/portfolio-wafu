import type { Plan } from '@/types/content';
import { useLang } from '@/hooks/useLang';
import { formatPlanPrice } from '@/lib/format';
import { pickText } from '@/lib/i18n';

export interface PlanCardProps {
  readonly plan: Plan;
}

/** 制作プラン1枚(設計書 §6-4)。`highlight` のプランは金茶の薄面で強調する。 */
export function PlanCard({ plan }: PlanCardProps) {
  const { lang } = useLang();

  return (
    <div
      className={`border-r border-hairline-dark p-5 last:border-r-0 ${plan.highlight ? 'bg-kincha/[0.12]' : ''}`}
    >
      <div className="flex flex-wrap items-baseline gap-2">
        <span className="font-mincho text-base font-semibold text-sumi">{pickText(plan.name, lang)}</span>
        {plan.badge && (
          <span className="border border-shinshu px-1.5 py-0.5 font-mono text-[9px] tracking-[.15em] text-shinshu">
            {pickText(plan.badge, lang)}
          </span>
        )}
      </div>
      {plan.scope && <p className="mt-1 font-mono text-[11px] text-sumi/55">{pickText(plan.scope, lang)}</p>}
      <p className="mt-3 font-mincho text-xl text-sumi">{formatPlanPrice(plan)}</p>
      <ul className="mt-3 flex flex-col gap-1.5 border-t border-hairline-dark pt-2.5 text-caption leading-relaxed text-sumi/75">
        {plan.features.map((feature) => (
          <li key={pickText(feature, lang)}>— {pickText(feature, lang)}</li>
        ))}
      </ul>
    </div>
  );
}

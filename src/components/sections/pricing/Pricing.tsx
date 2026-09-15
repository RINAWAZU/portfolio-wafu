'use client';

import { Disclosure } from '@/components/common/Disclosure';
import { Reveal } from '@/components/common/Reveal';
import { Section } from '@/components/common/Section';
import { SectionHeading } from '@/components/common/SectionHeading';
import { MAINTENANCE_PLANS, PRICE_OPTIONS, PRODUCTION_PLANS, VALUE_POINTS } from '@/content/pricing';
import { useLang } from '@/hooks/useLang';
import { getDictionary } from '@/lib/i18n';
import { OptionList } from './OptionList';
import { PlanCard } from './PlanCard';
import { PlanCompactRow } from './PlanCompactRow';
import { ValuePoints } from './ValuePoints';

/**
 * 価(Pricing)。価値訴求 + 制作3プラン + 保守(折りたたみ) + オプション(折りたたみ)(設計書 §14 T22)。
 * 価格は `formatPlanPrice`(内部で `formatYen` を使用)経由で表示する。
 * このセクション中央で季節が紅葉100%になる(`id="pricing"` が季節アンカー、§5-1)。
 */
export function Pricing() {
  const { lang } = useLang();
  const t = getDictionary(lang).pricing;
  const [leadPre, leadEmphasis, leadPost] = t.lead;

  return (
    <Section id="pricing" surface="washi">
      <div className="flex flex-col justify-between gap-8 md:flex-row md:items-start">
        <SectionHeading glyph="価" latin="PRICING" tone="on-kinari" />
        <p className="max-w-[480px] font-mincho text-lg leading-relaxed text-sumi">
          {leadPre}
          <span className="text-shinshu">{leadEmphasis}</span>
          {leadPost}
        </p>
      </div>

      {/*
        価値訴求3点は見出し右のリード文に抱き合わせず、下の制作3プランと同じ横幅・同じ3分割で
        独立した帯として置く。右カラムに入れると塊が右へ寄り、左半分が空いて重心が崩れるため。
      */}
      <Reveal>
        <ValuePoints points={VALUE_POINTS} />
      </Reveal>

      <Reveal delay={80} className="mt-16">
        <p className="font-latin text-xs tracking-latin text-sumi/50 uppercase">{t.groupProduction}</p>
        <div className="mt-4 grid grid-cols-1 border border-hairline-dark md:grid-cols-3">
          {PRODUCTION_PLANS.map((plan) => (
            <PlanCard key={plan.id} plan={plan} />
          ))}
        </div>
      </Reveal>

      <Reveal delay={160} className="mt-10 border border-hairline-dark">
        <Disclosure summary={t.groupMaintenance}>
          <div className="flex flex-col">
            {MAINTENANCE_PLANS.map((plan) => (
              <PlanCompactRow key={plan.id} plan={plan} />
            ))}
          </div>
        </Disclosure>
        <Disclosure summary={t.groupOptions}>
          <OptionList options={PRICE_OPTIONS} />
        </Disclosure>
      </Reveal>
    </Section>
  );
}

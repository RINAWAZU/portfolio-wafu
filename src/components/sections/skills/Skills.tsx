'use client';

import { Section } from '@/components/common/Section';
import { Reveal } from '@/components/common/Reveal';
import { SectionHeading } from '@/components/common/SectionHeading';
import { SKILL_GROUPS } from '@/content/skills';
import { useLang } from '@/hooks/useLang';
import { getDictionary } from '@/lib/i18n';
import { SkillColumn } from './SkillColumn';

/** 技(Skills)。生成面+和紙オーバーレイ。4カラム(`< md` は2カラム)(設計書 §14 T20)。 */
export function Skills() {
  const { lang } = useLang();
  const t = getDictionary(lang).skills;

  return (
    <Section id="skills" surface="washi">
      <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
        <SectionHeading glyph="技" latin="SKILLS" tone="on-kinari" />
        <p className="max-w-[440px] text-caption leading-body text-sumi/75">{t.sub}</p>
      </div>

      {/*
        4カラムは1カラムあたり約150pxの内容幅（最長の「GSAP / ScrollTrigger」＋目盛り）を要する。
        左ナビ分の余白を引くと `md`(768px) では約84pxしか取れず、技術名が単語の途中で改行される。
        実測に基づき 1 → 2 → 4 カラムの切り替えを sm / lg に置く。
      */}
      <Reveal className="mt-14 grid grid-cols-1 gap-x-6 gap-y-8 border-t border-hairline-dark sm:grid-cols-2 lg:grid-cols-4 lg:gap-x-0 lg:gap-y-0">
        {SKILL_GROUPS.map((group) => (
          <SkillColumn key={group.no} group={group} />
        ))}
      </Reveal>
    </Section>
  );
}

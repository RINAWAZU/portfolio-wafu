'use client';

import { Section } from '@/components/common/Section';
import { Reveal } from '@/components/common/Reveal';
import { SectionHeading } from '@/components/common/SectionHeading';
import { CAREER_ENTRIES } from '@/content/career';
import { CareerEntryView } from './CareerEntryView';

/** 歴(Career)。デスクトップは横一列5分割、`< md` は縦(設計書 §14 T21)。会社名なし。 */
export function Career() {
  return (
    <Section id="career" surface="washi">
      <SectionHeading glyph="歴" latin="CAREER" tone="on-kinari" />

      {/*
        横一列の5分割は1セルあたり約115pxの内容幅を要する。左ナビ分の余白を引くと
        `md`(768px) では約64pxしか取れず和文が4文字ごとに改行される。
        実測に基づき `lg` から横一列に切り替え、それ未満は縦の年表にする。
      */}
      <Reveal className="mt-14 flex flex-col gap-3 border-t border-hairline-dark pt-3 lg:grid lg:grid-cols-5 lg:gap-0 lg:pt-0">
        {CAREER_ENTRIES.map((entry) => (
          <CareerEntryView key={entry.when} entry={entry} />
        ))}
      </Reveal>
    </Section>
  );
}

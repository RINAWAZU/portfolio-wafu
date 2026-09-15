'use client';

import { Section } from '@/components/common/Section';
import { Reveal } from '@/components/common/Reveal';
import { SectionHeading } from '@/components/common/SectionHeading';
import { AboutProfile } from './AboutProfile';
import { AboutStatement } from './AboutStatement';

/**
 * 我(About)。左に縦書きステートメント、右に写真+紹介文が隣接(設計書 §14 T18)。
 *
 * 見出しはグリッドの外（上）に置く。中に入れて左カラムの一部にすると、
 * 左は「見出しの高さ + 72px」・右は固定 96px の余白から始まることになり、
 * 見出しの高さが clamp で可変なぶん両ブロックの開始位置が必ずずれる（実測で 77px）。
 * 見出しを行から外し、縦書きと写真+紹介文を同じ行の先頭から揃える。
 *
 * 2カラム化は `xl`(1280px)から。写真+紹介文の組は 416+36+300 = 752px を要するため、
 * それ未満の幅で2カラムにすると右カラムが潰れて写真と紹介文が縦積みになる。
 * `xl` 未満では1カラム(ステートメントの下に写真+紹介文)とし、
 * 横幅いっぱいを使うことで写真と紹介文の横並びを維持する。
 */
export function About() {
  return (
    <Section id="about" surface="wood">
      <SectionHeading glyph="我" latin="ABOUT" tone="on-dark" />

      <div className="mt-[72px] grid grid-cols-1 items-start gap-10 xl:grid-cols-[minmax(0,1fr)_auto] xl:gap-16">
        <Reveal>
          <AboutStatement />
        </Reveal>
        <Reveal delay={80}>
          <AboutProfile />
        </Reveal>
      </div>
    </Section>
  );
}

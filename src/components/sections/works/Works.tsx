'use client';

import { Section } from '@/components/common/Section';
import { Reveal } from '@/components/common/Reveal';
import { SectionHeading } from '@/components/common/SectionHeading';
import { WORKS } from '@/content/works';
import { useLang } from '@/hooks/useLang';
import { WorkRow } from './WorkRow';
import { WorkTanzaku } from './WorkTanzaku';
import { WorksSummary } from './WorksSummary';

/**
 * 作(Works)。松葉の面。左に `ADOPTED PROJECTS / 十二`、右に短冊を右から並べる(設計書 §14 T19)。
 *
 * `content/works.ts` の `WORKS` にオブジェクトを1件追加するだけで短冊が1枚増える
 * (件数・落款の有無・破線枠はすべて `Work` のフィールドから導出。ハードコードしない)。
 * デスクトップ(`WorkTanzaku`)とモバイル(`WorkRow`)は `hidden md:flex` で排他的に描画し、
 * スクリーンリーダーの二重読み上げを避ける(§6-4)。
 */
export function Works() {
  // `en` は短冊タイトルが横書きへ縮退し(§4-4)、固定幅では6件分の合計が
  // 行の幅を超えて横スクロールを起こす。`flex-1` で行自体にも残り幅を明示的に
  // 割り当て、`WorkTanzaku` 側の `flex-1` と連動させて必ず収まるようにする。
  const { lang } = useLang();

  return (
    <Section id="works" surface="works">
      <SectionHeading glyph="作" latin="WORKS" tone="on-dark" />

      {/*
        短冊(ja)は 104px 固定 × 6枚 + gap = 674px を必要とし、縮まない。
        そのため面の構成を幅で三段に分ける:
          < lg          … 短冊を出さず `WorkRow`(横書きの行)にする
          lg 〜 xl 未満 … 概要を上に積み、短冊行にコンテンツ幅いっぱい(≧674px)を渡す
          xl 以上       … ワイヤーフレーム #3a どおり 概要を左・短冊を右に並置する
        `md` で並置すると 674px + 概要180px + gap48px = 902px を確保できず
        ページ全体が横スクロールする(834px 幅の実測で発覚)。
      */}
      <div className="mt-14 flex flex-col gap-10 xl:flex-row xl:items-stretch xl:justify-between xl:gap-12">
        <Reveal>
          <WorksSummary />
        </Reveal>

        {/* デスクトップ: 短冊(縦書き)を右から並べる */}
        <div className={`hidden flex-row-reverse gap-2.5 lg:flex ${lang === 'en' ? 'min-w-0 flex-1' : ''}`}>
          {WORKS.map((work) => (
            <WorkTanzaku key={work.id} work={work} />
          ))}
        </div>

        {/* モバイル・タブレット: 短冊1行(横書き) */}
        <div className="flex flex-col gap-2.5 lg:hidden">
          {WORKS.map((work) => (
            <WorkRow key={work.id} work={work} />
          ))}
        </div>
      </div>
    </Section>
  );
}

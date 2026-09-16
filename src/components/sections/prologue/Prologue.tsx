'use client';

import { KiriGlow } from '@/components/common/KiriGlow';
import { useLang } from '@/hooks/useLang';
import { getDictionary } from '@/lib/i18n';
import { SHOW_BONSAI, SHOW_KIRI_GLOW } from '@/lib/features';
import { ScrollCue } from './ScrollCue';

/**
 * 序（Prologue）。ヒーロー。設計書 §6-4。
 *
 * `BonsaiStage` は `layout.tsx` 側の独立した固定レイヤーであり、ここには置かない。
 * このセクションは盆栽が視覚的に重なる位置に空きスペースを確保するだけ
 * （正確なハイファイ実寸との整合は Phase 2 / T17 で仕上げる。骨格段階の暫定値）。
 *
 * 汎用の `Section` は使わない ─ ヒーローは `py-section` の上下余白を持たない
 * 全画面レイアウトのため、ハイファイに合わせて専用のマークアップを組んでいる。
 */
export function Prologue() {
  const { lang } = useLang();
  const t = getDictionary(lang).prologue;

  return (
    <section
      id="prologue"
      className="relative min-h-screen overflow-hidden pr-6 pl-[calc(var(--spacing-nav)+24px)] md:pr-12 md:pl-[160px]"
    >
      {SHOW_KIRI_GLOW && <KiriGlow />}
      <div className="relative mx-auto grid min-h-screen max-w-page grid-cols-1 items-center gap-10 lg:grid-cols-[minmax(0,1fr)_auto]">
        <div className="flex flex-col items-start gap-0 pt-[min(100px,11vh)] pb-[min(80px,9vh)] md:pt-[min(140px,15vh)] md:pb-[min(120px,13vh)]">
          {/*
            盆栽（BonsaiStage）が重なる領域の空き。サイズは BonsaiStage の `--bonsai-w`
            と必ず同じ式にすること（ここがずれると盆栽が本文の上に乗る）。
            上下の余白も含めて `vh` の上限を入れているのは、画面高が低いノートPCで
            タグライン以下が画面外へ押し出されるのを防ぐため（BonsaiStage のコメント参照）。
          */}
          {SHOW_BONSAI && (
            <div
              aria-hidden="true"
              className="ml-[min(8vw,120px)] w-[min(34vw,460px,30vh)] max-w-full"
              style={{ aspectRatio: '158 / 248' }}
            />
          )}
          <h1 className="mt-[min(72px,8vh)] font-mincho text-[clamp(2rem,3.4vw,3rem)] leading-[1.9] font-semibold tracking-mincho text-gofun">
            {t.tagline}
          </h1>
          <p className="mt-2 font-brush text-body leading-body text-gofun/80">{t.sub}</p>
        </div>
        <div className="hidden self-stretch gap-7 pt-[140px] pb-[160px] lg:flex">
          <div className="[writing-mode:vertical-rl] font-latin text-[clamp(14px,1.3vw,20px)] tracking-latin text-gofun">
            FREELANCE ENGINEER · TOKYO
          </div>
          <div className="w-px bg-hairline" />
        </div>
      </div>
      <ScrollCue />
    </section>
  );
}

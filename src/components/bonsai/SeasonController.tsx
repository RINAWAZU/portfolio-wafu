'use client';

import { useEffect, useRef } from 'react';
import { useScrollProgress } from '@/hooks/useScrollProgress';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import { publishSeasonBlend } from '@/lib/seasonRuntime';
import { SEASON_ANCHORS, blendAt, seasonEnvironmentAt, seasonOpacities } from '@/lib/season';
import type { Season, SeasonBlend } from '@/types/season';

function measureAnchorTops(): readonly number[] {
  const tops = SEASON_ANCHORS.map((anchor) => document.getElementById(anchor.sectionId)?.offsetTop ?? 0);
  // 最終アンカーはスクロール可能な最大値でクランプする（§5-1 の「最も踏みやすい罠」）。
  // これを忘れると最下部までスクロールしても winter に到達しない。
  const maxScroll = Math.max(0, document.documentElement.scrollHeight - window.innerHeight);
  const clamped = [...tops];
  clamped[clamped.length - 1] = Math.min(tops[tops.length - 1] ?? maxScroll, maxScroll);

  // クランプの結果、最終アンカーが1つ前を下回ることがある（結セクションがビューポート高より
  // 低い＝大画面デスクトップで起こり得る）。`blendAt` は昇順を前提にしているため、
  // そのままだと「紅葉→雪」の区間が消えていきなり雪へ飛ぶ。前から均して単調増加を保証する。
  for (let i = 1; i < clamped.length; i += 1) {
    clamped[i] = Math.max(clamped[i] ?? 0, clamped[i - 1] ?? 0);
  }
  return clamped;
}

function writeBlendToDocument(blend: SeasonBlend): void {
  const root = document.documentElement;
  const opacities = seasonOpacities(blend);
  (Object.keys(opacities) as Season[]).forEach((season) => {
    root.style.setProperty(`--season-op-${season}`, opacities[season].toFixed(4));
  });

  const environment = seasonEnvironmentAt(blend);
  root.style.setProperty('--season-glow', environment.glowColor);
  root.style.setProperty('--season-beam', environment.beamColor);
  root.style.setProperty('--season-filter', environment.filter);
}

/**
 * 描画を持たない制御コンポーネント。スクロールに応じて季節の CSS 変数を書き込む（§5-3）。
 * `layout.tsx` に1つだけ置く。
 *
 * - 通常モード: Lenis（または native fallback）のスクロール値から `blendAt()` で
 *   連続的に混合比を求め、rAF に同期して documentElement へ直接書き込む。
 *   React の setState はここでは一切呼ばない。
 * - reduced-motion: IntersectionObserver でセクション進入を検出し、離散的に
 *   切り替える（トランジションなし）。季節が移ろうという情報自体は残す（§5-5）。
 */
export function SeasonController() {
  const { subscribe } = useScrollProgress();
  const prefersReducedMotion = usePrefersReducedMotion();
  const anchorTopsRef = useRef<readonly number[]>([]);

  useEffect(() => {
    const remeasure = () => {
      anchorTopsRef.current = measureAnchorTops();
    };
    remeasure();

    const resizeObserver = new ResizeObserver(remeasure);
    resizeObserver.observe(document.body);
    document.fonts.ready.then(remeasure).catch(() => undefined);

    return () => resizeObserver.disconnect();
  }, []);

  useEffect(() => {
    if (prefersReducedMotion) {
      const elements = SEASON_ANCHORS.map((anchor) => document.getElementById(anchor.sectionId));

      const observer = new IntersectionObserver(
        (entries) => {
          const mostVisible = entries
            .filter((entry) => entry.isIntersecting)
            .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
          if (!mostVisible) return;

          const index = elements.findIndex((element) => element === mostVisible.target);
          if (index === -1) return;

          const season = SEASON_ANCHORS[index].season;
          const blend: SeasonBlend = { from: season, to: season, t: 0, dominant: season };
          writeBlendToDocument(blend);
          publishSeasonBlend(blend);
        },
        { threshold: [0, 0.5, 1] },
      );

      elements.forEach((element) => element && observer.observe(element));
      return () => observer.disconnect();
    }

    const unsubscribe = subscribe((scrollY) => {
      const blend = blendAt(scrollY, anchorTopsRef.current);
      writeBlendToDocument(blend);
      publishSeasonBlend(blend);
    });
    return unsubscribe;
  }, [prefersReducedMotion, subscribe]);

  return null;
}

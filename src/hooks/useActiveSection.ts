'use client';

import { useEffect, useState } from 'react';
import type { SectionId } from '@/types/content';

const SECTION_IDS: readonly SectionId[] = ['prologue', 'about', 'works', 'skills', 'career', 'pricing', 'contact'];

function isSectionId(value: string): value is SectionId {
  return (SECTION_IDS as readonly string[]).includes(value);
}

/** 縦ナビ以外は誰も使わないため、グローバルに持ち上げずここに閉じる（設計書 §11）。 */
export function useActiveSection(): SectionId {
  const [active, setActive] = useState<SectionId>('prologue');

  useEffect(() => {
    const elements = SECTION_IDS.map((id) => document.getElementById(id)).filter(
      (element): element is HTMLElement => element !== null,
    );
    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const mostVisible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (!mostVisible) return;
        const id = mostVisible.target.id;
        if (isSectionId(id)) setActive(id);
      },
      { rootMargin: '-40% 0px -40% 0px', threshold: [0, 0.25, 0.5, 0.75, 1] },
    );

    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, []);

  return active;
}

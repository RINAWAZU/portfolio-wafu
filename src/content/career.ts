import type { CareerEntry } from '@/types/content';

/**
 * `data.js` の CAREER（5件）を移植（§7-2）。
 * 強調位置（emEn/emJp）の構造は破棄しプレーン文字列に単純化。
 * 会社名は「金融系IT企業」「金融系IT・SIer 等 4社」へ置換済み（設計書 §1-6）。
 */
export const CAREER_ENTRIES: readonly CareerEntry[] = [
  {
    when: '2022',
    kind: { ja: '入学', en: "Bachelor's" },
    body: {
      ja: '芝浦工業大学 システム理工学部 入学',
      en: 'Shibaura Institute of Technology, College of Systems Engineering and Science — enrolled',
    },
    tone: 'past',
  },
  {
    when: '2025 — 2026',
    kind: { ja: 'インターン', en: 'Internships' },
    body: {
      ja: '就活を通じて金融系IT・SIer等4社にてインターンを経験',
      en: 'Internships at financial IT / SIer companies (4 firms) through job-hunting',
    },
    tone: 'past',
  },
  {
    when: '2026 —',
    kind: { ja: '現在', en: 'Now' },
    body: {
      ja: 'フリーランスとして本格的に活動開始。同理由により大学を一年休学',
      en: 'Started freelance practice in earnest; on academic leave for one year to focus on it',
    },
    tone: 'current',
  },
  {
    when: '2027 · 03',
    kind: { ja: '卒業予定', en: 'Planned' },
    body: {
      ja: '芝浦工業大学 システム理工学部 卒業予定',
      en: 'Graduation — B.E. Systems Engineering and Science, Shibaura Institute of Technology',
    },
    tone: 'future',
  },
  {
    when: '2027 · 04',
    kind: { ja: '入社予定', en: 'New grad' },
    body: {
      ja: '金融系IT企業 入社予定',
      en: 'Joining a financial IT company',
    },
    tone: 'future',
  },
];

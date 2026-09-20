import type { ProfileStat, ProfileTag, SocialLink } from '@/types/content';

/** 我（About）の数値3点。ハイファイの表記に合わせ、大きな数値＋固定の英字サフィックスで統一。 */
export const PROFILE_STATS: readonly ProfileStat[] = [
  { value: '23', suffix: { ja: 'AGE', en: 'AGE' }, label: 'Age' },
  { value: '05', suffix: { ja: 'YRS', en: 'YRS' }, label: 'Experience' },
  { value: 'JP', suffix: { ja: '/ EN', en: '/ EN' }, label: 'Languages' },
];

/** 我（About）の枠線タグ。ハイファイ実装（4件）に合わせる。 */
export const PROFILE_TAGS: readonly ProfileTag[] = [
  { label: { ja: '受注可能', en: 'Available' }, accent: true },
  { label: { ja: 'WEB', en: 'WEB' }, accent: false },
  { label: { ja: 'iOS / SwiftUI', en: 'iOS / SwiftUI' }, accent: false },
  { label: { ja: 'AI', en: 'AI' }, accent: false },
];

/** 問い合わせ用メールアドレス。旧 Contact.jsx から移植（公開情報）。 */
export const CONTACT_EMAIL = 'awazurin551@gmail.com';

/**
 * GitHub アカウント。結（`SOCIAL_LINKS`）と作（`WORKS` の 01・`WorksSummary`）の
 * 両方が参照するため、URL の実体はここ1箇所に置く。
 */
export const GITHUB_URL = 'https://github.com/RINAWAZU';

/**
 * 結（Contact）の外部リンク。`ContactLinks` と `SiteFooter` の両方がこの配列を参照する。
 *
 * X は 2026-09-15 に社長がハンドルを `@rin_devcodes` と確定（旧サイトは `@rin_engineer` と
 * 表示していたがリンクは `href="#"` の空リンクで、実 URL は一度も設定されていなかった）。
 * Note / LinkedIn は URL 未確定のため引き続き掲載しない（設計書 §12-3 #1）。
 * 死んだリンクを置かないという方針のため、確定するまでこの配列に追加しないこと。
 */
export const SOCIAL_LINKS: readonly SocialLink[] = [
  { key: 'github', label: 'GitHub', href: GITHUB_URL, external: true },
  { key: 'x', label: 'X / Twitter', href: 'https://x.com/rin_devcodes', external: true },
];

import type { LocalizedText } from './i18n';

/** 季節アンカーの実測対象でもあるため、この union 以外の id をセクションに与えないこと。 */
export type SectionId =
  | 'prologue'
  | 'about'
  | 'works'
  | 'skills'
  | 'career'
  | 'pricing'
  | 'contact';

export type WorkStatus = 'delivered' | 'planned';
export type WorkCategory = 'web' | 'ios' | 'lp' | 'saas' | 'ai';

export interface Work {
  /** 'cast-dashboard' 等の安定キー */
  readonly id: string;
  /** 表示番号 '01' */
  readonly no: string;
  readonly title: LocalizedText;
  readonly category: WorkCategory;
  /** 短冊に出す 'iOS' 'WEB' 'LP' */
  readonly categoryLabel: string;
  /** planned は null */
  readonly year: number | null;
  /** 'delivered' のときのみ落款「済」 */
  readonly status: WorkStatus;
  readonly stack: readonly string[];
  /** 現行データの保全用。初期実装では未描画（§12-3） */
  readonly description: LocalizedText;
}

export type SkillLevel = 1 | 2 | 3 | 4 | 5;

export interface SkillItem {
  readonly name: string;
  readonly level: SkillLevel;
}

export interface SkillGroup {
  /** '01' */
  readonly no: string;
  /** 'FRONTEND'（欧文のみ。翻訳対象外） */
  readonly label: string;
  readonly items: readonly SkillItem[];
}

export type CareerTone = 'past' | 'current' | 'future';

export interface CareerEntry {
  /** '2022' / '2025 — 2026' / '2027 · 04' */
  readonly when: string;
  /** 入学 / インターン / 現在 / 卒業予定 / 入社予定 */
  readonly kind: LocalizedText;
  /** 会社名を含めないこと */
  readonly body: LocalizedText;
  readonly tone: CareerTone;
}

export type PriceUnit = 'once' | 'month';

export interface Plan {
  readonly id: string;
  readonly name: LocalizedText;
  readonly badge: LocalizedText | null;
  readonly scope: LocalizedText | null;
  /** 69800（整数。表示は formatYen で '¥69,800'） */
  readonly price: number;
  readonly unit: PriceUnit;
  readonly features: readonly LocalizedText[];
  readonly highlight: boolean;
}

export interface PriceOption {
  readonly label: LocalizedText;
  readonly from: number;
}

export interface ValuePoint {
  /** '30' | '0' | '∞' */
  readonly value: string;
  readonly unit: string;
  readonly label: LocalizedText;
  readonly note: LocalizedText;
}

export interface ProfileStat {
  readonly value: string;
  readonly suffix: LocalizedText;
  readonly label: string;
}

export interface ProfileTag {
  readonly label: LocalizedText;
  readonly accent: boolean;
}

export interface SocialLink {
  readonly key: string;
  readonly label: string;
  readonly href: string;
  readonly external: boolean;
}

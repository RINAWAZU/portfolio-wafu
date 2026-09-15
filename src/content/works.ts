import type { Work } from '@/types/content';
import type { LocalizedText } from '@/types/i18n';

/** `status: 'planned'` の短冊に出す小さなラベル(ワイヤーフレーム「予定」)。 */
export const PLANNED_LABEL: LocalizedText = { ja: '予定', en: 'Planned' };

/**
 * `site_old/rin-portfolio/src/data.js` の WORKS を移植（§7-2）。
 * 件数・順序は変更しない。サムネ・カード用の `size` `mark` は短冊表示に不要なため破棄。
 *
 * `year` は旧データに存在しなかったフィールド（型で新設）。'delivered' の3件は
 * サイト自体の更新時期（2026年）を暫定値として入れている。正式な年が確定したら
 * ここを更新すること（デザイン確定事項ではなく、コーダー側の暫定補完）。
 */
export const WORKS: readonly Work[] = [
  {
    id: 'cast-dashboard',
    no: '01',
    title: {
      ja: 'cast-dashboard — キャスト実績管理',
      en: 'cast-dashboard — Performance Manager',
    },
    category: 'ios',
    categoryLabel: 'iOS',
    year: 2026,
    status: 'delivered',
    stack: ['Swift', 'SwiftUI', 'Supabase', 'Google OAuth'],
    description: {
      ja: '業界特化iOSアプリ。給与計算・ペナルティロジック・月次実績・PDF出力・AI RAG チャットを実装。',
      en: 'Industry-specific iOS app: payroll, penalty logic, monthly reporting, PDF export, and an AI RAG chat.',
    },
  },
  {
    id: 'portfolio-v2',
    no: '02',
    title: {
      ja: 'ポートフォリオ リニューアル（本サイト）',
      en: 'Portfolio v2.0 (this site)',
    },
    category: 'web',
    categoryLabel: 'WEB',
    year: 2026,
    status: 'delivered',
    stack: ['React', 'TypeScript', 'Spline', 'GSAP', 'Framer Motion'],
    description: {
      ja: '全案件の入口。3Dモデル・スクロールアニメ・Digital Luxury の体現。案件獲得の核となるブランドサイト。',
      en: 'The hub for every other project. 3D, scroll choreography, Digital Luxury concept — engineered as the lead-funnel for freelance briefs.',
    },
  },
  {
    id: 'multi-industry-lp',
    no: '03',
    title: {
      ja: '業種別マルチLP集',
      en: 'Multi-Industry LP Set',
    },
    category: 'lp',
    categoryLabel: 'LP',
    year: 2026,
    status: 'delivered',
    stack: ['HTML', 'CSS', 'JS', 'React'],
    description: {
      ja: 'クラウドワークス案件最多ジャンル対応。飲食・美容・パーソナルジム等、複数業種のLPを制作。',
      en: 'Three landing pages — F&B, beauty, fitness — to demonstrate range against the highest-volume CrowdWorks category.',
    },
  },
  {
    id: 'saas-admin-dashboard',
    no: '04',
    title: {
      ja: 'SaaS風 管理ダッシュボード',
      en: 'SaaS Admin Dashboard',
    },
    category: 'saas',
    categoryLabel: 'SaaS',
    year: null,
    status: 'planned',
    stack: ['React', 'TypeScript', 'Supabase', 'Recharts'],
    description: {
      ja: '中小企業向け売上・顧客管理ダッシュボード。cast-dashboard の設計を汎用化。',
      en: 'A revenue & customer dashboard for SMBs — generalising what was learned from cast-dashboard into a higher-tier offer.',
    },
  },
  {
    id: 'ai-chatbot-web-app',
    no: '05',
    title: {
      ja: 'AIチャットボット組込Webアプリ',
      en: 'AI Chatbot Web App',
    },
    category: 'ai',
    categoryLabel: 'AI',
    year: null,
    status: 'planned',
    stack: ['React', 'TypeScript', 'Claude API', 'Vercel'],
    description: {
      ja: 'Claude API を活用した業種特化チャットボット。AI 案件需要急増のトレンドに対応。',
      en: 'Industry-tuned chatbot built on Claude API. Demonstrates a fluency in the AI surface area that briefs are increasingly asking for.',
    },
  },
  {
    id: 'threejs-corporate-site',
    no: '06',
    title: {
      ja: 'Three.js × 架空企業Webサイト',
      en: 'Three.js × Fictional Corporate Site',
    },
    category: 'web',
    categoryLabel: 'WEB',
    year: null,
    status: 'planned',
    stack: ['React', 'TypeScript', 'Three.js', 'GSAP'],
    description: {
      ja: '03で培った Three.js 技術を応用した架空スタートアップの高品質コーポレートサイト。',
      en: 'A high-quality corporate site for a fictional startup — applying the Three.js system from this portfolio at production scale.',
    },
  },
];

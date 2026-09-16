import type { LocalizedText } from '@/types/i18n';
import type { Work, WorkStatus } from '@/types/content';

/**
 * 短冊に出す状態ラベル。'delivered' は「カテゴリ · 年」を出すためここには持たない。
 *
 * 「納品」「案件」といった受託を思わせる語は使わない。このセクションは
 * 受けた仕事の実績ではなく、技術を示すために自ら作った作品の一覧である
 * （2026-09-16 社長指摘）。
 */
export const STATUS_LABEL: Readonly<Record<Exclude<WorkStatus, 'delivered'>, LocalizedText>> = {
  'in-progress': { ja: '制作中', en: 'In progress' },
  planned: { ja: '構想中', en: 'In design' },
};

/**
 * 掲載する作品。
 *
 * 元は `site_old/rin-portfolio/src/data.js` の WORKS を移植したものだが、
 * 2026-09-16 に社長判断で内容を改訂した。
 *  - 「業種別マルチLP集」は制作していないため削除し、以降を繰り上げ
 *  - 「Three.js × 架空企業Webサイト」は完成済みのため 'delivered' へ
 *  - 「習慣タスク管理アプリ」を 'in-progress' で追加
 *
 * このファイルにオブジェクトを1件足すだけで短冊が1枚増える（件数はどこにも
 * ハードコードしない）。`no` は表示順の連番なので、増減させたら振り直すこと。
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
    id: 'saas-admin-dashboard',
    no: '03',
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
    no: '04',
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
    no: '05',
    title: {
      ja: 'Three.js × 架空企業Webサイト',
      en: 'Three.js × Fictional Corporate Site',
    },
    category: 'web',
    categoryLabel: 'WEB',
    year: 2026,
    status: 'delivered',
    stack: ['React', 'TypeScript', 'Three.js', 'GSAP'],
    description: {
      ja: 'Three.js を応用した架空スタートアップのコーポレートサイト。3D表現を実運用規模で成立させる検証。',
      en: 'A corporate site for a fictional startup — proving out Three.js at production scale.',
    },
  },
  {
    id: 'habit-tracker-web-app',
    no: '06',
    title: {
      ja: '習慣タスク管理Webアプリ',
      en: 'Habit & Task Manager',
    },
    category: 'web',
    categoryLabel: 'WEB',
    year: null,
    status: 'in-progress',
    stack: ['React', 'TypeScript', 'Tailwind CSS', 'Supabase'],
    description: {
      ja: '習慣・今日のTodo・週間月間計画・達成率の可視化を1つにまとめたセルフマネジメントアプリ。普段はモノクロ、達成時だけ演出が弾ける構成。',
      en: 'A self-management app that unifies habits, daily todos, weekly and monthly planning, and progress visualisation. Monochrome at rest; colour breaks out only on completion.',
    },
  },
];

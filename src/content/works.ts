import { GITHUB_URL } from '@/content/profile';
import { SITE_URL } from '@/lib/site';
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
 * リンクを持つ短冊にだけ添える読み上げ用の補足（`WorkTanzaku` / `WorkRow` が共用）。
 *
 * 見た目の ↗ は装飾（`aria-hidden`）なので、「押すと外部サイトが新しいタブで開く」ことは
 * 文字で伝える必要がある。リンク先が別タブで開くことを予告しないと、読み上げ環境では
 * 突然コンテキストが変わったように受け取られる。
 */
export const EXTERNAL_LABEL: LocalizedText = {
  ja: '（作品のページを新しいタブで開く）',
  en: '(opens the work in a new tab)',
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
 *
 * `href` を入れた作品は短冊そのものがリンクになる（2026-09-20 社長指示）。
 * 死んだリンクを置かない方針のため、**実際に開ける URL だけ**を入れ、未公開は `null`。
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
    // 業務内容を含むため個別リポジトリは非公開。GitHub アカウントを行き先にする
    // （2026-09-20 時点で cast-dashboard の公開リポジトリは存在しない）。
    href: GITHUB_URL,
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
    stack: ['Next.js', 'TypeScript', 'Tailwind CSS', 'Lenis'],
    // 本サイト自身。環境変数で本番ドメインを差し替えても追従するよう SITE_URL を使う。
    href: SITE_URL,
    description: {
      ja: '全作品の入口。和紙・筆文字・落款で構成した和風のブランドサイト。スクロールに連動する演出と多言語切替を実装。',
      en: 'The entry point to every other work. A Japanese-styled brand site built from washi, brush glyphs and seal marks, with scroll-linked motion and bilingual switching.',
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
    href: null,
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
    href: null,
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
    // 社長が後日 URL を送る予定（2026-09-20）。届いたらここに入れるだけで短冊がリンクになる。
    href: null,
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
    href: null,
    description: {
      ja: '習慣・今日のTodo・週間月間計画・達成率の可視化を1つにまとめたセルフマネジメントアプリ。普段はモノクロ、達成時だけ演出が弾ける構成。',
      en: 'A self-management app that unifies habits, daily todos, weekly and monthly planning, and progress visualisation. Monochrome at rest; colour breaks out only on completion.',
    },
  },
];

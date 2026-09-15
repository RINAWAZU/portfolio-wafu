import type { Plan, PriceOption, ValuePoint } from '@/types/content';

/**
 * `site_old/rin-portfolio/src/components/Pricing.jsx` の4定数を移植（§7-2）。
 * 価格は文字列 '¥69,800' から数値 69800 へ変換。'〜' は表示側（formatYen 等）で付ける。
 */
export const PRODUCTION_PLANS: readonly Plan[] = [
  {
    id: 'light',
    name: { ja: 'ライト', en: 'Light' },
    badge: null,
    scope: { ja: '1〜3ページ', en: '1–3 pages' },
    price: 69800,
    unit: 'once',
    features: [
      { ja: 'LP形式 or 会社概要のみ', en: 'LP format or company profile only' },
      { ja: 'お問い合わせフォーム', en: 'Contact form' },
      { ja: 'Googleマップ埋め込み', en: 'Google Maps embed' },
      { ja: 'スマホ対応', en: 'Mobile responsive' },
    ],
    highlight: false,
  },
  {
    id: 'standard',
    name: { ja: 'スタンダード', en: 'Standard' },
    badge: { ja: '主力プラン', en: 'Most popular' },
    scope: { ja: '5〜8ページ（TOP・メニュー・アクセス等）', en: '5–8 pages (top, menu, access, etc.)' },
    price: 98000,
    unit: 'once',
    features: [
      { ja: 'Instagram埋め込み', en: 'Instagram embed' },
      { ja: 'Google Analytics設置', en: 'Google Analytics setup' },
      { ja: '予約フォーム or LINEリンク', en: 'Booking form or LINE link' },
      { ja: '公開後1ヶ月サポート', en: '1 month of post-launch support' },
    ],
    highlight: true,
  },
  {
    id: 'premium',
    name: { ja: 'プレミアム', en: 'Premium' },
    badge: { ja: 'こだわり層向け', en: 'For the detail-oriented' },
    scope: { ja: '10ページ以上 or アニメーション演出', en: '10+ pages or animated presentation' },
    price: 148000,
    unit: 'once',
    features: [
      { ja: 'SEO初期設定込み', en: 'Initial SEO setup included' },
      { ja: 'ブログ・お知らせ機能', en: 'Blog / news feature' },
      { ja: '公開後3ヶ月サポート', en: '3 months of post-launch support' },
    ],
    highlight: false,
  },
];

export const MAINTENANCE_PLANS: readonly Plan[] = [
  {
    id: 'maintenance-minimum',
    name: { ja: 'ミニマム', en: 'Minimum' },
    badge: null,
    scope: null,
    price: 9800,
    unit: 'month',
    features: [
      { ja: 'サーバー・ドメイン管理代行', en: 'Server & domain management' },
      { ja: '軽微テキスト修正（月2回まで）', en: 'Minor text edits (up to 2/month)' },
    ],
    highlight: false,
  },
  {
    id: 'maintenance-standard',
    name: { ja: 'スタンダード', en: 'Standard' },
    badge: { ja: '推奨', en: 'Recommended' },
    scope: null,
    price: 19800,
    unit: 'month',
    features: [
      { ja: 'テキスト・画像更新（月4回まで）', en: 'Text & image updates (up to 4/month)' },
      { ja: '月次アクセスレポート', en: 'Monthly traffic report' },
      { ja: '障害時の優先対応', en: 'Priority incident response' },
    ],
    highlight: true,
  },
  {
    id: 'maintenance-full',
    name: { ja: 'フル管理', en: 'Full management' },
    badge: null,
    scope: null,
    price: 29800,
    unit: 'month',
    features: [
      { ja: '更新無制限', en: 'Unlimited updates' },
      { ja: 'SNS投稿代行（月4本）', en: 'SNS posting on your behalf (4/month)' },
      { ja: 'SEO月次改善提案', en: 'Monthly SEO improvement proposals' },
    ],
    highlight: false,
  },
];

export const PRICE_OPTIONS: readonly PriceOption[] = [
  { label: { ja: 'ロゴ制作', en: 'Logo design' }, from: 15000 },
  { label: { ja: '写真撮影（出張）', en: 'On-site photography' }, from: 20000 },
  { label: { ja: '多言語対応（英語）', en: 'Multilingual support (English)' }, from: 20000 },
  { label: { ja: 'Web予約システム連携', en: 'Web booking system integration' }, from: 15000 },
  { label: { ja: 'EC機能（カート）', en: 'E-commerce (cart) feature' }, from: 50000 },
];

export const VALUE_POINTS: readonly ValuePoint[] = [
  {
    value: '30',
    unit: '%〜',
    label: { ja: '業界平均より安く', en: 'Below industry average' },
    note: {
      ja: '制作会社の相場：LP ¥100,000〜 / 5ページ ¥150,000〜',
      en: 'Agency market rate: LP from ¥100,000 / 5 pages from ¥150,000',
    },
  },
  {
    value: '0',
    unit: '円',
    label: { ja: '中間マージン', en: 'Agency margin' },
    note: {
      ja: 'エンジニア直契約だから代理店コストがない',
      en: 'Direct contract with the engineer — no agency overhead',
    },
  },
  {
    value: '∞',
    unit: '',
    label: { ja: '品質は妥協しない', en: 'No compromise on quality' },
    note: {
      ja: '安さの理由はオーバーヘッドの排除。成果物の質は落とさない',
      en: 'The low price comes from cutting overhead, not cutting corners',
    },
  },
];

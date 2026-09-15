/**
 * サイト全体のメタ情報。metadata / OGP / JSON-LD / sitemap / robots がすべてここを参照する。
 *
 * `SITE_URL` は `NEXT_PUBLIC_SITE_URL`（Vercel の環境変数）を優先し、未設定なら
 * 既定の Vercel URL にフォールバックする。独自ドメインを取得したら環境変数を設定するだけでよい
 * （末尾スラッシュは `metadataBase` と `sitemap` の相対解決を壊すため落とす）。
 */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://portfolio-wafu.vercel.app').replace(/\/+$/, '');

export const SITE_NAME = 'RIN — Freelance Engineer';

/** `<title>` に出す既定値。セクションが1ページに同居する構成のためページ単位の出し分けはしない。 */
export const SITE_TITLE = 'RIN — Freelance Engineer / Web・iOS・AI';

export const SITE_DESCRIPTION =
  '東京を拠点に活動するフリーランスエンジニア RIN のポートフォリオ。Web・iOS・AI 統合の受託開発を行っています。ブランドサイト、プロダクト UI、iOS アプリ、AI ツールの制作実績と料金プラン。';

export const SITE_DESCRIPTION_EN =
  'Portfolio of RIN, a freelance engineer based in Tokyo. Web, iOS and AI integration — brand sites, product UI, iOS apps and AI tooling.';

/** 序のタグラインと同じ文言。OGP 画像にも使う。 */
export const SITE_TAGLINE = '麟 — つくり続ける。';

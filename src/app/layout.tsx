import type { Metadata } from 'next';
import { JetBrains_Mono, Marcellus } from 'next/font/google';
import localFont from 'next/font/local';
import './globals.css';
import { PersonJsonLd } from '@/components/common/PersonJsonLd';
import { SITE_DESCRIPTION, SITE_NAME, SITE_TITLE, SITE_URL } from '@/lib/site';
import { LangProvider } from '@/providers/LangProvider';
import { SmoothScrollProvider } from '@/providers/SmoothScrollProvider';
import { SeasonController } from '@/components/bonsai/SeasonController';
import { BonsaiStage } from '@/components/bonsai/BonsaiStage';
import { ENABLE_SEASON, SHOW_BONSAI } from '@/lib/features';
import { WoodBackdrop } from '@/components/layout/WoodBackdrop';
import { SideNav } from '@/components/layout/SideNav';
import { LangSwitch } from '@/components/layout/LangSwitch';
import { LoadingVeil } from '@/components/layout/LoadingVeil';

/*
 * 和文2書体は **next/font/google を使わず自前サブセットを読む**（設計書 §7「使用文字のみに
 * 絞り込む」の実装）。Google 配信の CSS は unicode-range で約120分割された @font-face を
 * そのまま展開するため、2書体で 488 定義 / 372KB のレンダリングを止める CSS になり、
 * その評価だけで Style & Layout が 1.5 秒を超えていた（Lighthouse モバイル FCP 8.1s）。
 * 再生成は `npm run font:subset:jp`（文字集合はソースから自動抽出）。
 */
const shippori = localFont({
  src: [
    { path: '../fonts/ShipporiMinchoB1-400-subset.woff2', weight: '400', style: 'normal' },
    { path: '../fonts/ShipporiMinchoB1-600-subset.woff2', weight: '600', style: 'normal' },
  ],
  display: 'swap',
  // 序のタグライン（600）は初回表示に入るため preload するが、400 は主に折り返し以降で
  // 使うため事前読込しない（初期転送を絞る）。
  preload: false,
  variable: '--font-shippori',
});

const marcellus = Marcellus({
  weight: ['400'],
  subsets: ['latin'],
  preload: true,
  display: 'swap',
  variable: '--font-marcellus',
});

// 本文書体。weight 500 は実装上どこにも使われていないため読み込まない。
const zenKaku = localFont({
  src: '../fonts/ZenKakuGothicNew-400-subset.woff2',
  weight: '400',
  style: 'normal',
  display: 'swap',
  preload: true,
  variable: '--font-zen-kaku',
});

const jetbrainsMono = JetBrains_Mono({
  weight: ['300', '400'],
  subsets: ['latin'],
  preload: true,
  display: 'swap',
  variable: '--font-jetbrains',
});

// Yuji Syuku は手動サブセット済みの woff2 を next/font/local で読み込む（設計書 §10-3）。
// 再生成手順は src/fonts/README.md を参照。
const yuji = localFont({
  src: '../fonts/YujiSyuku-subset.woff2',
  display: 'block',
  preload: true,
  variable: '--font-yuji',
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: SITE_TITLE,
  description: SITE_DESCRIPTION,
  alternates: { canonical: '/' },
  openGraph: {
    type: 'profile',
    locale: 'ja_JP',
    url: '/',
    siteName: SITE_NAME,
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
  },
  twitter: {
    card: 'summary_large_image',
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
  },
};

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html
      lang="ja"
      className={`${shippori.variable} ${marcellus.variable} ${zenKaku.variable} ${jetbrainsMono.variable} ${yuji.variable}`}
    >
      <body className="font-body text-body leading-body text-gofun antialiased">
        <LoadingVeil />
        <PersonJsonLd />
        <LangProvider>
          <SmoothScrollProvider>
            {ENABLE_SEASON && <SeasonController />}
            <WoodBackdrop />
            {SHOW_BONSAI && <BonsaiStage />}
            <SideNav />
            <LangSwitch />
            {children}
          </SmoothScrollProvider>
        </LangProvider>
      </body>
    </html>
  );
}

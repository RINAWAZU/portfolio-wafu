import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { ImageResponse } from 'next/og';
import { SITE_TAGLINE } from '@/lib/site';

export const alt = 'RIN — Freelance Engineer';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

/**
 * SNS 共有用の OGP 画像（設計書 §13-1, §12-2 #4）。静的な PNG を用意せずコードで生成する。
 *
 * 写真やテクスチャは敷かない ─ 仕様書 §1「装飾で和を語らず、余白・階調・間で語る」に従い、
 * 墨の面・筆文字・金茶のヘアラインだけで構成する。サイト本体と同じ語彙になる。
 *
 * フォントについて: Satori（`ImageResponse` の描画エンジン）は **woff2 を読めない**ため、
 * 本体が使う `YujiSyuku-subset.woff2` は流用できない。この画像に出る文字だけを
 * `src/fonts/og/og.chars.txt` に列挙し、TTF としてサブセットしたものを読み込む。
 * 文言を変えたら `og.chars.txt` を更新して以下を再実行すること（未実施だと豆腐表示になる）:
 *   python3 -m fontTools.subset src/fonts/src/YujiSyuku-Regular.ttf \
 *     --text-file=src/fonts/og/og.chars.txt --layout-features='' \
 *     --output-file=src/fonts/og/YujiSyuku-og.ttf
 */
export default async function OpengraphImage() {
  const brush = await readFile(join(process.cwd(), 'src/fonts/og/YujiSyuku-og.ttf'));

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          backgroundColor: '#0E0F0D',
          color: '#F2EFE6',
          padding: '96px 112px',
          fontFamily: 'Yuji Syuku',
        }}
      >
        <div style={{ display: 'flex', fontSize: 190, lineHeight: 1 }}>麟</div>

        {/* 金茶のヘアライン。本体の「行灯の光を線に還元した」表現と同じ語彙 */}
        <div style={{ display: 'flex', width: 360, height: 1, backgroundColor: '#B79A5B', margin: '56px 0 48px' }} />

        <div style={{ display: 'flex', fontSize: 54, lineHeight: 1.4 }}>{SITE_TAGLINE}</div>

        <div style={{ display: 'flex', marginTop: 28, fontSize: 26, letterSpacing: 8, color: '#B79A5B' }}>
          FREELANCE ENGINEER·TOKYO
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [{ name: 'Yuji Syuku', data: brush, style: 'normal', weight: 400 }],
    },
  );
}

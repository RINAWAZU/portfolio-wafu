import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { ImageResponse } from 'next/og';

export const size = { width: 64, height: 64 };
export const contentType = 'image/png';

/**
 * ファビコン。OGP 画像と同じく筆文字「麟」をコードで描く（静的 ico を持たない）。
 * フォントは OGP 用の TTF サブセットを共用する（Satori は woff2 を読めないため）。
 */
export default async function Icon() {
  const brush = await readFile(join(process.cwd(), 'src/fonts/og/YujiSyuku-og.ttf'));

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#0E0F0D',
          color: '#F2EFE6',
          fontSize: 46,
          fontFamily: 'Yuji Syuku',
        }}
      >
        麟
      </div>
    ),
    { ...size, fonts: [{ name: 'Yuji Syuku', data: brush, style: 'normal', weight: 400 }] },
  );
}

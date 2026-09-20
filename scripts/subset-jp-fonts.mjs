#!/usr/bin/env node
/**
 * 和文フォント（Shippori Mincho B1 / Zen Kaku Gothic New）を、書体×ウェイトごとに
 * 「実際に描かれる文字」だけの woff2 にして生成する。
 *
 *   npm run font:measure     文字集合を実サイトの DOM から実測（要: build + start）
 *   npm run font:subset:jp   その文字集合でサブセット再生成（本スクリプト）
 *
 * 文字集合は書体ごとに別ファイル（src/fonts/mincho-400 / mincho-600 / zen-400 .chars.txt）。
 * 以前は全書体に同じ 663 字を積んでおり 3 書体で 300KB あったが、実測に切り替えて約 100KB になった。
 * 理由と実測の詳細は scripts/measure-font-usage.mjs のヘッダを参照。
 *
 * なぜ自前サブセットか（設計書 §7「日本語フォントは無対策だと 3〜5MB になる」の実測）:
 *   next/font/google 経由で和文フォントを読むと、Google が unicode-range で約120分割した
 *   @font-face が**そのまま CSS に展開される**。実測で 2 書体 = 488 定義 / 372KB の
 *   レンダリングを止める CSS になり、その評価コストで Style & Layout が 1.5 秒を超えていた
 *   （Lighthouse モバイル: FCP 8.1s / Performance 55）。
 *   使用文字だけの自前サブセットにすれば @font-face は 1 書体 1 定義で済む。
 *
 * 前提: python3 + fonttools + brotli、`src/fonts/src/*.ttf`（google/fonts の OFL 版）
 *       python3 は環境変数 PYTHON で差し替えられる（fonttools を入れた venv を使う場合）。
 */
import { execFileSync } from 'node:child_process';
import { existsSync, statSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const FONT_SRC = join(ROOT, 'src/fonts/src');
const OUT_DIR = join(ROOT, 'src/fonts');
const PYTHON = process.env.PYTHON ?? 'python3';

const FONTS = [
  { ttf: 'ShipporiMinchoB1-Regular.ttf', chars: 'mincho-400.chars.txt', out: 'ShipporiMinchoB1-400-subset.woff2' },
  { ttf: 'ShipporiMinchoB1-SemiBold.ttf', chars: 'mincho-600.chars.txt', out: 'ShipporiMinchoB1-600-subset.woff2' },
  { ttf: 'ZenKakuGothicNew-Regular.ttf', chars: 'zen-400.chars.txt', out: 'ZenKakuGothicNew-400-subset.woff2' },
];

for (const font of FONTS) {
  const src = join(FONT_SRC, font.ttf);
  const charsFile = join(OUT_DIR, font.chars);
  const out = join(OUT_DIR, font.out);
  if (!existsSync(charsFile)) {
    console.error(`文字集合がありません: ${font.chars}（先に npm run font:measure を実行）`);
    process.exit(1);
  }
  execFileSync(
    PYTHON,
    ['-m', 'fontTools.subset', src, `--text-file=${charsFile}`, '--flavor=woff2', '--layout-features=', `--output-file=${out}`],
    { stdio: 'inherit' },
  );
  console.log(`生成: ${font.out} (${(statSync(out).size / 1024).toFixed(1)} KB)`);
}

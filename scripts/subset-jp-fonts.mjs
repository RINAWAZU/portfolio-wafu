#!/usr/bin/env node
/**
 * 和文フォント（Shippori Mincho B1 / Zen Kaku Gothic New）を、このサイトで実際に使う
 * 文字だけに絞った woff2 として生成する。
 *
 *   node scripts/subset-jp-fonts.mjs      （npm run font:subset:jp）
 *
 * なぜ必要か（設計書 §7「日本語フォントは無対策だと 3〜5MB になる」の実測）:
 *   next/font/google 経由で和文フォントを読むと、Google が unicode-range で約120分割した
 *   @font-face が**そのまま CSS に展開される**。実測で 2 書体 = 488 定義 / 372KB の
 *   レンダリングを止める CSS になり、その評価コストで Style & Layout が 1.5 秒を超えていた
 *   （Lighthouse モバイル: FCP 8.1s / Performance 55）。
 *   使用文字だけの自前サブセットにすれば @font-face は 1 書体 1 定義で済む。
 *
 * 文字集合は「ソースの文字列リテラル + JSX テキスト」から自動抽出するため、
 * 原則として手動更新は不要（文言を変えても再実行するだけでよい）。
 * 保険として ASCII・ひらがな・カタカナ・約物の全域を常に含める。
 *
 * 前提: python3 + fonttools + brotli、`src/fonts/src/*.ttf`（google/fonts の OFL 版）
 */
import { execFileSync } from 'node:child_process';
import { readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const SRC_DIR = join(ROOT, 'src');
const FONT_SRC = join(ROOT, 'src/fonts/src');
const OUT_DIR = join(ROOT, 'src/fonts');

const FONTS = [
  { ttf: 'ShipporiMinchoB1-Regular.ttf', out: 'ShipporiMinchoB1-400-subset.woff2' },
  { ttf: 'ShipporiMinchoB1-SemiBold.ttf', out: 'ShipporiMinchoB1-600-subset.woff2' },
  { ttf: 'ZenKakuGothicNew-Regular.ttf', out: 'ZenKakuGothicNew-400-subset.woff2' },
];

/** 常に含める保険の文字集合（文言の小変更でいちいち豆腐にしないため） */
function baseChars() {
  const out = [];
  for (let c = 0x20; c <= 0x7e; c++) out.push(String.fromCodePoint(c)); // ASCII
  for (let c = 0x3041; c <= 0x309f; c++) out.push(String.fromCodePoint(c)); // ひらがな
  for (let c = 0x30a0; c <= 0x30ff; c++) out.push(String.fromCodePoint(c)); // カタカナ
  for (const c of '、。・「」『』（）〔〕【】〜ー…‥“”‘’—–　±×÷≒≠≦≧°′″¥％＆＋－＝／＼｜！？：；＊＃＠＄€') out.push(c);
  for (const c of '①②③④⑤⑥⑦⑧⑨⑩▮▯●○◆■□▲△→←↑↓↗✓') out.push(c);
  return out;
}

function collectFromSource(dir, set) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) {
      collectFromSource(p, set);
      continue;
    }
    if (!/\.(ts|tsx)$/.test(p)) continue;
    const body = readFileSync(p, 'utf8');
    // 文字列リテラル（'…' "…" `…`）と JSX のテキストノードを対象にする。
    // 絞り込みすぎて取りこぼすより、多めに拾ってサブセットが少し太る方を選ぶ。
    for (const m of body.matchAll(/'([^'\n]*)'|"([^"\n]*)"|`([^`]*)`/g)) {
      for (const c of m[1] ?? m[2] ?? m[3] ?? '') set.add(c);
    }
    for (const m of body.matchAll(/>([^<>{}]+)</g)) {
      for (const c of m[1]) set.add(c);
    }
  }
}

const chars = new Set(baseChars());
collectFromSource(SRC_DIR, chars);
// 制御文字を除く
const text = [...chars].filter((c) => c.codePointAt(0) >= 0x20).sort().join('');

const charsFile = join(OUT_DIR, 'jp.chars.txt');
writeFileSync(charsFile, text);
console.log(`文字集合: ${[...text].length} 文字 → ${charsFile}`);

for (const font of FONTS) {
  const src = join(FONT_SRC, font.ttf);
  const out = join(OUT_DIR, font.out);
  execFileSync(
    'python3',
    ['-m', 'fontTools.subset', src, `--text-file=${charsFile}`, '--flavor=woff2', '--layout-features=', `--output-file=${out}`],
    { stdio: 'inherit' },
  );
  console.log(`生成: ${font.out} (${(statSync(out).size / 1024).toFixed(1)} KB)`);
}

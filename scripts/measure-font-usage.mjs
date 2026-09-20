#!/usr/bin/env node
/**
 * 和文フォントを「書体×ウェイトごとに実際に描かれる文字」だけに絞るための文字集合を、
 * 動いているサイトの DOM から実測して書き出す。
 *
 *   npm run build && npm run start          （別ターミナル）
 *   npm run font:measure                    （BASE_URL 既定 http://localhost:3000）
 *   npm run font:subset:jp                  （書き出した文字集合でサブセット再生成）
 *
 * なぜ実測か:
 *   以前は「ソース中の文字列リテラル」から全書体に同じ文字集合（663字）を積んでいた。
 *   実際には明朝 600 は見出しの約 110 字、明朝 400 は約 190 字、Zen 角ゴは約 200 字しか
 *   描かない。全書体に 663 字を積むと 3 書体で 300KB になり、Lighthouse の LCP を 4.7s まで
 *   押し上げていた（フォント遮断で Performance 94〜100、LCP 1.1〜2.9s になる実験で確認）。
 *
 * 何を数えるか:
 *   JP / EN の両言語 × モバイル / デスクトップの両幅で、`body` 配下の全テキストノード
 *   （`display:none` や閉じた `<details>` の中も含む）と input の placeholder を集め、
 *   親要素の computed style（font-family / font-weight）で書体を判定する。
 *
 * 数えられないもの（→ 下の EXTRA_* で補う）:
 *   操作した後にだけ出る文言（フォームの検証エラー・送信結果）と、疑似要素の content。
 *   これらは Zen 角ゴの文字集合に、ソースの文字列リテラルとひらがな・カタカナ全域を足して補う。
 *   明朝は見出しと静的な文言だけで、操作後に出る文言を持たない。
 *
 * 抜けた文字がどうなるか:
 *   font-family は `var(--font-shippori), serif` のようにフォールバックを持つため、
 *   サブセットに無い文字は白抜きや豆腐ではなく、その文字だけシステムの明朝/ゴシックで出る。
 *   ただし気づきにくい劣化なので、文言を変えたら再実測して再生成すること。
 *
 * 前提: `puppeteer-core`（devDependency）と Chrome。CHROME_PATH で場所を上書きできる。
 */
import { readdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import puppeteer from 'puppeteer-core';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const OUT_DIR = join(ROOT, 'src/fonts');
const BASE_URL = process.env.BASE_URL ?? 'http://localhost:3000/';
const CHROME_PATH = process.env.CHROME_PATH ?? '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

const VIEWPORTS = [
  { width: 412, height: 823 },
  { width: 1440, height: 900 },
];

/** 全書体に必ず含める ASCII と約物（欧文の折り返し・数字・記号が絶対に抜けないように） */
function baseChars() {
  const out = [];
  for (let c = 0x20; c <= 0x7e; c++) out.push(String.fromCodePoint(c));
  for (const c of '、。・「」『』（）〜ー…—–“”‘’％＋－＝／！？：；×÷±°→←↑↓✓') out.push(c);
  return out;
}

/** Zen 角ゴにだけ足す: ひらがな・カタカナ全域（操作後に出る文言の取りこぼし防止） */
function kanaChars() {
  const out = [];
  for (let c = 0x3041; c <= 0x30ff; c++) out.push(String.fromCodePoint(c));
  return out;
}

/** Zen 角ゴにだけ足す: 操作後にだけ出る文言を持つファイルの文字列リテラル */
const EXTRA_ZEN_SOURCES = [
  'src/components/sections/contact',
  'src/lib/contactValidation.ts',
  'src/app/api/contact/route.ts',
];

function collectLiterals(path, set) {
  if (statSync(path).isDirectory()) {
    for (const name of readdirSync(path)) collectLiterals(join(path, name), set);
    return;
  }
  if (!/\.(ts|tsx)$/.test(path)) return;
  const body = readFileSync(path, 'utf8');
  for (const m of body.matchAll(/'([^'\n]*)'|"([^"\n]*)"|`([^`]*)`/g)) {
    for (const c of m[1] ?? m[2] ?? m[3] ?? '') set.add(c);
  }
  for (const m of body.matchAll(/>([^<>{}]+)</g)) for (const c of m[1]) set.add(c);
}

const buckets = { mincho400: new Set(), mincho600: new Set(), zen: new Set() };
const unmatched = new Map(); // どの和文3書体にも当たらなかった computed font-family（参考表示）

function bucketOf(family, weight) {
  const f = family.toLowerCase();
  if (f.includes('shippori')) return weight >= 600 ? 'mincho600' : 'mincho400';
  if (f.includes('zen')) return 'zen';
  return null;
}

const browser = await puppeteer.launch({ executablePath: CHROME_PATH, headless: 'new', args: ['--no-sandbox'] });
try {
  for (const viewport of VIEWPORTS) {
    const page = await browser.newPage();
    await page.setViewport(viewport);
    await page.goto(BASE_URL, { waitUntil: 'networkidle0' });
    for (const label of ['JP', 'EN']) {
      await page.evaluate((l) => {
        [...document.querySelectorAll('button')].find((b) => b.textContent.trim() === l)?.click();
      }, label);
      await new Promise((resolve) => setTimeout(resolve, 800));
      const rows = await page.evaluate(() => {
        const out = [];
        const push = (el, text) => {
          const cs = getComputedStyle(el);
          out.push({ family: cs.fontFamily, weight: parseInt(cs.fontWeight, 10), text });
        };
        const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
        for (let n = walker.nextNode(); n; n = walker.nextNode()) {
          const el = n.parentElement;
          if (!n.nodeValue.trim() || /^(SCRIPT|STYLE|NOSCRIPT)$/.test(el.tagName)) continue;
          push(el, n.nodeValue);
        }
        for (const el of document.querySelectorAll('input[placeholder],textarea[placeholder]')) {
          push(el, el.getAttribute('placeholder'));
        }
        return out;
      });
      for (const { family, weight, text } of rows) {
        const bucket = bucketOf(family, weight);
        if (!bucket) {
          unmatched.set(family.split(',')[0], (unmatched.get(family.split(',')[0]) ?? 0) + 1);
          continue;
        }
        for (const c of text.replace(/\s+/g, '')) buckets[bucket].add(c);
      }
    }
    await page.close();
  }
} finally {
  await browser.close();
}

const zenExtra = new Set(kanaChars());
for (const rel of EXTRA_ZEN_SOURCES) collectLiterals(join(ROOT, rel), zenExtra);

const FILES = {
  mincho400: 'mincho-400.chars.txt',
  mincho600: 'mincho-600.chars.txt',
  zen: 'zen-400.chars.txt',
};

for (const [key, file] of Object.entries(FILES)) {
  const chars = new Set([...baseChars(), ...buckets[key], ...(key === 'zen' ? zenExtra : [])]);
  const text = [...chars].filter((c) => c.codePointAt(0) >= 0x20).sort().join('');
  writeFileSync(join(OUT_DIR, file), text);
  console.log(`${file.padEnd(22)} ${String([...text].length).padStart(4)} 文字（実測 ${buckets[key].size} 字 + 保険）`);
}
console.log('和文3書体に当たらなかった font-family（欧文書体・等幅は対象外で正常）:', Object.fromEntries(unmatched));

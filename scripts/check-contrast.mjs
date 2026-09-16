/**
 * 配色のコントラスト実測（設計書 §13-4 / T27）。
 *
 *   npm run check:contrast
 *
 * 色を触ったら必ず流すこと。落ちたら配色を直すか、用途の判定（テキストか非テキストか）を
 * 見直す。数値をこの表に合わせに行かないこと。
 *
 * 背景は決め打ちにせず、実際に配信している木目画像から求める。
 * 木目の上に墨48%が重なるため、明るい文字にとっての最悪ケースは
 * 「木目の明るい側」。上位5%の明度を代表値に採る。
 */
import sharp from 'sharp';

const hex = (h) => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16));
const over = (fg, a, bg) => fg.map((c, i) => c * a + bg[i] * (1 - a));
const lum = (rgb) => {
  const [r, g, b] = rgb.map((v) => {
    const s = v / 255;
    return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};
const ratio = (a, b) => {
  const [hi, lo] = lum(a) > lum(b) ? [lum(a), lum(b)] : [lum(b), lum(a)];
  return (hi + 0.05) / (lo + 0.05);
};

const { data, info } = await sharp('public/assets/wood.webp').resize(600).raw().toBuffer({ resolveWithObject: true });
const pixels = [];
for (let i = 0; i < data.length; i += info.channels) pixels.push([data[i], data[i + 1], data[i + 2]]);
pixels.sort((a, b) => lum(a) - lum(b));

const SUMI = hex('#0e0f0d');
const WOOD = over(SUMI, 0.48, pixels[Math.floor(pixels.length * 0.95)]);
const WORKS = over(hex('#1b2a22'), 0.72, WOOD);
const KINARI = hex('#e3dbc8');

const GOFUN = hex('#f2efe6');
const KINCHA = hex('#b79a5b');
const SHINSHU = hex('#8c3a31');
const SHINSHU_DARK = hex('#f26455');
const MATSUBA_DARK = hex('#679f75');
const MATSUBA_KINARI = hex('#44694d');

// [用途, 前景, 背景, 要求比率]。要求は WCAG 2.1 AA:
// 通常テキスト 4.5 / 大きなテキスト・非テキスト 3.0
const CASES = [
  ['本文 胡粉100%（墨面）', over(GOFUN, 1, WOOD), WOOD, 4.5],
  ['紹介文 胡粉82%', over(GOFUN, 0.82, WOOD), WOOD, 4.5],
  ['序サブコピー 胡粉80%', over(GOFUN, 0.8, WOOD), WOOD, 4.5],
  ['ナビ非アクティブ 胡粉60%', over(GOFUN, 0.6, WOOD), WOOD, 4.5],
  ['フォームlabel 胡粉60%', over(GOFUN, 0.6, WOOD), WOOD, 4.5],
  ['著作権表示 胡粉60%', over(GOFUN, 0.6, WOOD), WOOD, 4.5],
  ['placeholder 胡粉55%', over(GOFUN, 0.55, WOOD), WOOD, 4.5],
  ['欧文ラベル 金茶（墨面）', KINCHA, WOOD, 4.5],
  ['フォーカスリング 金茶', KINCHA, WOOD, 3.0],
  ['ナビ現在地 松葉（墨面）', MATSUBA_DARK, WOOD, 4.5],
  ['成功文 松葉（墨面）', MATSUBA_DARK, WOOD, 4.5],
  ['エラー文 真朱（墨面）', SHINSHU_DARK, WOOD, 4.5],
  ['落款「麟」真朱（墨面）', SHINSHU_DARK, WOOD, 3.0],
  ['作面 本文 胡粉100%', over(GOFUN, 1, WORKS), WORKS, 4.5],
  ['作面 金茶', KINCHA, WORKS, 4.5],
  ['作面 未着手 胡粉60%', over(GOFUN, 0.6, WORKS), WORKS, 4.5],
  ['落款「済」真朱（作面）', SHINSHU_DARK, WORKS, 3.0],
  ['和紙面 本文 墨', SUMI, KINARI, 4.5],
  ['和紙面 欧文ラベル 真朱', SHINSHU, KINARI, 4.5],
  ['和紙面 技能目盛り 真朱', SHINSHU, KINARI, 3.0],
  ['和紙面 ナビ現在地 松葉', MATSUBA_KINARI, KINARI, 4.5],
];

let failed = 0;
console.log(`実効背景  墨面 rgb(${WOOD.map(Math.round)}) / 作面 rgb(${WORKS.map(Math.round)})\n`);
console.log('用途                             比率   要求  判定');
console.log('─'.repeat(52));
for (const [label, fg, bg, need] of CASES) {
  const r = ratio(fg, bg);
  const ok = r >= need;
  if (!ok) failed += 1;
  console.log(`${label.padEnd(30)} ${r.toFixed(2).padStart(5)}  ${need.toFixed(1)}  ${ok ? '✅' : '❌'}`);
}
console.log(`\n不合格: ${failed} 件`);
process.exit(failed === 0 ? 0 : 1);

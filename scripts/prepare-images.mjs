/**
 * 元素材（高解像度 PNG）から配信用 WebP を生成する。
 *
 *   node scripts/prepare-images.mjs
 *
 * 元素材は iCloud 側の `新素材/` に置かれる（リポジトリには入れない。20MB 超あるため）。
 * 生成物だけを public/ にコミットする。素材を差し替えたら SOURCES のパスを直して再実行する。
 *
 * 盆栽は額縁が `aspect-[158/248]` で固定されているため、その比率に切り出す。
 * 正方形の素材をそのまま object-cover に渡すと中央で切られ、左へ大きく張り出した
 * 幹が落ちるので、樹の実測範囲（X 587〜3360）の中心で切る。
 */
import sharp from 'sharp';
import { mkdir } from 'node:fs/promises';
import { dirname } from 'node:path';

const MATERIALS =
  '/Users/rin/Library/Mobile Documents/com~apple~CloudDocs/Personal_Mac/開発/reportforio_260915/新素材';

const SOURCES = [
  {
    label: '木目背景',
    input: `${MATERIALS}/IMG_4359.PNG`,
    output: 'public/assets/wood.webp',
    // 全画面に敷く（sizes="100vw"）。2560 あれば 2x のデスクトップと横向きの iPhone を賄える。
    resize: { width: 2560 },
    quality: 82,
  },
  {
    label: '盆栽',
    input: `${MATERIALS}/IMG_4376.PNG`,
    output: 'public/assets/bonsai/front.webp',
    // 4096 角から 158:248 を切り出す（幅 = 4096 × 158/248 = 2609）。
    // 樹の実測範囲は X 587〜3360（幅 2773）で切り出し幅に収まらないため、
    // 左へ大きく張り出した白い幹（構図の主役）を優先し、右端の細い枝葉を落とす。
    // 中央で切ると幹が切れる。
    crop: { left: 570, top: 0, width: 2609, height: 4096 },
    // 表示上限は min(34vw, 460px, 30vh)。大型の 2x ディスプレイでも 900px 程度。
    resize: { width: 1422 },
    quality: 85,
  },
];

for (const { label, input, output, crop, resize, quality } of SOURCES) {
  await mkdir(dirname(output), { recursive: true });
  let pipeline = sharp(input);
  if (crop) pipeline = pipeline.extract(crop);
  const info = await pipeline
    .resize({ ...resize, withoutEnlargement: true })
    .webp({ quality, effort: 6 })
    .toFile(output);
  console.log(
    `${label.padEnd(6)} → ${output}  ${info.width} x ${info.height}  ${(info.size / 1024).toFixed(0)} KB`,
  );
}

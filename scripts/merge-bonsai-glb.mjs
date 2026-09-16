import { readFileSync, writeFileSync } from 'node:fs';

const [,, inPath, outPath] = process.argv;
const buf = readFileSync(inPath);
if (buf.readUInt32LE(0) !== 0x46546C67) throw new Error('not a GLB');
const jsonLen = buf.readUInt32LE(12);
const json = JSON.parse(buf.subarray(20, 20 + jsonLen).toString('utf8'));
const binStart = 20 + jsonLen + 8;
const bin = buf.subarray(binStart, binStart + buf.readUInt32LE(20 + jsonLen));

const COMP = { 5120: Int8Array, 5121: Uint8Array, 5122: Int16Array, 5123: Uint16Array, 5125: Uint32Array, 5126: Float32Array };
const NCOMP = { SCALAR: 1, VEC2: 2, VEC3: 3, VEC4: 4 };

// 色の島が多すぎると簡略化時に境界頂点がロックされるため、sRGB 空間で量子化して
// 隣接面の色を揃える。levels=0 なら量子化しない。
const LEVELS = Number(process.argv[4] ?? 0);
// 法線を捨てると position+color だけで weld でき、簡略化が効くようになる。
// レリーフなので three.js 側の computeVertexNormals() で滑らかな法線を作り直す。
const DROP_NORMAL = process.argv[5] === 'nonormal';
const toSrgb = (c) => (c <= 0.0031308 ? c * 12.92 : 1.055 * Math.pow(c, 1 / 2.4) - 0.055);
const toLinear = (c) => (c <= 0.04045 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4));
function quantize(bcf) {
  if (!LEVELS) return bcf;
  return bcf.map((c, i) => {
    if (i === 3) return c;
    const s = Math.round(toSrgb(Math.max(0, Math.min(1, c))) * (LEVELS - 1)) / (LEVELS - 1);
    return toLinear(s);
  });
}
const palette = new Map();
function paletteColor(bcf) {
  const q = quantize(bcf);
  const key = q[0] + '|' + q[1] + '|' + q[2];
  if (!palette.has(key)) palette.set(key, q);
  return palette.get(key);
}

const cache = new Map();
function read(accIdx) {
  if (cache.has(accIdx)) return cache.get(accIdx);
  const a = json.accessors[accIdx];
  const bv = json.bufferViews[a.bufferView];
  const TA = COMP[a.componentType];
  const n = NCOMP[a.type];
  if (bv.byteStride && bv.byteStride !== n * TA.BYTES_PER_ELEMENT) throw new Error('interleaved は未対応');
  const out = new TA(bin.buffer, bin.byteOffset + (bv.byteOffset ?? 0) + (a.byteOffset ?? 0), a.count * n);
  cache.set(accIdx, out);
  return out;
}

// このファイルは 16,201 プリミティブが 1 本の頂点バッファを共有している。
// 各プリミティブが実際に参照する頂点だけを複製し、面ごとのフラットな色を保つ。
const prims = [];
let totalIdx = 0;
for (const mesh of json.meshes) for (const p of mesh.primitives) {
  if ((p.mode ?? 4) !== 4) throw new Error('TRIANGLES 以外が含まれる');
  if (p.indices == null) throw new Error('非インデックス形式は未対応');
  prims.push(p);
  totalIdx += json.accessors[p.indices].count;
}
console.log(`プリミティブ ${prims.length.toLocaleString()} / インデックス総数 ${totalIdx.toLocaleString()}`);

const POS = new Float32Array(totalIdx * 3);
const NRM = new Float32Array(totalIdx * 3);
const COL = new Float32Array(totalIdx * 3);
const IDX = new Uint32Array(totalIdx);

let vOff = 0, iOff = 0;
const min = [Infinity, Infinity, Infinity], max = [-Infinity, -Infinity, -Infinity];
const remap = new Map();
for (const p of prims) {
  const pos = read(p.attributes.POSITION);
  const nrm = p.attributes.NORMAL != null ? read(p.attributes.NORMAL) : null;
  const idx = read(p.indices);
  const bcf = paletteColor(json.materials[p.material]?.pbrMetallicRoughness?.baseColorFactor ?? [1, 1, 1, 1]);
  remap.clear();
  for (let i = 0; i < idx.length; i++) {
    const oldV = idx[i];
    let newV = remap.get(oldV);
    if (newV === undefined) {
      newV = vOff++;
      remap.set(oldV, newV);
      for (let k = 0; k < 3; k++) {
        const c = pos[oldV * 3 + k];
        POS[newV * 3 + k] = c;
        NRM[newV * 3 + k] = nrm ? nrm[oldV * 3 + k] : 0;
        COL[newV * 3 + k] = bcf[k];
        if (c < min[k]) min[k] = c;
        if (c > max[k]) max[k] = c;
      }
    }
    IDX[iOff++] = newV;
  }
}
console.log(`→ 統合後 頂点 ${vOff.toLocaleString()} / 三角形 ${(iOff / 3).toLocaleString()} / 色 ${palette.size.toLocaleString()}`);

const pad4 = (n) => (n + 3) & ~3;
const sub = (ta, count, n) => Buffer.from(ta.buffer, ta.byteOffset, count * n * ta.BYTES_PER_ELEMENT);
const parts = DROP_NORMAL
  ? [sub(POS, vOff, 3), sub(COL, vOff, 3), sub(IDX, iOff, 1)]
  : [sub(POS, vOff, 3), sub(NRM, vOff, 3), sub(COL, vOff, 3), sub(IDX, iOff, 1)];
const views = []; const chunks = [];
let off = 0;
parts.forEach((d, i) => {
  views.push({ buffer: 0, byteOffset: off, byteLength: d.length, target: i === parts.length - 1 ? 34963 : 34962 });
  chunks.push(d);
  const padded = pad4(d.length);
  if (padded > d.length) chunks.push(Buffer.alloc(padded - d.length));
  off += padded;
});
const binOut = Buffer.concat(chunks);

const outJson = {
  asset: { version: '2.0', generator: 'portfolio-wafu merge (vertex colors)' },
  scene: 0,
  scenes: [{ nodes: [0] }],
  nodes: [{ name: 'Bonsai', mesh: 0 }],
  meshes: [{ name: 'Bonsai', primitives: [{ attributes: DROP_NORMAL ? { POSITION: 0, COLOR_0: 1 } : { POSITION: 0, NORMAL: 1, COLOR_0: 2 }, indices: DROP_NORMAL ? 2 : 3, material: 0 }] }],
  materials: [{ name: 'BonsaiVertexColor', pbrMetallicRoughness: { baseColorFactor: [1, 1, 1, 1], metallicFactor: 0, roughnessFactor: 1 }, doubleSided: true }],
  accessors: DROP_NORMAL ? [
    { bufferView: 0, componentType: 5126, count: vOff, type: 'VEC3', min, max },
    { bufferView: 1, componentType: 5126, count: vOff, type: 'VEC3' },
    { bufferView: 2, componentType: 5125, count: iOff, type: 'SCALAR' },
  ] : [
    { bufferView: 0, componentType: 5126, count: vOff, type: 'VEC3', min, max },
    { bufferView: 1, componentType: 5126, count: vOff, type: 'VEC3' },
    { bufferView: 2, componentType: 5126, count: vOff, type: 'VEC3' },
    { bufferView: 3, componentType: 5125, count: iOff, type: 'SCALAR' },
  ],
  bufferViews: views,
  buffers: [{ byteLength: binOut.length }],
};

const jsonBuf = Buffer.from(JSON.stringify(outJson), 'utf8');
const jsonPad = Buffer.alloc(pad4(jsonBuf.length) - jsonBuf.length, 0x20);
const header = Buffer.alloc(12);
header.writeUInt32LE(0x46546C67, 0); header.writeUInt32LE(2, 4);
const total = 12 + 8 + jsonBuf.length + jsonPad.length + 8 + binOut.length;
header.writeUInt32LE(total, 8);
const jc = Buffer.alloc(8); jc.writeUInt32LE(jsonBuf.length + jsonPad.length, 0); jc.writeUInt32LE(0x4E4F534A, 4);
const bc = Buffer.alloc(8); bc.writeUInt32LE(binOut.length, 0); bc.writeUInt32LE(0x004E4942, 4);
writeFileSync(outPath, Buffer.concat([header, jc, jsonBuf, jsonPad, bc, binOut]));
console.log(`✅ ${outPath} (${(total / 1048576).toFixed(1)} MB) — マテリアル 1 / プリミティブ 1`);

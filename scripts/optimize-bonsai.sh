#!/usr/bin/env bash
#
# 盆栽レリーフ GLB の最適化パイプライン（設計書 F02）。
#
#   bash scripts/optimize-bonsai.sh <入力.glb> <出力名>
#   例: bash scripts/optimize-bonsai.sh ~/…/bonsai_model/盆栽正面.glb front
#
# 素材は ImageToStl.com が写真から起こした浮き彫り（レリーフ）で、そのままでは Web で扱えない。
#   - 16,202 個のマテリアル（= 1 色 1 マテリアル）→ 同数のドローコール
#   - 16,201 個のプリミティブが 1 本の頂点バッファを共有している
#     → gltf-transform の palette / join は素朴に展開して 161 億頂点に膨らみ OOM で落ちる
#
# そのため統合だけは自前で行い（merge-bonsai-glb.mjs）、以降を gltf-transform に任せる。
#   1. merge    実参照頂点だけを取り出して 1 メッシュ 1 マテリアルへ。色は頂点カラーに焼き込む
#               色は sRGB 空間で 20 段に量子化（16,202 色 → 約 450 色）。
#               色の島が多すぎると簡略化時に境界頂点がロックされて三角形が落ちないため。
#               法線は捨てる（面ごとに法線が違うと weld が効かない）。three.js 側で再生成する。
#   2. weld     位置と色が一致する頂点を統合
#   3. simplify 三角形を削減
#   4. draco    圧縮。完了条件は 1.5MB 以内
#
set -euo pipefail

SRC="${1:?入力 GLB を指定してください}"
NAME="${2:?出力名を指定してください（例: front）}"
OUT_DIR="$(cd "$(dirname "$0")/.." && pwd)/public/assets/bonsai"
TMP="$(mktemp -d)"
trap 'rm -rf "$TMP"' EXIT

GT="npx --yes @gltf-transform/cli@4"

node "$(dirname "$0")/merge-bonsai-glb.mjs" "$SRC" "$TMP/01-merged.glb" 20 nonormal
$GT weld     "$TMP/01-merged.glb" "$TMP/02-weld.glb"
$GT simplify "$TMP/02-weld.glb"   "$TMP/03-simplify.glb" --ratio 0.05 --error 0.01
$GT draco    "$TMP/03-simplify.glb" "$OUT_DIR/bonsai-$NAME.glb" \
    --quantize-position 12 --quantize-color 8 --quantize-generic 12

ls -lh "$OUT_DIR/bonsai-$NAME.glb"

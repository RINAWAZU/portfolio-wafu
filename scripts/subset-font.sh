#!/usr/bin/env bash
# Yuji Syuku を使用文字だけにサブセットして woff2 を再生成する。
#
# 使い方: pnpm font:subset （package.json から呼ばれる想定。npm run font:subset でも可）
#
# 前提:
#   - python3 が使える
#   - pip install fonttools brotli 済み（未実施ならこのスクリプトが自動で実行する）
#   - src/fonts/src/YujiSyuku-Regular.ttf が置かれている
#     （Google Fonts / google/fonts リポジトリの OFL 版オリジナル。サブセット前の完全版）
#   - src/fonts/yuji-syuku.chars.txt に使用文字を1行で列挙済み
#
# 運用上の注意（設計書 §10-3 より）:
#   筆文字で表示する文言（ロゴ「麟」/ 一文字見出し 序我作技歴価結 / 落款「済」/
#   我の紹介文 / 序のサブコピー / モバイル縦ナビの一文字）を変更したら、
#   yuji-syuku.chars.txt を更新してこのスクリプトを再実行すること。
#   再実行しないと変更後の文言が「豆腐（tofu）」表示になる。

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
FONTS_DIR="$SCRIPT_DIR/../src/fonts"
SRC_TTF="$FONTS_DIR/src/YujiSyuku-Regular.ttf"
CHARS_FILE="$FONTS_DIR/yuji-syuku.chars.txt"
OUT_WOFF2="$FONTS_DIR/YujiSyuku-subset.woff2"

if [ ! -f "$SRC_TTF" ]; then
  echo "エラー: $SRC_TTF が見つかりません。" >&2
  echo "Google Fonts (https://fonts.google.com/specimen/Yuji+Syuku) または" >&2
  echo "https://github.com/google/fonts/raw/main/ofl/yujisyuku/YujiSyuku-Regular.ttf から取得し、" >&2
  echo "src/fonts/src/ に配置してください（OFL のためサブセット・再配布可）。" >&2
  exit 1
fi

if [ ! -f "$CHARS_FILE" ]; then
  echo "エラー: $CHARS_FILE が見つかりません。" >&2
  exit 1
fi

if ! python3 -c "import fontTools" >/dev/null 2>&1; then
  echo "fonttools が見つからないためインストールします..."
  pip3 install fonttools brotli
fi

python3 -m fontTools.subset "$SRC_TTF" \
  --text-file="$CHARS_FILE" \
  --flavor=woff2 \
  --layout-features='' \
  --output-file="$OUT_WOFF2"

echo "生成しました: $OUT_WOFF2"
ls -la "$OUT_WOFF2"

# フォントのサブセット運用

このサイトは**和文フォントをすべて自前サブセットで配信する**（Google Fonts からは
欧文の Marcellus / JetBrains Mono のみを読む）。設計書 `docs/architecture.md` §7, §10-3 に基づく。

| 書体 | 役割 | 実体 | 再生成 |
|---|---|---|---|
| Yuji Syuku | 筆文字（下記5箇所のみ） | `YujiSyuku-subset.woff2` | `npm run font:subset`（文字は手動列挙） |
| Shippori Mincho B1 400/600 | 和文見出し・タグライン | `ShipporiMinchoB1-{400,600}-subset.woff2` | `npm run font:measure` → `npm run font:subset:jp`（**文字は実サイトのDOMから書体別に実測**） |
| Zen Kaku Gothic New 400 | 和文本文 | `ZenKakuGothicNew-400-subset.woff2` | 同上 |

## なぜ自前サブセットなのか

`next/font/google` で和文を読むと、Google が unicode-range で約120分割した `@font-face` が
**そのまま CSS に展開される**。実測では 2 書体で **488 定義・372KB のレンダリングを止める CSS**
になり、その評価だけで Style & Layout が 1.5 秒を超えていた
（Lighthouse モバイル: Performance 55 / FCP 8.1s）。

自前サブセットに置き換えた結果、CSS は **36.6KB・23 定義**まで減り、
**Performance 90 / FCP 1.1s** になった。和文フォントを Google 配信に戻すとこの退行が再発する。

---

## Yuji Syuku（筆文字）

設計書 §10-3 に基づく。

## 使用箇所（この5箇所以外に広げないこと）

1. ロゴ「麟」
2. 一文字見出し（序 我 作 技 歴 価 結）
3. 落款「済」
4. 我（About）の紹介文
5. 序（Prologue）のサブコピー、モバイル縦ナビの一文字

## ファイル構成

```
src/fonts/
├ src/YujiSyuku-Regular.ttf   フルセットの原本（.gitignore 対象。下記URLから再取得可）
├ yuji-syuku.chars.txt        使用文字の列挙（1行）
├ YujiSyuku-subset.woff2      サブセット済み実体（next/font/local が読み込む）
├ OFL.txt                     ライセンス（OFL 1.1。同梱必須）
└ README.md                   このファイル
```

## 再生成が必要になるタイミング

**筆文字で表示する文言（上記5箇所のいずれか）を1文字でも変更・追加したら、
`yuji-syuku.chars.txt` を更新して `npm run font:subset` を再実行すること。**
再実行を忘れると、追加した文字が「豆腐（□）」になる。tester は文言変更のたびに
実際の表示を目視確認すること。

## 原本の入手先

`src/fonts/src/YujiSyuku-Regular.ttf` は `.gitignore` 対象のため、初回セットアップ時や
Git 管理外の環境では以下のいずれかから再取得する。

- Google Fonts: https://fonts.google.com/specimen/Yuji+Syuku
- google/fonts リポジトリ（OFL 原本・直接ダウンロード可）:
  `https://github.com/google/fonts/raw/main/ofl/yujisyuku/YujiSyuku-Regular.ttf`

## 再生成手順

```bash
npm run font:subset
```

内部では `scripts/subset-font.sh` が以下を実行する。

1. `fonttools` / `brotli` が無ければ `pip install fonttools brotli`
2. `python3 -m fontTools.subset` で `yuji-syuku.chars.txt` の文字だけを woff2 に抽出
3. `src/fonts/YujiSyuku-subset.woff2` を上書き

## next/font/local での読み込み

`src/app/layout.tsx` で以下のように読み込む（`display: 'block'` + `preload: true`）。
筆書体 → 明朝フォールバックの FOUT / CLS を避けるための構成（設計書 §10-3）。

```ts
import localFont from 'next/font/local';

const yuji = localFont({
  src: './fonts/YujiSyuku-subset.woff2',
  variable: '--font-yuji',
  display: 'block',
  preload: true,
});
```

---

## Shippori Mincho B1 / Zen Kaku Gothic New（和文見出し・本文）

### 再生成

文言を変えたら、**実測 → 生成**の2段で流し直す。

```bash
npm run build && npm run start      # 別ターミナルで本番ビルドを起動しておく
npm run font:measure                # 実サイトの DOM から書体×ウェイトごとの使用文字を実測
npm run font:subset:jp              # その文字集合で 3 つの woff2 を生成
```

| 文字集合ファイル | 対象 | 中身 |
|---|---|---|
| `mincho-400.chars.txt` | 明朝 400 | 実測（JP/EN × モバイル/デスクトップ）+ ASCII・約物 |
| `mincho-600.chars.txt` | 明朝 600 | 同上（見出し・タグライン・プラン名など） |
| `zen-400.chars.txt` | Zen 角ゴ 400 | 同上 + ひらがな・カタカナ全域 + 問い合わせ周りの文字列リテラル |

- `scripts/measure-font-usage.mjs`（`puppeteer-core` + Chrome）が全テキストノードと placeholder を集め、
  親要素の computed style（font-family / font-weight）で書体を判定する。
- `scripts/subset-jp-fonts.mjs` が `python3 -m fontTools.subset` で woff2 を生成する。
  `fonttools` を入れた venv を使うときは `PYTHON=/path/to/python npm run font:subset:jp`。
- 開発サーバーが `localhost:3000` 以外なら `BASE_URL=http://localhost:3100/ npm run font:measure`。

### なぜ書体別に実測するのか

以前は「ソースの文字列リテラル」から全書体に**同じ 663 字**を積んでいた（3 書体で 300KB）。
実際に描かれるのは明朝 600 が約 110 字、明朝 400 が約 190 字、Zen が約 200 字にすぎない。
実測に切り替えて **300KB → 約 96KB**になった。旧方式は取りこぼしもあり、
実測後はシステム書体（Hiragino）に落ちていた 14 字が配信フォントで描かれるようになった。

**実測でも数えられないもの**は、操作した後にだけ出る文言（フォームの検証エラー・送信結果）と
疑似要素の `content`。前者は Zen の文字集合にソースの文字列リテラルとかな全域を足して補っている。
明朝は見出しと静的文言だけなので補っていない。**明朝で操作後にだけ出る文言を足したときは
`scripts/measure-font-usage.mjs` の `EXTRA_*` を見直すこと。**

抜けた文字は豆腐ではなく、`font-family` のフォールバック（`serif` / `sans-serif`）で
その文字だけシステム書体になる。気づきにくい劣化なので、文言を変えたら流し直す。

### 原本の入手先

`src/fonts/src/` は `.gitignore` 対象（計 41MB）。初回セットアップ時は以下を取得して置く。

```bash
cd src/fonts/src
curl -LO https://github.com/google/fonts/raw/main/ofl/shipporiminchob1/ShipporiMinchoB1-Regular.ttf
curl -LO https://github.com/google/fonts/raw/main/ofl/shipporiminchob1/ShipporiMinchoB1-SemiBold.ttf
curl -LO https://github.com/google/fonts/raw/main/ofl/zenkakugothicnew/ZenKakuGothicNew-Regular.ttf
```

ライセンスは `OFL-ShipporiMinchoB1.txt` / `OFL-ZenKakuGothicNew.txt` として同梱済み（OFL 1.1）。

### 太さについて

Zen Kaku Gothic New の **weight 500 は読み込まない**（実装上どこからも使われていないため）。
本文に `font-medium` を使いたくなった場合は、このファイルに追記したうえで
`scripts/subset-jp-fonts.mjs` の `FONTS` と `scripts/measure-font-usage.mjs` の `bucketOf` に 500 を足すこと。

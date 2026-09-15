# フォントのサブセット運用

このサイトは**和文フォントをすべて自前サブセットで配信する**（Google Fonts からは
欧文の Marcellus / JetBrains Mono のみを読む）。設計書 `docs/architecture.md` §7, §10-3 に基づく。

| 書体 | 役割 | 実体 | 再生成 |
|---|---|---|---|
| Yuji Syuku | 筆文字（下記5箇所のみ） | `YujiSyuku-subset.woff2` | `npm run font:subset`（文字は手動列挙） |
| Shippori Mincho B1 400/600 | 和文見出し・タグライン | `ShipporiMinchoB1-{400,600}-subset.woff2` | `npm run font:subset:jp`（**文字はソースから自動抽出**） |
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

```bash
npm run font:subset:jp
```

`scripts/subset-jp-fonts.mjs` が以下を行う。

1. `src/**/*.{ts,tsx}` の**文字列リテラルと JSX テキストから使用文字を自動抽出**する
2. 保険として ASCII・ひらがな・カタカナ・約物の全域を常に足す（現在 663 文字）
3. `python3 -m fontTools.subset` で 3 つの woff2 を生成する
4. 抽出結果を `jp.chars.txt` に書き出す（差分を見れば何が増減したか分かる）

文字集合はソースから自動で作られるため、**文言を変えたらこのコマンドを流し直すだけでよい**
（Yuji Syuku のように手で文字を列挙する必要はない）。流し忘れると追加した漢字が豆腐（□）になる。

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
`scripts/subset-jp-fonts.mjs` の `FONTS` に 500 のサブセットを足すこと。

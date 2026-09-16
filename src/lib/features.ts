/**
 * 表示の on/off を1箇所に集める。
 *
 * 盆栽は 2026-09-16 の実機確認で社長判断により一旦オフにした。
 * 素材（4096角の正方形）を額縁比率 158:248 に切り出すと構図が不自然になり、
 * サイト全体の質感を下げていたため。素材が縦長で用意できたら true に戻す。
 *
 * 実装（BonsaiStage / BonsaiFigure / BonsaiImage / BonsaiModel / 最適化済み GLB）は
 * 残してあるので、このフラグ1つで復帰できる。
 *
 * なお季節の演出そのものは盆栽と独立している（SeasonController が書き込む
 * `--season-glow` / `--season-beam` を霧と光の帯が参照している）ため、
 * 盆栽を消しても「場の光」としての四季は残る。
 */
export const SHOW_BONSAI = false;

/**
 * 序の霧（KiriGlow）。2026-09-16 の実機確認で社長判断によりオフ。
 *
 * 注意: `--season-glow` を参照しているのはこの霧だけで、`--season-beam` を
 * 参照していたのは BonsaiFigure だけだった。したがって両方オフの現在、
 * SeasonController が計算している四季は**画面上に一切現れない**。
 * 四季の演出を復活させるなら、どちらかを戻すか、季節を映す別の面を用意する必要がある。
 */
export const SHOW_KIRI_GLOW = false;

/**
 * スクロール連動の四季（SeasonController）。2026-09-16 に社長判断でオフ。
 *
 * 盆栽と霧を落とした結果、季節を映す面が1つも無くなったため、計算だけが走る状態に
 * なっていた。オフにすると `--season-*` は tokens.css の初期値（新緑）で固定される。
 *
 * コードは削除していない。季節の純粋関数（season.ts）と単体テストは盆栽の実装と
 * 共有しており、消すと盆栽側も道連れになるため。四季ごと不要と決まったら
 * SeasonController / season.ts / seasonRuntime.ts / useSeasonBlend.ts /
 * types/season.ts と盆栽一式をまとめて削除する。
 */
export const ENABLE_SEASON = false;

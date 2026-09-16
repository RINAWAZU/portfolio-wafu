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

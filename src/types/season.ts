/** 盆栽が移ろう四季。TOKENS.md の割り当て（序=新緑 / 作=深緑 / 価=紅葉 / 結=雪）と対応する。 */
export type Season = 'spring' | 'summer' | 'autumn' | 'winter';

/**
 * スクロール位置から求めた季節の混合状態。
 * 離散値ではなく「from → to への遷移が t だけ進んでいる」という連続値として持つ。
 */
export interface SeasonBlend {
  readonly from: Season;
  readonly to: Season;
  /** 0..1 の混合比。0 なら from そのもの、1 なら to そのもの */
  readonly t: number;
  /** ラベル表示用の離散値（t < .5 なら from、それ以外は to） */
  readonly dominant: Season;
}

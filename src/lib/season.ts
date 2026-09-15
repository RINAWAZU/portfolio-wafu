import type { SectionId } from '@/types/content';
import type { Season, SeasonBlend } from '@/types/season';

/** 季節のキーフレーム。TOKENS.md の割り当て（序=新緑 / 作=深緑 / 価=紅葉 / 結=雪）と1:1で対応する。 */
export const SEASON_ANCHORS = [
  { season: 'spring', sectionId: 'prologue' },
  { season: 'summer', sectionId: 'works' },
  { season: 'autumn', sectionId: 'pricing' },
  { season: 'winter', sectionId: 'contact' },
] as const satisfies readonly { season: Season; sectionId: SectionId }[];

/**
 * 区間の前後何%を単一季節で安定させるか（§5-1「プラトー付き補間」）。
 * 調整はこの定数1箇所で行う。
 */
export const SEASON_PLATEAU = 0.3;

function smoothstep(x: number): number {
  const clamped = Math.min(1, Math.max(0, x));
  return clamped * clamped * (3 - 2 * clamped);
}

function plateauInterpolate(u: number): number {
  const span = 1 - SEASON_PLATEAU * 2;
  return smoothstep((u - SEASON_PLATEAU) / span);
}

/**
 * スクロール位置(px)と各アンカーの実測 offsetTop(px) から混合比を求める純粋関数。
 *
 * - anchorTops は SEASON_ANCHORS と同じ並び・同じ長さ（4）で、昇順であること。
 * - 呼び出し側で最終アンカーを `scrollHeight - innerHeight` にクランプしておくこと。
 *   （やらないと最下部まで下げても winter に到達しない。§5-1 の「最も踏みやすい罠」）
 */
export function blendAt(scrollY: number, anchorTops: readonly number[]): SeasonBlend {
  const seasons = SEASON_ANCHORS.map((anchor) => anchor.season);
  const last = seasons.length - 1;

  if (anchorTops.length !== seasons.length) {
    // 実測がまだ揃っていない（マウント直後など）は先頭の季節で安定させる
    return { from: seasons[0], to: seasons[0], t: 0, dominant: seasons[0] };
  }

  if (scrollY <= anchorTops[0]) {
    return { from: seasons[0], to: seasons[0], t: 0, dominant: seasons[0] };
  }
  if (scrollY >= anchorTops[last]) {
    return { from: seasons[last], to: seasons[last], t: 1, dominant: seasons[last] };
  }

  for (let i = 0; i < last; i += 1) {
    const start = anchorTops[i];
    const end = anchorTops[i + 1];
    if (scrollY >= start && scrollY <= end) {
      const u = end > start ? (scrollY - start) / (end - start) : 1;
      const t = plateauInterpolate(u);
      const dominant = t < 0.5 ? seasons[i] : seasons[i + 1];
      return { from: seasons[i], to: seasons[i + 1], t, dominant };
    }
  }

  // 浮動小数の境界誤差などで上のループに一致しなかった場合の保険
  return { from: seasons[last], to: seasons[last], t: 1, dominant: seasons[last] };
}

/** SeasonBlend → 4季節それぞれの不透明度。合計は常に1になる。 */
export function seasonOpacities(blend: SeasonBlend): Readonly<Record<Season, number>> {
  const opacities: Record<Season, number> = { spring: 0, summer: 0, autumn: 0, winter: 0 };
  opacities[blend.from] += 1 - blend.t;
  opacities[blend.to] += blend.t;
  return opacities;
}

interface RGBA {
  readonly r: number;
  readonly g: number;
  readonly b: number;
  readonly a: number;
}

interface SeasonFilterParams {
  readonly saturate: number;
  readonly brightness: number;
  readonly sepia: number;
}

interface SeasonEnvironmentDef {
  readonly glow: RGBA;
  readonly beam: RGBA;
  readonly filter: SeasonFilterParams;
}

/**
 * 季節ごとの「場の光」の定義（§5-4）。画像1枚のまま季節を成立させるための提案値。
 * hue-rotate は使わない（葉を赤くすると鉢・幹まで色相が回って破綻するため）。
 * 数値はデザイン確認待ち（§12-2 #4）。
 */
const SEASON_ENVIRONMENT: Readonly<Record<Season, SeasonEnvironmentDef>> = {
  spring: {
    glow: { r: 200, g: 214, b: 190, a: 0.1 },
    beam: { r: 183, g: 154, b: 91, a: 0.6 },
    filter: { saturate: 1.08, brightness: 1.04, sepia: 0 },
  },
  summer: {
    glow: { r: 242, g: 239, b: 230, a: 0.06 },
    beam: { r: 183, g: 154, b: 91, a: 0.6 },
    filter: { saturate: 0.92, brightness: 0.94, sepia: 0 },
  },
  autumn: {
    glow: { r: 183, g: 154, b: 91, a: 0.13 },
    beam: { r: 183, g: 154, b: 91, a: 0.8 },
    filter: { saturate: 1.0, brightness: 0.98, sepia: 0.18 },
  },
  winter: {
    glow: { r: 242, g: 239, b: 230, a: 0.14 },
    beam: { r: 242, g: 239, b: 230, a: 0.5 },
    filter: { saturate: 0.45, brightness: 1.06, sepia: 0 },
  },
};

function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

function lerpRgba(from: RGBA, to: RGBA, t: number): string {
  const r = Math.round(lerp(from.r, to.r, t));
  const g = Math.round(lerp(from.g, to.g, t));
  const b = Math.round(lerp(from.b, to.b, t));
  const a = lerp(from.a, to.a, t);
  return `rgba(${r}, ${g}, ${b}, ${a.toFixed(3)})`;
}

export interface SeasonEnvironment {
  readonly glowColor: string;
  readonly beamColor: string;
  readonly filter: string;
}

/**
 * 画像1枚のまま季節を成立させる「場の光」を、SeasonBlend から補間して返す。
 * SeasonController がこの結果を rAF 内で documentElement に直接書き込む（§5-4, §5-3）。
 */
export function seasonEnvironmentAt(blend: SeasonBlend): SeasonEnvironment {
  const from = SEASON_ENVIRONMENT[blend.from];
  const to = SEASON_ENVIRONMENT[blend.to];
  const { t } = blend;

  const saturate = lerp(from.filter.saturate, to.filter.saturate, t);
  const brightness = lerp(from.filter.brightness, to.filter.brightness, t);
  const sepia = lerp(from.filter.sepia, to.filter.sepia, t);

  return {
    glowColor: lerpRgba(from.glow, to.glow, t),
    beamColor: lerpRgba(from.beam, to.beam, t),
    filter: `saturate(${saturate.toFixed(3)}) brightness(${brightness.toFixed(3)}) sepia(${sepia.toFixed(3)})`,
  };
}

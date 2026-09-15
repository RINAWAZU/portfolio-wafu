import { describe, expect, it } from 'vitest';
import { SEASON_ANCHORS, SEASON_PLATEAU, blendAt, seasonOpacities } from './season';

// 序=0 / 作=1000 / 価=2000 / 結=3000 相当のダミーアンカー
const ANCHOR_TOPS = [0, 1000, 2000, 3000] as const;

describe('SEASON_ANCHORS', () => {
  it('matches the TOKENS.md assignment (序=新緑 / 作=深緑 / 価=紅葉 / 結=雪)', () => {
    expect(SEASON_ANCHORS.map((anchor) => `${anchor.season}:${anchor.sectionId}`)).toEqual([
      'spring:prologue',
      'summer:works',
      'autumn:pricing',
      'winter:contact',
    ]);
  });
});

describe('blendAt', () => {
  it('pins to the first season before the first anchor', () => {
    const blend = blendAt(-100, ANCHOR_TOPS);
    expect(blend).toEqual({ from: 'spring', to: 'spring', t: 0, dominant: 'spring' });
  });

  it('stays on a single season within the leading plateau of an interval', () => {
    const plateauEnd = 1000 + (2000 - 1000) * SEASON_PLATEAU;
    const blend = blendAt(plateauEnd - 1, ANCHOR_TOPS);
    expect(blend.from).toBe('summer');
    expect(blend.to).toBe('autumn');
    expect(blend.t).toBe(0);
    expect(blend.dominant).toBe('summer');
  });

  it('stays on a single season within the trailing plateau of an interval', () => {
    const plateauStart = 1000 + (2000 - 1000) * (1 - SEASON_PLATEAU);
    const blend = blendAt(plateauStart + 1, ANCHOR_TOPS);
    expect(blend.t).toBe(1);
    expect(blend.dominant).toBe('autumn');
  });

  it('transitions smoothly through the middle 40% of an interval', () => {
    const mid = (1000 + 2000) / 2;
    const blend = blendAt(mid, ANCHOR_TOPS);
    expect(blend.t).toBeGreaterThan(0);
    expect(blend.t).toBeLessThan(1);
  });

  it('clamps to winter at t=1 once the final anchor is reached or exceeded', () => {
    expect(blendAt(3000, ANCHOR_TOPS)).toEqual({ from: 'winter', to: 'winter', t: 1, dominant: 'winter' });
    expect(blendAt(999_999, ANCHOR_TOPS)).toEqual({ from: 'winter', to: 'winter', t: 1, dominant: 'winter' });
  });
});

describe('seasonOpacities', () => {
  it('always sums to 1 and matches the from/to weights', () => {
    const blend = blendAt(1500, ANCHOR_TOPS);
    const opacities = seasonOpacities(blend);
    const total = Object.values(opacities).reduce((sum, value) => sum + value, 0);
    expect(total).toBeCloseTo(1);
    expect(opacities[blend.from]).toBeCloseTo(1 - blend.t);
    expect(opacities[blend.to]).toBeCloseTo(blend.t);
  });

  it('is fully one season at the edges', () => {
    const opacities = seasonOpacities(blendAt(-100, ANCHOR_TOPS));
    expect(opacities.spring).toBe(1);
    expect(opacities.summer + opacities.autumn + opacities.winter).toBe(0);
  });
});

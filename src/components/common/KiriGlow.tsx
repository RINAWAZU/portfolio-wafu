export interface KiriGlowProps {
  readonly position?: string;
}

/**
 * 霧の放射グラデーション。色は `var(--season-glow)` を参照する（設計書 §5-4, §6-2）。
 * JS を持たない。SeasonController が書き込む CSS 変数が変わるだけで季節に反応する。
 */
export function KiriGlow({ position = 'inset-0' }: KiriGlowProps) {
  return <div aria-hidden="true" className={`kiri-glow pointer-events-none absolute ${position}`} />;
}

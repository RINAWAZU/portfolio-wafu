export type BrushChar = '麟' | '序' | '我' | '作' | '技' | '歴' | '価' | '結' | '済';

export interface BrushGlyphProps {
  readonly char: BrushChar;
  readonly animate?: 'none' | 'wipe';
  readonly className?: string;
}

/**
 * 筆文字1文字の描画。Yuji Syuku で確定しているため実装の分岐は持たない（設計書 §6-2-1）。
 * `BrushChar` 型は、筆文字の使用箇所を5つに限定する規約を機械的に強制するために残す
 * （本文へ広げようとするとコンパイルエラーになる）。
 *
 * `animate='wipe'` は CSS の `clip-path` アニメーションのみで完結し、JS を必要としない
 * （`prefers-reduced-motion` の縮退も globals.css 側のメディアクエリで担保する）。
 * ロゴ「麟」は常時ビューポート内にあるため、マウント時に自動再生してよい。
 * セクション見出しでの「初回進入時」トリガー（Reveal との連動）は Phase 2 で配線する。
 */
export function BrushGlyph({ char, animate = 'none', className = '' }: BrushGlyphProps) {
  const animationClass = animate === 'wipe' ? 'brush-glyph--wipe' : '';
  return <span className={`font-brush ${animationClass} ${className}`.trim()}>{char}</span>;
}

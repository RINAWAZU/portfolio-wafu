import { BrushGlyph, type BrushChar } from './BrushGlyph';

export interface SectionHeadingProps {
  readonly glyph: BrushChar;
  readonly latin: string;
  readonly tone: 'on-dark' | 'on-kinari';
}

const TONE_CLASS: Record<'on-dark' | 'on-kinari', string> = {
  'on-dark': 'text-gofun',
  'on-kinari': 'text-sumi',
};

/**
 * 欧文ラベルの色。金茶は生成（和紙）面に乗せると実測 1.96:1 まで落ちて読めない。
 * tokens.css の定義どおり「真朱＝生成面の欧文ラベル」に従う（実測 5.51:1）。
 */
const LATIN_TONE_CLASS: Record<'on-dark' | 'on-kinari', string> = {
  'on-dark': 'text-kincha',
  'on-kinari': 'text-shinshu',
};

/** 一文字筆文字 + 欧文 small caps。内部で `<h2>` を出す（設計書 §6-2, §13-4）。 */
export function SectionHeading({ glyph, latin, tone }: SectionHeadingProps) {
  return (
    <h2 className={`flex items-end gap-5 ${TONE_CLASS[tone]}`}>
      <BrushGlyph char={glyph} className="text-[clamp(4rem,8vw,7rem)] leading-[0.9]" />
      <span className={`pb-3.5 font-latin text-sm tracking-latin uppercase ${LATIN_TONE_CLASS[tone]}`}>{latin}</span>
    </h2>
  );
}

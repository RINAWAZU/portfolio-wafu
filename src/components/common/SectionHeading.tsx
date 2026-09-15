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

/** 一文字筆文字 + 欧文 small caps。内部で `<h2>` を出す（設計書 §6-2, §13-4）。 */
export function SectionHeading({ glyph, latin, tone }: SectionHeadingProps) {
  return (
    <h2 className={`flex items-end gap-5 ${TONE_CLASS[tone]}`}>
      <BrushGlyph char={glyph} className="text-[clamp(4rem,8vw,7rem)] leading-[0.9]" />
      <span className="pb-3.5 font-latin text-sm tracking-latin text-kincha uppercase">{latin}</span>
    </h2>
  );
}

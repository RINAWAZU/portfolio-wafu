import type { CareerEntry, CareerTone } from '@/types/content';
import { useLang } from '@/hooks/useLang';
import { pickText } from '@/lib/i18n';

export interface CareerEntryViewProps {
  readonly entry: CareerEntry;
}

const TONE_CLASS: Record<CareerTone, string> = {
  past: '',
  current: 'bg-kincha/[0.12]',
  // 生成面に対して 4.5:1 を確保するため /55 から引き上げ（設計書 §13-3）。
  future: 'text-sumi/70',
};

/**
 * 年表1件(設計書 §6-4)。デスクトップは横一列の1カラム(`border-r`)、
 * モバイルは縦の年表(左罫線 `border-l`)として同じマークアップを描き分ける。
 * `current` は金茶の薄面、`future` は薄墨(設計書 §14 T21)。会社名は含めない
 * (`content/career.ts`側で既に置換済み)。
 *
 * セル内は左右対称のパディングを取る(ワイヤーフレーム #3a: 中間セルは `padding:14px 12px 0`)。
 * 片側だけだと内容が罫線に張り付いて「左詰め」に見えるため。
 */
export function CareerEntryView({ entry }: CareerEntryViewProps) {
  const { lang } = useLang();

  return (
    <div
      className={`border-l border-hairline-dark py-1.5 pl-4 lg:border-l-0 lg:border-r lg:px-6 lg:py-6 lg:first:pl-0 lg:last:border-r-0 lg:last:pr-0 ${TONE_CLASS[entry.tone]}`}
    >
      <p className="font-mono text-xs tracking-[.15em] text-shinshu">{entry.when}</p>
      <p className="mt-0.5 font-latin text-[10px] tracking-latin text-sumi/50 uppercase">{pickText(entry.kind, lang)}</p>
      <p className="mt-2.5 font-mincho text-sm leading-loose text-sumi">{pickText(entry.body, lang)}</p>
    </div>
  );
}

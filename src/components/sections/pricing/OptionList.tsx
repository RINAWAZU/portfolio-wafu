import type { PriceOption } from '@/types/content';
import { useLang } from '@/hooks/useLang';
import { formatYen } from '@/lib/format';
import { pickText } from '@/lib/i18n';

export interface OptionListProps {
  readonly options: readonly PriceOption[];
}

/** オプション単価(設計書 §6-4)。 */
export function OptionList({ options }: OptionListProps) {
  const { lang } = useLang();

  return (
    <ul className="flex flex-wrap gap-x-8 gap-y-3 font-mono text-xs tracking-[.05em] text-sumi/75">
      {options.map((option) => (
        <li key={pickText(option.label, lang)}>
          {/* 金額は装飾ではなく読ませる情報。生成面に対して 4.5:1 を確保するため /50 から引き上げ（§13-3）。 */}
          {pickText(option.label, lang)} <span className="text-sumi/70">+{formatYen(option.from)}〜</span>
        </li>
      ))}
    </ul>
  );
}

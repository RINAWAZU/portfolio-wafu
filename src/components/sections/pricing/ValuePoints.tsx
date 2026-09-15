import type { ValuePoint } from '@/types/content';
import { useLang } from '@/hooks/useLang';
import { pickText } from '@/lib/i18n';

export interface ValuePointsProps {
  readonly points: readonly ValuePoint[];
}

/**
 * 30%〜 / 0円 / ∞ の価値訴求3点(設計書 §6-4)。
 * 下の制作3プランと桁を揃えるため、コンテンツ幅いっぱいの3分割で並べる。
 */
export function ValuePoints({ points }: ValuePointsProps) {
  const { lang } = useLang();

  return (
    <div className="mt-12 grid grid-cols-1 gap-x-6 gap-y-6 border-t border-hairline-dark pt-6 sm:grid-cols-3">
      {points.map((point) => (
        <div key={point.label.ja}>
          <p className="font-mincho text-2xl font-semibold text-sumi">
            {point.value}
            <span className="ml-0.5 text-sm font-normal text-sumi/60">{point.unit}</span>
          </p>
          <p className="mt-1 font-mincho text-sm text-sumi">{pickText(point.label, lang)}</p>
          <p className="mt-1 text-caption leading-snug text-sumi/60">{pickText(point.note, lang)}</p>
        </div>
      ))}
    </div>
  );
}

import type { ProfileStat } from '@/types/content';
import { useLang } from '@/hooks/useLang';
import { pickText } from '@/lib/i18n';

export interface StatTripleProps {
  readonly items: readonly ProfileStat[];
}

/**
 * 23 AGE / 05 YRS / JP-EN の数値3点(設計書 §6-4)。
 *
 * `flex-wrap` と `gap-x-7`: 3点を1行に固定すると、左ナビ分の余白を引いた狭い画面
 * （360px 幅で内容幅 216px）で3つ目が画面外へ出る。折り返しを許して収める。
 */
export function StatTriple({ items }: StatTripleProps) {
  const { lang } = useLang();

  return (
    <div className="mt-7 flex flex-wrap gap-x-7 gap-y-3 font-mono text-[11px] tracking-[.15em] text-kincha">
      {items.map((item) => (
        <span key={item.label}>
          <span className="mr-1.5 font-mincho text-[30px] text-gofun">{item.value}</span>
          {pickText(item.suffix, lang)}
        </span>
      ))}
    </div>
  );
}

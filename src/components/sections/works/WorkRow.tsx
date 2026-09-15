import { SealMark } from '@/components/common/SealMark';
import { PLANNED_LABEL } from '@/content/works';
import { useLang } from '@/hooks/useLang';
import { pickText } from '@/lib/i18n';
import type { Work } from '@/types/content';

export interface WorkRowProps {
  readonly work: Work;
}

const DELIVERED_LABEL = { ja: '納品済み', en: 'Delivered' } as const;

/** 短冊1行(モバイル・横書き)。設計書 §6-4。 */
export function WorkRow({ work }: WorkRowProps) {
  const { lang } = useLang();
  const isDelivered = work.status === 'delivered';
  const meta = isDelivered ? `${work.categoryLabel} · ${work.year}` : pickText(PLANNED_LABEL, lang);

  return (
    <div
      className={`flex items-center gap-2.5 px-3 py-2.5 ${
        isDelivered ? 'border border-hairline bg-sumi/35' : 'border border-dashed border-hairline/70 text-gofun/50'
      }`}
    >
      <span className="font-mono text-[11px] text-kincha">{work.no}</span>
      <span className="flex-1 font-mincho text-[13px] tracking-mincho text-gofun">
        {pickText(work.title, lang)}
        <span className="mt-0.5 block font-mono text-[10px] tracking-[.15em] text-gofun/50">{meta}</span>
      </span>
      {isDelivered && <SealMark char="済" label={pickText(DELIVERED_LABEL, lang)} size="sm" />}
    </div>
  );
}

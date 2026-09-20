import type { ReactNode } from 'react';
import { SealMark } from '@/components/common/SealMark';
import { EXTERNAL_LABEL, STATUS_LABEL } from '@/content/works';
import { useLang } from '@/hooks/useLang';
import { pickText } from '@/lib/i18n';
import type { Work } from '@/types/content';

export interface WorkRowProps {
  readonly work: Work;
}

// 「納品」は受託を思わせる語なので使わない。ここは自主制作の作品集である。
const COMPLETED_LABEL = { ja: '完成', en: 'Completed' } as const;

/**
 * 短冊1行(モバイル・横書き)。設計書 §6-4。
 *
 * `WorkTanzaku` と同じく、`work.href` を持つ作品だけ行ごとリンクになる
 * (社長指示・2026-09-20)。指で押す面なので行全体を当たり判定にする。
 */
export function WorkRow({ work }: WorkRowProps) {
  const { lang } = useLang();
  const isDelivered = work.status === 'delivered';
  const meta = isDelivered ? `${work.categoryLabel} · ${work.year}` : pickText(STATUS_LABEL[work.status], lang);

  const frameClass = `flex items-center gap-2.5 px-3 py-2.5 ${
    isDelivered ? 'border border-hairline bg-sumi/35' : 'border border-dashed border-hairline/70 text-gofun/60'
  }`;

  const body: ReactNode = (
    <>
      <span className="font-mono text-[11px] text-kincha">{work.no}</span>
      <span className="flex-1 font-mincho text-[13px] tracking-mincho text-gofun">
        {pickText(work.title, lang)}
        <span className="mt-0.5 block font-mono text-[10px] tracking-[.15em] text-gofun/60">{meta}</span>
      </span>
      {isDelivered && <SealMark char="済" label={pickText(COMPLETED_LABEL, lang)} size="sm" />}
    </>
  );

  if (!work.href) {
    return <div className={frameClass}>{body}</div>;
  }

  return (
    <a
      href={work.href}
      target="_blank"
      rel="noopener noreferrer"
      className={`${frameClass} transition-colors duration-[0.4s] ease-out hover:border-kincha hover:bg-sumi/60`}
    >
      {body}
      <span aria-hidden="true" className="font-mono text-[11px] text-kincha">
        ↗
      </span>
      <span className="sr-only">{pickText(EXTERNAL_LABEL, lang)}</span>
    </a>
  );
}

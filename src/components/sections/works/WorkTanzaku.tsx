import type { ReactNode } from 'react';
import { SealMark } from '@/components/common/SealMark';
import { Tategaki } from '@/components/common/Tategaki';
import { EXTERNAL_LABEL, STATUS_LABEL } from '@/content/works';
import { useLang } from '@/hooks/useLang';
import { pickText } from '@/lib/i18n';
import type { Work } from '@/types/content';

export interface WorkTanzakuProps {
  readonly work: Work;
}

// 「納品」は受託を思わせる語なので使わない。ここは自主制作の作品集である。
const COMPLETED_LABEL = { ja: '完成', en: 'Completed' } as const;

/**
 * 短冊1枚(デスクトップ・縦書き)。設計書 §6-4, §1-4。
 *
 * 高さは固定しない ─ ワイヤーフレームは圧縮表示のため、実際のタイトル文字数
 * (特に EN の長いタイトル)をそのまま流し込むと固定高では文字が枠外にはみ出す。
 * `Works` 側の行コンテナが `items-stretch` のため、最も長いタイトルの短冊に
 * 他の短冊の高さが揃う。
 *
 * `work.href` を持つ短冊は枠ごとリンクになる(社長指示・2026-09-20)。押せることが
 * 見て分かるよう番号の下に ↗ を出し、hover で枠線を金茶に変える。href が無い作品は
 * `<div>` のまま ─ 押せない要素を `<a>` にすると Tab 移動と読み上げに行き先のない
 * リンクが混ざるため、要素そのものを出し分ける。
 */
export function WorkTanzaku({ work }: WorkTanzakuProps) {
  const { lang } = useLang();
  const isDelivered = work.status === 'delivered';
  const meta = isDelivered ? `${work.categoryLabel} · ${work.year}` : pickText(STATUS_LABEL[work.status], lang);
  // `Tategaki` は `en` で横書きへ縮退する(§4-4)。`whitespace-nowrap` は縦書き時の
  // 「1列に収める」トリックであり、横書きでは長い英文タイトルが折り返さずに
  // 隣の短冊へはみ出して重なってしまう(Playwright での実測で発覚)。
  // そのため横書き時のみ折り返しを許可する。幅も固定px(104px)だと英文タイトル6件分の
  // 合計が行の幅を超えてページ全体を横スクロールさせてしまうため、`flex-1` で
  // 残り幅を均等配分する(`Works` 側で行コンテナにも `flex-1` を与えて連動させる)。
  const isVertical = lang === 'ja';

  const frameClass = `flex flex-col items-center justify-between gap-4 py-6 ${
    isVertical ? 'w-[104px] flex-none' : 'min-w-[110px] flex-1'
  } ${isDelivered ? 'border border-hairline bg-sumi/35' : 'border border-dashed border-hairline/70 text-gofun/60'}`;

  const body: ReactNode = (
    <>
      <span className="flex flex-col items-center gap-1.5 font-mono text-[11px] text-kincha">
        {work.no}
        {work.href && (
          <span aria-hidden="true" className="text-[9px] leading-none">
            ↗
          </span>
        )}
      </span>
      <Tategaki
        className={`px-2 text-center font-mincho text-[13px] tracking-mincho leading-tight text-gofun ${
          isVertical ? 'whitespace-nowrap' : ''
        }`}
      >
        {pickText(work.title, lang)}
      </Tategaki>
      <Tategaki className={`font-mono text-[10px] tracking-[.15em] text-gofun/60 ${isVertical ? 'whitespace-nowrap' : ''}`}>
        {meta}
      </Tategaki>
      {isDelivered ? (
        <SealMark char="済" label={pickText(COMPLETED_LABEL, lang)} size="sm" />
      ) : (
        <span aria-hidden="true" className="h-6 w-6" />
      )}
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
      <span className="sr-only">{pickText(EXTERNAL_LABEL, lang)}</span>
    </a>
  );
}

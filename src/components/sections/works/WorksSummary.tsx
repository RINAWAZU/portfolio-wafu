import { useLang } from '@/hooks/useLang';
import { getDictionary } from '@/lib/i18n';

/**
 * 作の左カラム（設計書 §6-4, ワイヤーフレーム #3a）。
 *
 * ワイヤーフレームにあった件数の大字（十二）は掲載しない。案件が増減するたびに
 * 数字の更新が必要になり、更新漏れがそのまま誤情報になるため（社長判断・2026-09-15）。
 * 件数は下の短冊一覧そのものが示すので、情報としても失われない。
 */
export function WorksSummary() {
  const { lang } = useLang();
  const [line1, line2] = getDictionary(lang).works.blurb;

  return (
    <div className="w-[180px] flex-none">
      <p className="font-latin text-xs tracking-latin text-kincha uppercase">Adopted Projects</p>
      <p className="mt-3 text-caption leading-body text-gofun/70">
        {line1}
        <br />
        {line2}
      </p>
    </div>
  );
}

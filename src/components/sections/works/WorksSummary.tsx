import { GITHUB_URL } from '@/content/profile';
import { useLang } from '@/hooks/useLang';
import { handleFromHref } from '@/lib/format';
import { getDictionary } from '@/lib/i18n';

/**
 * 作の左カラム（設計書 §6-4, ワイヤーフレーム #3a）。
 *
 * ワイヤーフレームにあった件数の大字（十二）は掲載しない。作品が増減するたびに
 * 数字の更新が必要になり、更新漏れがそのまま誤情報になるため（社長判断・2026-09-15）。
 * 件数は下の短冊一覧そのものが示すので、情報としても失われない。
 *
 * 欧文ラベルは 'Adopted Projects'（＝採用された案件）から 'Selected Works' に変更した。
 * このセクションは受託の実績ではなく、技術を示すために自ら作った作品の一覧である
 * （社長指摘・2026-09-16）。
 *
 * GitHub への導線を持つ（社長指示・2026-09-20）。短冊は1枚ずつ作品そのものへ飛ぶが、
 * リンクを持つのは公開済みの作品だけなので、「もっと見たい」の受け皿をここに1つ置く。
 * 見た目は結（Contact）の外部リンク行と同じ形にそろえる（同じ意味には同じ形を使う）。
 */
export function WorksSummary() {
  const { lang } = useLang();
  const works = getDictionary(lang).works;
  const [line1, line2] = works.blurb;

  return (
    <div className="w-[180px] flex-none">
      <p className="font-latin text-xs tracking-latin text-kincha uppercase">Selected Works</p>
      <p className="mt-3 text-caption leading-body text-gofun/70">
        {line1}
        <br />
        {line2}
      </p>

      <a
        href={GITHUB_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-7 flex items-center justify-between border-b border-hairline pb-1.5 font-mono text-[11px] tracking-[.1em] transition-colors duration-[0.4s] ease-out hover:text-kincha"
      >
        <span className="text-gofun/60">GITHUB</span>
        <span>{handleFromHref(GITHUB_URL)} ↗</span>
      </a>
      <p className="mt-2.5 text-caption leading-body text-gofun/55">{works.more}</p>
    </div>
  );
}

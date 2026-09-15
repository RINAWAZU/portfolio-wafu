import Image from 'next/image';
import { PROFILE_STATS, PROFILE_TAGS } from '@/content/profile';
import { useLang } from '@/hooks/useLang';
import { getDictionary } from '@/lib/i18n';
import { StatTriple } from './StatTriple';
import { TagList } from './TagList';

/**
 * ポートレート + 紹介文 + 数値3点 + タグ(設計書 §6-4)。
 * ハイファイの比率(aspect 4:5)と紹介文カラム 300px を `gap:36px` で**横並び**にする
 * (ハイファイ `display:flex;gap:36px;flex-wrap:wrap`)。
 *
 * ポートレートの高さは左の縦書きステートメントと同じ 520px に揃える
 * (`AboutStatement` の `height`)。4:5 を保つため幅はそこから 416px に定まる。
 * 上の余白は持たない ─ 見出しとの間隔は `About` 側のグリッドが一括で持ち、
 * 左右ブロックの開始位置を一致させる。
 *
 * 幅は `sm` 以上で固定値にすること。`min(300px,100%)` のような百分率を含む指定だと、
 * 親グリッドの `auto` トラックが max-content を確定できずトラック幅が縮み、
 * その結果 `flex-wrap` が発動して写真と紹介文が縦積みになってしまう。
 * `< sm` はコンテナ幅いっぱい(`w-full`)に縮めて横スクロールを防ぐ。
 */
export function AboutProfile() {
  const { lang } = useLang();
  const t = getDictionary(lang);
  const [bio1, bio2] = t.about.bio;

  return (
    <div className="flex flex-wrap items-start gap-9">
      <div
        className="relative w-full flex-none border border-hairline sm:h-[520px] sm:w-auto"
        style={{ aspectRatio: '4 / 5' }}
      >
        <Image
          src="/assets/portrait.webp"
          alt="RIN"
          fill
          loading="lazy"
          sizes="(min-width: 640px) 416px, 80vw"
          className="object-cover object-[center_35%] grayscale-[60%] contrast-[95%] brightness-[78%]"
        />
        <p className="absolute bottom-4 left-5 font-mono text-[10px] tracking-[.2em] text-kincha">{t.avatarTag}</p>
      </div>
      <div className="w-full font-brush text-body leading-[2.1] text-gofun/82 sm:w-[300px]">
        {bio1}
        <br />
        {bio2}
        <StatTriple items={PROFILE_STATS} />
        <TagList tags={PROFILE_TAGS} />
      </div>
    </div>
  );
}

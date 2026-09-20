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
 *
 * 紹介文カラムは当初ハイファイどおり 300px だったが、**紹介文の2文が必ず2行に割れ、
 * 最終行が「中。」の1文字+句点になっていた**（社長指摘・2026-09-20）。
 * 本文サイズは `clamp(15px, 1.1vw, 17px)` で伸びるのにカラムが固定だったのが原因で、
 * 実測すると1行に必要な幅は 308px（15px 時）〜349px（17px 時）。文字を縮めずに収めるため
 * カラム側を広げた ─ `sm` で 320px、`xl` で 380px。**この2値を縮めると2行に戻る。**
 * `xl` 未満で 380px にしないのは、1024px 幅だと写真(416)+gap(36)+段 が入りきらず
 * 紹介文が写真の下へ段落ちするため（実測で上限 364px）。
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
      {/*
        紹介文の書体は `ja` のときだけ筆文字にする（社長判断・2026-09-20）。
        Yuji Syuku のサブセットは和文の文言から起こした英字（`AIOSTWbei` と `0247`）しか
        持たないため、EN では宣言済みの字だけ筆文字・残りはシステムのサンセリフになり、
        単語の途中で書体が変わっていた（"Technology" の T だけ筆文字）。
        ASCII 全域を足して英文も筆文字にする案もあったが、筆書体は英文の本文組み用に
        作られていないため、EN は本文書体（Zen Kaku Gothic New）に寄せる。
      */}
      <div
        className={`w-full text-body leading-[2.1] text-gofun/82 sm:w-[320px] xl:w-[380px] ${
          lang === 'ja' ? 'font-brush' : 'font-body'
        }`}
      >
        {bio1}
        <br />
        {bio2}
        <StatTriple items={PROFILE_STATS} />
        <TagList tags={PROFILE_TAGS} />
      </div>
    </div>
  );
}

'use client';

import { useLang } from '@/hooks/useLang';
import { useOnKinari } from '@/hooks/useOnKinari';

/**
 * EN / JP 切替（設計書 §6-2, §13-4）。`<button>` 2つ、`aria-pressed` で状態を表明する。
 *
 * **文字色**: 胡粉色のまま生成面（技・歴・価）に重なると実測 1.16:1 まで落ち、事実上
 * 見えなくなる。面の明暗で反転させる。判定は `useOnKinari` に集約（固定レイヤーごとに
 * 書き写さない）。
 *
 * **配置**: `lg` 以上はハイファイ通り右上に置く。それ未満では本文の段が画面右端まで
 * 伸びるため、右上に固定すると**スクロールの度に見出しの文字と重なって両方読めなくなる**
 * （モバイル実測で「EN / JP」がタグラインの真上に乗っていた）。狭い画面では左の縦ナビの
 * レール下端へ移す。レールは本文が入らない専用の列なので、構造的に衝突しない。
 */
export function LangSwitch() {
  const { lang, setLang } = useLang();
  const onKinari = useOnKinari();

  const activeClass = onKinari ? 'text-sumi' : 'text-gofun';
  const inactiveClass = onKinari ? 'text-shinshu' : 'text-kincha';

  return (
    <div className="fixed bottom-8 left-0 z-[20] flex w-nav justify-center lg:top-8 lg:right-12 lg:bottom-auto lg:left-auto lg:w-auto lg:justify-end">
      {/*
        `sm` 未満だけ間隔を詰める。縦ナビが 56px に細くなる幅で `gap-2.5` のままだと
        「EN / JP」が 70px になり、レールの罫線を 7px 跨いでいた（2026-09-20 実測）。
        `gap-0.5` で 53px に収まる。**字間（`tracking-latin`）は詰めないこと** ─
        字間を詰めると各ボタンの当たり判定が 20px → 14px まで痩せ、ただでさえ小さい
        タップ領域がさらに小さくなる（DEVLOG 3-2）。`sm` 以上はナビが 96px に戻るので従来どおり。
      */}
      <div className="flex items-center gap-0.5 font-mono text-xs tracking-latin sm:gap-2.5 lg:gap-4">
        <button
          type="button"
          onClick={() => setLang('en')}
          aria-pressed={lang === 'en'}
          className={`transition-colors duration-[0.4s] ease-out ${lang === 'en' ? activeClass : inactiveClass}`}
        >
          EN
        </button>
        {/* 2つのボタンを視覚的に分けるだけの装飾。読み上げると「EN スラッシュ JP」になるため外す。 */}
        <span aria-hidden="true" className={onKinari ? 'text-sumi/40' : 'text-gofun/30'}>
          /
        </span>
        <button
          type="button"
          onClick={() => setLang('ja')}
          aria-pressed={lang === 'ja'}
          className={`transition-colors duration-[0.4s] ease-out ${lang === 'ja' ? activeClass : inactiveClass}`}
        >
          JP
        </button>
      </div>
    </div>
  );
}

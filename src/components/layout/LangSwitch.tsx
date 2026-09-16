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
      <div className="flex items-center gap-2.5 font-mono text-xs tracking-latin lg:gap-4">
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

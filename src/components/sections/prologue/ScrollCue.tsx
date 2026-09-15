'use client';

import { useEffect, useState } from 'react';
import { useScrollProgress } from '@/hooks/useScrollProgress';

/** この距離を超えてスクロールしたら、役目を終えたものとして消す。 */
const HIDE_AFTER_PX = 40;

/**
 * 罫線に挟まれた `SCROLL`（設計書 §6-4）。
 *
 * スクロールを始めたら消す。スクロールの合図は最初の一瞬だけ意味があり、
 * 出したままだと固定レイヤーである盆栽のキャプション（BONSAI · 新緑）と
 * 画面上で交差して両方読みにくくなる（モバイル実測）。
 *
 * 購読しているのは「しきい値を跨いだか」の真偽値だけで、再レンダリングは最大1回。
 * 季節演出と違って毎フレームの更新は不要なので、ここでは state を持ってよい（§5-3 の方針）。
 */
export function ScrollCue() {
  const { subscribe, getScrollY } = useScrollProgress();
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const update = (scrollY: number) => setHidden((prev) => (prev === scrollY > HIDE_AFTER_PX ? prev : scrollY > HIDE_AFTER_PX));
    update(getScrollY());
    return subscribe(update);
  }, [subscribe, getScrollY]);

  return (
    <div
      aria-hidden={hidden}
      className={`absolute right-12 bottom-9 left-[calc(var(--spacing-nav)+24px)] flex items-center gap-4 font-mono text-[10px] tracking-[.3em] text-gofun/60 transition-opacity duration-[0.8s] ease-slow md:left-[160px] ${
        hidden ? 'opacity-0' : 'opacity-100'
      }`}
    >
      <span className="h-px flex-1 bg-hairline" />
      SCROLL
      <span className="h-px flex-1 bg-hairline" />
    </div>
  );
}

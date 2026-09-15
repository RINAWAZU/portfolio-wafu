'use client';

import { useEffect, useState, type CSSProperties } from 'react';
import { useOnKinari } from '@/hooks/useOnKinari';
import { BonsaiFigure } from './BonsaiFigure';

const PROLOGUE_ID = 'prologue';

/**
 * 固定レイヤー。序では主役、序を抜けると縮小・減光して常駐する（設計書 §5-2, §6-3）。
 * `layout.tsx` に1つだけ置く。セクションツリーとは兄弟関係で、セクション側は
 * 盆栽の存在を知らない。
 *
 * サイズ・位置・不透明度の遷移は、序セクションを監視する IntersectionObserver 1個で
 * `.is-ambient` 相当のクラスを付け外しし、CSS transition に任せる。季節のような
 * 毎フレーム更新はここでは行わない（§5-2「実装の単純化」）。
 *
 * ## サイズに `vh` の上限を入れている理由
 * 幅だけで決めると（`min(34vw,460px)`）、縦横比 158:248 から高さが最大 722px になり、
 * 序セクションの高さが画面高に関係なく約1185px で固定される。その結果
 * **1440×900・1366×768・1280×800 といった主要なノートPC解像度で、タグライン以下が
 * 初期表示に入らなくなっていた**（実測。1920×1080 でのみ収まっていた）。
 * 画面高にも連動させ、どの解像度でも「盆栽・タグライン・SCROLL」が1画面に収まるようにする。
 *
 * ## z-index を常に本文の背面に置く理由
 * この要素は `position: fixed` なので、序をスクロールして抜ける間は本文の上を通過する。
 * 前面（`z-1`）に置くと、通過中の見出し・本文が盆栽に隠れて読めなくなる
 * （モバイル実測でサブコピーが盆栽の下敷きになっていた）。背面に置けば、
 * 重なっても文字は常に読める。序では専用の空きスペースに収まるため見た目は変わらない。
 */
export function BonsaiStage() {
  const [isAmbient, setIsAmbient] = useState(false);
  const onKinari = useOnKinari();

  useEffect(() => {
    const prologue = document.getElementById(PROLOGUE_ID);
    if (!prologue) return;

    const observer = new IntersectionObserver(([entry]) => setIsAmbient(!entry.isIntersecting), {
      threshold: 0.2,
    });
    observer.observe(prologue);
    return () => observer.disconnect();
  }, []);

  // 位置は **常に top/left の数値**で与える。`top-auto` / `left-auto` を挟むと
  // CSS は auto との間を補間できず、幅と不透明度だけが動いて位置は瞬間移動する。
  // それが「スクロールすると盆栽が急に消える」ように見えていた原因。
  // 常駐時の座標は `--bonsai-w` から算出する（高さ = 幅 × 248/158）。
  // イージングは `ease-slow`（cubic-bezier(.16,1,.3,1)）ではなく前後対称の曲線を使う。
  // ease-slow は最初の2割で距離の大半を進むため、退場が「跳んで止まる」ように見える。
  const stageStyle = {
    '--bonsai-w': isAmbient ? 'min(18vw, 240px, 22vh)' : 'min(34vw, 460px, 30vh)',
    top: isAmbient ? 'calc(100dvh - (var(--bonsai-w) * 1.5696) - 24px)' : '16vh',
    left: isAmbient ? 'calc(100vw - var(--bonsai-w) - 24px)' : 'calc(var(--spacing-nav) + 6vw)',
  } as CSSProperties;

  return (
    <div
      style={stageStyle}
      className={`bonsai-stage fixed z-[-1] transition-[top,left,opacity] duration-[1.6s] ease-[cubic-bezier(0.65,0,0.35,1)] ${
        isAmbient
          ? // 生成（和紙）面でだけ乗算する（設計書 §5-2）。木目の暗い面に乗算を掛けると
            // 「暗×暗」で完全に沈み、実測でシルエットが一切見えなくなっていた。
            `${onKinari ? 'opacity-40 mix-blend-multiply' : 'opacity-60'}`
          : 'opacity-100'
      }`}
    >
      <BonsaiFigure />
    </div>
  );
}

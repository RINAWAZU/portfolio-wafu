import Image from 'next/image';

/**
 * 木目写真を `position: fixed` の単一レイヤーとして敷き、上に墨48%を重ねる（設計書 §6-2, §9-3）。
 *
 * `background-attachment: fixed` は iOS Safari で破綻するため使わない。代わりに
 * `position: fixed` の `<div>` + `next/image fill priority` で実装する。
 * z-index は -2（設計書 §9-3 の整理）。
 */
export function WoodBackdrop() {
  return (
    <div aria-hidden="true" className="fixed inset-0 z-[-2] overflow-hidden bg-sumi">
      <Image
        src="/assets/wood.webp"
        alt=""
        fill
        priority
        /*
          品質は既定の 75 のまま。90 との差は実測で平均 0.4%/256 しかなく、
          さらに墨を48%重ねるため視認できない。3840px 版で 392KB → 211KB の差になり、
          LCP を持つ画像で 181KB は割に合わない。
        */
        /*
          `100vw` では足りない。木目は 1.887:1 の横長で、それより縦長の画面に
          object-cover で敷くと高さ基準で拡大され、描画幅は「画面高 x 1.887」になる。
          390x844 の iPhone では 1593 CSSpx ＝ 画面幅の約4倍。`100vw` のままだと
          ブラウザが 1/4 の大きさの候補を選び、4倍に引き伸ばされて粗く見える。
        */
        sizes="(max-aspect-ratio: 1887/1000) 189vh, 100vw"
        className="object-cover"
      />
      <div className="absolute inset-0 bg-sumi/48" />
    </div>
  );
}

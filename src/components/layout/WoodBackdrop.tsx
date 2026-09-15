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
      <Image src="/assets/wood.webp" alt="" fill priority sizes="100vw" className="object-cover" />
      <div className="absolute inset-0 bg-sumi/48" />
    </div>
  );
}

import { BrushGlyph } from '@/components/common/BrushGlyph';

/**
 * 初回ロードの覆い（設計書 §6「初回ロード: 墨面から筆文字ロゴが現れる 1.8s」）。
 *
 * **CSS アニメーションだけで自動的に退場する**設計にしている。JS の状態で出し入れすると、
 * スクリプトが落ちた環境やハイドレーション前に覆いが残り続け、サイト全体が
 * 見えなくなる事故につながる。`animation-fill-mode: forwards` で消えたまま留まり、
 * `pointer-events: none` なので退場アニメーション中も操作を妨げない。
 *
 * 中身は墨の面と筆文字「麟」だけ。スピナーや進捗率は置かない ─ 仕様書 §1 の
 * 「装飾で和を語らず、余白・階調・間で語る」に従い、間（ま）そのものを見せる。
 *
 * `prefers-reduced-motion` では即座に消す（globals.css 側で縮退）。
 */
export function LoadingVeil() {
  return (
    <div className="loading-veil" aria-hidden="true">
      <BrushGlyph char="麟" className="loading-veil__glyph text-[clamp(4rem,12vw,7rem)] leading-none text-gofun" />
    </div>
  );
}

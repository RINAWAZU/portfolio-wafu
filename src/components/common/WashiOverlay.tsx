/**
 * 和紙テクスチャ（opacity .35 / mix-blend-mode: multiply）。
 *
 * `washi.png`（tileable 512px）は未制作のため（設計書 §12-2 #6）、暫定として
 * `repeating-linear-gradient` によるノイズ代替で実装している。画像が用意でき次第、
 * この `backgroundImage` を `url(/assets/textures/washi.png)` に差し替える。
 */
export function WashiOverlay() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 mix-blend-multiply opacity-[0.35]"
      style={{
        backgroundImage:
          'repeating-linear-gradient(115deg, rgba(14,15,13,0.05) 0px, rgba(14,15,13,0.05) 1px, transparent 1px, transparent 3px)',
      }}
    />
  );
}

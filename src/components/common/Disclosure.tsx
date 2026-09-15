import type { ReactNode } from 'react';

export interface DisclosureProps {
  readonly summary: string;
  readonly children: ReactNode;
  readonly defaultOpen?: boolean;
}

/**
 * 折りたたみ（設計書 §6-2, §9-4）。`<details>/<summary>` のネイティブなセマンティクスを
 * 保ったまま、`grid-template-rows: 0fr → 1fr` で高さをアニメーションする（JS 不要）。
 *
 * 実装メモ: `<details>` は非開時に内容を `display:none` にする UA スタイルを持つが、
 * それだとトランジションが効かない。ここでは内容側を常に `display:grid` にして
 * `grid-template-rows` と `overflow:hidden` だけで見た目上の開閉を作り、
 * 開閉状態そのもの（`open` 属性）はネイティブの `<details>` に委ねる
 * （キーボード操作・支援技術への状態通知はブラウザの標準動作のまま）。
 */
export function Disclosure({ summary, children, defaultOpen = false }: DisclosureProps) {
  return (
    <details open={defaultOpen} className="disclosure border-t border-hairline-dark first:border-t-0">
      <summary className="flex cursor-pointer list-none items-center justify-between px-4 py-3.5 font-mincho text-[15px] font-semibold tracking-mincho marker:content-none">
        {summary}
        <span aria-hidden="true" className="disclosure-icon font-mono text-base leading-none text-shinshu">
          ＋
        </span>
      </summary>
      <div className="disclosure-panel">
        <div className="overflow-hidden">
          <div className="px-4 pb-5">{children}</div>
        </div>
      </div>
    </details>
  );
}

export interface SealMarkProps {
  readonly char: '済' | '麟';
  /** 装飾ではなく状態表示のため必須（設計書 §13-4） */
  readonly label: string;
  readonly size?: 'sm' | 'md';
}

const SIZE_CLASS: Record<'sm' | 'md', string> = {
  sm: 'h-6 w-6 text-sm',
  md: 'h-9 w-9 text-lg',
};

/**
 * 落款。角形の枠 + 真朱。
 *
 * 色は墨面用の変種を使う。現在の使用箇所（作の「済」・フッターの「麟」）はすべて
 * 暗い面の上で、原色の真朱では実測 1.95:1 と枠も文字もほぼ見えない（T27）。
 * 生成（和紙）面へ置く必要が出たら、面に追従させる分岐をここに足すこと。
 */
export function SealMark({ char, label, size = 'md' }: SealMarkProps) {
  return (
    <span
      role="img"
      aria-label={label}
      className={`inline-flex items-center justify-center border border-shinshu-on-dark font-brush leading-none text-shinshu-on-dark ${SIZE_CLASS[size]}`}
    >
      {char}
    </span>
  );
}

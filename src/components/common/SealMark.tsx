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

/** 落款。角形の枠 + 真朱（TOKENS.md）。 */
export function SealMark({ char, label, size = 'md' }: SealMarkProps) {
  return (
    <span
      role="img"
      aria-label={label}
      className={`inline-flex items-center justify-center border border-shinshu font-brush leading-none text-shinshu ${SIZE_CLASS[size]}`}
    >
      {char}
    </span>
  );
}

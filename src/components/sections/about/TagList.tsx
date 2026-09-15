import type { ProfileTag } from '@/types/content';
import { useLang } from '@/hooks/useLang';
import { pickText } from '@/lib/i18n';

export interface TagListProps {
  readonly tags: readonly ProfileTag[];
}

/** 受注可能・WEB・iOS 等の枠線タグ(設計書 §6-4)。強調タグ(`accent`)のみ金茶で塗る。 */
export function TagList({ tags }: TagListProps) {
  const { lang } = useLang();

  return (
    <div className="mt-6 flex flex-wrap gap-2 font-mono text-[10px] tracking-[.15em]">
      {tags.map((tag) => {
        const label = pickText(tag.label, lang);
        return (
          <span
            key={label}
            className={
              tag.accent
                ? 'border border-kincha px-2.5 py-1.5 text-kincha'
                : 'border border-hairline px-2.5 py-1.5 text-gofun/85'
            }
          >
            {tag.accent && '● '}
            {label}
          </span>
        );
      })}
    </div>
  );
}

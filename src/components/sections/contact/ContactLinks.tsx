import { CONTACT_EMAIL, SOCIAL_LINKS } from '@/content/profile';
import type { SocialLink } from '@/types/content';

/** URL の末尾セグメントから `@handle` 表記を導く(ラベルとは別にハンドル文字列を持たないため)。 */
function handleFromHref(href: string): string {
  try {
    const url = new URL(href);
    const last = url.pathname.replace(/\/$/, '').split('/').pop();
    return last ? `@${last}` : href;
  } catch {
    return href;
  }
}

function SocialLinkRow({ link }: { readonly link: SocialLink }) {
  return (
    <a
      href={link.href}
      target={link.external ? '_blank' : undefined}
      rel={link.external ? 'noopener noreferrer' : undefined}
      className="flex items-center justify-between border-b border-hairline pb-1.5 transition-colors duration-[0.4s] ease-out hover:text-kincha"
    >
      <span className="text-gofun/50 uppercase">{link.label}</span>
      <span>
        {handleFromHref(link.href)}
        {link.external && ' ↗'}
      </span>
    </a>
  );
}

/**
 * 連絡先リスト(設計書 §6-4)。掲載する外部リンクは `content/profile.ts` の `SOCIAL_LINKS` が
 * 唯一の情報源。Note / LinkedIn は URL 未確定のためそこに含めていない
 * (死んだリンクを置かない方針、§12-3 #1)。
 */
export function ContactLinks() {
  return (
    <div className="mt-9 flex flex-col gap-2.5 font-mono text-xs tracking-[.1em]">
      <div className="flex items-center justify-between border-b border-hairline pb-1.5">
        <span className="text-gofun/50">EMAIL</span>
        <a href={`mailto:${CONTACT_EMAIL}`} className="transition-colors duration-[0.4s] ease-out hover:text-kincha">
          {CONTACT_EMAIL}
        </a>
      </div>
      {SOCIAL_LINKS.map((link) => (
        <SocialLinkRow key={link.key} link={link} />
      ))}
    </div>
  );
}

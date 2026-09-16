import { SealMark } from '@/components/common/SealMark';
import { SOCIAL_LINKS } from '@/content/profile';

/** 外部リンク列 + コピーライト + 落款「麟」(設計書 §6-4)。 */
export function SiteFooter() {
  return (
    <div className="mt-20 flex flex-col items-start gap-6 border-t border-hairline pt-6 md:flex-row md:items-center md:justify-between">
      <div className="flex flex-wrap gap-5 font-mono text-xs tracking-[.15em] text-gofun/70">
        {SOCIAL_LINKS.map((link) => (
          <a
            key={link.key}
            href={link.href}
            target={link.external ? '_blank' : undefined}
            rel={link.external ? 'noopener noreferrer' : undefined}
            className="transition-colors duration-[0.4s] ease-out hover:text-kincha"
          >
            {link.label.toUpperCase()} {link.external && '↗'}
          </a>
        ))}
      </div>
      <div className="flex items-center gap-3.5">
        <span className="font-mono text-[11px] tracking-[.15em] text-gofun/60">© RIN 2026 · TOKYO</span>
        <SealMark char="麟" label="RIN" size="sm" />
      </div>
    </div>
  );
}

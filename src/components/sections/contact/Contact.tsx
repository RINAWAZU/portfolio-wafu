'use client';

import { Section } from '@/components/common/Section';
import { SectionHeading } from '@/components/common/SectionHeading';
import { useLang } from '@/hooks/useLang';
import { getDictionary } from '@/lib/i18n';
import { ContactForm } from './ContactForm';
import { ContactLinks } from './ContactLinks';
import { SiteFooter } from './SiteFooter';

/**
 * 結(Contact)。左に連絡先、右にフォーム。フッターに外部リンク・コピーライト・落款「麟」
 * (設計書 §14 T23, T24)。このセクションで季節が雪100%になる(`id="contact"` が季節アンカー)。
 */
export function Contact() {
  const { lang } = useLang();
  const t = getDictionary(lang).contact;

  return (
    <Section id="contact" surface="wood">
      <SectionHeading glyph="結" latin="CONTACT" tone="on-dark" />

      <div className="mt-14 grid grid-cols-1 gap-14 md:grid-cols-2 md:gap-20">
        <div>
          <h3 className="font-mincho text-[clamp(1.5rem,2.4vw,2rem)] leading-[1.9] font-semibold tracking-mincho text-gofun">
            {t.heading[0]}
            <br />
            {t.heading[1]}
          </h3>
          <p className="mt-3 max-w-[420px] text-body leading-body text-gofun/75">{t.sub}</p>
          <ContactLinks />
        </div>
        <ContactForm />
      </div>

      <SiteFooter />
    </Section>
  );
}

import { CONTACT_EMAIL, SOCIAL_LINKS } from '@/content/profile';
import { SITE_DESCRIPTION, SITE_URL } from '@/lib/site';

/**
 * `Person` の構造化データ（設計書 §13-1）。
 *
 * **会社名は含めない**（内定先・インターン先の社名は非開示。§1-6）。`jobTitle` も
 * 「フリーランスエンジニア」までに留め、所属を示唆する語を入れないこと。
 * `sameAs` は `SOCIAL_LINKS` を唯一の情報源とし、URL が確定したものだけが自動的に載る。
 */
export function PersonJsonLd() {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'RIN',
    alternateName: '麟',
    jobTitle: 'フリーランスエンジニア',
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    email: `mailto:${CONTACT_EMAIL}`,
    address: { '@type': 'PostalAddress', addressLocality: '東京', addressCountry: 'JP' },
    knowsLanguage: ['ja', 'en'],
    sameAs: SOCIAL_LINKS.map((link) => link.href),
  };

  return (
    <script
      type="application/ld+json"
      // JSON.stringify の出力のみを渡す。ユーザー入力は含まれない（すべてビルド時定数）。
      // `<` を < に逃がしておくのは、将来どれかの定数に `</script>` を含む文字列が
      // 入ったときにタグが途中で閉じてしまうのを構造的に防ぐため（JSON としては等価）。
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, '\\u003c') }}
    />
  );
}

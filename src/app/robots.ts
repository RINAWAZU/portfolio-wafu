import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/site';

/** 問い合わせ API はクロール対象にしない（設計書 §13-1）。 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', allow: '/', disallow: '/api/' },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}

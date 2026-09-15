import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/site';

/** 1ページ構成のため、サイトマップの項目もトップ1件のみ（設計書 §13-1）。 */
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1,
    },
  ];
}

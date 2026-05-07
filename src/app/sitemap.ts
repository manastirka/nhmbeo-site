import type { MetadataRoute } from 'next';
import { routing } from '@/i18n/routing';
import { nav } from '@/lib/nav';
import { listNews } from '@/lib/news';
import type { Locale } from '@/i18n/config';

// Required for `output: 'export'` — pre-render once at build time.
export const dynamic = 'force-static';

const SITE = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

function* walkPaths(): Generator<string> {
  for (const item of nav) {
    yield item.href;
    if (item.children) {
      for (const child of item.children) yield child.href;
    }
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = [];
  for (const locale of routing.locales) {
    for (const p of walkPaths()) {
      entries.push({
        url: `${SITE}/${locale}${p === '/' ? '' : p}`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
      });
    }
    const articles = await listNews(locale as Locale);
    for (const a of articles) {
      entries.push({
        url: `${SITE}/${locale}/vesti/${a.slug}`,
        lastModified: a.date ? new Date(a.date) : new Date(),
        changeFrequency: 'yearly',
      });
    }
  }
  return entries;
}

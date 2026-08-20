import type { MetadataRoute } from 'next';
import { routing } from '@/i18n/routing';
import { nav } from '@/lib/nav';
import { listNews } from '@/lib/news';
import { loadPage } from '@/lib/content';
import type { Locale } from '@/i18n/config';

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

function slugFromPath(p: string): string | null {
  if (p === '/') return null;
  const parts = p.split('/').filter(Boolean);
  return parts[parts.length - 1] ?? null;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const entries: MetadataRoute.Sitemap = [];
  for (const locale of routing.locales) {
    const loc = locale as Locale;
    for (const p of walkPaths()) {
      const slug = slugFromPath(p);
      const page = slug ? await loadPage(loc, slug) : null;
      entries.push({
        url: `${SITE}/${locale}${p === '/' ? '' : p}`,
        lastModified: page?.meta?.lastModified
          ? new Date(page.meta.lastModified)
          : undefined,
        changeFrequency: p === '/' || p === '/vesti' ? 'weekly' : 'monthly',
      });
    }
    const articles = await listNews(loc);
    for (const a of articles) {
      entries.push({
        url: `${SITE}/${locale}/vesti/${a.slug}`,
        lastModified: a.date ? new Date(a.date) : undefined,
        changeFrequency: 'monthly',
      });
    }
  }
  return entries;
}

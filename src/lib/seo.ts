import type { Metadata } from 'next';
import type { Locale } from '@/i18n/config';
import { locales } from '@/i18n/config';
import { loadPage, loadHome } from '@/lib/content';
import { getNews } from '@/lib/news';
import { getCatalogProduct } from '@/lib/products';

const FALLBACK_SITE = 'https://nhmbeo.aleksandarlukovic.com';

export function siteUrl(): string {
  return (process.env.NEXT_PUBLIC_SITE_URL || FALLBACK_SITE).replace(/\/$/, '');
}

export function localizedUrl(locale: Locale, pathname: string): string {
  const path = pathname === '/' ? '' : pathname;
  return `${siteUrl()}/${locale}${path}`;
}

export function absoluteAssetUrl(src: string | undefined): string | undefined {
  if (!src) return undefined;
  if (/^https?:\/\//i.test(src)) return src;
  return `${siteUrl()}${src.startsWith('/') ? src : `/${src}`}`;
}

function languageAlternates(pathname: string): Record<string, string> {
  const path = pathname === '/' ? '' : pathname;
  const map: Record<string, string> = {
    'x-default': `${siteUrl()}/sr-Cyrl${path}`,
  };
  for (const locale of locales) {
    map[locale] = `${siteUrl()}/${locale}${path}`;
  }
  return map;
}

const DEFAULT_DESCRIPTION: Record<Locale, string> = {
  'sr-Cyrl':
    'Природњачки музеј у Београду — основан 1895. Преко два милиона предмета. Галерија на Малом Калемегдану.',
  en: 'Natural History Museum in Belgrade — founded 1895. Over two million specimens. Gallery at Mali Kalemegdan.',
};

const SITE_NAME: Record<Locale, string> = {
  'sr-Cyrl': 'Природњачки музеј у Београду',
  en: 'Natural History Museum in Belgrade',
};

export function pageMetadata({
  locale,
  pathname,
  title,
  description,
  image,
  type = 'website',
}: {
  locale: Locale;
  pathname: string;
  title: string;
  description?: string;
  image?: string;
  type?: 'website' | 'article';
}): Metadata {
  const desc = (description || DEFAULT_DESCRIPTION[locale]).slice(0, 300);
  const canonical = localizedUrl(locale, pathname);
  const ogImage = absoluteAssetUrl(image);
  const siteName = SITE_NAME[locale];

  return {
    title,
    description: desc,
    alternates: {
      canonical,
      languages: languageAlternates(pathname),
    },
    openGraph: {
      type,
      locale: locale === 'en' ? 'en_GB' : 'sr_RS',
      url: canonical,
      siteName,
      title,
      description: desc,
      ...(ogImage ? { images: [{ url: ogImage }] } : {}),
    },
    twitter: {
      card: ogImage ? 'summary_large_image' : 'summary',
      title,
      description: desc,
      ...(ogImage ? { images: [ogImage] } : {}),
    },
  };
}

export async function metadataFromPageJson(
  locale: Locale,
  slug: string,
  pathname: string,
  fallbackTitle: string,
): Promise<Metadata> {
  const data = await loadPage(locale, slug);
  return pageMetadata({
    locale,
    pathname,
    title: data?.title || fallbackTitle,
    description: data?.intro || data?.body?.slice(0, 220),
    image: data?.images?.[0],
  });
}

export async function homeMetadata(locale: Locale): Promise<Metadata> {
  const home = await loadHome(locale);
  const meta = pageMetadata({
    locale,
    pathname: '/',
    title: SITE_NAME[locale],
    description: home?.intro.body || home?.hero.subtitle,
    image: home?.hero.image || home?.featured?.image,
  });
  return {
    ...meta,
    title: { absolute: SITE_NAME[locale] },
  };
}

export async function newsArticleMetadata(
  locale: Locale,
  slug: string,
): Promise<Metadata> {
  const article = await getNews(locale, slug);
  if (!article) {
    return pageMetadata({
      locale,
      pathname: `/vesti/${slug}`,
      title: SITE_NAME[locale],
    });
  }
  return pageMetadata({
    locale,
    pathname: `/vesti/${slug}`,
    title: article.title,
    description: article.excerpt,
    image: article.image,
    type: 'article',
  });
}

export async function catalogProductMetadata(
  locale: Locale,
  slug: string,
): Promise<Metadata> {
  const product = await getCatalogProduct(locale, slug);
  const pathname = `/posetite-nas/prodavnica/${slug}`;
  if (!product) {
    return pageMetadata({
      locale,
      pathname,
      title: SITE_NAME[locale],
    });
  }
  return pageMetadata({
    locale,
    pathname,
    title: product.title,
    description: product.body?.slice(0, 220) || product.kind,
    image: product.image,
  });
}

export { DEFAULT_DESCRIPTION, SITE_NAME };

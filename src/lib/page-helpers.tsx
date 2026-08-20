import { setRequestLocale } from 'next-intl/server';
import { loadPage, loadDocumentList } from '@/lib/content';
import { heroFor } from '@/lib/page-heroes';
import { metadataFromPageJson } from '@/lib/seo';
import ContentPage from '@/components/ContentPage';
import DocumentList from '@/components/DocumentList';
import type { Locale } from '@/i18n/config';
import type { Metadata } from 'next';

export async function generatePageMetadata({
  params,
  slug,
  pathname,
  fallbackTitle,
}: {
  params: Promise<{ locale: Locale }>;
  slug: string;
  pathname: string;
  fallbackTitle: string;
}): Promise<Metadata> {
  const { locale } = await params;
  return metadataFromPageJson(locale, slug, pathname, fallbackTitle);
}

export async function renderContentPage({
  locale,
  slug,
  fallbackTitle,
  eyebrow,
}: {
  locale: Locale;
  slug: string;
  fallbackTitle: string;
  eyebrow?: string;
}) {
  setRequestLocale(locale);
  const data = await loadPage(locale, slug);
  return (
    <ContentPage
      eyebrow={eyebrow}
      title={data?.title || fallbackTitle}
      intro={data?.intro}
      body={data?.body}
      images={data?.images}
      heroImage={heroFor(slug)}
    />
  );
}

export async function renderDocumentListPage({
  locale,
  slug,
  fallbackTitle,
  eyebrow,
}: {
  locale: Locale;
  slug: string;
  fallbackTitle: string;
  eyebrow?: string;
}) {
  setRequestLocale(locale);
  const data = await loadDocumentList(locale, slug);
  return (
    <ContentPage
      eyebrow={eyebrow}
      title={data?.title || fallbackTitle}
      intro={data?.intro}
      heroImage={heroFor(slug)}
    >
      <DocumentList documents={data?.documents ?? []} />
    </ContentPage>
  );
}

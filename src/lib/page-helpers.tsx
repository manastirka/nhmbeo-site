import { setRequestLocale } from 'next-intl/server';
import { loadPage, loadDocumentList } from '@/lib/content';
import { heroFor } from '@/lib/page-heroes';
import ContentPage from '@/components/ContentPage';
import DocumentList from '@/components/DocumentList';
import type { Locale } from '@/i18n/config';

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

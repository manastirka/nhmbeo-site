import { getTranslations } from 'next-intl/server';
import { renderDocumentListPage, generatePageMetadata } from '@/lib/page-helpers';
import type { Locale } from '@/i18n/config';
import type { Metadata } from 'next';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  return generatePageMetadata({
    params,
    slug: 'posebna-izdanja',
    pathname: '/istrazite/posebna-izdanja',
    fallbackTitle: 'Посебна издања',
  });
}

export default async function Page({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const t = await getTranslations('nav');
  return renderDocumentListPage({
    locale,
    slug: 'posebna-izdanja',
    fallbackTitle: t('explore_special'),
    eyebrow: t('explore'),
  });
}

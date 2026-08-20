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
    slug: 'javne-nabavke',
    pathname: '/o-muzeju/javne-nabavke',
    fallbackTitle: 'Јавне набавке',
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
    slug: 'javne-nabavke',
    fallbackTitle: t('about_procurement'),
    eyebrow: t('about'),
  });
}

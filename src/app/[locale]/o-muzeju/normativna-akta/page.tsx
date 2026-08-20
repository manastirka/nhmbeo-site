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
    slug: 'normativna-akta',
    pathname: '/o-muzeju/normativna-akta',
    fallbackTitle: 'Нормативна акта',
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
    slug: 'normativna-akta',
    fallbackTitle: t('about_regulations'),
    eyebrow: t('about'),
  });
}

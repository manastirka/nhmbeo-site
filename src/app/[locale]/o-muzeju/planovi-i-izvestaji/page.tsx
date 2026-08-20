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
    slug: 'planovi-i-izvestaji',
    pathname: '/o-muzeju/planovi-i-izvestaji',
    fallbackTitle: 'Планови и извештаји',
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
    slug: 'planovi-i-izvestaji',
    fallbackTitle: t('about_plans'),
    eyebrow: t('about'),
  });
}

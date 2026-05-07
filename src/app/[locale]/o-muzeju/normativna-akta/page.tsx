import { getTranslations } from 'next-intl/server';
import { renderDocumentListPage } from '@/lib/page-helpers';
import type { Locale } from '@/i18n/config';

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

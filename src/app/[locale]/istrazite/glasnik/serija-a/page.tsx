import { setRequestLocale, getTranslations } from 'next-intl/server';
import ContentPage from '@/components/ContentPage';
import GlasnikVolumeList from '@/components/GlasnikVolumeList';
import { loadGlasnikSeries } from '@/lib/glasnik';
import type { Locale } from '@/i18n/config';

const NHM = 'https://nhmbeo.rs/wp-content/uploads';

export default async function Page({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('nav');
  const data = await loadGlasnikSeries(locale, 'a');
  const groupLabel = locale === 'en' ? 'Edition' : 'Издање';

  return (
    <ContentPage
      eyebrow={t('explore_glasnik')}
      title={data?.title || 'Glasnik — Series A'}
      intro={data?.intro}
      heroImage={`${NHM}/2025/09/02-Fosilizacija-SAJT.jpg`}
    >
      {data?.volumes && (
        <GlasnikVolumeList volumes={data.volumes} groupLabel={groupLabel} />
      )}
    </ContentPage>
  );
}

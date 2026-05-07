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
  const data = await loadGlasnikSeries(locale, 'b');
  const groupLabel = locale === 'en' ? 'Edition' : 'Издање';

  return (
    <ContentPage
      eyebrow={t('explore_glasnik')}
      title={data?.title || 'Glasnik — Series B'}
      intro={data?.intro}
      heroImage={`${NHM}/2021/04/Buteo-buteo-photo-Milivoj-Vucanovic.jpg`}
    >
      {data?.volumes && (
        <GlasnikVolumeList volumes={data.volumes} groupLabel={groupLabel} />
      )}
    </ContentPage>
  );
}

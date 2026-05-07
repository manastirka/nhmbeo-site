import { setRequestLocale, getTranslations } from 'next-intl/server';
import { loadProducts } from '@/lib/content';
import ContentPage from '@/components/ContentPage';
import ProductGrid from '@/components/ProductGrid';
import { heroFor } from '@/lib/page-heroes';
import type { Locale } from '@/i18n/config';

export default async function Page({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('nav');
  const data = await loadProducts(locale);

  return (
    <ContentPage
      eyebrow={t('visit')}
      title={data?.title || t('visit_shop')}
      intro={data?.intro}
      heroImage={heroFor('prodavnica')}
    >
      <div className="mt-8">
        <ProductGrid products={data?.products ?? []} />
      </div>
    </ContentPage>
  );
}

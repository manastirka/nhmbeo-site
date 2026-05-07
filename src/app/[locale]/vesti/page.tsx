import { setRequestLocale, getTranslations } from 'next-intl/server';
import PageHeader from '@/components/PageHeader';
import NewsCard from '@/components/NewsCard';
import { listNews } from '@/lib/news';
import { heroFor } from '@/lib/page-heroes';
import type { Locale } from '@/i18n/config';

export default async function NewsListPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations();
  const articles = await listNews(locale);

  return (
    <>
      <PageHeader title={t('nav.news')} image={heroFor('vesti')} />
      <section className="container-page py-12">
        {articles.length === 0 ? (
          <p className="text-brand-ink/60">{t('news.empty')}</p>
        ) : (
          <ul className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
            {articles.map((a) => (
              <li key={a.slug}>
                <NewsCard article={a} />
              </li>
            ))}
          </ul>
        )}
      </section>
    </>
  );
}

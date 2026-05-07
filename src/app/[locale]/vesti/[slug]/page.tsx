import { notFound } from 'next/navigation';
import Image from 'next/image';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { getNews, listNews } from '@/lib/news';
import { routing } from '@/i18n/routing';
import MarkdownBody from '@/components/MarkdownBody';
import Gallery from '@/components/Gallery';
import type { Locale } from '@/i18n/config';

export async function generateStaticParams() {
  const params: { locale: string; slug: string }[] = [];
  for (const locale of routing.locales) {
    const articles = await listNews(locale);
    for (const a of articles) {
      params.push({ locale, slug: a.slug });
    }
  }
  return params;
}

export default async function NewsArticlePage({
  params,
}: {
  params: Promise<{ locale: Locale; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const article = await getNews(locale, slug);
  if (!article) notFound();

  const t = await getTranslations('news');
  const tNav = await getTranslations('nav');

  // Don't repeat the hero image inside the gallery.
  const galleryImages = (article.images ?? []).filter(
    (src) => src !== article.image,
  );

  return (
    <article>
      {article.image && (
        <div className="relative h-[55vh] min-h-[420px] w-full overflow-hidden bg-brand-midnight">
          <Image
            src={article.image}
            alt={article.title}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-brand-midnight/30 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 h-3/5 bg-gradient-to-t from-brand-midnight via-brand-midnight/85 to-transparent" />
          <div className="container-wide absolute inset-x-0 bottom-0 pb-10 md:pb-16">
            <Link
              href="/vesti"
              className="text-xs uppercase tracking-widerx text-brand-warm hover:text-white"
            >
              ← {tNav('news')}
            </Link>
            <p className="mt-4 text-xs uppercase tracking-widerx text-white/80">
              {article.date}
            </p>
            <h1 className="mt-2 max-w-3xl font-serif text-3xl leading-[1.1] text-white md:text-5xl">
              {article.title}
            </h1>
          </div>
        </div>
      )}

      {!article.image && (
        <header className="border-b border-brand-line bg-brand-paper py-16">
          <div className="container-wide">
            <Link
              href="/vesti"
              className="text-xs uppercase tracking-widerx text-brand-warmDeep hover:text-brand-deep"
            >
              ← {tNav('news')}
            </Link>
            <p className="mt-4 text-xs uppercase tracking-widerx text-brand-ink/60">
              {article.date}
            </p>
            <h1 className="mt-2 max-w-3xl font-serif text-3xl leading-tight text-brand-deep md:text-5xl">
              {article.title}
            </h1>
          </div>
        </header>
      )}

      <section className="container-wide grid gap-10 py-16 lg:grid-cols-12">
        <div className="lg:col-span-8 lg:col-start-3">
          <MarkdownBody source={article.body} />

          {galleryImages.length > 0 && (
            <Gallery images={galleryImages} />
          )}

          <div className="mt-16 border-t border-brand-line pt-6">
            <Link
              href="/vesti"
              className="text-sm text-brand-deep hover:text-brand-accent"
            >
              ← {t('back')}
            </Link>
          </div>
        </div>
      </section>
    </article>
  );
}

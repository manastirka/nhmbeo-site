import { setRequestLocale, getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { loadHome } from '@/lib/content';
import { getFeaturedNews } from '@/lib/news';
import { homeMetadata } from '@/lib/seo';
import HeroSection from '@/components/HeroSection';
import PlanYourVisitTiles from '@/components/PlanYourVisitTiles';
import ExhibitionShowcase from '@/components/ExhibitionShowcase';
import NewsCard from '@/components/NewsCard';
import type { Locale } from '@/i18n/config';
import type { Metadata } from 'next';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return homeMetadata(locale);
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations('home');
  const tNav = await getTranslations('nav');
  const home = await loadHome(locale);
  const featured = await getFeaturedNews(locale, 4);
  const [first, ...rest] = featured;

  return (
    <>
      {home && (
        <HeroSection
          eyebrow={home.hero.eyebrow}
          title={home.hero.title}
          subtitle={home.hero.subtitle}
          image={home.hero.image}
        />
      )}

      {home?.tiles && (
        <PlanYourVisitTiles title={home.tiles.title} items={home.tiles.items} />
      )}

      {home?.intro && (
        <section className="bg-white">
          <div className="container-wide grid gap-12 py-16 md:py-24 lg:grid-cols-12">
            <div className="lg:col-span-5">
              {home.intro.eyebrow && (
                <p className="eyebrow mb-3">{home.intro.eyebrow}</p>
              )}
              <h2 className="font-display text-3xl font-extrabold leading-tight tracking-tight text-brand-deep md:text-5xl">
                {home.intro.title}
              </h2>
              <span className="mt-6 block h-[3px] w-14 bg-brand-lime" />
            </div>
            <div className="lg:col-span-6 lg:col-start-7">
              <p className="text-base leading-relaxed text-brand-ink/80 md:text-lg">
                {home.intro.body}
              </p>
              {home.stats && (
                <dl className="mt-12 grid grid-cols-2 gap-y-10 gap-x-8 border-t border-brand-line pt-10 sm:gap-x-10 lg:grid-cols-4">
                  {home.stats.map((s, i) => (
                    <div key={i} className="min-w-0">
                      <dt className="font-display text-xl font-semibold tracking-tight tabular-nums text-brand-deep md:text-2xl xl:text-3xl">
                        {s.value}
                      </dt>
                      <dd className="mt-2 text-xs uppercase tracking-widerx text-brand-ink/60">
                        {s.label}
                      </dd>
                    </div>
                  ))}
                </dl>
              )}
            </div>
          </div>
        </section>
      )}

      {home?.featured && (
        <ExhibitionShowcase
          eyebrow={home.featured.eyebrow}
          title={home.featured.title}
          description={home.featured.description}
          href={home.featured.href}
          image={home.featured.image}
          cta={home.featured.cta}
        />
      )}

      {featured.length > 0 && (
        <section className="bg-brand-paper">
          <div className="container-wide py-16 md:py-24">
            <div className="mb-10 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="eyebrow mb-2">02</p>
                <h2 className="font-display text-3xl font-extrabold tracking-tight text-brand-deep md:text-4xl">
                  {tNav('news')}
                </h2>
              </div>
              <Link
                href="/vesti"
                className="self-start text-sm font-semibold text-brand-deep hover:text-brand-purple"
              >
                {t('ctaNews')} <span aria-hidden="true">→</span>
              </Link>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
              {first && (
                <div className="lg:col-span-2">
                  <NewsCard article={first} variant="large" />
                </div>
              )}
              <div className="grid gap-6">
                {rest.slice(0, 2).map((article) => (
                  <NewsCard key={article.slug} article={article} />
                ))}
              </div>
            </div>
          </div>
        </section>
      )}
    </>
  );
}

import path from 'node:path';
import fs from 'node:fs/promises';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import PageHeader from '@/components/PageHeader';
import MarkdownBody from '@/components/MarkdownBody';
import Gallery from '@/components/Gallery';
import { heroFor } from '@/lib/page-heroes';
import type { Locale } from '@/i18n/config';

type Featured = {
  eyebrow: string;
  title: string;
  authors: string;
  dates: string;
  venue: string;
  ctaHref: string;
  ctaLabel: string;
};

type Stat = { value: string; label: string };

type Credits = {
  authors_label: string;
  authors: string;
  photography_label: string;
  photography: string;
  patron_label: string;
  patron: string;
};

type IzlozbaPage = {
  title: string;
  intro?: string;
  body?: string;
  images?: string[];
  featured?: Featured;
  stats?: Stat[];
  credits?: Credits;
};

async function loadIzlozba(locale: Locale): Promise<IzlozbaPage | null> {
  const file = path.join(
    process.cwd(),
    'content',
    locale,
    'pages',
    'izlozba-u-galeriji.json',
  );
  try {
    return JSON.parse(await fs.readFile(file, 'utf8'));
  } catch {
    return null;
  }
}

const STAT_BG = ['bg-brand-peach', 'bg-brand-lime', 'bg-brand-cyan', 'bg-brand-purple'];
const STAT_TEXT = [
  'text-brand-midnight',
  'text-brand-midnight',
  'text-brand-midnight',
  'text-white',
];

export default async function Page({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const tNav = await getTranslations('nav');
  const data = await loadIzlozba(locale);
  const aboutLabel = locale === 'en' ? '02 · About the exhibition' : '02 · О изложби';
  const galleryLabel = locale === 'en' ? '03 · Gallery' : '03 · Галерија';
  const creditsLabel = locale === 'en' ? '04 · Credits' : '04 · Аутори и захвалнице';
  const statsLabel = locale === 'en' ? '01 · At a glance' : '01 · Бројкама';

  return (
    <>
      <PageHeader
        eyebrow={tNav('visit')}
        title={data?.title || tNav('visit_exhibition')}
        intro={data?.intro}
        image={heroFor('izlozba-u-galeriji')}
      />

      {data?.featured && (
        <section className="bg-brand-cyan">
          <div className="container-wide grid gap-8 py-16 md:grid-cols-12 md:py-20">
            <div className="md:col-span-4">
              <p className="eyebrow text-brand-midnight">{data.featured.eyebrow}</p>
              <span className="mt-3 inline-block h-3 w-12 bg-brand-midnight" />
            </div>
            <div className="md:col-span-8">
              <h2 className="font-display text-4xl leading-[1.05] text-brand-midnight md:text-6xl">
                {data.featured.title}
              </h2>
              <dl className="mt-8 grid gap-x-10 gap-y-3 sm:grid-cols-2">
                <div>
                  <dt className="text-[10px] uppercase tracking-widerx text-brand-midnight/60">
                    {locale === 'en' ? 'Authors' : 'Аутори'}
                  </dt>
                  <dd className="mt-1 text-sm text-brand-midnight">
                    {data.featured.authors}
                  </dd>
                </div>
                <div>
                  <dt className="text-[10px] uppercase tracking-widerx text-brand-midnight/60">
                    {locale === 'en' ? 'On view' : 'Трајање'}
                  </dt>
                  <dd className="mt-1 text-sm text-brand-midnight">
                    {data.featured.dates}
                  </dd>
                </div>
                <div className="sm:col-span-2">
                  <dt className="text-[10px] uppercase tracking-widerx text-brand-midnight/60">
                    {locale === 'en' ? 'Venue' : 'Место'}
                  </dt>
                  <dd className="mt-1 text-sm text-brand-midnight">
                    {data.featured.venue}
                  </dd>
                </div>
              </dl>
              <Link
                href={data.featured.ctaHref}
                className="mt-10 inline-flex items-center gap-2 rounded-full bg-brand-midnight px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-deep no-underline"
              >
                {data.featured.ctaLabel}
                <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </section>
      )}

      {data?.stats && data.stats.length > 0 && (
        <section className="bg-brand-paper">
          <div className="container-wide py-16 md:py-20">
            <div className="mb-10 grid gap-6 md:grid-cols-12">
              <div className="md:col-span-3">
                <p className="eyebrow text-brand-purple">{statsLabel}</p>
                <span className="mt-3 inline-block h-3 w-12 bg-brand-cyan" />
              </div>
            </div>
            <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {data.stats.map((s, i) => (
                <li
                  key={i}
                  className={`flex min-h-[180px] flex-col justify-between rounded-3xl p-7 ${
                    STAT_BG[i % STAT_BG.length]
                  } ${STAT_TEXT[i % STAT_TEXT.length]}`}
                >
                  <span className="text-xs font-semibold uppercase tracking-widerx opacity-60">
                    0{i + 1}
                  </span>
                  <div>
                    <p className="font-display text-2xl font-bold leading-tight tracking-tight md:text-3xl">
                      {s.value}
                    </p>
                    <p className="mt-3 text-sm opacity-80">{s.label}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {data?.body && (
        <section className="bg-white">
          <div className="container-wide py-16 md:py-20">
            <div className="mb-10 grid gap-6 md:grid-cols-12">
              <div className="md:col-span-3">
                <p className="eyebrow text-brand-purple">{aboutLabel}</p>
                <span className="mt-3 inline-block h-3 w-12 bg-brand-lime" />
              </div>
            </div>
            <MarkdownBody source={data.body} />
          </div>
        </section>
      )}

      {data?.images && data.images.length > 0 && (
        <section className="bg-brand-paper">
          <div className="container-wide py-16 md:py-20">
            <div className="mb-10 grid gap-6 md:grid-cols-12">
              <div className="md:col-span-3">
                <p className="eyebrow text-brand-purple">{galleryLabel}</p>
                <span className="mt-3 inline-block h-3 w-12 bg-brand-cyan" />
              </div>
            </div>
            <Gallery images={data.images} />
          </div>
        </section>
      )}

      {data?.credits && (
        <section className="bg-brand-deep text-white">
          <div className="container-wide py-16 md:py-20">
            <div className="mb-10 grid gap-6 md:grid-cols-12">
              <div className="md:col-span-3">
                <p className="eyebrow text-brand-lime">{creditsLabel}</p>
                <span className="mt-3 inline-block h-3 w-12 bg-brand-peach" />
              </div>
            </div>
            <dl className="grid gap-10 md:grid-cols-3">
              <div>
                <dt className="text-[10px] uppercase tracking-widerx text-brand-lime">
                  {data.credits.authors_label}
                </dt>
                <dd className="mt-3 font-display text-xl text-white">
                  {data.credits.authors}
                </dd>
              </div>
              <div>
                <dt className="text-[10px] uppercase tracking-widerx text-brand-lime">
                  {data.credits.photography_label}
                </dt>
                <dd className="mt-3 font-display text-xl text-white">
                  {data.credits.photography}
                </dd>
              </div>
              <div>
                <dt className="text-[10px] uppercase tracking-widerx text-brand-lime">
                  {data.credits.patron_label}
                </dt>
                <dd className="mt-3 font-display text-xl text-white">
                  {data.credits.patron}
                </dd>
              </div>
            </dl>
          </div>
        </section>
      )}
    </>
  );
}

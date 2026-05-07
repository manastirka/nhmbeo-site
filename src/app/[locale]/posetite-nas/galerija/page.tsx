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
  address: string;
  phone: string;
  email: string;
  ctaHref: string;
  ctaLabel: string;
};

type Stat = { value: string; label: string };
type Fact = { label: string; value: string };
type GroupBookings = {
  label: string;
  description: string;
  phone: string;
  email: string;
};

type GalerijaPage = {
  title: string;
  intro?: string;
  body?: string;
  featured?: Featured;
  stats?: Stat[];
  facts?: Fact[];
  groupBookings?: GroupBookings;
  images?: string[];
};

async function loadPage(locale: Locale): Promise<GalerijaPage | null> {
  const file = path.join(process.cwd(), 'content', locale, 'pages', 'galerija.json');
  try {
    return JSON.parse(await fs.readFile(file, 'utf8'));
  } catch {
    return null;
  }
}

const STAT_BG = ['bg-brand-peach', 'bg-brand-cyan', 'bg-brand-lime', 'bg-brand-purple'];
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
  const data = await loadPage(locale);
  const statsLabel = locale === 'en' ? '01 · Hours' : '01 · Радно време';
  const aboutLabel = locale === 'en' ? '02 · About the Gallery' : '02 · О Галерији';
  const factsLabel = locale === 'en' ? '03 · The building, in brief' : '03 · Зграда укратко';
  const galleryLabel = locale === 'en' ? '04 · From the Gallery' : '04 · Из Галерије';
  const groupLabel = locale === 'en' ? '05 · Group visits' : '05 · Групне посете';

  return (
    <>
      <PageHeader
        eyebrow={tNav('visit')}
        title={data?.title || tNav('visit_gallery')}
        intro={data?.intro}
        image={heroFor('galerija')}
      />

      {data?.featured && (
        <section className="bg-brand-peach">
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
                <div className="sm:col-span-2">
                  <dt className="text-[10px] uppercase tracking-widerx text-brand-midnight/60">
                    {locale === 'en' ? 'Address' : 'Адреса'}
                  </dt>
                  <dd className="mt-1 text-sm text-brand-midnight">
                    {data.featured.address}
                  </dd>
                </div>
                <div>
                  <dt className="text-[10px] uppercase tracking-widerx text-brand-midnight/60">
                    {locale === 'en' ? 'Phone' : 'Телефон'}
                  </dt>
                  <dd className="mt-1 text-sm text-brand-midnight">
                    <a href={`tel:${data.featured.phone.replace(/\s/g, '')}`}>
                      {data.featured.phone}
                    </a>
                  </dd>
                </div>
                <div>
                  <dt className="text-[10px] uppercase tracking-widerx text-brand-midnight/60">
                    {locale === 'en' ? 'Email' : 'Е-пошта'}
                  </dt>
                  <dd className="mt-1 text-sm text-brand-midnight">
                    <a href={`mailto:${data.featured.email}`}>{data.featured.email}</a>
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
                    <p className="font-display text-3xl font-bold leading-tight tracking-tight tabular-nums md:text-4xl">
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

      {data?.facts && data.facts.length > 0 && (
        <section className="bg-brand-paper">
          <div className="container-wide py-16 md:py-20">
            <div className="mb-10 grid gap-6 md:grid-cols-12">
              <div className="md:col-span-3">
                <p className="eyebrow text-brand-purple">{factsLabel}</p>
                <span className="mt-3 inline-block h-3 w-12 bg-brand-peach" />
              </div>
            </div>
            <dl className="grid gap-x-10 gap-y-8 md:grid-cols-3">
              {data.facts.map((f, i) => (
                <div key={i} className="border-t-2 border-brand-deep pt-4">
                  <dt className="text-[10px] uppercase tracking-widerx text-brand-purple">
                    {f.label}
                  </dt>
                  <dd className="mt-2 font-display text-xl text-brand-deep md:text-2xl">
                    {f.value}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </section>
      )}

      {data?.images && data.images.length > 0 && (
        <section className="bg-white">
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

      {data?.groupBookings && (
        <section className="bg-brand-deep text-white">
          <div className="container-wide grid gap-8 py-16 md:grid-cols-12 md:py-20">
            <div className="md:col-span-4">
              <p className="eyebrow text-brand-lime">{groupLabel}</p>
              <span className="mt-3 inline-block h-3 w-12 bg-brand-peach" />
            </div>
            <div className="md:col-span-8">
              <h2 className="font-display text-3xl text-white md:text-5xl">
                {data.groupBookings.label}
              </h2>
              <p className="mt-4 max-w-prose text-white/80 md:text-lg">
                {data.groupBookings.description}
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <a
                  href={`tel:${data.groupBookings.phone.replace(/\s/g, '')}`}
                  className="inline-flex items-center gap-2 rounded-full border-2 border-brand-lime px-6 py-3 text-sm font-semibold text-brand-lime transition-colors hover:bg-brand-lime hover:text-brand-midnight no-underline"
                >
                  {data.groupBookings.phone}
                </a>
                <a
                  href={`mailto:${data.groupBookings.email}`}
                  className="inline-flex items-center gap-2 rounded-full bg-brand-lime px-6 py-3 text-sm font-semibold text-brand-midnight transition-colors hover:bg-brand-cyan no-underline"
                >
                  {data.groupBookings.email}
                  <span aria-hidden="true">→</span>
                </a>
              </div>
            </div>
          </div>
        </section>
      )}
    </>
  );
}

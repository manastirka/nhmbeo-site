import path from 'node:path';
import fs from 'node:fs/promises';
import Image from 'next/image';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import PageHeader from '@/components/PageHeader';
import { heroFor } from '@/lib/page-heroes';
import { generatePageMetadata } from '@/lib/page-helpers';
import type { Locale } from '@/i18n/config';
import type { Metadata } from 'next';

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

type Destination = {
  key: string;
  title: string;
  description: string;
  href: string;
  image: string;
};

type VisitPage = {
  title: string;
  intro?: string;
  featured?: Featured;
  stats?: Stat[];
  destinations?: Destination[];
};

async function loadVisit(locale: Locale): Promise<VisitPage | null> {
  const file = path.join(process.cwd(), 'content', locale, 'pages', 'posetite-nas.json');
  try {
    return JSON.parse(await fs.readFile(file, 'utf8'));
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  return generatePageMetadata({
    params,
    slug: 'posetite-nas',
    pathname: '/posetite-nas',
    fallbackTitle: 'Посетите нас',
  });
}

const STAT_BG = ['bg-brand-peach', 'bg-brand-cyan', 'bg-brand-lime', 'bg-brand-purple'];
const STAT_TEXT = [
  'text-brand-midnight',
  'text-brand-midnight',
  'text-brand-midnight',
  'text-white',
];

export default async function VisitSection({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const tNav = await getTranslations('nav');
  const data = await loadVisit(locale);
  const statsLabel = locale === 'en' ? '01 · Hours & info' : '01 · Радно време';
  const destinationsLabel =
    locale === 'en' ? '02 · Where to start' : '02 · Истражите';

  return (
    <>
      <PageHeader
        title={data?.title || tNav('visit')}
        intro={data?.intro}
        image={heroFor('visit-section')}
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

      {data?.destinations && data.destinations.length > 0 && (
        <section className="bg-white">
          <div className="container-wide py-16 md:py-20">
            <div className="mb-10 grid gap-6 md:grid-cols-12">
              <div className="md:col-span-3">
                <p className="eyebrow text-brand-purple">{destinationsLabel}</p>
                <span className="mt-3 inline-block h-3 w-12 bg-brand-lime" />
              </div>
            </div>
            <ul className="grid gap-6 md:grid-cols-2">
              {data.destinations.map((d, i) => (
                <li key={d.key}>
                  <Link href={d.href} className="group block no-underline">
                    <div className="relative aspect-[4/3] overflow-hidden rounded-3xl bg-brand-bone">
                      <Image
                        src={d.image}
                        alt=""
                        fill
                        sizes="(min-width: 768px) 50vw, 100vw"
                        className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-brand-midnight/60 via-brand-midnight/10 to-transparent" />
                      <span className="absolute left-5 top-5 rounded-full bg-brand-lime px-3 py-1 text-[10px] font-semibold uppercase tracking-widerx text-brand-midnight">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                    </div>
                    <div className="mt-5 flex items-start justify-between gap-4">
                      <div>
                        <h3 className="font-display text-2xl leading-tight text-brand-deep group-hover:text-brand-purple md:text-3xl">
                          {d.title}
                        </h3>
                        <p className="mt-2 max-w-prose text-sm text-brand-ink/70">
                          {d.description}
                        </p>
                      </div>
                      <span
                        aria-hidden="true"
                        className="mt-2 shrink-0 text-brand-deep transition-transform group-hover:translate-x-1"
                      >
                        →
                      </span>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}
    </>
  );
}

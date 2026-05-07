import path from 'node:path';
import fs from 'node:fs/promises';
import Image from 'next/image';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import PageHeader from '@/components/PageHeader';
import { heroFor } from '@/lib/page-heroes';
import type { Locale } from '@/i18n/config';

type Featured = {
  eyebrow: string;
  title: string;
  description: string;
  ctaHref: string;
  ctaLabel: string;
};

type Destination = {
  key: string;
  title: string;
  description: string;
  href: string;
  image: string;
};

type ExplorePage = {
  title: string;
  intro?: string;
  featured?: Featured;
  destinations?: Destination[];
};

async function loadExplore(locale: Locale): Promise<ExplorePage | null> {
  const file = path.join(process.cwd(), 'content', locale, 'pages', 'istrazite.json');
  try {
    return JSON.parse(await fs.readFile(file, 'utf8'));
  } catch {
    return null;
  }
}

export default async function ExploreSection({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const tNav = await getTranslations('nav');
  const data = await loadExplore(locale);
  const destinationsLabel =
    locale === 'en' ? '01 · Where to start' : '01 · Где почети';

  return (
    <>
      <PageHeader
        title={data?.title || tNav('explore')}
        intro={data?.intro}
        image={heroFor('explore-section')}
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
              <p className="mt-6 max-w-2xl text-base text-brand-midnight/80 md:text-lg">
                {data.featured.description}
              </p>
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

      {data?.destinations && data.destinations.length > 0 && (
        <section className="bg-white">
          <div className="container-wide py-16 md:py-24">
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
                      <div className="absolute inset-0 bg-gradient-to-t from-brand-midnight/55 via-brand-midnight/10 to-transparent" />
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

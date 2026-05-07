import path from 'node:path';
import fs from 'node:fs/promises';
import Image from 'next/image';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import PageHeader from '@/components/PageHeader';
import MarkdownBody from '@/components/MarkdownBody';
import { heroFor } from '@/lib/page-heroes';
import type { Locale } from '@/i18n/config';

type Featured = {
  eyebrow: string;
  title: string;
  scope: string;
  founded: string;
  membership: string;
  resultsHref?: string;
  resultsLabel?: string;
};

type Stat = { value: string; label: string };

type Species = {
  latin: string;
  common: string;
  photographer: string;
  image: string;
};

type Contact = {
  label: string;
  description: string;
  phone: string;
  email: string;
};

type MarkingPage = {
  title: string;
  intro?: string;
  body?: string;
  featured?: Featured;
  stats?: Stat[];
  species?: Species[];
  contact?: Contact;
};

async function loadPage(locale: Locale): Promise<MarkingPage | null> {
  const file = path.join(
    process.cwd(),
    'content',
    locale,
    'pages',
    'centar-za-markiranje-zivotinja.json',
  );
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
  const statsLabel = locale === 'en' ? '01 · By the numbers' : '01 · Бројкама';
  const aboutLabel = locale === 'en' ? '02 · About the Centre' : '02 · О Центру';
  const speciesLabel = locale === 'en' ? '03 · Species we mark' : '03 · Које врсте маркирамо';
  const contactLabel = locale === 'en' ? '04 · Get in touch' : '04 · Контакт';

  return (
    <>
      <PageHeader
        eyebrow={tNav('explore')}
        title={data?.title || tNav('explore_marking')}
        intro={data?.intro}
        image={heroFor('centar-za-markiranje-zivotinja')}
      />

      {data?.featured && (
        <section className="bg-brand-lime">
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
                    {locale === 'en' ? 'Scope' : 'Обухват'}
                  </dt>
                  <dd className="mt-1 text-sm text-brand-midnight">
                    {data.featured.scope}
                  </dd>
                </div>
                <div>
                  <dt className="text-[10px] uppercase tracking-widerx text-brand-midnight/60">
                    {locale === 'en' ? 'Founded' : 'Основан'}
                  </dt>
                  <dd className="mt-1 text-sm text-brand-midnight">
                    {data.featured.founded}
                  </dd>
                </div>
                <div className="sm:col-span-2">
                  <dt className="text-[10px] uppercase tracking-widerx text-brand-midnight/60">
                    {locale === 'en' ? 'Membership' : 'Чланство'}
                  </dt>
                  <dd className="mt-1 text-sm text-brand-midnight">
                    {data.featured.membership}
                  </dd>
                </div>
              </dl>
              {data.featured.resultsHref && (
                <a
                  href={data.featured.resultsHref}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="mt-10 inline-flex items-center gap-2 rounded-full bg-brand-midnight px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-deep no-underline"
                >
                  {data.featured.resultsLabel}
                  <span aria-hidden="true">→</span>
                </a>
              )}
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

      {data?.species && data.species.length > 0 && (
        <section className="bg-brand-paper">
          <div className="container-wide py-16 md:py-20">
            <div className="mb-10 grid gap-6 md:grid-cols-12">
              <div className="md:col-span-3">
                <p className="eyebrow text-brand-purple">{speciesLabel}</p>
                <span className="mt-3 inline-block h-3 w-12 bg-brand-peach" />
              </div>
            </div>
            <ul className="grid gap-6 md:grid-cols-3">
              {data.species.map((s, i) => (
                <li key={i}>
                  <article className="group flex h-full flex-col">
                    <div className="relative aspect-[4/3] overflow-hidden rounded-3xl bg-brand-bone">
                      <Image
                        src={s.image}
                        alt={`${s.common} (${s.latin})`}
                        fill
                        sizes="(min-width: 768px) 360px, 90vw"
                        className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                      />
                    </div>
                    <div className="mt-5">
                      <p className="text-[10px] uppercase tracking-widerx text-brand-purple">
                        0{i + 1}
                      </p>
                      <h3 className="mt-1 font-display text-xl italic text-brand-deep">
                        {s.latin}
                      </h3>
                      <p className="mt-1 font-display text-2xl text-brand-deep">
                        {s.common}
                      </p>
                      <p className="mt-3 text-xs uppercase tracking-widerx text-brand-ink/55">
                        {locale === 'en' ? 'Photo' : 'Фото'} · {s.photographer}
                      </p>
                    </div>
                  </article>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {data?.contact && (
        <section className="bg-brand-deep text-white">
          <div className="container-wide grid gap-8 py-16 md:grid-cols-12 md:py-20">
            <div className="md:col-span-4">
              <p className="eyebrow text-brand-lime">{contactLabel}</p>
              <span className="mt-3 inline-block h-3 w-12 bg-brand-peach" />
            </div>
            <div className="md:col-span-8">
              <h2 className="font-display text-3xl text-white md:text-5xl">
                {data.contact.label}
              </h2>
              <p className="mt-4 max-w-prose text-white/80 md:text-lg">
                {data.contact.description}
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <a
                  href={`tel:${data.contact.phone.replace(/\s/g, '')}`}
                  className="inline-flex items-center gap-2 rounded-full border-2 border-brand-lime px-6 py-3 text-sm font-semibold text-brand-lime transition-colors hover:bg-brand-lime hover:text-brand-midnight no-underline"
                >
                  {data.contact.phone}
                </a>
                <a
                  href={`mailto:${data.contact.email}`}
                  className="inline-flex items-center gap-2 rounded-full bg-brand-lime px-6 py-3 text-sm font-semibold text-brand-midnight transition-colors hover:bg-brand-cyan no-underline"
                >
                  {data.contact.email}
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

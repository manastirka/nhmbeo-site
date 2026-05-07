import path from 'node:path';
import fs from 'node:fs/promises';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { routing } from '@/i18n/routing';
import type { Locale } from '@/i18n/config';

type VolumeData = {
  volume: number;
  year: string;
  intro?: string;
  articles?: { title: string; href: string }[];
};

type BulletinIssue = {
  year: string;
  volume: number | null;
  image: string;
};

type BulletinIndex = {
  title: string;
  issn?: string;
  issues?: BulletinIssue[];
};

async function loadVolume(locale: Locale, volume: string): Promise<VolumeData | null> {
  const file = path.join(
    process.cwd(), 'content', locale, 'pages', 'bulletin', `volume-${volume}.json`,
  );
  try { return JSON.parse(await fs.readFile(file, 'utf8')); } catch { return null; }
}

async function loadIndex(locale: Locale): Promise<BulletinIndex | null> {
  try {
    return JSON.parse(
      await fs.readFile(
        path.join(process.cwd(), 'content', locale, 'pages', 'bulletin.json'),
        'utf8',
      ),
    );
  } catch {
    return null;
  }
}

export async function generateStaticParams() {
  const volumes = new Set<string>();
  for (const locale of routing.locales) {
    const idx = await loadIndex(locale as Locale);
    for (const i of idx?.issues ?? []) {
      if (i.volume != null) volumes.add(String(i.volume));
    }
  }
  const params: { locale: string; volume: string }[] = [];
  for (const locale of routing.locales) {
    for (const volume of volumes) params.push({ locale, volume });
  }
  return params;
}

export default async function Page({
  params,
}: {
  params: Promise<{ locale: Locale; volume: string }>;
}) {
  const { locale, volume } = await params;
  setRequestLocale(locale);
  const data = await loadVolume(locale, volume);
  const idx = await loadIndex(locale);
  const issue = idx?.issues?.find((i) => String(i.volume) === volume);
  if (!issue) notFound();

  const tNav = await getTranslations('nav');
  const articlesLabel =
    locale === 'en' ? '01 · Articles in this issue' : '01 · Радови у овом броју';
  const noArticlesLabel =
    locale === 'en'
      ? 'Articles for this issue are not yet listed.'
      : 'Радови за овај број још нису објављени.';
  const downloadLabel = locale === 'en' ? 'Download PDF' : 'Преузми PDF';
  const backLabel = locale === 'en' ? 'All issues' : 'Сви бројеви';

  return (
    <>
      {/* Hero featuring the cover image */}
      <section className="relative isolate overflow-hidden bg-brand-deep text-white">
        {issue.image && (
          <div className="absolute inset-0 -z-10 opacity-40">
            <Image src={issue.image} alt="" fill priority sizes="100vw" className="object-cover blur-md scale-110" />
          </div>
        )}
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-brand-deep via-brand-deep/80 to-brand-deep/40" />

        <div className="container-wide grid gap-10 py-20 md:grid-cols-12 md:py-28">
          <div className="md:col-span-3">
            <div className="relative aspect-[2/3] overflow-hidden rounded-2xl bg-brand-bone shadow-2xl ring-1 ring-white/20">
              {issue.image && (
                <Image
                  src={issue.image}
                  alt={`Bulletin volume ${volume}`}
                  fill
                  priority
                  sizes="(min-width: 768px) 280px, 60vw"
                  className="object-cover"
                />
              )}
            </div>
          </div>
          <div className="md:col-span-8 md:col-start-5 flex flex-col justify-end">
            <Link
              href="/istrazite/bulletin"
              className="text-xs uppercase tracking-widerx text-brand-lime hover:text-white"
            >
              ← {tNav('explore_bulletin')}
            </Link>
            <p className="eyebrow mt-4 text-brand-lime">Bulletin · ISSN {idx?.issn ?? '2406-1360'}</p>
            <h1 className="mt-2 font-display text-4xl leading-[1.05] text-white md:text-6xl">
              {locale === 'en' ? `Volume ${volume}` : `Број ${volume}`} · {data?.year ?? issue.year}
            </h1>
            {data?.intro && (
              <p className="mt-6 max-w-2xl text-base text-white/85 md:text-lg">{data.intro}</p>
            )}
          </div>
        </div>
      </section>

      <section className="bg-white">
        <div className="container-wide py-16 md:py-20">
          <div className="mb-10 grid gap-6 md:grid-cols-12">
            <div className="md:col-span-3">
              <p className="eyebrow text-brand-purple">{articlesLabel}</p>
              <span className="mt-3 inline-block h-3 w-12 bg-brand-lime" />
            </div>
          </div>

          {data?.articles && data.articles.length > 0 ? (
            <ul className="divide-y divide-brand-line border-t border-b border-brand-line">
              {data.articles.map((a, i) => (
                <li key={i} className="group">
                  <a
                    href={a.href}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="flex flex-col gap-3 py-5 sm:flex-row sm:items-start sm:justify-between no-underline"
                  >
                    <div className="flex-1">
                      <p className="text-[10px] uppercase tracking-widerx text-brand-purple">
                        {String(i + 1).padStart(2, '0')}
                      </p>
                      <p className="mt-1 font-display text-lg leading-snug text-brand-deep group-hover:text-brand-purple">
                        {a.title}
                      </p>
                    </div>
                    <span className="shrink-0 text-xs font-semibold uppercase tracking-widerx text-brand-warmDeep">
                      {downloadLabel} →
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-brand-ink/60">{noArticlesLabel}</p>
          )}

          <div className="mt-12">
            <Link
              href="/istrazite/bulletin"
              className="inline-flex items-center gap-2 rounded-full border-2 border-brand-deep px-6 py-3 text-sm font-semibold text-brand-deep transition-colors hover:bg-brand-deep hover:text-white no-underline"
            >
              ← {backLabel}
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

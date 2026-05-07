import path from 'node:path';
import fs from 'node:fs/promises';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import ContentPage from '@/components/ContentPage';
import { Link } from '@/i18n/navigation';
import { heroFor } from '@/lib/page-heroes';
import type { Locale } from '@/i18n/config';

type Series = {
  label: string;
  title: string;
  description: string;
  slug: string;
};

type GlasnikPage = {
  title: string;
  intro?: string;
  body?: string;
  series?: Series[];
};

async function loadGlasnik(locale: Locale): Promise<GlasnikPage | null> {
  const file = path.join(process.cwd(), 'content', locale, 'pages', 'glasnik.json');
  try {
    return JSON.parse(await fs.readFile(file, 'utf8'));
  } catch {
    return null;
  }
}

export default async function Page({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('nav');
  const data = await loadGlasnik(locale);
  const seriesLabel = locale === 'en' ? 'The three series' : 'Три серије';

  return (
    <ContentPage
      eyebrow={t('explore')}
      title={data?.title || t('explore_glasnik')}
      intro={data?.intro}
      body={data?.body}
      heroImage={heroFor('glasnik')}
    >
      {data?.series && data.series.length > 0 && (
        <section className="mt-16">
          <p className="eyebrow mb-6 text-brand-warmDeep">{seriesLabel}</p>
          <ul className="divide-y divide-brand-line border-t border-b border-brand-line">
            {data.series.map((s) => (
              <li key={s.label}>
                <Link
                  href={`/istrazite/glasnik/${s.slug}`}
                  className="group flex flex-col gap-1 py-5 sm:flex-row sm:items-center sm:justify-between no-underline"
                >
                  <div>
                    <p className="text-[10px] uppercase tracking-widerx text-brand-warmDeep">
                      {s.label}
                    </p>
                    <h3 className="mt-1 font-serif text-xl text-brand-deep group-hover:text-brand-accent">
                      {s.title}
                    </h3>
                    <p className="mt-1 text-sm text-brand-ink/70">
                      {s.description}
                    </p>
                  </div>
                  <span
                    aria-hidden="true"
                    className="text-brand-warmDeep transition-transform group-hover:translate-x-1"
                  >
                    →
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </ContentPage>
  );
}

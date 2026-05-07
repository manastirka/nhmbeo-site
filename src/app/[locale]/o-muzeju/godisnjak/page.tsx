import Image from 'next/image';
import path from 'node:path';
import fs from 'node:fs/promises';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import ContentPage from '@/components/ContentPage';
import { heroFor } from '@/lib/page-heroes';
import type { Locale } from '@/i18n/config';

type Issue = { year: string; image: string; href?: string };
type GodisnjakPage = {
  title: string;
  intro?: string;
  body?: string;
  issues?: Issue[];
};

async function loadGodisnjak(locale: Locale): Promise<GodisnjakPage | null> {
  const file = path.join(process.cwd(), 'content', locale, 'pages', 'godisnjak.json');
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
  const data = await loadGodisnjak(locale);
  const issuesLabel = locale === 'en' ? 'Past issues' : 'Претходни бројеви';
  const noPdfLabel = locale === 'en' ? 'PDF unavailable' : 'PDF недоступан';

  return (
    <ContentPage
      eyebrow={t('about')}
      title={data?.title || t('about_annual')}
      intro={data?.intro}
      body={data?.body}
      heroImage={heroFor('godisnjak')}
      heroPosition="top"
    >
      {data?.issues && data.issues.length > 0 && (
        <section className="mt-12">
          <p className="eyebrow mb-6 text-brand-warmDeep">{issuesLabel}</p>
          <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:gap-6 lg:grid-cols-6">
            {data.issues.map((issue) => {
              const card = (
                <>
                  <div className="relative aspect-[2/3] overflow-hidden bg-brand-bone shadow-sm ring-1 ring-brand-line/40 transition-all duration-300 group-hover:shadow-lg group-hover:ring-brand-warm">
                    <Image
                      src={issue.image}
                      alt={`Годишњак ${issue.year}`}
                      fill
                      sizes="(min-width: 1024px) 180px, 45vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                    />
                    {!issue.href && (
                      <span className="absolute bottom-2 left-2 right-2 bg-brand-midnight/70 px-2 py-1 text-center text-[10px] uppercase tracking-widerx text-white/80">
                        {noPdfLabel}
                      </span>
                    )}
                  </div>
                  <p className="mt-3 text-center text-sm font-medium text-brand-deep group-hover:text-brand-accent">
                    {issue.year}
                  </p>
                </>
              );
              return (
                <li key={issue.year}>
                  {issue.href ? (
                    <a
                      href={issue.href}
                      target="_blank"
                      rel="noreferrer noopener"
                      className="group block no-underline"
                    >
                      {card}
                    </a>
                  ) : (
                    <div className="group block opacity-80">{card}</div>
                  )}
                </li>
              );
            })}
          </ul>
        </section>
      )}
    </ContentPage>
  );
}

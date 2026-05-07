import Image from 'next/image';
import path from 'node:path';
import fs from 'node:fs/promises';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import ContentPage from '@/components/ContentPage';
import { Link } from '@/i18n/navigation';
import { heroFor } from '@/lib/page-heroes';
import type { Locale } from '@/i18n/config';

type Issue = { year: string; image: string; volume?: number | null };
type EditorialBoard = {
  publisher?: { label: string; name: string };
  editorInChief?: { label: string; name: string };
  sectionEditors?: { name: string; subject: string }[];
  members?: string[];
  journalManager?: { label: string; name: string };
  membersLabel?: string;
  editorsLabel?: string;
};
type BulletinPage = {
  title: string;
  intro?: string;
  body?: string;
  issn?: string;
  issues?: Issue[];
  editorialBoard?: EditorialBoard;
};

async function loadBulletin(locale: Locale): Promise<BulletinPage | null> {
  const file = path.join(process.cwd(), 'content', locale, 'pages', 'bulletin.json');
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
  const data = await loadBulletin(locale);
  const issuesLabel = locale === 'en' ? '01 · All issues' : '01 · Сви бројеви';
  const volumeLabel = locale === 'en' ? 'Volume' : 'Број';
  const boardLabel = locale === 'en' ? '02 · Editorial board' : '02 · Уредништво';

  return (
    <ContentPage
      eyebrow={t('explore')}
      title={data?.title || t('explore_bulletin')}
      intro={data?.intro}
      body={data?.body}
      heroImage={heroFor('bulletin')}
    >
      {data?.issn && (
        <p className="-mt-2 mb-2 text-xs uppercase tracking-widerx text-brand-purple">
          ISSN {data.issn}
        </p>
      )}

      {data?.issues && data.issues.length > 0 && (
        <section className="mt-12">
          <div className="mb-6 grid gap-6 md:grid-cols-12">
            <div className="md:col-span-3">
              <p className="eyebrow text-brand-purple">{issuesLabel}</p>
              <span className="mt-3 inline-block h-3 w-12 bg-brand-lime" />
            </div>
          </div>
          <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:gap-6 lg:grid-cols-6">
            {data.issues.map((issue) => {
              const card = (
                <>
                  <div className="relative aspect-[2/3] overflow-hidden rounded-lg bg-brand-bone shadow-sm ring-1 ring-brand-line/40 transition-all duration-300 group-hover:shadow-xl group-hover:ring-brand-deep">
                    <Image
                      src={issue.image}
                      alt={`Bulletin ${issue.year}`}
                      fill
                      sizes="(min-width: 1024px) 180px, 45vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                    />
                    {issue.volume != null && (
                      <span className="absolute left-2 top-2 rounded-full bg-brand-deep px-2.5 py-1 text-[10px] font-semibold uppercase tracking-widerx text-white">
                        Vol. {issue.volume}
                      </span>
                    )}
                  </div>
                  <p className="mt-3 text-center font-display text-base font-semibold text-brand-deep group-hover:text-brand-purple">
                    {issue.year}
                  </p>
                </>
              );
              return (
                <li key={issue.year}>
                  {issue.volume != null ? (
                    <Link
                      href={`/istrazite/bulletin/${issue.volume}`}
                      className="group block no-underline"
                      aria-label={`${volumeLabel} ${issue.volume} · ${issue.year}`}
                    >
                      {card}
                    </Link>
                  ) : (
                    <div className="group block opacity-90">{card}</div>
                  )}
                </li>
              );
            })}
          </ul>
        </section>
      )}

      {data?.editorialBoard && (
        <section className="mt-20 border-t border-brand-line pt-12">
          <div className="mb-8 grid gap-6 md:grid-cols-12">
            <div className="md:col-span-3">
              <p className="eyebrow text-brand-purple">{boardLabel}</p>
              <span className="mt-3 inline-block h-3 w-12 bg-brand-peach" />
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {data.editorialBoard.publisher && (
              <div className="border-l-2 border-brand-deep pl-5">
                <p className="text-[10px] uppercase tracking-widerx text-brand-purple">
                  {data.editorialBoard.publisher.label}
                </p>
                <p className="mt-2 font-display text-xl text-brand-deep">
                  {data.editorialBoard.publisher.name}
                </p>
              </div>
            )}
            {data.editorialBoard.editorInChief && (
              <div className="border-l-2 border-brand-lime pl-5">
                <p className="text-[10px] uppercase tracking-widerx text-brand-purple">
                  {data.editorialBoard.editorInChief.label}
                </p>
                <p className="mt-2 font-display text-xl text-brand-deep">
                  {data.editorialBoard.editorInChief.name}
                </p>
              </div>
            )}
          </div>

          {data.editorialBoard.sectionEditors && data.editorialBoard.sectionEditors.length > 0 && (
            <div className="mt-10">
              <p className="text-[10px] uppercase tracking-widerx text-brand-purple">
                {data.editorialBoard.editorsLabel}
              </p>
              <ul className="mt-3 space-y-1">
                {data.editorialBoard.sectionEditors.map((e, i) => (
                  <li key={i} className="font-display text-lg text-brand-deep">
                    {e.name}{' '}
                    <span className="text-sm font-normal text-brand-ink/60">
                      · {e.subject}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {data.editorialBoard.members && data.editorialBoard.members.length > 0 && (
            <div className="mt-10">
              <p className="text-[10px] uppercase tracking-widerx text-brand-purple">
                {data.editorialBoard.membersLabel}
              </p>
              <ul className="mt-4 grid gap-x-8 gap-y-2 sm:grid-cols-2 lg:grid-cols-3">
                {data.editorialBoard.members.map((m, i) => (
                  <li
                    key={i}
                    className="border-b border-brand-line/60 py-2 font-display text-base text-brand-deep"
                  >
                    {m}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {data.editorialBoard.journalManager && (
            <div className="mt-10 border-l-2 border-brand-cyan pl-5">
              <p className="text-[10px] uppercase tracking-widerx text-brand-purple">
                {data.editorialBoard.journalManager.label}
              </p>
              <p className="mt-2 font-display text-xl text-brand-deep">
                {data.editorialBoard.journalManager.name}
              </p>
            </div>
          )}
        </section>
      )}
    </ContentPage>
  );
}

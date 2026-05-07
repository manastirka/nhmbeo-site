import path from 'node:path';
import fs from 'node:fs/promises';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import PageHeader from '@/components/PageHeader';
import { heroFor } from '@/lib/page-heroes';
import type { Locale } from '@/i18n/config';

type Member = {
  name: string;
  title: string;
  email?: string;
  lead?: boolean;
};

type Department = {
  name: string;
  members: Member[];
};

type OrgPage = {
  title: string;
  intro?: string;
  director?: { name: string; title: string; email?: string };
  departments?: Department[];
};

async function loadOrg(locale: Locale): Promise<OrgPage | null> {
  const file = path.join(
    process.cwd(),
    'content',
    locale,
    'pages',
    'organizaciona-struktura.json',
  );
  try {
    return JSON.parse(await fs.readFile(file, 'utf8'));
  } catch {
    return null;
  }
}

const ACCENT_BG = ['bg-brand-peach', 'bg-brand-cyan', 'bg-brand-lime', 'bg-brand-paper'];

function MemberCard({ member }: { member: Member }) {
  const card = (
    <div
      className={`group relative flex h-full flex-col justify-between rounded-2xl border border-brand-line bg-white p-6 transition-all hover:border-brand-deep hover:shadow-lg ${
        member.lead ? 'border-brand-deep ring-2 ring-brand-deep/15' : ''
      }`}
    >
      <div>
        {member.lead && (
          <span className="mb-3 inline-block rounded-full bg-brand-lime px-3 py-1 text-[10px] font-semibold uppercase tracking-widerx text-brand-midnight">
            Head
          </span>
        )}
        <h3 className="font-display text-lg leading-tight text-brand-deep group-hover:text-brand-purple">
          {member.name}
        </h3>
        <p className="mt-2 text-sm text-brand-ink/70">{member.title}</p>
      </div>
      {member.email && (
        <a
          href={`mailto:${member.email}`}
          className="mt-5 inline-flex items-center gap-2 text-sm text-brand-deep underline decoration-brand-lime decoration-[3px] underline-offset-[5px] hover:decoration-brand-cyan no-underline"
        >
          <span className="underline decoration-brand-lime decoration-[3px] underline-offset-[5px] group-hover:decoration-brand-cyan">
            {member.email}
          </span>
        </a>
      )}
    </div>
  );
  return card;
}

export default async function Page({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('nav');
  const data = await loadOrg(locale);
  const directorLabel = locale === 'en' ? 'Director' : 'Директор';

  return (
    <>
      <PageHeader
        eyebrow={t('about')}
        title={data?.title || t('about_org')}
        intro={data?.intro}
        image={heroFor('organizaciona-struktura')}
      />

      {data?.director && (
        <section className="bg-brand-peach">
          <div className="container-wide grid gap-8 py-16 md:grid-cols-12">
            <div className="md:col-span-4">
              <p className="eyebrow text-brand-midnight">{directorLabel}</p>
            </div>
            <div className="md:col-span-8">
              <h2 className="font-display text-4xl leading-[1.05] text-brand-midnight md:text-6xl">
                {data.director.name}
              </h2>
              <p className="mt-4 text-lg text-brand-midnight/80">
                {data.director.title}
              </p>
              {data.director.email && (
                <a
                  href={`mailto:${data.director.email}`}
                  className="mt-6 inline-flex items-center gap-2 rounded-full bg-brand-midnight px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-brand-deep no-underline"
                >
                  {data.director.email}
                  <span aria-hidden="true">→</span>
                </a>
              )}
            </div>
          </div>
        </section>
      )}

      {data?.departments && data.departments.length > 0 && (
        <div>
          {data.departments.map((dept, i) => (
            <section
              key={dept.name}
              className={i % 2 === 0 ? 'bg-brand-paper' : 'bg-white'}
            >
              <div className="container-wide py-16 md:py-20">
                <div className="mb-10 grid gap-6 md:grid-cols-12">
                  <div className="md:col-span-3">
                    <p className="eyebrow text-brand-purple">
                      {String(i + 1).padStart(2, '0')} ·{' '}
                      {locale === 'en' ? 'Department' : 'Одељење'}
                    </p>
                    <span
                      className={`mt-3 inline-block h-3 w-12 ${
                        ACCENT_BG[i % ACCENT_BG.length]
                      }`}
                    />
                  </div>
                  <h2 className="md:col-span-9 font-display text-3xl leading-[1.05] text-brand-deep md:text-5xl">
                    {dept.name}
                  </h2>
                </div>
                <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {dept.members.map((m, j) => (
                    <li key={j}>
                      <MemberCard member={m} />
                    </li>
                  ))}
                </ul>
              </div>
            </section>
          ))}
        </div>
      )}
    </>
  );
}

import { setRequestLocale, getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import PageHeader from '@/components/PageHeader';
import { loadDocumentList } from '@/lib/content';
import type { Locale } from '@/i18n/config';

const CATEGORIES = [
  { key: 'about_regulations', slug: 'normativna-akta',     href: '/o-muzeju/normativna-akta' },
  { key: 'about_plans',       slug: 'planovi-i-izvestaji', href: '/o-muzeju/planovi-i-izvestaji' },
  { key: 'about_procurement', slug: 'javne-nabavke',       href: '/o-muzeju/javne-nabavke' },
  { key: 'about_calls',       slug: 'javni-poziv',         href: '/o-muzeju/javni-poziv' },
] as const;

export default async function DocumentsHub({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const tNav = await getTranslations('nav');

  const cards = await Promise.all(
    CATEGORIES.map(async (c) => {
      const data = await loadDocumentList(locale, c.slug);
      return {
        ...c,
        title: data?.title || tNav(c.key),
        intro: data?.intro,
        count: data?.documents?.length ?? 0,
      };
    }),
  );

  const intro =
    locale === 'en'
      ? 'Public-facing institutional documents of the Natural History Museum: regulations, plans, public procurement and asset-sale notices.'
      : 'Јавни институционални документи Природњачког музеја: нормативна акта, планови и извештаји, јавне набавке и јавни позиви.';
  const docsLabel =
    locale === 'en' ? 'documents' : 'докумената';
  const sectionLabel =
    locale === 'en' ? 'Categories' : 'Категорије';

  return (
    <>
      <PageHeader
        eyebrow={tNav('about')}
        title={tNav('about_documents')}
        intro={intro}
      />

      <section className="bg-white">
        <div className="container-wide py-16 md:py-24">
          <div className="mb-10 grid gap-6 md:grid-cols-12">
            <div className="md:col-span-3">
              <p className="eyebrow text-brand-purple">01 · {sectionLabel}</p>
              <span className="mt-3 inline-block h-3 w-12 bg-brand-deep" />
            </div>
          </div>

          <ul className="grid gap-px bg-brand-line border border-brand-line md:grid-cols-2">
            {cards.map((c) => (
              <li key={c.slug} className="bg-white">
                <Link
                  href={c.href}
                  className="group flex h-full flex-col justify-between p-8 no-underline transition-colors hover:bg-brand-paper md:p-10"
                >
                  <div>
                    <p className="text-[10px] uppercase tracking-widerx text-brand-purple">
                      {locale === 'en' ? 'Section' : 'Категорија'}
                    </p>
                    <h2 className="mt-3 font-display text-2xl leading-tight text-brand-deep group-hover:text-brand-purple md:text-3xl">
                      {c.title}
                    </h2>
                    {c.intro && (
                      <p className="mt-4 max-w-prose text-sm text-brand-ink/70">
                        {c.intro.length > 220 ? c.intro.slice(0, 217) + '…' : c.intro}
                      </p>
                    )}
                  </div>
                  <div className="mt-8 flex items-end justify-between border-t border-brand-line pt-4">
                    <span className="font-display text-3xl font-semibold tabular-nums text-brand-deep md:text-4xl">
                      {c.count}
                      <span className="ml-2 text-xs font-medium uppercase tracking-widerx text-brand-purple">
                        {docsLabel}
                      </span>
                    </span>
                    <span
                      aria-hidden="true"
                      className="text-brand-purple transition-transform group-hover:translate-x-1"
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
    </>
  );
}

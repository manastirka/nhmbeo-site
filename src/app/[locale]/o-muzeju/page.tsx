import { setRequestLocale, getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import PageHeader from '@/components/PageHeader';
import { nav } from '@/lib/nav';
import { heroFor } from '@/lib/page-heroes';
import type { Locale } from '@/i18n/config';

export default async function AboutSection({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('nav');

  const section = nav.find((n) => n.key === 'about');
  const items = section?.children ?? [];

  return (
    <>
      <PageHeader title={t('about')} image={heroFor('about-section')} />
      <section className="container-page py-12">
        <ul className="grid gap-4 sm:grid-cols-2">
          {items.map((it) => (
            <li key={it.key}>
              <Link
                href={it.href}
                className="block border border-brand-line bg-white p-6 transition-colors hover:border-brand-accent no-underline"
              >
                <h3 className="font-serif text-xl text-brand-deep">{t(it.key)}</h3>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}

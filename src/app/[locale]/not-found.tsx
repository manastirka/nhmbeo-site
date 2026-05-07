import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';

export default async function NotFound() {
  // setRequestLocale isn't reliable on not-found; use defaults.
  const t = await getTranslations('nav').catch(() => null);
  return (
    <section className="container-page py-24 text-center">
      <p className="text-sm uppercase tracking-widest text-brand-accent">404</p>
      <h1 className="mt-2 font-serif text-4xl text-brand-deep">
        Страница није пронађена / Page not found
      </h1>
      <p className="mt-4 text-brand-ink/70">
        Тражена страница не постоји или је премештена.
      </p>
      <Link
        href="/"
        className="mt-6 inline-block rounded bg-brand-warm px-5 py-3 text-sm font-medium text-brand-ink hover:opacity-90 no-underline"
      >
        {t?.('home') ?? 'Home'}
      </Link>
    </section>
  );
}

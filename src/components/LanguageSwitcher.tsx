'use client';

import { useLocale } from 'next-intl';
import { usePathname, Link } from '@/i18n/navigation';
import { locales, localeShort, type Locale } from '@/i18n/config';

export default function LanguageSwitcher() {
  const pathname = usePathname();
  const current = useLocale() as Locale;

  return (
    <div className="flex items-center rounded-full border border-brand-line bg-brand-paper p-0.5 text-[11px] font-semibold uppercase tracking-widerx">
      {locales.map((loc) => (
        <Link
          key={loc}
          href={pathname}
          locale={loc}
          hrefLang={loc}
          aria-current={loc === current ? 'true' : undefined}
          className={
            loc === current
              ? 'rounded-full bg-brand-deep px-2.5 py-1 text-white no-underline'
              : 'rounded-full px-2.5 py-1 text-brand-ink/60 no-underline hover:text-brand-deep'
          }
        >
          {localeShort[loc]}
        </Link>
      ))}
    </div>
  );
}

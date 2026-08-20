'use client';

import { useLocale } from 'next-intl';
import { usePathname, Link } from '@/i18n/navigation';
import { locales, localeShort, type Locale } from '@/i18n/config';

export default function LanguageSwitcher() {
  const pathname = usePathname();
  const current = useLocale() as Locale;

  return (
    <div className="flex items-center gap-1 text-sm">
      {locales.map((loc, i) => (
        <span key={loc} className="flex items-center">
          {i > 0 && <span className="px-1 text-brand-line">|</span>}
          <Link
            href={pathname}
            locale={loc}
            hrefLang={loc}
            aria-current={loc === current ? 'true' : undefined}
            className={
              loc === current
                ? 'font-semibold text-brand-deep no-underline'
                : 'text-brand-ink/70 no-underline hover:text-brand-deep'
            }
          >
            {localeShort[loc]}
          </Link>
        </span>
      ))}
    </div>
  );
}

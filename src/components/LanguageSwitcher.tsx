'use client';

import { useLocale } from 'next-intl';
import { usePathname, useRouter } from '@/i18n/navigation';
import { useParams } from 'next/navigation';
import { locales, localeShort, type Locale } from '@/i18n/config';

export default function LanguageSwitcher() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();
  const current = useLocale() as Locale;

  const switchTo = (next: Locale) => {
    if (next === current) return;
    router.replace(
      // @ts-expect-error -- pathname here is a relative locale-aware string
      { pathname, params },
      { locale: next },
    );
  };

  return (
    <div className="flex items-center gap-1 text-sm">
      {locales.map((loc, i) => (
        <span key={loc} className="flex items-center">
          {i > 0 && <span className="px-1 text-brand-line">|</span>}
          <button
            type="button"
            onClick={() => switchTo(loc)}
            aria-pressed={loc === current}
            className={
              loc === current
                ? 'font-semibold text-brand-deep'
                : 'text-brand-ink/70 hover:text-brand-deep'
            }
          >
            {localeShort[loc]}
          </button>
        </span>
      ))}
    </div>
  );
}

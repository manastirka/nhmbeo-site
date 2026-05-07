import { defineRouting } from 'next-intl/routing';
import { locales, defaultLocale } from './config';

export const routing = defineRouting({
  locales: [...locales],
  defaultLocale,
  localePrefix: 'always',
});

export function isLocale(value: string | undefined): value is (typeof locales)[number] {
  return value !== undefined && (locales as readonly string[]).includes(value);
}

export const locales = ['sr-Cyrl', 'en'] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = 'sr-Cyrl';

export const localeLabels: Record<Locale, string> = {
  'sr-Cyrl': 'Ћирилица',
  en: 'English',
};

export const localeShort: Record<Locale, string> = {
  'sr-Cyrl': 'Ћир',
  en: 'EN',
};

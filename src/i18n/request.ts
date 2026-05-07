import { getRequestConfig } from 'next-intl/server';
import { locales, defaultLocale, type Locale } from './config';

async function loadMessages(locale: Locale) {
  if (locale === 'en') {
    return (await import('../../content/en/ui.json')).default;
  }
  return (await import('../../content/sr-Cyrl/ui.json')).default;
}

export default getRequestConfig(async ({ requestLocale }) => {
  const requested = await requestLocale;
  const locale: Locale =
    requested && (locales as readonly string[]).includes(requested)
      ? (requested as Locale)
      : defaultLocale;

  return {
    locale,
    messages: await loadMessages(locale),
  };
});

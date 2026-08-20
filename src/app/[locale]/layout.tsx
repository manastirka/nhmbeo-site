import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Inter, Bricolage_Grotesque } from 'next/font/google';
import { NextIntlClientProvider } from 'next-intl';
import { setRequestLocale, getMessages, getTranslations } from 'next-intl/server';
import { routing, isLocale } from '@/i18n/routing';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Analytics from '@/components/Analytics';
import { DEFAULT_DESCRIPTION, SITE_NAME } from '@/lib/seo';
import type { Locale } from '@/i18n/config';
import '../globals.css';

// Google Search Console site verification.
// Set NEXT_PUBLIC_GOOGLE_VERIFICATION in .env.local (or your deploy env)
// to the token shown in Search Console → "HTML tag" verification method.
// Next.js renders <meta name="google-site-verification" content="…"> in <head>.
const GOOGLE_VERIFICATION = process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const loc: Locale = isLocale(locale) ? locale : 'sr-Cyrl';
  return {
    title: {
      default: SITE_NAME[loc],
      template: `%s — ${SITE_NAME[loc]}`,
    },
    description: DEFAULT_DESCRIPTION[loc],
    ...(GOOGLE_VERIFICATION ? { verification: { google: GOOGLE_VERIFICATION } } : {}),
  };
}

const sans = Inter({
  subsets: ['latin', 'cyrillic'],
  display: 'swap',
  variable: '--font-sans',
});

const display = Bricolage_Grotesque({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-display',
  weight: ['400', '500', '600', '700', '800'],
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

const HTML_LANG: Record<string, string> = {
  'sr-Cyrl': 'sr-Cyrl',
  en: 'en',
};

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) {
    notFound();
  }
  setRequestLocale(locale);
  const messages = await getMessages();
  const t = await getTranslations('site');

  return (
    <html lang={HTML_LANG[locale] ?? 'sr-Cyrl'} className={`${sans.variable} ${display.variable}`}>
      <body className="bg-brand-paper text-brand-ink font-sans antialiased">
        <NextIntlClientProvider messages={messages} locale={locale}>
          <div className="flex min-h-screen flex-col">
            <a
              href="#main"
              className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:bg-brand-lime focus:px-4 focus:py-2 focus:text-brand-midnight"
            >
              {t('skip')}
            </a>
            <Header />
            <main id="main" className="flex-1">
              {children}
            </main>
            <Footer />
          </div>
        </NextIntlClientProvider>
        <Analytics />
      </body>
    </html>
  );
}

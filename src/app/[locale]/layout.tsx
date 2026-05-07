import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Inter, Bricolage_Grotesque } from 'next/font/google';
import { NextIntlClientProvider } from 'next-intl';
import { setRequestLocale, getMessages } from 'next-intl/server';
import { routing, isLocale } from '@/i18n/routing';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Analytics from '@/components/Analytics';
import '../globals.css';

// Google Search Console site verification.
// Set NEXT_PUBLIC_GOOGLE_VERIFICATION in .env.local (or your deploy env)
// to the token shown in Search Console → "HTML tag" verification method.
// Next.js renders <meta name="google-site-verification" content="…"> in <head>.
const GOOGLE_VERIFICATION = process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION;

export const metadata: Metadata = GOOGLE_VERIFICATION
  ? { verification: { google: GOOGLE_VERIFICATION } }
  : {};

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

  return (
    <html lang={HTML_LANG[locale] ?? 'sr-Cyrl'} className={`${sans.variable} ${display.variable}`}>
      <body className="bg-brand-paper text-brand-ink font-sans antialiased">
        <NextIntlClientProvider messages={messages} locale={locale}>
          <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </NextIntlClientProvider>
        <Analytics />
      </body>
    </html>
  );
}

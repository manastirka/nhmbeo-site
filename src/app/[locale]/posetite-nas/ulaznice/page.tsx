import { setRequestLocale, getTranslations } from 'next-intl/server';
import path from 'node:path';
import fs from 'node:fs/promises';
import ContentPage from '@/components/ContentPage';
import { heroFor } from '@/lib/page-heroes';
import type { Locale } from '@/i18n/config';

type Tickets = {
  title: string;
  intro?: string;
  body?: string;
  tickets?: { label: string; price: string }[];
};

async function loadTickets(locale: Locale): Promise<Tickets | null> {
  const file = path.join(process.cwd(), 'content', locale, 'pages', 'ulaznice.json');
  try {
    return JSON.parse(await fs.readFile(file, 'utf8'));
  } catch {
    return null;
  }
}

export default async function Page({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('nav');
  const data = await loadTickets(locale);

  return (
    <ContentPage
      eyebrow={t('visit')}
      title={data?.title || t('visit_tickets')}
      intro={data?.intro}
      body={data?.body}
      heroImage={heroFor('ulaznice')}
    >
      {data?.tickets && data.tickets.length > 0 && (
        <table className="mt-8 w-full border-collapse text-sm">
          <tbody>
            {data.tickets.map((row, i) => (
              <tr key={i} className="border-b border-brand-line">
                <td className="py-3 pr-4 font-medium text-brand-ink">{row.label}</td>
                <td className="py-3 text-right text-brand-deep">{row.price}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </ContentPage>
  );
}

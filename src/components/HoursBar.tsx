import { Link } from '@/i18n/navigation';
import { getTranslations } from 'next-intl/server';
import { galleryHours } from '@/lib/hours';

export default async function HoursBar() {
  const t = await getTranslations('hours');
  const status = galleryHours();

  let label: string;
  if (status.closedToday) {
    label = t('closedToday');
  } else if (status.openNow) {
    label = t('openNow', { range: status.range });
  } else {
    label = t('opens', { range: status.range });
  }

  return (
    <div className="border-b border-white/10 bg-brand-deep text-white">
      <div className="container-wide flex flex-wrap items-center justify-between gap-x-4 gap-y-1 py-1.5 text-[11px] uppercase tracking-widerx">
        <p className="text-white/85">
          <span className="text-brand-lime">{t('gallery')}</span>
          <span className="mx-2 text-white/30" aria-hidden="true">
            ·
          </span>
          {label}
          {status.freeMorning && (
            <>
              <span className="mx-2 text-white/30" aria-hidden="true">
                ·
              </span>
              {t('freeThursday')}
            </>
          )}
        </p>
        <Link
          href="/posetite-nas/ulaznice"
          className="font-semibold text-brand-lime hover:text-white no-underline"
        >
          {t('tickets')}
        </Link>
      </div>
    </div>
  );
}

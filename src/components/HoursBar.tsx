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
    <div className="bg-brand-midnight text-white">
      <div className="container-wide flex items-center justify-between gap-3 py-1.5 text-[10px] uppercase tracking-widerx sm:text-[11px]">
        <p className="min-w-0 truncate text-white/80">
          <span className="text-brand-lime">{t('gallery')}</span>
          <span className="mx-2 text-white/25" aria-hidden="true">
            ·
          </span>
          <span>{label}</span>
          {status.freeMorning && (
            <span className="ml-2 hidden text-brand-peach sm:inline">
              · {t('freeThursday')}
            </span>
          )}
        </p>
        <Link
          href="/posetite-nas/ulaznice"
          className="shrink-0 font-semibold text-brand-lime no-underline hover:text-white"
        >
          {t('tickets')}
        </Link>
      </div>
    </div>
  );
}

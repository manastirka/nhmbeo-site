import Image from 'next/image';
import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import NavMenu from './NavMenu';
import MobileMenu from './MobileMenu';
import LanguageSwitcher from './LanguageSwitcher';
import HoursBar from './HoursBar';

const LOGO_URL = '/uploads/wp-content-uploads-2021-04-ezgif.com-gif-maker.gif';

export default async function Header() {
  const t = await getTranslations('site');
  const tNav = await getTranslations('nav');

  return (
    <header className="sticky top-0 z-40 border-b border-brand-line/60 bg-white/95 backdrop-blur-md">
      <HoursBar />
      <div className="container-wide flex items-center justify-between gap-3 py-3">
        <Link
          href="/"
          aria-label={t('longName')}
          className="flex shrink-0 items-center gap-3 no-underline"
        >
          <Image
            src={LOGO_URL}
            alt=""
            width={708}
            height={416}
            unoptimized
            priority
            className="h-[52px] w-auto md:h-14"
            style={{
              filter: 'contrast(1.25) saturate(1.2) brightness(0.7)',
            }}
          />
          <span className="hidden items-baseline gap-3 leading-none sm:flex">
            <span className="font-display text-sm font-bold text-brand-deep tracking-tight whitespace-nowrap">
              {t('shortName')}
            </span>
            <span className="hidden h-3 w-px bg-brand-line xl:inline-block" />
            <span className="hidden text-[10px] uppercase tracking-widerx text-brand-purple whitespace-nowrap xl:inline">
              {t('tagline')}
            </span>
          </span>
        </Link>
        <div className="flex shrink-0 items-center gap-2 md:gap-3">
          <NavMenu />
          <Link
            href="/posetite-nas/ulaznice"
            className="hidden items-center gap-2 rounded-full bg-brand-lime px-4 py-2 text-xs font-semibold uppercase tracking-widerx text-brand-midnight transition-colors hover:bg-brand-cyan md:inline-flex no-underline whitespace-nowrap"
          >
            {tNav('tickets_short')}
          </Link>
          <LanguageSwitcher />
          <MobileMenu />
        </div>
      </div>
    </header>
  );
}

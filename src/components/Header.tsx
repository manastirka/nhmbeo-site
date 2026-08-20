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
    <header className="sticky top-0 z-40 border-b border-brand-line/70 bg-white/90 backdrop-blur-md">
      <HoursBar />
      <div className="container-wide flex items-center justify-between gap-3 py-2.5">
        <Link
          href="/"
          aria-label={t('longName')}
          className="flex min-w-0 shrink items-center gap-3 no-underline"
        >
          <Image
            src={LOGO_URL}
            alt=""
            width={708}
            height={416}
            unoptimized
            priority
            className="h-11 w-auto md:h-12"
          />
          <span className="hidden min-w-0 flex-col leading-none sm:flex">
            <span className="font-display text-[13px] font-bold tracking-tight text-brand-deep md:text-sm">
              {t('shortName')}
            </span>
            <span className="mt-1 hidden text-[10px] uppercase tracking-widerx text-brand-purple xl:inline">
              {t('tagline')}
            </span>
          </span>
        </Link>
        <div className="flex shrink-0 items-center gap-1.5 md:gap-2.5">
          <NavMenu />
          <Link
            href="/posetite-nas/ulaznice"
            className="hidden items-center rounded-full bg-brand-lime px-4 py-2 text-[11px] font-semibold uppercase tracking-widerx text-brand-midnight no-underline transition-colors hover:bg-brand-cyan md:inline-flex"
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

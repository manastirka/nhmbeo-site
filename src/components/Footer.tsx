import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import NewsletterSignup from './NewsletterSignup';
import { socialLinks, nav } from '@/lib/nav';

export default async function Footer() {
  const t = await getTranslations('footer');
  const tNav = await getTranslations('nav');
  const tSite = await getTranslations('site');
  const year = new Date().getFullYear();

  return (
    <footer className="bg-brand-midnight text-white">
      <div className="h-[3px] bg-brand-lime" />
      <div className="border-b border-white/10">
        <div className="container-wide grid gap-12 py-16 md:grid-cols-2 md:py-20 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <p className="eyebrow mb-4 text-brand-lime">{tSite('tagline')}</p>
            <h2 className="font-display text-3xl font-extrabold tracking-tight text-white md:text-4xl">
              {tSite('longName')}
            </h2>
            <div className="mt-8">
              <NewsletterSignup />
            </div>
          </div>

          <div className="lg:col-span-3">
            <p className="eyebrow mb-4 text-brand-lime">{t('main_title')}</p>
            <address className="not-italic text-sm leading-relaxed text-white/70">
              {t('main_address')}
              <br />
              <a href={`tel:${t('main_phoneRaw')}`} className="text-white hover:text-brand-lime">
                {t('main_phone')}
              </a>
              <br />
              <a href={`mailto:${t('main_email')}`} className="text-white hover:text-brand-lime">
                {t('main_email')}
              </a>
            </address>
          </div>

          <div className="lg:col-span-3">
            <p className="eyebrow mb-4 text-brand-lime">{t('gallery_title')}</p>
            <address className="not-italic text-sm leading-relaxed text-white/70">
              {t('gallery_address')}
              <br />
              <a href={`tel:${t('gallery_phoneRaw')}`} className="text-white hover:text-brand-lime">
                {t('gallery_phone')}
              </a>
              <br />
              <a href={`mailto:${t('gallery_email')}`} className="text-white hover:text-brand-lime">
                {t('gallery_email')}
              </a>
            </address>
          </div>

          <nav className="lg:col-span-2">
            <p className="eyebrow mb-4 text-brand-lime">{tNav('home')}</p>
            <ul className="space-y-2 text-sm">
              {nav.slice(1).map((item) => (
                <li key={item.key}>
                  <Link
                    href={item.href}
                    className="text-white/75 hover:text-brand-lime"
                  >
                    {tNav(item.key)}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>

      <div className="container-wide flex flex-col gap-6 py-6 md:flex-row md:items-center md:justify-between">
        <ul className="flex flex-wrap gap-2">
          {socialLinks.map((s) => (
            <li key={s.key}>
              <a
                href={s.href}
                target="_blank"
                rel="noreferrer noopener"
                className="inline-flex rounded-full border border-white/15 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-widerx text-white/70 no-underline hover:border-brand-lime hover:text-brand-lime"
              >
                {s.label}
              </a>
            </li>
          ))}
        </ul>
        <div className="flex flex-col gap-1 text-xs text-white/45 md:items-end">
          <p>© {year} {tSite('longName')}</p>
          <Link href="/kontakt" className="text-white/70 hover:text-brand-lime">
            {t('contactLink')}
          </Link>
        </div>
      </div>
    </footer>
  );
}

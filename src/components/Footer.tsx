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
    <footer className="bg-brand-deep text-white">
      <div className="border-b border-white/10">
        <div className="container-wide grid gap-12 py-20 md:grid-cols-2 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <p className="eyebrow mb-4 text-brand-lime">{tSite('tagline')}</p>
            <h2 className="font-display text-3xl text-white md:text-4xl">
              {tSite('longName')}
            </h2>
            <div className="mt-8">
              <NewsletterSignup />
            </div>
          </div>

          <div className="lg:col-span-3">
            <p className="eyebrow mb-4 text-brand-lime">{t('main_title')}</p>
            <address className="not-italic text-sm leading-relaxed text-white/75">
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
            <address className="not-italic text-sm leading-relaxed text-white/75">
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
                    className="text-white/80 hover:text-brand-lime"
                  >
                    {tNav(item.key)}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>

      <div className="border-b border-white/10">
        <div className="container-wide flex flex-col items-start justify-between gap-4 py-6 sm:flex-row sm:items-center">
          <ul className="flex flex-wrap gap-4 text-xs uppercase tracking-widerx text-white/60">
            {socialLinks.map((s) => (
              <li key={s.key}>
                <a
                  href={s.href}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="text-white/70 hover:text-brand-lime"
                >
                  {s.key}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="container-wide flex flex-col gap-2 py-6 text-xs text-white/50 md:flex-row md:items-center md:justify-between">
        <p>© {year} {tSite('longName')}</p>
        <Link href="/kontakt" className="text-white/70 hover:text-brand-lime">
          {t('contactLink')}
        </Link>
      </div>
    </footer>
  );
}

import Image from 'next/image';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import PageHeader from '@/components/PageHeader';
import { socialLinks } from '@/lib/nav';
import { loadPage } from '@/lib/content';
import { generatePageMetadata } from '@/lib/page-helpers';
import type { Locale } from '@/i18n/config';
import type { Metadata } from 'next';

const MAP_MAIN =
  'https://www.google.com/maps?q=Njego%C5%A1eva+51,+Belgrade&output=embed';
const MAP_GALLERY =
  'https://www.google.com/maps?q=Mali+Kalemegdan+5,+Belgrade&output=embed';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  return generatePageMetadata({
    params,
    slug: 'kontakt',
    pathname: '/kontakt',
    fallbackTitle: 'Контакт',
  });
}

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations('contact');
  const tNav = await getTranslations('nav');
  const tFooter = await getTranslations('footer');
  const data = await loadPage(locale, 'kontakt');
  const [mainPhoto, galleryPhoto] = data?.images ?? [];

  return (
    <>
      <PageHeader title={tNav('contact')} />
      <section className="container-wide py-16 grid gap-12 md:grid-cols-2">
        <article>
          {mainPhoto && (
            <div className="relative mb-6 aspect-[4/3] overflow-hidden bg-brand-bone">
              <Image
                src={mainPhoto}
                alt={tFooter('main_title')}
                fill
                sizes="(min-width: 768px) 50vw, 100vw"
                className="object-cover"
              />
            </div>
          )}
          <p className="eyebrow mb-3">{t('main')}</p>
          <h2 className="font-serif text-2xl text-brand-deep md:text-3xl">
            {tFooter('main_title')}
          </h2>
          <dl className="mt-5 space-y-3 text-sm">
            <div>
              <dt className="text-xs uppercase tracking-widerx text-brand-ink/55">
                {t('addressLabel')}
              </dt>
              <dd className="mt-1">{tFooter('main_address')}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-widerx text-brand-ink/55">
                {t('phoneLabel')}
              </dt>
              <dd className="mt-1">
                <a href={`tel:${tFooter('main_phoneRaw')}`}>
                  {tFooter('main_phone')}
                </a>
              </dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-widerx text-brand-ink/55">
                {t('emailLabel')}
              </dt>
              <dd className="mt-1">
                <a href={`mailto:${tFooter('main_email')}`}>
                  {tFooter('main_email')}
                </a>
              </dd>
            </div>
          </dl>
          <div className="mt-6 aspect-[4/3] w-full overflow-hidden border border-brand-line">
            <iframe
              src={MAP_MAIN}
              className="h-full w-full"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title={tFooter('main_title')}
            />
          </div>
        </article>

        <article>
          {galleryPhoto && (
            <div className="relative mb-6 aspect-[4/3] overflow-hidden bg-brand-bone">
              <Image
                src={galleryPhoto}
                alt={tFooter('gallery_title')}
                fill
                sizes="(min-width: 768px) 50vw, 100vw"
                className="object-cover"
              />
            </div>
          )}
          <p className="eyebrow mb-3">{t('gallery')}</p>
          <h2 className="font-serif text-2xl text-brand-deep md:text-3xl">
            {tFooter('gallery_title')}
          </h2>
          <dl className="mt-5 space-y-3 text-sm">
            <div>
              <dt className="text-xs uppercase tracking-widerx text-brand-ink/55">
                {t('addressLabel')}
              </dt>
              <dd className="mt-1">{tFooter('gallery_address')}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-widerx text-brand-ink/55">
                {t('phoneLabel')}
              </dt>
              <dd className="mt-1">
                <a href={`tel:${tFooter('gallery_phoneRaw')}`}>
                  {tFooter('gallery_phone')}
                </a>
              </dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-widerx text-brand-ink/55">
                {t('emailLabel')}
              </dt>
              <dd className="mt-1">
                <a href={`mailto:${tFooter('gallery_email')}`}>
                  {tFooter('gallery_email')}
                </a>
              </dd>
            </div>
          </dl>
          <div className="mt-6 aspect-[4/3] w-full overflow-hidden border border-brand-line">
            <iframe
              src={MAP_GALLERY}
              className="h-full w-full"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title={tFooter('gallery_title')}
            />
          </div>
        </article>
      </section>

      <section className="container-wide pb-20">
        <p className="eyebrow mb-3">{t('social')}</p>
        <ul className="flex flex-wrap gap-3">
          {socialLinks.map((s) => (
            <li key={s.key}>
              <a
                href={s.href}
                target="_blank"
                rel="noreferrer noopener"
                className="inline-flex rounded-full border border-brand-line px-4 py-2 text-sm font-medium text-brand-deep no-underline hover:border-brand-deep hover:bg-brand-paper"
              >
                {s.label}
              </a>
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}

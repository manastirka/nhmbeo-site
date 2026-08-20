import { notFound } from 'next/navigation';
import Image from 'next/image';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { getCatalogProduct, listCatalogProducts } from '@/lib/products';
import { routing } from '@/i18n/routing';
import { catalogProductMetadata } from '@/lib/seo';
import MarkdownBody from '@/components/MarkdownBody';
import type { Locale } from '@/i18n/config';
import type { Metadata } from 'next';

export async function generateStaticParams() {
  const params: { locale: string; slug: string }[] = [];
  for (const locale of routing.locales) {
    const products = await listCatalogProducts(locale);
    for (const p of products) {
      params.push({ locale, slug: p.slug });
    }
  }
  return params;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  return catalogProductMetadata(locale, slug);
}

function isKeywordFact(label: string): boolean {
  return /кључне речи|keywords/i.test(label);
}

export default async function CatalogProductPage({
  params,
}: {
  params: Promise<{ locale: Locale; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);
  const product = await getCatalogProduct(locale, slug);
  if (!product) notFound();

  const t = await getTranslations('shop');
  const tNav = await getTranslations('nav');
  const tFooter = await getTranslations('footer');

  const facts = (product.facts ?? []).filter(
    (f) => f.value && !isKeywordFact(f.label),
  );
  const keywords = (product.facts ?? []).find((f) => isKeywordFact(f.label))?.value;
  const price = product.price?.trim() || t('priceOnRequest');

  return (
    <article>
      <section className="border-b border-brand-line bg-brand-paper">
        <div className="container-wide grid gap-10 py-12 md:grid-cols-12 md:py-16">
          <div className="md:col-span-4">
            <div className="relative aspect-square overflow-hidden bg-white ring-1 ring-brand-line">
              {product.image ? (
                <Image
                  src={product.image}
                  alt={product.title}
                  fill
                  priority
                  sizes="(min-width: 768px) 360px, 90vw"
                  className="object-contain p-4"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-sm text-brand-ink/40">
                  {t('noImage')}
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col justify-center md:col-span-8">
            <Link
              href="/posetite-nas/prodavnica"
              className="text-xs uppercase tracking-widerx text-brand-warmDeep hover:text-brand-deep"
            >
              ← {tNav('visit_shop')}
            </Link>
            {product.kind && <p className="eyebrow mt-4">{product.kind}</p>}
            <h1 className="mt-2 max-w-3xl font-display text-3xl font-extrabold leading-[1.08] tracking-tight text-brand-deep md:text-5xl">
              {product.title}
            </h1>
            <span className="mt-5 block h-[3px] w-14 bg-brand-lime" />
            <p className="mt-5 font-display text-2xl font-bold text-brand-deep">{price}</p>

            {facts.length > 0 && (
              <dl className="mt-8 divide-y divide-brand-line border-t border-b border-brand-line text-sm">
                {facts.map((fact) => (
                  <div
                    key={`${fact.label}-${fact.value}`}
                    className="grid grid-cols-1 gap-1 py-3 sm:grid-cols-12 sm:gap-4"
                  >
                    <dt className="font-semibold text-brand-ink/55 sm:col-span-4">
                      {fact.label}
                    </dt>
                    <dd className="text-brand-ink sm:col-span-8">{fact.value}</dd>
                  </div>
                ))}
              </dl>
            )}

            <div className="mt-8 rounded-sm bg-white p-5 ring-1 ring-brand-line">
              <p className="text-sm leading-relaxed text-brand-ink/80">{t('buyNote')}</p>
              <p className="mt-3 text-sm text-brand-ink">
                <a href={`mailto:${tFooter('gallery_email')}`}>{tFooter('gallery_email')}</a>
                {' · '}
                <a href={`tel:${tFooter('gallery_phoneRaw')}`}>{tFooter('gallery_phone')}</a>
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="container-wide py-12 md:py-16">
        <div className="max-w-3xl">
          {product.body && <MarkdownBody source={product.body} />}
          {keywords && (
            <p className="mt-10 text-sm text-brand-ink/55">
              <span className="font-semibold text-brand-ink/70">{t('keywords')}: </span>
              {keywords}
            </p>
          )}
          <div className="mt-12">
            <Link href="/posetite-nas/prodavnica" className="btn-outline no-underline">
              ← {t('back')}
            </Link>
          </div>
        </div>
      </section>
    </article>
  );
}

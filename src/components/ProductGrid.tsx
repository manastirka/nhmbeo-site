'use client';

import { useMemo, useState } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import type { Product } from '@/lib/content';

type SortKey = 'default' | 'priceAsc' | 'priceDesc' | 'name';

function priceValue(p: string): number {
  const m = p.replace(/[^0-9]/g, '');
  return m ? parseInt(m, 10) : 0;
}

export default function ProductGrid({ products }: { products: Product[] }) {
  const t = useTranslations('shop');
  const [sort, setSort] = useState<SortKey>('default');

  const sorted = useMemo(() => {
    const arr = [...products];
    switch (sort) {
      case 'priceAsc':
        return arr.sort((a, b) => priceValue(a.price) - priceValue(b.price));
      case 'priceDesc':
        return arr.sort((a, b) => priceValue(b.price) - priceValue(a.price));
      case 'name':
        return arr.sort((a, b) => a.title.localeCompare(b.title));
      default:
        return arr;
    }
  }, [products, sort]);

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <p className="text-sm text-brand-ink/60">
          {t('count', { count: products.length })}
        </p>
        <label className="flex items-center gap-2 text-sm">
          {t('sortBy')}:
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortKey)}
            className="rounded border border-brand-line bg-white px-2 py-1 text-sm"
          >
            <option value="default">{t('sort_default')}</option>
            <option value="name">{t('sort_name')}</option>
            <option value="priceAsc">{t('sort_priceAsc')}</option>
            <option value="priceDesc">{t('sort_priceDesc')}</option>
          </select>
        </label>
      </div>

      <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {sorted.map((product) => (
          <li key={product.slug || product.href} className="group">
            <Link href={product.href} className="block no-underline">
              <div className="relative aspect-square overflow-hidden bg-brand-paper ring-1 ring-brand-line">
                {product.image ? (
                  <Image
                    src={product.image}
                    alt={product.title}
                    fill
                    sizes="(min-width: 1024px) 280px, 50vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-brand-ink/40 text-xs">
                    {t('noImage')}
                  </div>
                )}
              </div>
              <h3 className="mt-3 font-display text-base font-bold leading-snug tracking-tight text-brand-deep group-hover:text-brand-purple">
                {product.title}
              </h3>
              <p className="mt-1 text-sm text-brand-ink/70">
                {product.price?.trim() || t('priceOnRequest')}
              </p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

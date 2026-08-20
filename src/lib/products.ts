import fs from 'node:fs/promises';
import path from 'node:path';
import type { Locale } from '@/i18n/config';
import { CONTENT_ROOT } from './content';

export type ProductFact = {
  key: string;
  label: string;
  value: string;
};

export type CatalogProduct = {
  slug: string;
  title: string;
  price: string;
  image?: string;
  kind?: string;
  isbn?: string;
  facts?: ProductFact[];
  body?: string;
};

function productsDir(locale: Locale): string {
  return path.join(CONTENT_ROOT, locale, 'products');
}

export async function listCatalogProducts(locale: Locale): Promise<CatalogProduct[]> {
  let entries: string[] = [];
  try {
    entries = await fs.readdir(productsDir(locale));
  } catch {
    return [];
  }
  const products: CatalogProduct[] = [];
  for (const entry of entries) {
    if (!entry.endsWith('.json')) continue;
    try {
      const raw = await fs.readFile(path.join(productsDir(locale), entry), 'utf8');
      products.push(JSON.parse(raw) as CatalogProduct);
    } catch {
      // skip unreadable files
    }
  }
  return products;
}

export async function getCatalogProduct(
  locale: Locale,
  slug: string,
): Promise<CatalogProduct | null> {
  try {
    const raw = await fs.readFile(path.join(productsDir(locale), `${slug}.json`), 'utf8');
    return JSON.parse(raw) as CatalogProduct;
  } catch {
    return null;
  }
}

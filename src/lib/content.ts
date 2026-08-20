import fs from 'node:fs/promises';
import path from 'node:path';
import type { Locale } from '@/i18n/config';

const CONTENT_ROOT = path.join(process.cwd(), 'content');

export type PageContent = {
  title: string;
  intro?: string;
  body?: string;
  images?: string[];
  meta?: Record<string, string>;
};

async function readJson<T>(filePath: string, fallback: T): Promise<T> {
  try {
    const raw = await fs.readFile(filePath, 'utf8');
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export async function loadUiMessages(locale: Locale): Promise<Record<string, unknown>> {
  return readJson<Record<string, unknown>>(
    path.join(CONTENT_ROOT, locale, 'ui.json'),
    {},
  );
}

export async function loadPage(
  locale: Locale,
  slug: string,
): Promise<PageContent | null> {
  const file = path.join(CONTENT_ROOT, locale, 'pages', `${slug}.json`);
  try {
    const raw = await fs.readFile(file, 'utf8');
    return JSON.parse(raw) as PageContent;
  } catch {
    return null;
  }
}

export type DocumentItem = {
  title: string;
  href: string;
  date?: string;
  size?: string;
};

export async function loadDocumentList(
  locale: Locale,
  slug: string,
): Promise<{ title: string; intro?: string; documents: DocumentItem[] } | null> {
  const file = path.join(CONTENT_ROOT, locale, 'pages', `${slug}.json`);
  try {
    const raw = await fs.readFile(file, 'utf8');
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export type Product = {
  title: string;
  price: string;
  image?: string;
  href: string;
  slug: string;
};

export async function loadProducts(
  locale: Locale,
): Promise<{ title: string; intro?: string; products: Product[] } | null> {
  const file = path.join(CONTENT_ROOT, locale, 'pages', 'prodavnica.json');
  try {
    const raw = await fs.readFile(file, 'utf8');
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export type HomeContent = {
  hero: { eyebrow?: string; title: string; subtitle: string; image?: string };
  tiles?: { title: string; items: { title: string; description: string; href: string }[] };
  intro: { eyebrow?: string; title: string; body: string };
  stats?: { value: string; label: string }[];
  featured?: {
    eyebrow?: string;
    title: string;
    description: string;
    href: string;
    image?: string;
    cta?: string;
  };
};

export async function loadHome(locale: Locale): Promise<HomeContent | null> {
  const file = path.join(CONTENT_ROOT, locale, 'home.json');
  try {
    const raw = await fs.readFile(file, 'utf8');
    return JSON.parse(raw) as HomeContent;
  } catch {
    return null;
  }
}

export { CONTENT_ROOT };

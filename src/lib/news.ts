import fs from 'node:fs/promises';
import path from 'node:path';
import type { Locale } from '@/i18n/config';
import { CONTENT_ROOT } from './content';

export type NewsArticle = {
  slug: string;
  title: string;
  date: string;
  excerpt: string;
  image?: string;
  images?: string[];
  body: string;
};

async function newsDir(locale: Locale): Promise<string> {
  return path.join(CONTENT_ROOT, locale, 'news');
}

export async function listNews(locale: Locale): Promise<NewsArticle[]> {
  const dir = await newsDir(locale);
  let entries: string[] = [];
  try {
    entries = await fs.readdir(dir);
  } catch {
    return [];
  }
  const articles: NewsArticle[] = [];
  for (const entry of entries) {
    if (!entry.endsWith('.json') || entry === 'index.json') continue;
    try {
      const raw = await fs.readFile(path.join(dir, entry), 'utf8');
      const data = JSON.parse(raw) as NewsArticle;
      articles.push(data);
    } catch {
      // skip
    }
  }
  return articles.sort((a, b) => b.date.localeCompare(a.date));
}

export async function getNews(
  locale: Locale,
  slug: string,
): Promise<NewsArticle | null> {
  const dir = await newsDir(locale);
  try {
    const raw = await fs.readFile(path.join(dir, `${slug}.json`), 'utf8');
    return JSON.parse(raw) as NewsArticle;
  } catch {
    return null;
  }
}

export async function getFeaturedNews(
  locale: Locale,
  count = 3,
): Promise<NewsArticle[]> {
  const all = await listNews(locale);
  return all.slice(0, count);
}

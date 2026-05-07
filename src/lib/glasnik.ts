import fs from 'node:fs/promises';
import path from 'node:path';
import type { Locale } from '@/i18n/config';

export type GlasnikVolume = {
  label: string;
  era: string;
  href: string;
};

export type GlasnikSeriesContent = {
  title: string;
  intro?: string;
  volumes: GlasnikVolume[];
};

export async function loadGlasnikSeries(
  locale: Locale,
  series: 'a' | 'b' | 'c',
): Promise<GlasnikSeriesContent | null> {
  const file = path.join(
    process.cwd(),
    'content',
    locale,
    'pages',
    `glasnik-serija-${series}.json`,
  );
  try {
    return JSON.parse(await fs.readFile(file, 'utf8'));
  } catch {
    return null;
  }
}

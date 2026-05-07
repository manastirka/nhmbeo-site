#!/usr/bin/env node
/**
 * Pulls each Bulletin volume page from nhmbeo.rs and writes structured
 * JSON into content/{sr-Cyrl,en}/pages/bulletin/volume-X.json so we can
 * host the article listings ourselves instead of redirecting outbound.
 */
import { writeFile, mkdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { parse } from 'node-html-parser';

const ROOT = process.cwd();
const UA = 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36';

// Build the (year → volume slug) list from the bulletin index that's
// already in our content. Scraped via probing the WordPress permalinks.
const VOLUMES = [
  { vol: 18, year: 2025, slug: 'volume-18-2025-2' },
  { vol: 17, year: 2024, slug: 'volume-17-2024' },
  { vol: 16, year: 2023, slug: 'volume-16-2023' },
  { vol: 15, year: 2022, slug: 'volume-15-2022' },
  { vol: 14, year: 2021, slug: 'volume-14-2' },
  { vol: 13, year: 2020, slug: 'volume-13' },
  { vol: 12, year: 2019, slug: 'volume-12-2019' },
  { vol: 11, year: 2018, slug: 'volume-11-2018' },
  { vol: 10, year: 2017, slug: 'volume-10-2017' },
  { vol: 9,  year: 2016, slug: 'volume-9-2016' },
  { vol: 8,  year: 2015, slug: 'volume-8-2015' },
  { vol: 7,  year: 2014, slug: 'volume-7-2014' },
  { vol: 6,  year: 2013, slug: 'volume-6-2013' },
  { vol: 5,  year: 2012, slug: 'volume-5-2012' },
  { vol: 4,  year: 2011, slug: 'volume-4-2011' },
  { vol: 3,  year: 2010, slug: 'volume-3-2010' },
  { vol: 2,  year: 2009, slug: 'volume-2-2009' },
  { vol: 1,  year: 2008, slug: 'volume-1-2008' },
];

async function fetchHtml(url) {
  const res = await fetch(url, { headers: { 'user-agent': UA, accept: 'text/html' } });
  if (!res.ok) throw new Error(`${res.status} ${url}`);
  return res.text();
}

function clean(s) { return (s || '').replace(/\s+/g, ' ').trim(); }

function extractArticles(root) {
  // Each article on a volume page tends to be a paragraph or list item with
  // a PDF link. We scan the entry-content for elements that contain a .pdf
  // anchor, then capture the surrounding title/author text.
  const main =
    root.querySelector('article .entry-content') ||
    root.querySelector('.entry-content') ||
    root.querySelector('main') ||
    root.querySelector('body');
  if (!main) return [];

  const articles = [];
  const seenHref = new Set();

  for (const a of main.querySelectorAll('a')) {
    const href = (a.getAttribute('href') || '').trim();
    if (!href.toLowerCase().endsWith('.pdf')) continue;
    // Skip "Directions for the authors" boilerplate links
    if (/directions-for-the-authors|references|example/i.test(href)) continue;
    if (seenHref.has(href)) continue;
    seenHref.add(href);

    // Walk up to a reasonable container (paragraph or list item) to grab the
    // title text. Fall back to the link text.
    let container = a.parentNode;
    let depth = 0;
    while (container && depth < 4 && !['P', 'LI'].includes(container.rawTagName?.toUpperCase?.() || '')) {
      container = container.parentNode;
      depth++;
    }
    const fullText = clean(container?.text || a.text);
    // Often the link text is "PDF" or the article title; prefer surrounding text if longer.
    const linkText = clean(a.text);
    const title = fullText.length > linkText.length + 10 ? fullText : linkText;

    articles.push({
      title: title.replace(/\s*\bPDF\b\s*$/i, '').replace(/\s+\(PDF\)\s*$/i, '').trim(),
      href,
    });
  }
  return articles;
}

function extractIntro(root) {
  const main =
    root.querySelector('article .entry-content') ||
    root.querySelector('.entry-content') ||
    root.querySelector('main');
  if (!main) return '';
  const p = main.querySelector('p');
  return clean(p?.text || '');
}

async function ensureDir(p) {
  await mkdir(p, { recursive: true });
}

async function processVolume(v) {
  const url = `https://nhmbeo.rs/bulletin/${v.slug}/`;
  process.stdout.write(`  vol ${v.vol} (${v.year}) … `);
  let html;
  try {
    html = await fetchHtml(url);
  } catch (err) {
    console.log(`FAIL ${err.message}`);
    return;
  }
  const root = parse(html);
  const intro = extractIntro(root);
  const articles = extractArticles(root);

  const data = {
    volume: v.vol,
    year: String(v.year),
    intro,
    articles,
  };

  const fileSr = path.join(ROOT, 'content', 'sr-Cyrl', 'pages', 'bulletin', `volume-${v.vol}.json`);
  const fileEn = path.join(ROOT, 'content', 'en',     'pages', 'bulletin', `volume-${v.vol}.json`);
  await ensureDir(path.dirname(fileSr));
  await ensureDir(path.dirname(fileEn));
  await writeFile(fileSr, JSON.stringify(data, null, 2));
  await writeFile(fileEn, JSON.stringify({ ...data, _machineTranslated: true }, null, 2));
  console.log(`OK (${articles.length} articles)`);
}

async function main() {
  console.log(`Scraping ${VOLUMES.length} Bulletin volumes from nhmbeo.rs…`);
  for (const v of VOLUMES) await processVolume(v);
  console.log('done.');
}

main().catch((err) => { console.error(err); process.exit(1); });

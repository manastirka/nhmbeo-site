#!/usr/bin/env node
/**
 * Scrapes nhmbeo.rs into content/sr-Cyrl/.
 * One-shot script. Re-run any time to refresh.
 *
 * Strategy per page:
 *  - 'page'        → main article content → JSON { title, intro, body }
 *  - 'documents'   → PDF link list        → JSON { title, intro, documents[] }
 *  - 'products'    → product card list    → JSON { title, products[] }
 *  - 'news-list'   → article URL list     → returned in-memory
 *  - 'news-article'→ single article       → JSON { slug, title, date, excerpt, image, body }
 */

import { writeFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
import { parse } from 'node-html-parser';

const ROOT = process.cwd();
const OUT = path.join(ROOT, 'content', 'sr-Cyrl');
const PAGES_DIR = path.join(OUT, 'pages');
const NEWS_DIR = path.join(OUT, 'news');

const UA =
  'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36';

async function fetchHtml(url) {
  const res = await fetch(url, { headers: { 'user-agent': UA, accept: 'text/html' } });
  if (!res.ok) throw new Error(`${res.status} ${url}`);
  return res.text();
}

function clean(s) {
  return (s || '').replace(/\s+/g, ' ').trim();
}

function pickMain(root) {
  return (
    root.querySelector('article .entry-content') ||
    root.querySelector('.entry-content') ||
    root.querySelector('article') ||
    root.querySelector('main') ||
    root.querySelector('.elementor-widget-theme-post-content') ||
    root.querySelector('#content') ||
    root.querySelector('body')
  );
}

function extractTitle(root) {
  const h = root.querySelector('h1.entry-title') || root.querySelector('h1');
  return clean(h?.text || '');
}

function extractBody(main) {
  if (!main) return '';
  const parts = [];
  for (const node of main.childNodes) {
    if (node.nodeType !== 1) continue;
    const tag = node.rawTagName;
    if (!tag) continue;
    const text = clean(node.text);
    if (!text) continue;
    if (tag === 'h2' || tag === 'h3') {
      const level = tag === 'h2' ? '##' : '###';
      parts.push(`${level} ${text}`);
    } else if (tag === 'p') {
      parts.push(text);
    } else if (tag === 'ul' || tag === 'ol') {
      const items = node.querySelectorAll('li').map((li) => `- ${clean(li.text)}`);
      if (items.length) parts.push(items.join('\n'));
    } else if (tag === 'div' || tag === 'section') {
      const inner = extractBody(node);
      if (inner) parts.push(inner);
    }
  }
  return parts.join('\n\n');
}

function extractIntro(main) {
  if (!main) return '';
  const firstP = main.querySelector('p');
  return clean(firstP?.text || '');
}

function extractPdfLinks(main) {
  if (!main) return [];
  const docs = [];
  const seen = new Set();
  for (const a of main.querySelectorAll('a')) {
    const href = a.getAttribute('href') || '';
    if (!/\.(pdf|docx?|xlsx?)(\?|$)/i.test(href)) continue;
    if (seen.has(href)) continue;
    seen.add(href);
    const title = clean(a.text) || href.split('/').pop();
    docs.push({ title, href });
  }
  return docs;
}

function extractProducts(root) {
  const products = [];
  const cards = root.querySelectorAll('li.product, .product');
  for (const card of cards) {
    const a = card.querySelector('a');
    const titleEl = card.querySelector('.woocommerce-loop-product__title, h2, h3');
    const priceEl = card.querySelector('.price');
    const img = card.querySelector('img');
    if (!titleEl) continue;
    const title = clean(titleEl.text);
    if (!title) continue;
    products.push({
      title,
      price: clean(priceEl?.text || ''),
      image: img?.getAttribute('data-src') || img?.getAttribute('src') || '',
      href: a?.getAttribute('href') || '',
    });
  }
  return products;
}

function extractNewsList(root) {
  const list = [];
  const seen = new Set();
  const articles = root.querySelectorAll('article');
  for (const art of articles) {
    const a = art.querySelector('h2 a, .entry-title a, h3 a, a.elementor-post__thumbnail__link');
    const href = a?.getAttribute('href') || '';
    if (!href) continue;
    if (seen.has(href)) continue;
    seen.add(href);
    const title = clean(art.querySelector('h2, .entry-title, h3')?.text || '');
    const date = clean(art.querySelector('time')?.getAttribute('datetime') || art.querySelector('time')?.text || '');
    const img = art.querySelector('img');
    const excerpt = clean(art.querySelector('p, .elementor-post__excerpt')?.text || '');
    list.push({
      url: href,
      title,
      date,
      excerpt,
      image: img?.getAttribute('data-src') || img?.getAttribute('src') || '',
    });
  }
  return list;
}

const pageJobs = [
  // Visit Us
  { url: 'https://nhmbeo.rs/galerija-prirodnjackog-muzeja/', slug: 'galerija', type: 'page' },
  { url: 'https://nhmbeo.rs/izlozba-u-galeriji/', slug: 'izlozba-u-galeriji', type: 'page' },
  { url: 'https://nhmbeo.rs/virtuelni-muzej/', slug: 'virtuelni-muzej', type: 'page' },
  { url: 'https://nhmbeo.rs/cene-ulaznica/', slug: 'ulaznice', type: 'page' },
  { url: 'https://nhmbeo.rs/prodavnica/', slug: 'prodavnica', type: 'products' },
  // About
  { url: 'https://nhmbeo.rs/organizaciona-struktura/', slug: 'organizaciona-struktura', type: 'page' },
  { url: 'https://nhmbeo.rs/godisnjak-prirodnjackog-muzeja/', slug: 'godisnjak', type: 'documents' },
  { url: 'https://nhmbeo.rs/javne-nabavke/', slug: 'javne-nabavke', type: 'documents' },
  { url: 'https://nhmbeo.rs/javni-poziv/', slug: 'javni-poziv', type: 'documents' },
  { url: 'https://nhmbeo.rs/normativna-akta/', slug: 'normativna-akta', type: 'documents' },
  { url: 'https://nhmbeo.rs/planovi-i-izvestaji/', slug: 'planovi-i-izvestaji', type: 'documents' },
  // Explore
  { url: 'https://nhmbeo.rs/centar-za-markiranje-zivotinja/', slug: 'centar-za-markiranje-zivotinja', type: 'page' },
  { url: 'https://nhmbeo.rs/bulletin-of-the-natural-history-museum/', slug: 'bulletin', type: 'page' },
  { url: 'https://nhmbeo.rs/glasnik-prirodnjackog-muzeja/', slug: 'glasnik', type: 'page' },
  { url: 'https://nhmbeo.rs/posebna-izdanja/', slug: 'posebna-izdanja', type: 'documents' },
  // Contact
  { url: 'https://nhmbeo.rs/kontakt/', slug: 'kontakt', type: 'page' },
  // Home (special — extract intro)
  { url: 'https://nhmbeo.rs/', slug: '__home', type: 'home' },
];

async function runJob(job) {
  process.stdout.write(`  [${job.type}] ${job.slug} … `);
  let html;
  try {
    html = await fetchHtml(job.url);
  } catch (err) {
    console.log(`FAIL (${err.message})`);
    return null;
  }
  const root = parse(html);
  const main = pickMain(root);

  if (job.type === 'home') {
    const intro = extractIntro(main);
    const file = path.join(OUT, 'home.json');
    const existing = JSON.parse(await import('node:fs/promises').then((fs) => fs.readFile(file, 'utf8').catch(() => null)) || '{}');
    existing.intro = existing.intro || {};
    if (intro) existing.intro.body = intro;
    await writeFile(file, JSON.stringify(existing, null, 2));
    console.log(`OK (${intro.length} chars)`);
    return null;
  }

  if (job.type === 'documents') {
    const title = extractTitle(root);
    const intro = extractIntro(main);
    const documents = extractPdfLinks(main);
    await writeFile(
      path.join(PAGES_DIR, `${job.slug}.json`),
      JSON.stringify({ title, intro, documents }, null, 2),
    );
    console.log(`OK (${documents.length} docs)`);
    return null;
  }

  if (job.type === 'products') {
    const title = extractTitle(root);
    const products = extractProducts(root);
    await writeFile(
      path.join(PAGES_DIR, `${job.slug}.json`),
      JSON.stringify({ title, products }, null, 2),
    );
    console.log(`OK (${products.length} products)`);
    return null;
  }

  // generic page
  const title = extractTitle(root);
  const intro = extractIntro(main);
  const body = extractBody(main);
  await writeFile(
    path.join(PAGES_DIR, `${job.slug}.json`),
    JSON.stringify({ title, intro, body }, null, 2),
  );
  console.log(`OK (${body.length} chars)`);
  return null;
}

async function scrapeNews() {
  console.log('\nNews:');
  let listHtml;
  try {
    listHtml = await fetchHtml('https://nhmbeo.rs/vesti/');
  } catch (err) {
    console.log(`  list FAIL (${err.message})`);
    return;
  }
  const root = parse(listHtml);
  const list = extractNewsList(root).slice(0, 8);
  console.log(`  found ${list.length} articles`);

  const indexEntries = [];

  for (const item of list) {
    const slug = item.url
      .replace(/\/$/, '')
      .split('/')
      .pop()
      .replace(/[^a-z0-9-]/gi, '-')
      .toLowerCase();
    process.stdout.write(`  fetching ${slug} … `);
    let html;
    try {
      html = await fetchHtml(item.url);
    } catch (err) {
      console.log(`FAIL (${err.message})`);
      continue;
    }
    const r = parse(html);
    const main = pickMain(r);
    const title = extractTitle(r) || item.title;
    const date = item.date || clean(r.querySelector('time')?.getAttribute('datetime') || '') || new Date().toISOString().slice(0, 10);
    const dateOnly = date.slice(0, 10);
    const body = extractBody(main);
    const heroImg = r.querySelector('article img');
    const image = item.image || heroImg?.getAttribute('data-src') || heroImg?.getAttribute('src') || '';
    const excerpt = item.excerpt || clean(main?.querySelector('p')?.text || '').slice(0, 220);

    const article = {
      slug,
      title,
      date: dateOnly,
      excerpt,
      image,
      body,
    };
    await writeFile(path.join(NEWS_DIR, `${slug}.json`), JSON.stringify(article, null, 2));
    indexEntries.push({ slug, title, date: dateOnly, excerpt, image });
    console.log(`OK`);
  }

  await writeFile(
    path.join(NEWS_DIR, 'index.json'),
    JSON.stringify(indexEntries, null, 2),
  );
}

async function main() {
  await mkdir(PAGES_DIR, { recursive: true });
  await mkdir(NEWS_DIR, { recursive: true });

  console.log('Pages:');
  for (const job of pageJobs) {
    await runJob(job);
  }
  await scrapeNews();
  console.log('\nDone.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

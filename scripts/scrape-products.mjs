#!/usr/bin/env node
/**
 * Fetches each WooCommerce product linked from prodavnica.json and writes
 * content/{locale}/products/{slug}.json, then rewrites listing hrefs to
 * local /posetite-nas/prodavnica/{slug} paths.
 *
 * Usage: node scripts/scrape-products.mjs
 */

import { readFile, writeFile, mkdir } from 'node:fs/promises';
import path from 'node:path';
import { parse } from 'node-html-parser';

const ROOT = process.cwd();
const SR_LIST = path.join(ROOT, 'content', 'sr-Cyrl', 'pages', 'prodavnica.json');
const EN_LIST = path.join(ROOT, 'content', 'en', 'pages', 'prodavnica.json');
const SR_OUT = path.join(ROOT, 'content', 'sr-Cyrl', 'products');
const EN_OUT = path.join(ROOT, 'content', 'en', 'products');

const UA =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36';

const SLUG_OVERRIDES = {
  __trashed: 'kavijar',
  'три-боје-вина-геологија-и-вино': 'tri-boje-vina-geologija-i-vino',
};

const FACT_KEYS = [
  [/^(аутор(и)?|author(s)?)\b/i, 'author'],
  [/^(издавач|publisher)\b/i, 'publisher'],
  [/^(број страна|страна|pages)\b/i, 'pages'],
  [/^(језик|language)\b/i, 'language'],
  [/^(тип повеза|повез|binding)\b/i, 'binding'],
  [/^(формат|format)\b/i, 'format'],
  [/^(година издања|година|year)\b/i, 'year'],
  [/^(кључне речи|keywords)\b/i, 'keywords'],
  [/^isbn\b/i, 'isbn'],
  [/^(фотогра[иф]+је|photographs?)\b/i, 'photographs'],
  [/^(уредник( каталога)?|editor)\b/i, 'editor'],
  [/^(илустрациј[еа]|illustrations?)\b/i, 'illustrations'],
  [/^(превод|translation)\b/i, 'translation'],
];

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

function decodeEntities(s) {
  return (s || '')
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)))
    .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCharCode(parseInt(n, 16)))
    .replace(/&nbsp;/gi, ' ')
    .replace(/&ndash;/g, '–')
    .replace(/&mdash;/g, '—')
    .replace(/&lsquo;/g, '‘')
    .replace(/&rsquo;/g, '’')
    .replace(/&ldquo;/g, '“')
    .replace(/&rdquo;/g, '”')
    .replace(/&times;/g, '×')
    .replace(/&hellip;/g, '…')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>');
}

function clean(s) {
  return decodeEntities(s).replace(/\u00a0/g, ' ').replace(/[ \t]+/g, ' ').trim();
}

function decodeHtml(s) {
  return clean(s).replace(/\s+/g, ' ').trim();
}

function htmlToLines(html) {
  const withBreaks = decodeEntities(html)
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/(p|div|li|h[1-6])>/gi, '\n')
    .replace(/<[^>]+>/g, ' ');
  return withBreaks
    .split('\n')
    .map((l) => l.replace(/\s+/g, ' ').trim())
    .filter(Boolean);
}

function lastPathSegment(href) {
  const pathname = /^https?:\/\//i.test(href)
    ? new URL(href).pathname
    : href;
  return decodeURIComponent(pathname.replace(/\/+$/, '').split('/').pop() || '');
}

function slugFromHref(href) {
  const raw = lastPathSegment(href);
  if (SLUG_OVERRIDES[raw]) return SLUG_OVERRIDES[raw];
  if (/[^\x00-\x7F]/.test(raw)) {
    const ascii = raw
      .normalize('NFKD')
      .replace(/[^\w-]+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '')
      .toLowerCase();
    return ascii || 'katalog';
  }
  return raw.toLowerCase() || 'katalog';
}

const SOURCE_BY_SLUG = {
  kavijar: 'https://nhmbeo.rs/product/__trashed/',
  'tri-boje-vina-geologija-i-vino':
    'https://nhmbeo.rs/product/' +
    encodeURIComponent('три-боје-вина-геологија-и-вино') +
    '/',
};

function sourceUrl(product) {
  if (/^https?:\/\//i.test(product.href) && /nhmbeo\.rs/i.test(product.href)) {
    return product.href;
  }
  const slug = product.slug || slugFromHref(product.href);
  if (SOURCE_BY_SLUG[slug]) return SOURCE_BY_SLUG[slug];
  return `https://nhmbeo.rs/product/${slug}/`;
}

function localHref(slug) {
  return `/posetite-nas/prodavnica/${slug}`;
}

function factKey(label) {
  for (const [re, key] of FACT_KEYS) {
    if (re.test(label)) return key;
  }
  return 'other';
}

function splitIsbn(value) {
  const m = value.match(/^(.*?)\s*;?\s*(ISBN[:\s]+)(.+)$/i);
  if (!m) return { value: value.replace(/\s*;\s*$/, ''), isbn: '' };
  return {
    value: m[1].replace(/\s*;\s*$/, '').trim(),
    isbn: m[3].trim(),
  };
}

function parseFacts(shortHtml) {
  const lines = htmlToLines(shortHtml);
  let kind = '';
  const facts = [];
  for (const line of lines) {
    const m = line.match(/^([^:]{2,48}):\s*(.+)$/);
    if (m) {
      const label = clean(m[1]).replace('Фотограифије', 'Фотографије');
      const split = splitIsbn(clean(m[2]));
      facts.push({ key: factKey(label), label, value: split.value });
      if (split.isbn) {
        facts.push({ key: 'isbn', label: 'ISBN', value: split.isbn });
      }
    } else if (/^ISBN\b/i.test(line)) {
      facts.push({
        key: 'isbn',
        label: 'ISBN',
        value: line.replace(/^ISBN[:\s]*/i, '').trim(),
      });
    } else if (!kind) {
      kind = line.replace(/\*+/g, '').trim();
    }
  }
  return { kind, facts };
}

function htmlToMarkdown(html) {
  const root = parse(`<div id="__root">${html}</div>`);
  return extractBlocks(root.querySelector('#__root')).join('\n\n').trim();
}

function extractBlocks(node) {
  if (!node) return [];
  const parts = [];
  for (const child of node.childNodes) {
    if (child.nodeType !== 1) continue;
    const tag = child.rawTagName;
    if (!tag) continue;
    if (tag === 'h2' || tag === 'h3') continue;
    if (tag === 'p') {
      const text = decodeHtml(child.text);
      if (text) parts.push(text);
    } else if (tag === 'ul' || tag === 'ol') {
      const items = child.querySelectorAll('li').map((li) => `- ${decodeHtml(li.text)}`);
      if (items.length) parts.push(items.join('\n'));
    } else if (tag === 'div' || tag === 'section') {
      const nested = extractBlocks(child);
      if (nested.length) {
        parts.push(...nested);
      } else {
        const text = decodeHtml(child.text);
        if (text) parts.push(text);
      }
    }
  }
  return parts;
}

async function fetchHtml(url) {
  const res = await fetch(url, { headers: { 'user-agent': UA, accept: 'text/html' } });
  if (!res.ok) throw new Error(`${res.status}`);
  return res.text();
}

async function scrapeOne(url) {
  const html = await fetchHtml(url);
  const root = parse(html);
  const title = decodeHtml(
    root.querySelector('h1.product_title, h1.entry-title, h1')?.text || '',
  );
  const price = decodeHtml(root.querySelector('p.price, .summary .price')?.text || '');
  const shortEl = root.querySelector('.woocommerce-product-details__short-description');
  const descEl =
    root.querySelector('#tab-description, .woocommerce-Tabs-panel--description');
  const { kind, facts } = parseFacts(shortEl?.innerHTML || '');
  const body = htmlToMarkdown(descEl?.innerHTML || '');
  const isbnFact = facts.find((f) => f.key === 'isbn');
  return { title, price, kind, facts, body, isbn: isbnFact?.value || '' };
}

async function main() {
  await mkdir(SR_OUT, { recursive: true });
  await mkdir(EN_OUT, { recursive: true });

  const srList = JSON.parse(await readFile(SR_LIST, 'utf8'));
  const enList = JSON.parse(await readFile(EN_LIST, 'utf8'));

  const used = new Set();
  const products = [];

  for (let i = 0; i < srList.products.length; i++) {
    const sr = srList.products[i];
    const en = enList.products[i] || sr;
    let slug = sr.slug || slugFromHref(sr.href);
    if (used.has(slug)) slug = `${slug}-${i + 1}`;
    used.add(slug);
    const url = sourceUrl({ ...sr, slug });

    process.stdout.write(`  [${i + 1}/${srList.products.length}] ${slug} … `);
    let detail = {
      title: sr.title,
      price: sr.price,
      kind: '',
      facts: [],
      body: '',
      isbn: '',
    };
    try {
      detail = await scrapeOne(url);
      console.log('OK');
    } catch (err) {
      console.log(`FAIL (${err.message}) — listing only`);
    }

    const srProduct = {
      slug,
      title: detail.title || sr.title,
      price: detail.price || sr.price || '',
      image: sr.image || '',
      kind: detail.kind,
      isbn: detail.isbn,
      facts: detail.facts,
      body: detail.body,
    };
    const enProduct = {
      slug,
      title: en.title || srProduct.title,
      price: en.price || srProduct.price,
      image: en.image || srProduct.image,
      kind: srProduct.kind,
      isbn: srProduct.isbn,
      facts: srProduct.facts,
      body: srProduct.body,
      _machineTranslated: true,
    };

    await writeFile(path.join(SR_OUT, `${slug}.json`), JSON.stringify(srProduct, null, 2) + '\n');
    await writeFile(path.join(EN_OUT, `${slug}.json`), JSON.stringify(enProduct, null, 2) + '\n');

    products.push({
      sr: {
        title: sr.title,
        price: sr.price,
        image: sr.image,
        slug,
        href: localHref(slug),
      },
      en: {
        title: en.title,
        price: en.price,
        image: en.image || sr.image,
        slug,
        href: localHref(slug),
      },
    });

    await sleep(150);
  }

  srList.products = products.map((p) => p.sr);
  enList.products = products.map((p) => p.en);
  await writeFile(SR_LIST, JSON.stringify(srList, null, 2) + '\n');
  await writeFile(EN_LIST, JSON.stringify(enList, null, 2) + '\n');
  console.log(`\nWrote ${products.length} catalogues.`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

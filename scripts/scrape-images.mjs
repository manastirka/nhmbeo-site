#!/usr/bin/env node
/**
 * Augments existing content/sr-Cyrl JSON files with an `images` array of
 * full-size image URLs from nhmbeo.rs.
 *
 * Strategy:
 *  - Fetch each known page URL.
 *  - Pull <img src> and <a href to image> from the main content.
 *  - Strip WordPress -WxH size suffixes so we get the original full-size URL.
 *  - De-duplicate, drop logos / social icons / tiny thumbs.
 *  - Write back into the matching content/sr-Cyrl/...json file as `images`.
 */

import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { parse } from 'node-html-parser';

const ROOT = process.cwd();
const SR = path.join(ROOT, 'content', 'sr-Cyrl');
const UA =
  'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36';

async function fetchHtml(url) {
  const res = await fetch(url, { headers: { 'user-agent': UA, accept: 'text/html' } });
  if (!res.ok) throw new Error(`${res.status} ${url}`);
  return res.text();
}

const SIZE_SUFFIX = /-(\d{2,4})x(\d{2,4})\.(jpe?g|png|gif|webp)$/i;
const BLOCKLIST = [
  /\/themes\//,
  /\/plugins\//,
  /\/cropped-/,
  /favicon/i,
  /logo/i,
  /\/uploads\/2021\/04\/ezgif/,
  /elementor\/assets/,
  /placeholder/i,
];
const VALID_EXT = /\.(jpe?g|png|gif|webp)(\?|$)/i;

function stripSize(url) {
  return url.replace(SIZE_SUFFIX, '.$3');
}

function isAllowed(url) {
  if (!VALID_EXT.test(url)) return false;
  if (BLOCKLIST.some((re) => re.test(url))) return false;
  return true;
}

function pickMain(root) {
  return (
    root.querySelector('article .entry-content') ||
    root.querySelector('.entry-content') ||
    root.querySelector('article') ||
    root.querySelector('main') ||
    root.querySelector('body')
  );
}

function extractImages(root) {
  const seen = new Set();
  const out = [];
  const main = pickMain(root) || root;
  for (const img of main.querySelectorAll('img')) {
    let src =
      img.getAttribute('data-src') ||
      img.getAttribute('data-lazy-src') ||
      img.getAttribute('src') ||
      '';
    if (!src) continue;
    src = stripSize(src);
    if (!isAllowed(src)) continue;
    if (seen.has(src)) continue;
    seen.add(src);
    out.push(src);
  }
  for (const a of main.querySelectorAll('a')) {
    let href = a.getAttribute('href') || '';
    if (!href || !VALID_EXT.test(href)) continue;
    href = stripSize(href);
    if (!isAllowed(href)) continue;
    if (seen.has(href)) continue;
    seen.add(href);
    out.push(href);
  }
  return out;
}

async function patchFile(file, images) {
  const raw = await readFile(file, 'utf8');
  const data = JSON.parse(raw);
  data.images = images;
  await writeFile(file, JSON.stringify(data, null, 2));
}

const targets = [
  // pages
  { url: 'https://nhmbeo.rs/galerija-prirodnjackog-muzeja/', file: path.join(SR, 'pages', 'galerija.json') },
  { url: 'https://nhmbeo.rs/izlozba-u-galeriji/', file: path.join(SR, 'pages', 'izlozba-u-galeriji.json') },
  { url: 'https://nhmbeo.rs/virtuelni-muzej/', file: path.join(SR, 'pages', 'virtuelni-muzej.json') },
  { url: 'https://nhmbeo.rs/centar-za-markiranje-zivotinja/', file: path.join(SR, 'pages', 'centar-za-markiranje-zivotinja.json') },
  { url: 'https://nhmbeo.rs/glasnik-prirodnjackog-muzeja/', file: path.join(SR, 'pages', 'glasnik.json') },
  { url: 'https://nhmbeo.rs/organizaciona-struktura/', file: path.join(SR, 'pages', 'organizaciona-struktura.json') },
  { url: 'https://nhmbeo.rs/kontakt/', file: path.join(SR, 'pages', 'kontakt.json') },
];

const newsTargets = [
  ['https://nhmbeo.rs/vesti/otvorena-izlozba-fosili-kao-odrazi-proslosti-u-zagubici/', 'otvorena-izlozba-fosili-kao-odrazi-proslosti-u-zagubici.json'],
  ['https://nhmbeo.rs/vesti/radujemo-se-gostovanju-nase-izlozbe-fosili-kao-odrazi-proslosti-u-zagubici/', 'radujemo-se-gostovanju-nase-izlozbe-fosili-kao-odrazi-proslosti-u-zagubici.json'],
  ['https://nhmbeo.rs/vesti/putovanje-izlozbe-biljka-kao-zacin-kroz-srbiju-se-nastavlja/', 'putovanje-izlozbe-biljka-kao-zacin-kroz-srbiju-se-nastavlja.json'],
  ['https://nhmbeo.rs/vesti/raspisan-javni-konkurs-za-izbor-direktora-prirodnjackog-muzeja-u-beogradu/', 'raspisan-javni-konkurs-za-izbor-direktora-prirodnjackog-muzeja-u-beogradu.json'],
  ['https://nhmbeo.rs/vesti/izlozba-fosili-kao-odrazi-proslosti-otvorena-u-aleksincu/', 'izlozba-fosili-kao-odrazi-proslosti-otvorena-u-aleksincu.json'],
  ['https://nhmbeo.rs/vesti/u-galeriji-prirodnjackog-muzeja-otvorena-je-izlozba-gospodari-dubina-ajkule-i-raze-jadranskog-mora/', 'u-galeriji-prirodnjackog-muzeja-otvorena-je-izlozba-gospodari-dubina-ajkule-i-raze-jadranskog-mora.json'],
  ['https://nhmbeo.rs/vesti/prirodnjacki-muzej-u-beogradu-objavljuje-poziv-za-obavljanje-strucne-prakse/', 'prirodnjacki-muzej-u-beogradu-objavljuje-poziv-za-obavljanje-strucne-prakse.json'],
];

async function processOne(url, file) {
  process.stdout.write(`  ${path.relative(ROOT, file)} … `);
  let html;
  try {
    html = await fetchHtml(url);
  } catch (err) {
    console.log(`FAIL ${err.message}`);
    return;
  }
  const root = parse(html);
  const images = extractImages(root);
  try {
    await patchFile(file, images);
    console.log(`${images.length} images`);
  } catch (err) {
    console.log(`SKIP ${err.message}`);
  }
}

async function main() {
  console.log('Pages:');
  for (const t of targets) await processOne(t.url, t.file);

  console.log('\nNews:');
  for (const [url, name] of newsTargets) {
    await processOne(url, path.join(SR, 'news', name));
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

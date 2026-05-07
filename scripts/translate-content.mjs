#!/usr/bin/env node
/**
 * Mirrors content/sr-Cyrl/ → content/en/ structure.
 *
 * For now this is a structural copy: it writes the same JSON shape into the
 * English locale, sets `_machineTranslated: true`, and leaves text fields
 * untouched. A real translation pass (manual or via an MT API) is expected
 * to overwrite the text. Re-running this script is safe — it preserves any
 * existing English files (won't overwrite, only fills gaps).
 *
 * Usage: node scripts/translate-content.mjs [--force]
 */

import { readdir, readFile, writeFile, mkdir, stat } from 'node:fs/promises';
import path from 'node:path';

const ROOT = process.cwd();
const SRC = path.join(ROOT, 'content', 'sr-Cyrl');
const DST = path.join(ROOT, 'content', 'en');
const force = process.argv.includes('--force');

async function exists(p) {
  try {
    await stat(p);
    return true;
  } catch {
    return false;
  }
}

async function copyJson(srcFile, dstFile) {
  if (!force && (await exists(dstFile))) {
    console.log(`  skip (exists): ${path.relative(ROOT, dstFile)}`);
    return;
  }
  const raw = await readFile(srcFile, 'utf8');
  const data = JSON.parse(raw);
  data._machineTranslated = true;
  await mkdir(path.dirname(dstFile), { recursive: true });
  await writeFile(dstFile, JSON.stringify(data, null, 2));
  console.log(`  wrote: ${path.relative(ROOT, dstFile)}`);
}

async function walk(dir, base = dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      await walk(full, base);
    } else if (entry.name.endsWith('.json')) {
      const rel = path.relative(base, full);
      await copyJson(full, path.join(DST, rel));
    }
  }
}

async function main() {
  console.log(`Mirroring ${SRC} → ${DST}${force ? ' (forcing overwrite)' : ''}`);
  await walk(SRC);
  console.log('\nDone. Run a real translation pass on content/en/ to replace Serbian text with English.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

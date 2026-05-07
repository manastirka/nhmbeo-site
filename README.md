# Природњачки музеј у Београду — Website

A Next.js + Tailwind rebuild of [nhmbeo.rs](https://nhmbeo.rs/), bilingual (Serbian Cyrillic + English), App Router.

## Stack

- Next.js 15 (App Router) + TypeScript (strict)
- Tailwind CSS 3
- `next-intl` for locale routing (`/sr-Cyrl`, `/en`)
- Content stored as MDX/JSON under `content/{locale}/`
- No CMS, no database in v1

## Develop

```bash
npm install
npm run dev    # http://localhost:3000 → /sr-Cyrl
```

## Build

```bash
npm run build
npm start
```

## Refresh content from nhmbeo.rs

```bash
npm run scrape       # writes content/sr-Cyrl/*
npm run translate    # mirrors into content/en/* (machine translation)
```

## Notes

- All English content is machine-translated and marked `_machineTranslated: true`. Serbian Cyrillic is the source of truth.
- PDFs and most images are linked to the originals on `nhmbeo.rs`.
- The newsletter form posts to a stub `/api/newsletter` — no real provider integration.
- The `/prodavnica` shop is a static catalog; no cart or checkout.

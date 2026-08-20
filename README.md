# Природњачки музеј у Београду — Website

Bilingual (Serbian Cyrillic + English) Next.js rebuild of [nhmbeo.rs](https://nhmbeo.rs/). Content is JSON on disk; staff edit it in the browser via Decap CMS. Production is a static export on Hostinger.

## Stack

- Next.js 15 (App Router) + React 19 + TypeScript
- Tailwind CSS 3
- `next-intl` locale routing (`/sr-Cyrl`, `/en`)
- JSON under `content/{locale}/`
- Decap CMS at `/admin/` (Netlify Identity + Git Gateway)
- GitHub Actions builds `out/` and uploads to Hostinger

Serbian Cyrillic is the source of truth. English is machine-translated unless a human has edited it (`_machineTranslated: true`).

## Develop

```bash
cp .env.example .env.local   # optional
npm install
npm run dev                  # http://localhost:3000 → /sr-Cyrl
```

Local newsletter signups post to `/api/newsletter` (logs only). Production posts to `/newsletter.php` on Hostinger.

## Build

```bash
npm run build
npm start
```

Static Hostinger export (what CI runs):

```bash
NEXT_OUTPUT=export NEXT_PUBLIC_NEWSLETTER_ENDPOINT=/newsletter.php npm run build
```

Or `scripts/deploy.sh` for a local build + upload.

## Editing content

Museum staff: open `/admin/` on the live site, sign in, edit news / home / visit pages. Saves commit to `main` and trigger a deploy (~3 minutes).

Setup notes: [`docs/CMS_SETUP.md`](docs/CMS_SETUP.md).

## Refresh scraped copy from nhmbeo.rs

```bash
npm run scrape       # writes content/sr-Cyrl/*
npm run translate    # mirrors into content/en/*
```

## Deploy secrets

GitHub → Settings → Secrets:

| Secret | Notes |
|---|---|
| `FTP_HOST` | Prefer the Hostinger **hostname**, not a raw IP |
| `FTP_USER` / `FTP_PASSWORD` | FTP account |
| `FTP_REMOTE_PATH` | `.` for subdomain accounts |
| `DEPLOY_PROTOCOL` | `ftp` (current default) or `sftp` |
| `SFTP_PORT` | `65002` on Hostinger if using SFTP |
| `NEXT_PUBLIC_SITE_URL` | Canonical site URL |

Switching to SFTP: set `DEPLOY_PROTOCOL=sftp` (and `SFTP_PORT` if it is not 65002).

## Known limits

- Shop is a static catalog (no cart).
- Newsletter production mail uses Hostinger `mail()` in `public/newsletter.php`.
- Next.js 15 is maintenance LTS until 21 Oct 2026 — plan the 16 upgrade after this 15.5 patch.

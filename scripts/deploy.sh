#!/usr/bin/env bash
# Build a static export of the site and upload it to Hostinger via FTP.
#
# Credentials come from .env.local (already gitignored). At minimum:
#   FTP_HOST="92.113.19.2"
#   FTP_USER="u583672902.nhmbeo.aleksandarlukovic.com"
#   FTP_PASSWORD="…"
#
# Usage:
#   scripts/deploy.sh           # build and deploy
#   scripts/deploy.sh --dry-run # show what would be uploaded, change nothing
#   scripts/deploy.sh --no-build # skip rebuild, deploy existing out/

set -euo pipefail

# --- script flags ---
DRY_RUN=""
SKIP_BUILD=""
for arg in "$@"; do
  case "$arg" in
    --dry-run) DRY_RUN="--dry-run" ;;
    --no-build) SKIP_BUILD="1" ;;
    -h|--help)
      sed -n '2,12p' "$0"
      exit 0
      ;;
  esac
done

cd "$(dirname "$0")/.."
PROJECT_ROOT="$(pwd)"

# --- load .env.local for credentials ---
if [[ -f .env.local ]]; then
  set -a
  # shellcheck disable=SC1091
  source .env.local
  set +a
fi

cyan()   { printf "\033[1;36m%s\033[0m\n" "$1"; }
green()  { printf "\033[1;32m%s\033[0m\n" "$1"; }
yellow() { printf "\033[1;33m%s\033[0m\n" "$1"; }
red()    { printf "\033[1;31m%s\033[0m\n" "$1"; }

# --- preflight ---
if ! command -v lftp >/dev/null 2>&1; then
  red "✗ lftp is not installed."
  echo "  Install it with:  sudo dnf install -y lftp        # Fedora"
  echo "                    sudo apt-get install -y lftp     # Debian/Ubuntu"
  exit 1
fi

# Required FTP env
: "${FTP_HOST:?FTP_HOST not set in .env.local}"
: "${FTP_USER:?FTP_USER not set in .env.local}"
FTP_PORT="${FTP_PORT:-21}"
# Hostinger subdomain FTP accounts already land inside public_html, so the
# default target is the current dir. Override in .env.local if you're using
# the master FTP account instead.
FTP_REMOTE_PATH="${FTP_REMOTE_PATH:-.}"

# Prompt for password if missing
if [[ -z "${FTP_PASSWORD:-}" ]]; then
  read -rsp "FTP password for ${FTP_USER}: " FTP_PASSWORD
  echo
fi

cyan "→ NHM site deploy → ftp://${FTP_USER}@${FTP_HOST}:${FTP_PORT}/${FTP_REMOTE_PATH}"

# --- 1. Static export build ---
if [[ -z "$SKIP_BUILD" ]]; then
  cyan "→ Building static export (NEXT_OUTPUT=export)…"

  # Static export can't ship API route handlers — temporarily move /api aside.
  API_DIR="${PROJECT_ROOT}/src/app/api"
  API_BACKUP=""
  if [[ -d "$API_DIR" ]]; then
    API_BACKUP="$(mktemp -d -t nhm-api-XXXXXX)/api"
    yellow "  • parking ${API_DIR} for the build"
    mv "$API_DIR" "$API_BACKUP"
    trap 'mv "$API_BACKUP" "$API_DIR" 2>/dev/null || true' EXIT
  fi

  rm -rf .next out
  NEXT_OUTPUT=export npm run build

  if [[ -n "$API_BACKUP" ]]; then
    mv "$API_BACKUP" "$API_DIR"
    trap - EXIT
  fi

  if [[ ! -d out ]]; then
    red "✗ build did not produce ./out — aborting"
    exit 1
  fi

  # --- 2. Apache rewrite + root redirect ---
  cat > out/.htaccess <<'HT'
# Hostinger / Apache: pretty URLs and root redirect to default locale.
RewriteEngine On

# Send the bare domain to the Serbian Cyrillic homepage.
RewriteRule ^$ /sr-Cyrl/ [R=302,L]

# Make /foo and /foo/ both serve foo/index.html.
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteCond %{REQUEST_URI} !\.[a-zA-Z0-9]+$
RewriteRule ^(.+?)/?$ $1/index.html [L]

# Long cache for static assets.
<IfModule mod_expires.c>
  ExpiresActive On
  ExpiresByType image/jpeg "access plus 30 days"
  ExpiresByType image/png  "access plus 30 days"
  ExpiresByType image/webp "access plus 30 days"
  ExpiresByType image/gif  "access plus 30 days"
  ExpiresByType text/css   "access plus 7 days"
  ExpiresByType application/javascript "access plus 7 days"
</IfModule>
HT

  cat > out/index.html <<'IDX'
<!doctype html>
<meta charset="utf-8">
<title>Природњачки музеј у Београду</title>
<meta http-equiv="refresh" content="0; url=/sr-Cyrl/">
<link rel="canonical" href="/sr-Cyrl/">
<p>Преусмеравање на <a href="/sr-Cyrl/">/sr-Cyrl/</a>…</p>
IDX

  green "✓ Build done (out/ ready)"
else
  yellow "→ Skipping rebuild (--no-build); deploying existing out/"
  if [[ ! -d out ]]; then
    red "✗ no out/ directory found; remove --no-build to build first"
    exit 1
  fi
fi

# --- 3. Upload via lftp (FTP, with TLS if the server offers it) ---
cyan "→ Uploading via FTP (lftp mirror)…"

LFTP_DEBUG=""
[[ -n "${LFTP_VERBOSE:-}" ]] && LFTP_DEBUG="debug 3;"

MIRROR_OPTS="-R --verbose --parallel=4 --exclude-glob .well-known --exclude-glob .git"
if [[ -n "$DRY_RUN" ]]; then
  MIRROR_OPTS="$MIRROR_OPTS --dry-run"
else
  MIRROR_OPTS="$MIRROR_OPTS --delete"
fi

# Hostinger supports FTPS on the standard port — try it, but don't require
# certificate validation since Hostinger's wildcard cert often doesn't match
# the bare IP host.
lftp -u "${FTP_USER},${FTP_PASSWORD}" -p "${FTP_PORT}" "${FTP_HOST}" <<EOF
set ftp:ssl-allow yes
set ftp:ssl-protect-data yes
set ssl:verify-certificate no
set net:max-retries 3
set net:reconnect-interval-base 5
set mirror:use-pget-n 4
${LFTP_DEBUG}
# --- Self-heal: remove leftovers from previous bad runs and Hostinger
#     placeholder pages. Errors here are non-fatal (file may not exist). ---
mrm public_html/* > /dev/null 2>&1
rmdir public_html > /dev/null 2>&1
rm default.php   > /dev/null 2>&1
rm default.html  > /dev/null 2>&1
rm index.php     > /dev/null 2>&1
# --- Upload ---
mirror ${MIRROR_OPTS} out/ ${FTP_REMOTE_PATH}/
# --- Show what's at the root after deploy ---
ls
bye
EOF

if [[ -n "$DRY_RUN" ]]; then
  yellow "→ Dry run complete. Re-run without --dry-run to actually deploy."
else
  green "✓ Deploy complete."
  if [[ -n "${NEXT_PUBLIC_SITE_URL:-}" ]]; then
    echo "   Test the site: ${NEXT_PUBLIC_SITE_URL}"
  fi
  echo "   The bare domain redirects to /sr-Cyrl/."
fi

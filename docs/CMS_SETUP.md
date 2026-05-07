# CMS Setup — Decap CMS + GitHub Actions + Netlify Identity

This document walks you through getting the `/admin/` editor live so your
museum staff can update news, the homepage, and contact info from a
browser without ever touching code or FTP.

The pieces:

```
   Decap CMS (in browser)
          │
          ▼   commits change
        GitHub repo (main branch)
          │
          ▼   push triggers
        GitHub Actions workflow
          │
          ▼   builds + lftp uploads
        Hostinger (public_html)
```

Total setup time: **~30 minutes**, one time.

---

## Stage A — Push the project to GitHub

### A1. Create a free GitHub account (if you don't have one)
Go to <https://github.com/signup>.

### A2. Create a new empty repository
- Sign in → click the **+** in the top-right → **New repository**
- Name it e.g. `nhmbeo-site`
- Visibility: **Private** is fine (recommended).
- **Do not** tick "Add a README" — we already have one.
- Click **Create repository**.

GitHub now shows you the URL. It will look like
`https://github.com/<your-username>/nhmbeo-site.git`.

### A3. Push the existing code to it

In a terminal on your laptop:

```bash
cd ~/NHMWebSite
git init
git branch -M main
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/<your-username>/nhmbeo-site.git
git push -u origin main
```

Done. The whole project is on GitHub.

---

## Stage B — Tell GitHub Actions how to deploy

### B1. Add FTP credentials as repository secrets

On the GitHub repository page → **Settings → Secrets and variables → Actions → New repository secret**.

Add these one by one (values come from your Hostinger hPanel → FTP Accounts):

| Name | Example value |
|---|---|
| `FTP_HOST` | `92.113.19.2` |
| `FTP_PORT` | `21` |
| `FTP_USER` | `u583672902.nhmbeo.aleksandarlukovic.com` |
| `FTP_PASSWORD` | (your FTP password) |
| `FTP_REMOTE_PATH` | `.` |
| `NEXT_PUBLIC_SITE_URL` | `https://nhmbeo.aleksandarlukovic.com` |

Optional (only if you set them up earlier):

| Name | Example |
|---|---|
| `NEXT_PUBLIC_GA_MEASUREMENT_ID` | `G-XXXXXXXXXX` |
| `NEXT_PUBLIC_GOOGLE_VERIFICATION` | (Search Console token) |

### B2. Trigger the first deploy

- Go to the **Actions** tab in the repository.
- Find the workflow **"Build & deploy"**.
- Click **Run workflow → main → Run workflow**.

Wait ~3 minutes. When it goes green, your site is live without you touching FTP. From now on, every commit (including ones the CMS makes for you) auto-deploys.

---

## Stage C — Hook up the editor login

We use **Netlify Identity** as a free login service. Editors sign in with email + password, and Netlify's "Git Gateway" relays their saves to GitHub on their behalf — they never need GitHub accounts.

### C1. Sign up at <https://app.netlify.com/signup>

Use the same email you'd like to manage the site from.

### C2. Connect your GitHub repo (just to enable Identity — Netlify will not deploy)

- Click **Add new site → Import an existing project → GitHub**.
- Authorize Netlify to read your repo, pick `nhmbeo-site`.
- On the build settings screen, set **Build command** to (leave blank) and **Publish directory** to `out`. We're not actually using Netlify for deploys, but it has to think it's a static site to enable Identity.
- Click **Deploy site**. The Netlify deploy will fail or be empty — that's fine, ignore it.

### C3. Enable Identity

- In the Netlify dashboard for that site, click **Identity** in the top menu.
- Click **Enable Identity**.
- Under **Registration preferences**, change to **Invite only** (so random people can't sign up).
- Under **Services → Git Gateway**, click **Enable Git Gateway**. (This authorises Netlify to push commits to GitHub on editors' behalf.)

### C4. Invite your editors

- Click **Invite users**.
- Enter the museum staff member's email, click send.
- They get an email, set their password, and can log in at
  `https://nhmbeo.aleksandarlukovic.com/admin/`.

### C5. Wire up the Identity widget on /admin/

The widget script is already in `public/admin/index.html`. You only need to tell Netlify which site URL to bind to:

- In the Netlify Identity settings, find **Site URL** and set it to `https://nhmbeo.aleksandarlukovic.com`.
- Under **Settings → Domain management**, add `nhmbeo.aleksandarlukovic.com` as a custom domain (just for Identity to work — no DNS change needed).

That's the whole setup. After the next deploy, `/admin/` will show a login screen.

---

## Day-to-day editing flow

1. Editor opens `https://nhmbeo.aleksandarlukovic.com/admin/`.
2. Logs in with their Netlify Identity email/password.
3. Sees a sidebar with **Вести (ћирилица) / News (English) / Почетна страница / Преводи и контакт подаци**.
4. Clicks **Вести → New Вест**, fills in the fields, clicks **Save**.
5. Behind the scenes: Decap CMS commits the new JSON file to `main` on GitHub.
6. GitHub Actions detects the commit, runs `npm run build`, FTP-uploads the new `out/` to Hostinger.
7. Site is live with the new article in ~3 minutes.

The `editorial_workflow` mode is enabled, so saves go through Draft → In review → Ready before publishing — it's like Word's review mode. Fully reversible.

---

## Adding a new collection later

Edit `public/admin/config.yml` and add a new entry under `collections:`. Push to GitHub — the next time staff opens `/admin/`, the new section appears in the sidebar.

The most useful next collections to add:
- The current featured exhibition (`content/{lang}/pages/izlozba-u-galeriji.json`)
- The Galerija page (`content/{lang}/pages/galerija.json`)
- The four document categories (Decap can manage PDF uploads for these too)

Tell me the user request and I'll extend the config.

---

## Local-only fallback

The desktop **Deploy NHM Site** shortcut still works exactly as before — useful when you want to push a change immediately without going through GitHub. After local deploy, just remember to also `git push` so GitHub stays in sync; otherwise the next CMS edit will revert any unpushed local changes.

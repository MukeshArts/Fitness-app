# FitForge

A mobile-first workout tracker (installable PWA) with private per-user accounts and an optional AI link (MCP) for Claude / ChatGPT.

Everything below runs on **free plans, with no custom domain**.

## How it fits together

```
Phone app (Netlify)  --login token-->  Cloudflare Worker + KV  <--OAuth-->  Claude / ChatGPT
        |                                      |
        +------------- Clerk (login) ----------+
```

| Piece | What it does | Free-plan limits to know |
| --- | --- | --- |
| Netlify | Hosts the app files | 300 credits/month; a production deploy costs 15 (about 20 deploys/month) |
| Clerk (development instance) | Login (email / Google), unique user ids, AI permission screen | 500 users cap, "Development mode" label, not meant for production workloads |
| Cloudflare Worker | Stores each user's data under their own id, verifies login, is the MCP server | 100,000 requests/day |
| Cloudflare KV | Storage used by the Worker | 1,000 writes/day, 100,000 reads/day, changes can take ~60 s to spread |

## Files

| File | Where it goes |
| --- | --- |
| `index.html` | Netlify (the app) |
| `config.js` | Netlify. Two values: Clerk publishable key + Worker address (both public by design) |
| `sw.js` | Netlify (offline + auto-update helper) |
| `manifest.json`, `icon-192.png`, `icon-512.png` | Netlify (install on home screen) |
| `worker/worker.js` | Cloudflare Worker (copy the text into the dashboard). Not served by Netlify |

## Privacy and permission

1. **Login lock** – every request carries a Clerk login token; the Worker only reads/writes that user's data.
2. **AI approval lock** – Claude / ChatGPT only get a token after the user approves on Clerk's page.
3. **App master switch** – AI tools stay blocked until the user turns **AI access ON** in Profile. Default is OFF. The AI cannot turn it on.

## Worker settings (Cloudflare dashboard)

- Variable `CLERK_PUBLISHABLE_KEY` = your `pk_test_...` key
- KV binding named `FF`
- Open the Worker address in a browser: it should show three green ticks.

## Updating the app

1. Change the files here (upload new versions on github.com → Add file → Upload files).
2. Deploy to Netlify by dragging the folder in (`worker/` is not needed there).
3. Batch several changes into one deploy to save Netlify credits.

> Do **not** connect this repo to Netlify auto-deploy on the free plan: every commit would become a 15-credit production deploy.

## Moving to a permanent setup later

- Own a domain → Clerk production instance (note: user accounts cannot be transferred from development to production; each phone re-uploads its own data on first sign-in).
- Many users → move storage from KV to Cloudflare D1.
- Host the app on Cloudflare too, so deploys never cost credits (sign in and sync first, because a new address starts with empty phone storage).

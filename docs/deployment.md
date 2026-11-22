# Deployment

**The site is live at <https://yoankrastev.com>.** It is served by a Cloudflare Worker named
`yoankrastev-site`, connected to the GitHub repository: pushing to `main` triggers a build and the
new version is live roughly a minute later. There is no deploy button to press and no staging step.

**So a push is a publish.** Anything merged to `main` is public within a minute, including a
half-finished page. To keep something unpublished, leave it as a `draft: true` article (drafts are
excluded from production builds) or keep it on a branch until it is ready.

The rest of this file covers how that is set up, what to check, and what would change it.

## What the build produces

```sh
npm run build     # writes dist/client and dist/server
npm run preview   # serves the built site locally
```

Since the signup form went server-side (2026-11-22) the build has two halves:

- **`dist/client`** — the whole site as static files: HTML, CSS, fonts, images. Every page is
  pre-rendered. `dist/client/404.html` is the not-found page.
- **`dist/server`** — the Cloudflare Worker, which exists to run one route, `/api/subscribe`.
  The Astro adapter also writes `dist/server/wrangler.json`, the deploy configuration, with
  `main: entry.mjs` and the assets pointing at `../client`.

Node 22.12 or newer (`engines` in `package.json`).

**One secret is required in production:** `BEEHIIV_API_KEY`, set on the Worker in the Cloudflare
dashboard (Settings → Variables and Secrets → add a *Secret*, not a plain variable). It must
never be committed. Without it the signup form falls back to the beehiiv page, so the site still
works, it just does not subscribe anyone itself. For local work, put the same key in a `.env`
file, which is gitignored.

The adapter also declares a `SESSION` KV namespace and an `IMAGES` binding. Nothing on the site
uses sessions; Cloudflare provisions that namespace automatically on deploy.

## The current setup

- **Host:** Cloudflare Workers, project `yoankrastev-site` (created 2026-09-18), serving the static
  build. The Cloudflare MCP tools in Claude Code can list it (`workers_list`), but they do not
  expose DNS, custom domains or build settings; those live in the Cloudflare dashboard.
- **Domain:** `yoankrastev.com`, registered and managed in the same Cloudflare account. HTTPS is
  automatic. `www.yoankrastev.com` currently serves the site too rather than redirecting to the
  apex; the canonical tag on every page points at the apex, so search engines are not confused.
- **Caching:** HTML is revalidated on every request, while hashed assets under `/_astro/` are sent
  with a one-year immutable cache. That is what you want: a deploy is visible immediately, and
  fonts and CSS are never re-downloaded needlessly.
- **Deploy command:** with the adapter in place the build output moved, so the deploy needs the
  generated config: `npx wrangler deploy -c dist/server/wrangler.json` (verified with
  `--dry-run`: 8 modules, 41 assets from `dist/client`). If the Worker's build settings in the
  dashboard still use a bare `npx wrangler deploy`, check a branch preview before merging
  anything that depends on the API route.

## If the host ever changes

Any static host works. All three below deploy on every push to `main`, give free HTTPS, and
support a custom domain.

| Host | Notes |
|---|---|
| **Cloudflare** (current) | Fastest global network, generous free tier. Visitor numbers come from the dashboard, with no script on the page. |
| **Netlify** | The simplest dashboard of the three. Equally fine. |
| **Vercel** | Fine too. Its strengths are for server-rendered apps this site doesn't need. |

Settings for all three:

- Build command: `npm run build`
- Output directory: `dist`
- Node version: 22 or newer (set `NODE_VERSION=22` if the host defaults to something older)
- No environment variables

GitHub Pages also works but needs a workflow file and handles custom domains less smoothly.

If the domain ever changes, it must be updated in two places, or canonical URLs, Open Graph tags,
the RSS feed and the sitemap will all point at the wrong host:

- `site:` in `astro.config.mjs`
- the `Sitemap:` line in `public/robots.txt`

## Still to do

1. **Check a link preview** by pasting an article URL into LinkedIn's Post Inspector
   (<https://www.linkedin.com/post-inspector/>). It should show the title, the description and the
   preview image. LinkedIn caches aggressively, so do this before sharing widely.
2. **Submit the sitemap** in Google Search Console: `https://yoankrastev.com/sitemap-index.xml`.
3. **Decide about `www`.** It currently serves the site rather than redirecting to the apex domain.
   A redirect rule in the Cloudflare dashboard would make it tidy.
4. **Replace the placeholder articles**, which are live and publicly readable today.

After any change, check the live site itself: the homepage, one article, `/rss.xml`,
`/sitemap-index.xml`, and a made-up URL to see the 404 page.

## Before each push, because each push publishes

- `npm run build` finishes without errors.
- No unfinished drafts are published: anything with `draft: true` must be absent from `dist/`.
- The open items in [roadmap.md](roadmap.md) are dealt with, or deliberately left.
- After the push, confirm the change is actually live (roughly a minute later), not just built.

## If the newsletter moves server-side

The static setup would change (see [decisions.md](decisions.md)):

- Add the host's Astro adapter and set `output` so only the API route runs on the server.
- Store the beehiiv API key as an environment variable in the host's dashboard. It must never be
  committed, and must not be exposed to the browser.
- Everything else stays static.

## Recovery

The repository is the site. If a bad version goes out, `git revert` the commit and push: the fix is
live about a minute later. The Cloudflare dashboard can also roll back to a previous deployment,
which is faster if the repository itself is in a mess. `dist/` is generated and is not committed.

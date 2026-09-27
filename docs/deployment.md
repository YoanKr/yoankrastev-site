# Deployment

The site is not hosted yet. This is what to do when it is time.

## What the build produces

```sh
npm run build     # writes dist/
npm run preview   # serves dist/ locally, to check the built site
```

- Plain static files: HTML, CSS, fonts, images. No server, no database, no environment variables.
- Node 22.12 or newer (`engines` in `package.json`).
- Current size: roughly 340 KB total, of which about 150 KB is fonts.
- `dist/404.html` is the not-found page. Every host below serves it automatically.

## Choosing a host

Any static host works. All three below deploy on every push to `main`, give free HTTPS, and
support a custom domain.

| Host | Notes |
|---|---|
| **Cloudflare Pages** (recommended) | Fastest global network, generous free tier, no build-minute anxiety. Server-side visitor stats without any script on the page. |
| **Netlify** | The simplest dashboard of the three. Equally fine. |
| **Vercel** | Fine too. Its strengths are for server-rendered apps this site doesn't need. |

Settings for all three:

- Build command: `npm run build`
- Output directory: `dist`
- Node version: 22 or newer (set `NODE_VERSION=22` if the host defaults to something older)
- No environment variables

GitHub Pages also works but needs a workflow file and handles custom domains less smoothly.

## Going live, in order

1. **Buy the domain** (assumed to be `yoankrastev.com`).
2. **Set the domain in two places** and commit:
   - `site:` in `astro.config.mjs`
   - the `Sitemap:` line in `public/robots.txt`

   These feed canonical URLs, Open Graph tags, the RSS feed and the sitemap. If they are wrong,
   LinkedIn previews and search results point at the wrong place.
3. **Connect the repository** (`YoanKr/yoankrastev-site`) to the host, with the settings above.
4. **Point DNS at the host** following its instructions, and wait for the certificate.
5. **Check the live site:** the homepage, one article, `/rss.xml`, `/sitemap-index.xml`, and a
   made-up URL to see the 404 page.
6. **Check a link preview** by pasting an article URL into LinkedIn's Post Inspector
   (<https://www.linkedin.com/post-inspector/>). It should show the title, the description and the
   preview image. LinkedIn caches aggressively, so check before sharing widely.
7. **Submit the sitemap** in Google Search Console: `https://yoankrastev.com/sitemap-index.xml`.

## Before each deploy

- `npm run build` finishes without errors.
- No unfinished drafts are published: anything with `draft: true` must be absent from `dist/`.
- The open placeholders in [roadmap.md](roadmap.md) are dealt with, or deliberately left.

## If the newsletter moves server-side

The static setup would change (see [decisions.md](decisions.md)):

- Add the host's Astro adapter and set `output` so only the API route runs on the server.
- Store the beehiiv API key as an environment variable in the host's dashboard. It must never be
  committed, and must not be exposed to the browser.
- Everything else stays static.

## Recovery

The repository is the site. If a deploy goes wrong, redeploy the previous commit from the host's
dashboard, or `git revert` and push. `dist/` is generated and is not committed.

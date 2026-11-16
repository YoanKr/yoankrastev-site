# Open items and possible upgrades

Status: the site is built and complete. It is not live. The homepage bio and the whole About page
now carry Yoan's own copy; the articles are still placeholder.
Last reviewed 2026-11-16.

## Before launch

| Item | Where | Notes |
|---|---|---|
| Photos | `src/lib/photos.ts` + `src/assets/about/` | In place, but Yoan is still testing; the homepage and About row 1 currently share one headshot. |
| Placeholder articles | `src/content/essays/` | Three articles and one draft, written by Claude, in Yoan's voice. Delete before launch. |
| Domain | `astro.config.mjs`, `public/robots.txt` | Currently `https://yoankrastev.com`. Confirm before going live. |
| Hosting | — | Not set up. See [deployment.md](deployment.md). |
| beehiiv publication page | beehiiv dashboard | Still default branding ("Yoan's Newsletter", default logo). Readers land there to subscribe, so it is part of the funnel. |
| Waitlist wording | `src/content/pages/*.md` | The newsletter starts a few weeks after the site, so the button says "Join the waitlist" and the pages say "every other week… starting soon". When the first issue goes out, revisit the button label in `newsletter.md` and the signup text in `home.md`, `articles.md` and `about.md`. |

## Possible upgrades, in rough order of value

**Server-side newsletter signup.** Brings the email field back on the site and makes signup one
step instead of two. The form would post to an Astro API route, which calls the beehiiv API
(`POST /v2/publications/{publicationId}/subscriptions`) with an API key from an environment
variable, then redirects to an on-site thank-you page. Needs an SSR adapter for that one route
and a host that runs server code. Worth doing if signups look low relative to traffic.

**Per-article preview images.** Each article would get its own card with its title drawn on the
site's background, instead of every link sharing one image. Noticeably better on LinkedIn.
Usually done with `satori` at build time. See [images.md](images.md).

**Browser-based editing.** A git-based CMS (Pages CMS, Keystatic) gives a web form for the
markdown files, so wording and new articles can be edited and published from a phone. Only worth
it once the site is hosted and the editing habit is real.

**A byline on article pages.** Since the header says "Home" rather than the name, an article
opened from LinkedIn does not show who wrote it above the fold. A small "Yoan Krastev" line under
the title would fix that without touching the header.

**Tag pages.** The frontmatter already accepts `tags`, and they reach the meta tags and RSS, but
nothing lists articles by tag. Worth it once there are enough articles for a theme to emerge.

**A book page.** These articles are meant to become a book. When that is real, it deserves its own
page and a link in the menu.

**Full-text RSS.** Currently the feed carries titles and one-line descriptions only. Some readers
prefer whole articles in their reader; it needs a markdown renderer and sanitiser in the feed
route.

## Deliberately not doing

- **Analytics scripts, tracking pixels, embeds, font CDNs.** Host-side page views cover the need
  without loading anything in the reader's browser. See [decisions.md](decisions.md).
- **Comments.** Nothing on the site invites them; the newsletter is the reply channel.
- **A wider text column on article pages.** The narrow column is the point.

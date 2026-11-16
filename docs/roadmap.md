# Open items and possible upgrades

Status: **live at <https://yoankrastev.com>** since before 2026-11-16, deployed automatically from
`main` by a Cloudflare Worker. The homepage bio and the whole About page carry Yoan's own copy;
the placeholder articles have been deleted, so the site has no articles yet.
Last reviewed 2026-11-16.

## Open items

| Item | Where | Notes |
|---|---|---|
| Photos | `src/lib/photos.ts` + `src/assets/about/` | In place, but Yoan is still testing; the homepage and About row 1 currently share one headshot. |
| First real article | `src/content/essays/` | Empty since the placeholders were deleted on 2026-11-16. The homepage and `/articles` show an empty-state line until the first one is published. |
| www duplicate | Cloudflare dashboard | `www.yoankrastev.com` serves the site instead of redirecting to the apex domain. The canonical tag points search engines at the apex, so this is tidiness, not a bug. |
| beehiiv email settings | beehiiv dashboard | Name, logo and share thumbnail are set (checked 2026-11-16). Still empty: the email footer's postal address (required by anti-spam law in every email) and the after-signup redirect, which could send new subscribers back to the site. |
| "First issue goes out in December" | `src/content/pages/newsletter.md`, `## Button note` | A dated claim, shown under the button on every page. Remove or change it once Risk Appetite is running. While there, check the signup text in `home.md`, `articles.md` and `about.md` still reads right for a live newsletter. |

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

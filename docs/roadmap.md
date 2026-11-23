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
| beehiiv email settings | beehiiv dashboard | Two settings to fix before the first issue. See the checklist under *beehiiv: before the first issue* below. |
| beehiiv API key | beehiiv → Settings → Workspace → API | The server-side signup is built and merged but inert until `BEEHIIV_API_KEY` exists as a secret on the Cloudflare Worker. beehiiv needs Stripe Identity Verification on the account before it will issue a key. Until then the form falls back to the beehiiv page, exactly as before. |
| "First issue goes out in January" | `src/content/pages/newsletter.md`, `## Button note` | A dated claim, shown under the button on every page. Moved from December to January on 2026-11-23. Remove or change it once Risk Appetite is running. While there, check the signup text in `home.md`, `articles.md` and `about.md` still reads right for a live newsletter. |

## beehiiv: before the first issue

Checked 2026-11-16 through the beehiiv MCP (read-only on the free plan, so these are changed by
hand in the beehiiv dashboard). Publication: **Risk Appetite**, `yoankrastev.beehiiv.com`, the one
`src/consts.ts` links to. Name, description, logo, share thumbnail and the sending domain
`mail.yoankrastev.com` are already set and live.

- [ ] **Postal address in the email footer.** Empty. beehiiv's help article "How to update the
  address and copyright text in your email footer" calls it legally required: it appears in every
  email (US anti-spam law; EU rules expect the sender to be identifiable). It is public to every
  subscriber, so prefer one of these over a home address, in this order:
  1. a Bulgarian virtual office / mail-handling address (search "виртуален офис София") that allows
     public use and scans or forwards post; it does not change when Yoan moves;
  2. a Bulgarian Posts PO box, if someone can collect the post;
  3. a family address marked "c/o", only if they accept it being published.

  Avoid a US virtual mailbox. If a sole trader or company is registered later, use its address.
- [ ] **After-signup redirect.** New subscribers currently get beehiiv's default "Recommendations
  Flow" (a modal on the beehiiv page suggesting other newsletters). Edit that signup flow in the
  dashboard and add or replace its step with an external URL back to the site, e.g.
  `https://yoankrastev.com/articles/`. Not yet confirmed whether the free plan allows editing
  signup flows; if not, leaving the default is harmless.
- [ ] *Optional:* copyright text in the email footer (e.g. "© 2026 Yoan Krastev"). Same help
  article as the address.
- Keep in mind: if double opt-in is ever turned on, its separate "Opt-in Redirect Url" can conflict
  with a signup flow, so set the redirect in only one place.
- Time zone stays London (issues are scheduled on EU time), by choice.

## Possible upgrades, in rough order of value

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

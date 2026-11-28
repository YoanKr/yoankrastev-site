# Decisions

Why the site is built the way it is, so choices aren't relitigated or undone by accident.
Each entry says what was decided, why, and what would change it.

The conventions that follow from these decisions are in [AGENTS.md](../AGENTS.md).

---

## Platform

**Astro 7, static output, no UI framework.** Decided 2026-09-19.

The site is a reading site: text, a few photos, one outbound button. A static build gives the
fastest possible pages on phones, and there is no server to maintain. React, Vue and friends
would add JavaScript for nothing.

The build ships **zero JavaScript files**. The only script in the source is an inline theme
script of about half a kilobyte (see *Light and dark theme* below). Readers do load one more that
the build never sees: Cloudflare injects its analytics beacon at the edge (see *Third-party
scripts*).

*Would change it:* moving the newsletter signup server-side (see *Newsletter*) needs an SSR
adapter for one route. Everything else can stay static.

## Reading width and page frame

**Two widths: a narrow reading column and a wide page frame.** Decided 2026-09-19,
revised 2026-09-19 after the first laptop review.

Body text is capped at about 65–70 characters per line (`--measure`, 33em). Longer lines are
measurably harder to read, and this archive is meant to become a book.

The first version applied that cap to *everything*, so on a laptop the whole site was a narrow
strip with empty space either side. Now only reading pages (articles, `/newsletter`, 404) use the
centred column. The header, footer, homepage, `/essays` and `/about` use the full frame
(`--page-width`, 70rem) and lay content out across it.

Article pages still have wide margins on a laptop. That is deliberate and matches how Substack,
Medium and newspapers set long text. Don't "fix" it by widening the text column.

## Typography

**Source Serif 4 for body text, Inter for interface text. Self-hosted.** Decided 2026-09-19.

Both are open-licence (SIL OFL), so they can be self-hosted without a font CDN. Only the
latin variable-weight files are shipped (about 150 KB in total), registered through Astro's
local font provider in `astro.config.mjs`, which also generates metric-matched fallbacks.

Body text is 18px on phones and 19px from tablets up, with a line height of 1.65. The
serif/sans split is strict: serif for anything read as prose, sans for dates, labels, menu,
footer and the button.

*Origin of the files:* the woff2 files came from the Fontsource npm packages
`@fontsource-variable/source-serif-4` and `@fontsource-variable/inter` (5.3.0), latin subset,
weight-axis only. Their OFL licences sit beside them in `src/assets/fonts/`.

## Colour

**Near-black on warm off-white, one accent colour, all in tokens.** Decided 2026-09-19.

Every colour, font family, font size and layout width is a custom property in
`src/styles/tokens.css`, so the whole look can change by editing a few values. Components never
hard-code these values.

The accent (oxblood `#8b2e22`, `#e3907c` in dark) is used **only** for links and hover states.
Not for headings, backgrounds, buttons at rest, or decoration. Used everywhere, an accent stops
meaning anything; used only for links, it tells the reader what is clickable.

There are no shadows, gradients or dividing rules anywhere. Space separates things, with two exceptions in `--color-surface`: the header and footer bands, and panels (see *Panels* below).

## Light and dark theme

**Follows the reader's system setting, with a switch to override it.** Decided 2026-09-19.

An inline script in `BaseHead.astro` sets `data-theme` on `<html>` before the first paint, from
the reader's saved choice, otherwise their system setting. Without JavaScript, readers get the
light theme and the switch is hidden.

The switch is a small pill drawn in CSS. Since 2026-11-16 its knob shows a sun in light mode and a
moon in dark mode, with the other icon faint in the track, because the earlier dot-and-crescent
knob was not obvious enough. An earlier version was a text link reading "Dark"/"Light", which
looked like another menu item and was confusing. Keep it visually distinct from the text links.

*Alternative rejected:* a Theme → Light/Dark dropdown. Two taps instead of one, needs scripting to
open and close, and reads as a menu item, the original problem.

*Alternative rejected:* the CSS `light-dark()` function would keep each colour pair on one line,
but it needs Safari 17.5+ and would break the palette on older iPhones.

## Header and footer bands

**The header and footer sit on full-width bands in `--color-surface`.** Decided 2026-11-16.

With header and footer on the page background, short pages had no visible top or bottom and the
footer seemed to float. The bands are one step off the background, with no border or shadow, and
the header is not sticky (it would take reading space on phones). This is the only exception to
"space, not rules, separates things". Muted text on the bands keeps 4.9:1 (light) and 5.7:1 (dark).

*Rejected at the same review:* faded or feathered photo edges (dates quickly, conflicts with no
gradients) and decorative shapes in the side margins on laptops (phones have no margins, extra
colours would compete with the accent, and margin art dates fastest).

## Panels

**Self-contained blocks sit in soft-edged panels.** Decided 2026-11-17, at Yoan's request, after
the bands were added; this revises the original "no cards" rule.

The site felt too static: every section was text on the same background. Yoan pointed to
aliabdaal.com, which puts content in rounded boxes on soft tinted backgrounds. The restrained
version used here: a panel is `--color-surface` (the band colour) with `--radius-panel` corners and
generous padding, and no border, shadow or hover animation. Panels hold: the article cards (compact on
the homepage, the latest three in one row on laptops; one long card per row on /essays with
date, reading time and tags in a left column; the whole card is the link, a bigger tap target on
phones) and the newsletter signup on the homepage, under every article and on /about. Photos got
slightly rounded corners to match.

Boxing more than that was tried the same day and reversed at Yoan's request because it was too
many boxes: the homepage About teaser, the /about row texts, "Read next" and everything on
/newsletter are plain. The boxed signup puts its button on the right where the box is wide, so
the box is not half-empty, and on one row under the text in the article column. The running text of an article was never boxed, because long reading should not
feel like a dashboard.

*Would change it:* if the boxes start to look dated, removing the `.panel` class (and the radius
tokens) brings back the plain layout without touching the content.

## Section naming and URLs

**The section is called "Essays" and lives at `/essays/`.** The name went Essays → "Writing"
→ "Articles" (2026-09-27) → back to **Essays** (2026-11-23, at Yoan's request: "Articles
sounds too journalistic"). The URLs moved with it the same day.

**The old `/articles/...` URLs still work, and must keep working.** The first real essay was
published on 2026-11-23, hours before the rename, so its link was already out and cannot be
edited after the fact. `public/_redirects` holds three 301s — `/articles`, `/articles/` and
`/articles/*` — pointing at the matching `/essays/` path. Deleting that file breaks every
link shared before the rename.

Everything else moved together, which is the only way a URL change is safe: `src/pages/essays/`,
`src/content/pages/essays.md`, the nav, the canonical tags, the sitemap and the RSS feed. In
code, individual pieces were always essays anyway (`src/content/essays/`, `getPublishedEssays()`).

**The catch when verifying:** `_redirects` is a Cloudflare Workers file. `astro dev` and
`astro build` ignore it completely, so a redirect can only be tested against the deployed
site. Build checks prove the new URLs exist; only curl against yoankrastev.com proves the old
ones still land.

*Would change it again:* don't, without the same redirect discipline. Each rename leaves
another layer of 301s to carry forever.

**Never rename a published article's file.** The file name is the URL, and links shared on
LinkedIn or Instagram cannot be edited after the fact. Renaming breaks every one of them.
If a slug must change, keep the old URL working with a redirect.

## Header

**The top-left link reads "Home", not the site name.** Decided 2026-09-27, at Yoan's request.

The known trade-off: on an article opened from LinkedIn, the author's name no longer appears at
the top of the page. It is still in the browser tab title, the link preview and the footer.
The fix chosen (2026-11-16) is a byline rather than changing the header back: every article's
meta line starts with "By Yoan Krastev", and the homepage statement has a one-line byline.

## Newsletter

**Our own button linking to beehiiv. No email field on the site.** Decided 2026-09-19,
label changed to "Join the waitlist" 2026-09-27, then to "Subscribe" 2026-11-16.

beehiiv's own embed is a script that renders beehiiv's form with beehiiv's styling, which cannot
be restyled to match the site, so it was never used.

The first version was our own email field that sent the address to beehiiv with `?email=`
prefilled. **Tested 2026-09-19: beehiiv ignores that parameter.** `/subscribe` redirects to the
publication homepage and opens a signup modal with an empty field, so readers would have typed
their address twice. The field was removed and only the button kept.

Every signup link carries `utm_source=website` and `utm_medium=<placement>` (`home`, `essay`,
`about`, `newsletter`), so beehiiv attributes subscribers to the place they came from.

*Known consequence:* readers finish signing up on beehiiv's page, so that page's branding is part
of the funnel. The note under the button says so ("Free. Signup opens on beehiiv.") to avoid a
surprise.

The newsletter is named **Risk Appetite** (2026-11-16). It had not launched when the site was
built, so the button briefly read "Join the waitlist"; it now reads "Subscribe", with a note under
it saying the first issue goes out in January 2027 (moved from December on 2026-11-23). That note is a
dated claim and needs removing
once the newsletter is running.

**The Risk Appetite mark** (2026-11-16) sits beside the newsletter's name in every signup box and
in the `/newsletter` heading. It is an inline SVG traced from Yoan's logo file, so it follows the
theme; its salmon tail has its own token (`--color-mark-tail`) and is not a use of the link
accent. `/newsletter` link previews use Yoan's 1200×630 Risk Appetite card (`og-newsletter.png`).
At the same time the button moved directly under the pitch on every screen size. (Revised 2026-11-17: inside the boxed signup, wide boxes put the button and note on the right of the text; see *Panels*.)

**Signup moved onto the site, server side (2026-11-22).** The email field is back, on our own
pages. The form posts to `src/pages/api/subscribe.ts`, which calls the beehiiv API with a secret
key and redirects to `/newsletter/thank-you/`. Readers no longer leave the site, and there is no
second place to type an address.

What made it possible: the site turned out to be hosted on Cloudflare Workers, which runs server
code, and beehiiv's API is available on every plan. The one gate is that beehiiv requires Stripe
Identity Verification on the account before it will issue an API key.

Design rules that came with it, all deliberate:

- **It degrades to the old behaviour.** No key, a beehiiv error, a rejected address, a timeout:
  the route redirects to the beehiiv signup page with the same UTM tags. The button is never
  broken, and the site worked this way before the key existed.
- **One server route, everything else static.** `output: 'static'` plus the Cloudflare adapter,
  and only the API route sets `prerender = false`.
- **No JavaScript.** It is a plain HTML form; the browser posts it.
- **A honeypot, not a CAPTCHA.** A hidden field catches bots. A CAPTCHA would mean third-party
  JavaScript on every page, which this site does not do.
- **The publication's own opt-in setting governs.** The route deliberately does not send
  `double_opt_override`, so turning double opt-in on in beehiiv changes behaviour without a
  code change.

## Page wording in markdown

**Every word outside the articles lives in `src/content/pages/*.md`.** Decided 2026-09-27.

Yoan edits the site's wording himself, in any markdown editor, without touching code and without
asking an agent. Page templates hold no copy.

Each `## Heading` in those files names one piece of text and is never displayed; `getPageCopy()`
in `src/lib/pages.ts` looks sections up by the heading's slug. A missing or mistyped heading fails
the build with a message naming the file and the heading, which is better than a page silently
losing a sentence.

*Alternative rejected:* putting copy in YAML frontmatter fields. Multi-paragraph text and colons
make YAML fragile for someone editing by hand.

Photos stay configured in `src/lib/photos.ts` because Astro has to import image files at build
time to optimise them. Their alt text lives there too.

## Drafts

**`draft: true` keeps an article out of production entirely.** Decided 2026-09-19.

Drafts render in `astro dev` with a visible label so they can be previewed, and are excluded from
pages, the RSS feed and the sitemap in production. This works because every page and feed lists
articles through `getPublishedEssays()`. Never call `getCollection('essays')` directly.

## Third-party scripts

**No analytics snippets, tracking pixels, embeds or font CDNs in the repo.** Decided 2026-09-19.

Readers arrive from social apps on phones, often on poor connections, and the site's job is to be
read. Nothing in the source loads from a third party at runtime. beehiiv is reached only when a
reader clicks the button and leaves.

**Cloudflare Web Analytics is on, though, and the page does load its beacon.** Found 2026-11-25.
The zone has a Web Analytics site, created around late September 2026, using Cloudflare's
*automatic setup*: the edge injects `static.cloudflareinsights.com/beacon.min.js` into every HTML
response. It appears nowhere in the repo and never reaches `dist/`, so the build's zero-JS check
passes while readers still run it. Confirmed in a browser on 2026-11-25: the beacon loads and
posts to `/cdn-cgi/rum`. This contradicted the paragraph above for two months, which is why the
check in *Before finishing a change* cannot be trusted on its own.

It is cookieless and Cloudflare states it does not collect visitors' personal data, so it needs no
consent banner. Two caveats about the numbers: Brave, DuckDuckGo and ad-blockers block the beacon,
so readers arriving from social apps are undercounted; and the free plan's zone-level Analytics
tab cannot be blocked but counts requests, not page views per essay.

*To turn it off:* Cloudflare dashboard, Web Analytics, **Manage site**, set the automatic setup to
**Disable**. Nothing in the repo changes either way. Turning it off or leaving it on is Yoan's
call, not an agent's.

## Content

**The three long articles and the one draft are placeholders.** Written 2026-09-19.

They are about 1,100–1,330 words each, written in Yoan's territory, so the layout could be judged
with realistic text. They read as if Yoan wrote them but he did not. Delete them before launch.

## Feed and dates

**RSS carries titles and one-line descriptions, not full article text.** Decided 2026-09-19.
Full-text feeds would need a markdown renderer and sanitiser, and the site's goal is to bring
readers to the page or the newsletter.

Dates are shown British style ("12 July 2026") via `en-GB` formatting, in UTC so the date never
shifts by a timezone. Reading time is calculated from the word count at 230 words per minute.

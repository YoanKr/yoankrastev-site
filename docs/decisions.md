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

The build ships **zero JavaScript files**. The only script is an inline theme script of
about half a kilobyte (see *Light and dark theme* below).

*Would change it:* moving the newsletter signup server-side (see *Newsletter*) needs an SSR
adapter for one route. Everything else can stay static.

## Reading width and page frame

**Two widths: a narrow reading column and a wide page frame.** Decided 2026-09-19,
revised 2026-09-19 after the first laptop review.

Body text is capped at about 65–70 characters per line (`--measure`, 33em). Longer lines are
measurably harder to read, and this archive is meant to become a book.

The first version applied that cap to *everything*, so on a laptop the whole site was a narrow
strip with empty space either side. Now only reading pages (articles, `/newsletter`, 404) use the
centred column. The header, footer, homepage, `/articles` and `/about` use the full frame
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

There are no cards, shadows, gradients or dividing rules anywhere. Space separates things.

## Light and dark theme

**Follows the reader's system setting, with a switch to override it.** Decided 2026-09-19.

An inline script in `BaseHead.astro` sets `data-theme` on `<html>` before the first paint, from
the reader's saved choice, otherwise their system setting. Without JavaScript, readers get the
light theme and the switch is hidden.

The switch is a small pill drawn in CSS with a dot that slides across and becomes a crescent.
An earlier version was a text link reading "Dark"/"Light", which looked like another menu item
and was confusing. Keep it visually distinct from the text links.

*Alternative rejected:* the CSS `light-dark()` function would keep each colour pair on one line,
but it needs Safari 17.5+ and would break the palette on older iPhones.

## Section naming and URLs

**The section is called "Articles" and lives at `/articles/`.** Settled 2026-09-27,
after "Essays" and a short-lived "Writing".

In code, and in some page copy, individual pieces are still called essays: the collection is
`src/content/essays/`, the helper is `getPublishedEssays()`. That mismatch is deliberate and
documented rather than churned through the codebase again.

**Never rename a published article's file.** The file name is the URL, and links shared on
LinkedIn or Instagram cannot be edited after the fact. Renaming breaks every one of them.
If a slug must change, keep the old URL working with a redirect.

## Header

**The top-left link reads "Home", not the site name.** Decided 2026-09-27, at Yoan's request.

The known trade-off: on an article opened from LinkedIn, the author's name no longer appears at
the top of the page. It is still in the browser tab title, the link preview and the footer.
If credibility on article pages becomes a concern, the fix is a byline under the article title
rather than changing the header back.

## Newsletter

**Our own button linking to beehiiv. No email field on the site.** Decided 2026-09-19,
label changed to "Join the waitlist" 2026-09-27.

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

*Possible upgrade, not done:* a server-side integration would let the email field come back and
keep readers on the site. See [roadmap.md](roadmap.md).

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

## No third-party scripts

**No analytics, tracking pixels, embeds or font CDNs.** Decided 2026-09-19.

Readers arrive from social apps on phones, often on poor connections, and the site's job is to be
read. Nothing is loaded from a third party at runtime. beehiiv is reached only when a reader
clicks the button and leaves.

*If traffic numbers are ever needed:* most hosts (Cloudflare, Netlify, Vercel) report page views
server-side, with no script on the page. That is the route to take before adding any analytics
snippet. Relaxing this is Yoan's call, not an agent's.

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

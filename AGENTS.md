# yoankrastev.com

Personal essay site for Yoan Krastev, a risk consultant leaving finance to write full time.
The essays are for people in the corporate world: work, ambition, career decisions, discipline, leaving stable paths.
Most readers arrive from LinkedIn and Instagram, on phones. The site has two jobs: make Yoan credible, and turn readers into newsletter subscribers.
The essays will eventually become a book, so the archive has to age well: no trendy effects, nothing that dates quickly.

`CLAUDE.md` is a symlink to this file. Edit `AGENTS.md`, keep the symlink.

**Naming:** the section is called **Essays** everywhere — nav label, headings, `/essays/` URLs, `src/pages/essays/`, `src/content/pages/essays.md`. Renamed from "Articles" on 2026-11-23; `public/_redirects` keeps every old `/articles/...` link working and must not be deleted. The top-left header link reads **Home**, not the site name.

**Repository:** `YoanKr/yoankrastev-site` on GitHub, work happens on `main`.

**Live:** <https://yoankrastev.com>, served by the Cloudflare Worker `yoankrastev-site`, which rebuilds and deploys automatically about a minute after every push to `main`. **A push is a publish** — check the build before pushing.

**More documentation:**

- [docs/decisions.md](docs/decisions.md) — why the site is built this way. Read before changing anything structural: layout widths, the theme switch, the newsletter signup, naming or URLs.
- [docs/roadmap.md](docs/roadmap.md) — what is still placeholder, and upgrades worth doing.
- [docs/deployment.md](docs/deployment.md) — hosting, going live, the domain checklist.
- [docs/images.md](docs/images.md) — the social preview image and icons, and how to regenerate them.

## Development

When starting the dev server, use background mode:

```
astro dev --background
```

Manage the background server with `astro dev stop`, `astro dev status`, and `astro dev logs`.
A saved markdown edit shows up in the browser in a second or two. If a change to a component's styles seems not to apply, restart the dev server before investigating; its CSS occasionally goes stale.

### Before finishing a change

1. `npx astro build` — must complete with no errors.
2. `find dist/client -name '*.js' | wc -l` — must be `0`. The theme script is inline; anything else means client-side JavaScript crept in. (`dist/server` holds the Worker that runs `/api/subscribe`; that one is meant to be there.)
3. `grep -rl "<slug of a draft>" dist | wc -l` — must be `0` when a draft exists. Drafts must not reach the build.
4. Look at the pages you touched at 375px and 1440px, in both light and dark themes.
5. For a refactor that should not change the visible site, build the previous commit into a scratch directory (`git worktree add`), strip the HTML tags from both builds and diff the text. That is how the move of page wording into markdown was verified as visually identical.

## File structure

```
astro.config.mjs            Site URL, sitemap integration, self-hosted font registration
docs/                       decisions.md, roadmap.md, deployment.md, images.md (see above)
scripts/
  make-images.mjs           Regenerates the site's social preview image and icons from the tokens
  make-article-og.mjs       Regenerates public/og/<slug>.png from each article's thumbnail
public/
  og-default.png            Default social preview image (1200×630), used on every page but /newsletter
  og-newsletter.png         Risk Appetite preview image (1200×630, logo and name), used on /newsletter
  _redirects                301s from the old /articles/ URLs (see Naming above)
  favicon.svg               Monogram favicon (adapts to dark mode)
  apple-touch-icon.png      Home-screen icon
  robots.txt                Points crawlers at the sitemap
src/
  consts.ts                 Settings: site name, social/footer links, beehiiv URL (no page wording)
  content.config.ts         Schemas for essays and page wording
  content/essays/           ONE MARKDOWN FILE PER ESSAY. The only folder touched to publish.
  content/pages/            ALL PAGE WORDING, one markdown file per page (see Editing page wording)
    site.md                 Menu labels, 404 page, site-wide description (also RSS)
    home.md                 Homepage statement, section labels, About teaser, signup text
    essays.md               /essays heading + intro, empty-state line, signup text under every essay
    about.md                About heading, the three row texts, closing signup heading + pitch
    newsletter.md           /newsletter text, plus the signup button label and note used everywhere
  lib/
    essays.ts               getPublishedEssays() (drafts filter + sort), essayUrl(), readingTime()
    pages.ts                getPageCopy(): reads a content/pages file and returns its sections
    photos.ts               Photo slots for the homepage About teaser and /about
  layouts/BaseLayout.astro  <html> shell: head, header, main, footer
  components/
    BaseHead.astro          <title>, meta, canonical, Open Graph, Twitter, JSON-LD, fonts, theme script
    Header.astro            Home link, nav (Essays, About, Newsletter), light/dark switch
    Footer.astro            Text links: LinkedIn, Email, RSS
    EssayList.astro         Title / date / excerpt list: layout="grid" (homepage) or "index" (/essays)
    NewsletterSignup.astro  Mark + heading, pitch, button linking to beehiiv (see Newsletter below)
    RiskAppetiteMark.astro  The newsletter's logo (bell curve, filled right tail) as inline SVG
    Photo.astro             A photo slot: optimised image, or an empty 4:5 frame until one is added
    FormattedDate.astro     "12 July 2026" style dates
  pages/
    index.astro             Positioning statement, 3 latest essays, About teaser, signup
    essays/index.astro      Full archive, newest first ("All pieces in one place")
    essays/[slug].astro     Single essay: title, date, reading time, body, signup
    about.astro             Three alternating photo/text rows + the newsletter signup
    newsletter.astro        What the newsletter is, cadence, signup
    404.astro
    newsletter/thank-you.astro  Where /api/subscribe sends a reader once beehiiv has them
    api/subscribe.ts        THE ONLY NON-PRERENDERED ROUTE: subscribes via the beehiiv API
    rss.xml.ts              RSS feed at /rss.xml
  styles/
    tokens.css              ALL colours, font families, font sizes, widths. Edit here to restyle.
    global.css              Page frame, reading column, prose styles. Uses tokens only.
  assets/
    fonts/                  Self-hosted woff2 files + OFL licences
    about/                  Photos for the homepage and About page
    essays/                 Figures and thumbnails used by articles (<slug>-thumb.svg)
```

The sitemap (`/sitemap-index.xml`) is generated by `@astrojs/sitemap` from whatever pages are built.

## Editing page wording

Every word on the site outside the essays lives in `src/content/pages/*.md`: headings, paragraphs, menu labels, button text and page descriptions. Page templates (`src/pages/*.astro`) contain no copy. Yoan edits these files directly, in any markdown editor, without touching code.

How the files work:

- **Frontmatter** (between the `---` lines) holds `description`, the summary for search results and link previews. Lines starting with `#` there are instructions for the editor and are never shown.
- **Body:** each `## Heading` names one piece of text, and everything under it until the next `##` is that text. The heading itself is never displayed. Code looks sections up by the heading's slug (`## Signup heading` becomes `'signup-heading'`) through `getPageCopy('<file>')` in `src/lib/pages.ts`:
  - `copy.block(name)` returns HTML with paragraphs, for running text (`set:html` on a `<div>`).
  - `copy.inline(name)` drops the wrapping `<p>`, for headings, links and buttons.
  - `copy.text(name)` returns plain text, for `<title>`.
- Normal markdown works inside sections: bold, italic, links, several paragraphs.
- If a section is missing or its heading is mistyped, the build stops with an error naming the file and the expected `## Heading`.
- Page titles in the browser tab come from each page's `## Heading` section. The site name is appended automatically.

When adding new visible text to a page: add a `## Section` to that page's markdown file and read it with `getPageCopy`. Never hard-code copy in `.astro` files. The exceptions are small interface strings tied to code: "min read", "Updated", the draft label, "Skip to content", the "Dark mode" switch label and the footer link names.

## Adding an essay

1. Create `src/content/essays/<slug>.md`. The file name is the URL: `the-stable-path-is-also-a-bet.md` becomes `/essays/the-stable-path-is-also-a-bet/`. Use lowercase words and hyphens, and never rename a published file, because that breaks every link shared on LinkedIn.
2. Start with this frontmatter:

   ```yaml
   ---
   title: The Title in Title Case
   description: One sentence. Shown as the excerpt in lists and as the LinkedIn/Instagram preview text.
   pubDate: 2026-10-04
   # updatedDate: 2026-10-18   # optional; shows "Updated …" on the essay
   # tags: [career, discipline] # optional; used in meta tags and RSS categories
   # thumbnail: ../../assets/essays/my-essay-thumb.svg   # optional; see Figures and thumbnails
   # thumbnailAlt: What the drawing shows.               # omit for purely decorative artwork
   draft: true
   ---
   ```

3. Write the body in plain markdown. `##` for section headings (never `#`; the title is the page's only h1), `>` for pull quotes, `---` for a section break (it renders as a small asterism, not a line). Footnotes (`[^1]`) work.
4. Preview with the dev server. Drafts show in dev with a "Draft (hidden in production)" label.
5. To publish, set `draft: false` (or delete the line). Production builds leave drafts out of every page, the RSS feed and the sitemap.

### Figures and thumbnails

Put every image an article uses in `src/assets/essays/` and reference it relatively,
`![Alt text](../../assets/essays/photo.jpg)`, so Astro hashes and optimises it.

- **Figures** (charts, diagrams) are SVG line art drawn in the **light** palette: near-black ink
  (`#1c1b19`), the accent (`#8b2e22`) as a fill, and a transparent background. An `<img>` cannot
  be restyled from the page, so `global.css` inverts them in dark mode
  (`invert(1) hue-rotate(180deg)`), which turns the ink near-white and the accent into a warm red
  close to the dark accent. Keep new figures to those two colours and leave the background
  transparent, or they will not survive the inversion. Photographs are never inverted; the rule is
  keyed to `.svg` only.
- **Thumbnails** are optional, one per article, drawn at **1.9:1**. They appear on the homepage
  cards and, picture-left in the manner of a newspaper, on the `/essays` rows. The article page
  itself has no hero image. Same colour rules as figures, and strip any background rectangle so
  the card shows through. Name the file after the slug: `<slug>-thumb.svg`.
- **Social previews.** Platforms reject SVG, so every article with a thumbnail also needs a PNG at
  `public/og/<slug>.png`, which the article page points `og:image` at. Generate them with
  `node scripts/make-article-og.mjs` (it rewrites all of them, and reads the background colour
  from the tokens). Without a thumbnail an article falls back to the site's default preview.
- **Tags never appear on the page.** They are frontmatter only, feeding the article's meta tags and
  the RSS categories, and are there so the archive can be filtered by category once there are
  enough articles to need it.

Every page and feed must list essays through `getPublishedEssays()` in `src/lib/essays.ts`, never `getCollection('essays')` directly. That function is what keeps drafts out of production.

While the collection is empty, the homepage and `/essays` show the `## Empty state` line from `essays.md` instead of a list, and `/essays` hides its intro. Both come back on their own if the last article is ever removed, so don't delete that handling.

## Adding photos

Photo slots are defined in `src/lib/photos.ts`: `PHOTOS.home` (homepage About teaser) and `PHOTOS.about` (the three About rows, top to bottom). Put the image in `src/assets/about/`, import it in `photos.ts`, and set it as that slot's `src` with real alt text. Slots without a `src` render as empty frames. Frames are portrait 4:5 and photos are cropped to fit. The About page has one row per `PHOTOS.about` entry, and each row's text is the `## Row N` section of `about.md`. Adding a fourth photo therefore needs a `## Row 4` section.

## Changing the palette, fonts or sizes

Everything visual comes from the custom properties in `src/styles/tokens.css`:

- **Colours:** `--color-bg`, `--color-text`, `--color-text-muted`, `--color-accent` (links and hover states only), `--color-selection`, `--color-placeholder` (empty photo frames), `--color-surface` (the header and footer bands only), `--color-mark-tail` (the filled tail of the Risk Appetite mark, nothing else). The first `:root` block is the light palette. The `:root[data-theme='dark']` block at the bottom is the dark palette. When you change a light colour, change its dark counterpart too, and keep body text at a contrast ratio of at least 7:1 and the accent at 4.5:1 or more against the background.
- **Font sizes:** `--text-*`. Phone sizes are in the first block. Larger screens override some of them in the `min-width: 48em` and `min-width: 64em` blocks.
- **Widths:** `--measure` (`33em`) caps reading text at about 65–70 characters per line. `--page-width` (`70rem`) is the frame for the header, footer and layout pages. `--gutter` is the space to the screen edge. `--space-section` is the gap between homepage sections. `--space-panel` and `--radius-panel` are the padding and corner radius of panels; `--radius-photo` rounds photos.
- **Font families:** `--font-serif`, `--font-sans`, `--font-mono`. To swap a typeface, add its woff2 files to `src/assets/fonts/`, register them in `astro.config.mjs` under `fonts` (local provider), and point the token at the new `cssVariable`. Only use fonts whose licence allows self-hosting (OFL is ideal), and keep the licence file next to the font.

Do not hard-code colours, font families or font sizes in components or `global.css`. Component `<style>` blocks reference tokens only.

Exceptions: `public/favicon.svg`, `public/apple-touch-icon.png` and `public/og-default.png` are static images with the palette baked in. After a palette change, regenerate them with `node scripts/make-images.mjs` (see [docs/images.md](docs/images.md) for the one-off install it needs). The preview image must be exactly 1200×630.

### Light and dark theme

- An inline script at the top of `BaseHead.astro` sets `data-theme="light"` or `"dark"` on `<html>` before first paint.
- The theme is the reader's saved choice from the header switch (stored in `localStorage` as `theme`), otherwise their system setting. It follows system changes live until the reader uses the switch.
- The switch is a small pill drawn in CSS, deliberately unlike the text nav links. The knob shows the current theme (a sun in light mode, a moon in dark mode) and the track shows the other icon faintly. The icons are inline SVG. The button is at least 44px tall for thumbs. It is a `role="switch"` button named "Dark mode", and the theme script keeps its `aria-checked` in sync.
- Without JavaScript, readers get the light theme and the switch is hidden.

## Newsletter

The signup is `src/components/NewsletterSignup.astro`: a heading, a short pitch and one **"Subscribe"** button. Each page passes its own heading and pitch from its wording file (`home.md`, `essays.md`, `about.md`). The newsletter is called **Risk Appetite**, which is the heading on the homepage block and the `<h1>` of `/newsletter`. The button label and the note under it come from `newsletter.md` and are shared by every placement. It is not beehiiv's embed script.

- **How it works:** the form posts to `src/pages/api/subscribe.ts`, the site's only server-rendered route. That route calls the beehiiv API with a secret key and redirects to `/newsletter/thank-you/`. It is a plain HTML form; no JavaScript is involved.
- **The key:** `BEEHIIV_API_KEY`, a secret on the Cloudflare Worker (and a local `.env` for `astro dev`). It must never be committed. beehiiv blocks browser-side calls, so this has to happen server-side. The publication ID is not secret and sits in `src/consts.ts`.
- **It always works, key or no key.** If the key is missing, beehiiv errors, the address looks wrong, or anything throws, the route redirects to the beehiiv signup page with the same UTM tags, which is how the site behaved before. Never replace that fallback with an error page.
- **Spam:** a hidden "company" field is a honeypot. If it is filled, the route redirects to the thank-you page without subscribing anyone.
- **Settings sent to beehiiv:** `reactivate_existing: true` (someone filling in the form means it), `send_welcome_email: false`, and no `double_opt_override`, so whatever the publication is set to in beehiiv governs. The link still carries `utm_source=website` and `utm_medium=<placement>` (`home`, `essay`, `about`, `newsletter`).
- Readers used to be sent to beehiiv to type their address a second time, because beehiiv ignores an `?email=` parameter (checked September 2026). The API route removed that second step (built 2026-11-22).
- It appears in exactly four places: the homepage, the end of every essay, `/about` and `/newsletter`. Reuse the component; never paste beehiiv's embed code or load its scripts.
- A panel on the homepage, under every article and on `/about`; plain on `/newsletter` (`boxed={false}`), where it is just the button and note under the page text. Its layout follows its own width through **container queries** (revised 2026-11-17): in narrow boxes (phones) mark and heading, pitch, then a full-width button with the note under it; from 30rem (the article column) the text is full width and the button and note sit on one row under it; from 44rem (homepage, `/about` on laptops) the text is on the left and the button and note on the right, so the box is neither half-empty nor tall. Its vertical padding is three quarters of other panels'. The mark only appears when a heading is passed; `/newsletter` shows it in its `<h1>` instead.
- **The mark** is `RiskAppetiteMark.astro`, traced from Yoan's 800×800 logo PNG: the curve and baseline use the text colour, the tail `--color-mark-tail`. Use the component; don't add the PNG.
- **Keep every other page static.** `astro.config.mjs` sets `output: 'static'` with the Cloudflare adapter, and only `api/subscribe.ts` opts out with `export const prerender = false`. Don't let pages drift into server rendering: it costs speed for no gain.

## Design constraints

Reading-first. Whitespace does the structural work.

- One serif for body text (Source Serif 4), 18px on phones and 19px from tablets up, line height 1.65, text capped at about 65–70 characters per line.
- Sans-serif (Inter) only for nav, metadata (dates, reading time, labels), footer and the button.
- Near-black on off-white by default, plus a dark theme driven by the same tokens.
- A single accent colour, used sparingly: links and hover states only. Not for headings, backgrounds, buttons at rest or decoration. (The salmon tail of the Risk Appetite mark is part of the logo, with its own token, not a use of the accent.)
- No shadows, no gradients, no section dividers or rules, no hero images, no feature grids. Separate things with space.
- Two exceptions, both in `--color-surface`: the header and footer sit on full-width bands (no border, not sticky), and a few self-contained blocks are **panels** (the global `.panel` class: soft rounded corners `--radius-panel`, padding `--space-panel`, no border, no shadow). Panels are: article cards on the homepage (compact, three in a row on laptops) and on `/essays` (one long card per row, with date, reading time and tags in a left column on wider screens); in both the whole card is the link. Also the newsletter signup on the homepage, under every article and on `/about`. Not boxed (revised 2026-11-17, too many boxes): the homepage About teaser, the `/about` rows, "Read next", everything on `/newsletter` including its button (`boxed={false}`), and the running text of an article. Photos have `--radius-photo` corners.
- Header: "Home" on the left; Essays, About, Newsletter and the light/dark switch on the right. Keep the switch visually distinct from the text links. The current page's nav link is underlined in the text colour (never the accent). Every header link is at least 44px tall.
- Bylines: the homepage statement has a byline (`## Byline` in `home.md`), and every article's meta line starts with one (`## Byline` in `essays.md`).
- Articles end with a "Read next" link (the next older article, or the next newer one for the oldest), then the signup. With a single article it is left out. Footer: LinkedIn, Email, RSS as text links (set in `src/consts.ts`). No icon sets.

### Layout and widths

- **Page frame (`.wrap`, `--page-width`):** the header, the footer, and the layout pages (homepage, `/essays`, `/about`) use the full frame, so laptops don't show a lonely narrow column.
- **Reading column (`.reading`, `--measure`):** essays, `/newsletter` and the 404 page are a centred column. Leave it narrow on laptops; long lines are harder to read.
- **Homepage:** 2–3 line positioning statement, then the 3 latest essays as cards in an auto-fit grid (1 column on phones, 2 on tablets, 3 in one row on laptops), then an About teaser (one photo and a link to `/about`), then the signup.
- **`/essays`:** one long card per row. On wider screens the date, reading time and tags sit in their own column on the left of the card.
- **`/about`:** three rows alternating photo and text (photo left, right, left), then the newsletter signup, all without boxes. On phones each row stacks photo-then-text.

## Technical constraints

- Mobile-first. Most traffic is phones arriving from social apps.
- Minimal JavaScript: the only script is the small inline theme script in `BaseHead.astro`. `dist/client` ships zero JS files. (`dist/server` is the Worker; it runs on Cloudflare, not in the reader's browser.) Don't add client-side frameworks, analytics, tracking pixels or embeds. The only third party is beehiiv, reached through a plain link.
- Self-hosted fonts only: no Google Fonts or any font CDN.
- Every page gets a title, meta description, canonical URL and Open Graph/Twitter tags through `BaseHead.astro`. Essays are `og:type=article`, with published/modified times and JSON-LD `BlogPosting`. Pass a real `description` to every new page.
- The production URL is set in two places: `site` in `astro.config.mjs` and the `Sitemap:` line in `public/robots.txt`.
- Markdown only for essays (MDX was removed on purpose). Publishing must never require editing anything but a markdown file.

## Before launch (open placeholders)

The full list, with what is in progress, is in [docs/roadmap.md](docs/roadmap.md). In short:

- `astro.config.mjs` / `public/robots.txt`: confirm the production domain.
- `src/content/pages/home.md`: the short "About text" bio is placeholder copy.
- `src/content/pages/about.md`: replace the placeholder copy in Row 1–3 and Closing.
- `src/lib/photos.ts`: add the homepage photo and the three About photos.
- `src/content/pages/newsletter.md`: the note under the button says the first issue goes out in January 2027. Revisit once it has.
- `src/content/essays/`: delete the placeholder essays and the sample draft.
- beehiiv dashboard: add a postal address to the email footer before the first issue (name, logo and thumbnail are already set).

## Pitfalls in this codebase

Things that have already cost time here:

- **A line break before an inline link eats the space.** Astro's compiler drops the whitespace, so `the\n<a ...>articles</a>` renders as "thearticles". Keep the opening tag on the same line as the word before it, or break inside the tag (`<a\n href=...>`). This shipped once before it was caught.
- **A page's scoped styles don't reach a child component's root element.** `.newsletter { margin-top: … }` in a page has no effect on `<NewsletterSignup>`'s own `<section class="newsletter">`. Pass a class to the component, which forwards it with `class:list` plus `{...rest}`, or style it inside the component.
- **`set:html` content is not scoped either.** Markdown rendered into a page arrives without the component's scoping attribute, so scoped rules must use `:global(...)`, for example `.lede :global(p + p)`. Global classes from `global.css` (`.prose`, `.meta`) apply normally, which is why rendered copy usually sits in a `.prose` wrapper.
- **Media queries and source order.** Scoped styles are emitted in file order and a plain class selector has the same weight as one inside a media query. A `@media (min-width: 40em)` override must come *after* the base rule in the file, or it loses.
- **The signup box uses a container query, not a media query.** It lays itself out from its own container's width (stacked, button row, or side by side), so it works in both the wide homepage frame and the narrow article column. Don't convert it to `@media`.
- **Section names in page wording files are slugs of the headings.** `## Signup heading` is read as `'signup-heading'`. Renaming a heading in a markdown file breaks the page that reads it, and the build says so.
- **Internal links end with a slash** (`/essays/`, `/about/`), matching the canonical URLs and the sitemap.
- **`public/_redirects` is the only thing keeping the old `/articles/...` links alive.** It is a Cloudflare
  Workers file, inert under `astro dev`, so a URL change can only be verified on the deployed site.
- **Fonts and images are the only binary assets.** Don't add an image to `public/` that could live in `src/assets/` and be optimised by Astro.

## Astro documentation

Full documentation: https://docs.astro.build

Consult these guides before working on related tasks:

- [Adding pages, dynamic routes, or middleware](https://docs.astro.build/en/guides/routing/)
- [Working with Astro components](https://docs.astro.build/en/basics/astro-components/)
- [Using React, Vue, Svelte, or other framework components](https://docs.astro.build/en/guides/framework-components/)
- [Adding or managing content](https://docs.astro.build/en/guides/content-collections/)
- [Adding styles or using Tailwind](https://docs.astro.build/en/guides/styling/)
- [Supporting multiple languages](https://docs.astro.build/en/guides/internationalization/)

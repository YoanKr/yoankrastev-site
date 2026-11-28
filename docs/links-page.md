# The link-in-bio page (`/links`)

One page at <https://yoankrastev.com/links/> for the Instagram, TikTok and YouTube bios.
Someone taps it inside one of those apps' built-in browsers, gives it about five seconds and
one thumb. Its only real job is the newsletter; everything else is secondary.

Built 2026-11-28 from the spec in *Link-in-bio landing page — build spec*.

**Everything on it lives in [`src/lib/links.ts`](../src/lib/links.ts).** That file is the whole
page: name, bio, photo, every button, every icon, the business address and the footer. Changing a
link or a label never means opening `links.astro`.

## The short URLs

These are what go in each bio, not the long `/links/` address:

| URL | Goes to |
|---|---|
| `yoankrastev.com/ig` | `/links/?utm_source=instagram&utm_medium=bio` |
| `yoankrastev.com/tt` | `/links/?utm_source=tiktok&utm_medium=bio` |
| `yoankrastev.com/yt` | `/links/?utm_source=youtube&utm_medium=bio` |

They are 302s in [`public/_redirects`](../public/_redirects). That file is a Cloudflare Workers
file and is **inert under `astro dev` and `astro build`**, so these can only ever be tested on the
deployed site, never locally.

## How to change things

**A link, a label, an emoji, or the order.** Open `src/lib/links.ts` and edit the `buttons` list.
Each button is one block, with its `emoji` and `label` next to its `href`. Move a block up or
down to reorder. Set `enabled: false` to hide one without deleting it — that is how "Work with
me" is parked, ready for when there is something to sell, and how the old plain Newsletter button
is kept in case the signup box is ever dropped.

An emoji is decorative: screen readers skip it, so the label has to carry the meaning on its own
("Essays", not "✍️" alone). One per button.

**The newsletter box.** `newsletter` in `links.ts` holds its `heading`, its `pitch`, and
`position` — `'below'` puts it under the buttons, `'above'` puts it directly under the bio. The
field label, its placeholder, the word on the button and the small print beneath come from
[`src/content/pages/newsletter.md`](../src/content/pages/newsletter.md) instead, shared with the
four signups on the rest of the site, so one edit changes all five and this page can never
contradict them. That is also where "First issue goes out in January" lives.

**The bio.** `profile.bio` is three strings, one per line. They should match the Instagram, TikTok
and YouTube bios word for word, so someone who taps through recognises the same person.

**The photo.** Put a square file, at least 800×800, in `src/assets/links/`, then at the top of
`links.ts`:

```ts
import profilePhoto from '../assets/links/profile.jpg';
```

and set `photo: profilePhoto`. Astro crops it to a circle, serves WebP at 1×/2×/3× and keeps it
small. Until then the page shows a circle with the initials, which is deliberate, not broken.

**A new social icon.** Add a block to `socials` in `links.ts` with a `label`, an `href` and an
`icon` name. The icon name must have a matching drawing in the `ICONS` list near the top of
[`src/pages/links.astro`](../src/pages/links.astro) — there are drawings for Instagram, TikTok,
YouTube, Strava, LinkedIn and Medium. **A name with no drawing fails the build** with a message
saying so, rather than rendering a blank gap nobody notices.

**Any other word on the page.** There are no others in the markup. The name, bio, every button
label, the meta title and description, the footer line and even the small Copy button's three
states (`ui.copy`, `ui.copied`, `ui.copyHint`) are all in `links.ts`, and the four shared signup
strings are in `newsletter.md`. `links.astro` holds no copy at all, which is the one thing to
preserve when changing this page.

**The "Latest" card.** `latest` in `links.ts`, off by default. Set `enabled: true` and fill in the
title and href to feature the newest essay or video above the buttons.

## Why the page is built the way it is

- **The wording is in `links.ts`, not in `src/content/pages/` like the rest of the site.**
  Deliberate: every string on this page is a button label welded to a URL. Keeping the two
  together means changing a button is one edit in one place, where splitting them across a
  markdown file and a config file would mean two.
- **It does not use `BaseLayout`.** No site header or nav: they compete with the one button that
  matters. It still reads `tokens.css`, so the palette, type sizes and dark mode cannot drift from
  the rest of the site.
- **One font, not two.** `BaseHead` preloads Source Serif *and* Inter, about 100 KB together,
  which is the entire page-weight budget on its own. This page is almost all buttons and labels,
  which the site already sets in Inter, so it loads Inter alone. The whole page is **60 KB**.
  Adding the serif back for the name would cost another ~47 KB.
- **The newsletter is a form on the page, not a button to beehiiv** (changed 2026-11-28). The
  reader types an address and stays here. It is a plain HTML form with no JavaScript, posting to
  the site's own `/api/subscribe` with `placement="links"`, which is the same route the four
  signups on the rest of the site use. **This only beats the old button once `BEEHIIV_API_KEY`
  is set on the Cloudflare Worker.** Without the key that route falls back to the beehiiv signup
  page, and beehiiv ignores a prefilled address, so the reader types it a second time — one step
  worse than the button it replaced. The key is blocked on beehiiv's Stripe Identity
  Verification; see [roadmap.md](roadmap.md). One-tap check on the live page: submitting lands
  you on `/newsletter/thank-you/` if the key is set, and on beehiiv if it is not.
- **The Subscribe button is filled in the text colour, not the accent.** The spec asked for an
  accent-filled primary; the site's own rule is that the accent is for links and hover states
  only, and the existing Subscribe button is filled near-black. Matching that makes this read as
  the same site. The accent is still the hover colour.
- **`mailto:` is not trusted, and the address is not shown until it is needed.** A `mailto:`
  often does nothing in the Instagram and TikTok browsers, which would leave a dead button, so
  tapping Email also reveals the address as selectable text with a Copy button. Nothing is shown
  before the tap, so the page stays clean; the Copy button is **shipped hidden** on top of that
  and only revealed once the Clipboard API is confirmed. With JavaScript off the `mailto:` is all
  there is, which is how it behaves in a real browser anyway.
- **No pop-up, and this is deliberate.** A subscribe modal on open was considered and rejected:
  the spec rules out overlays because in-app browsers block or mangle them, and a modal is the
  surest way to make someone close the page in the five seconds they give it. The box sits in the
  page instead, where it cannot be blocked.
- **The business address is `business@yoankrastev.com`**, not the personal iCloud address. iCloud
  catches everything at `@yoankrastev.com`, so it arrives in the same inbox without publishing a
  personal address on an indexed page.

## Analytics: what actually works, and what does not

The spec asked for click events per link and traffic split by platform. **Cloudflare Web
Analytics, which this site already runs, cannot do either**, and its own documentation says so:

- *"Does Web Analytics support custom events? Not yet."* — so there is no way to count clicks per
  button.
- *"Cloudflare Web Analytics do not log query strings"* — so the `utm_source` tags on `/ig`, `/tt`
  and `/yt` produce no separate numbers. All three land as plain `/links/`.

What works today: the total number of visits to `/links/`. That is all.

Two ways to get the rest, when it matters enough:

1. **Add a cookieless tool with custom events** — Plausible (paid) or Umami (free tier /
   self-hosted). Both read the `utm` tags already in place and both track outbound clicks. This is
   what the spec assumed. Cost: one more third-party script on the page.
2. **Give each platform its own path** — make `/ig/`, `/tt/` and `/yt/` real pages that render the
   same content with a canonical pointing at `/links/`, instead of redirects. Cloudflare counts
   page views per path, so the split appears for free with no extra script. Does not solve click
   counts.

The `utm` tags are already in the redirects either way, so option 1 needs no change here.

## Still open

| Item | Notes |
|---|---|
| Profile photo | Placeholder: initials in a circle. Needs a square original, 800×800 or more, the same one as the social accounts. |
| Bio | Placeholder, from the spec. Must end up identical to the three social bios. |
| Social preview image | `/links/` currently shares the site's default `og-default.png`. The spec wants a dedicated 1200×630 with the photo and name — worth doing once the real photo exists. See [images.md](images.md). |
| Strava link | `strava.app.link/t8FUBnjwq8b` is a deep link rather than a profile URL. It works in a browser, but a plain `strava.com/athletes/<id>` URL would be more predictable. |
| Tested in the real apps | Not yet opened inside the actual Instagram and TikTok browsers on a phone. Everything else on the acceptance checklist has been verified. |
| Click tracking | See *Analytics* above. Needs a decision, not code. |

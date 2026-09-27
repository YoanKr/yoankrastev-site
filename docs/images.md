# Social preview image and icons

Three files in `public/` have the palette and the typeface baked into pixels. They are the one
exception to "all styling comes from tokens", so they must be regenerated when the look changes.

| File | Size | Used for |
|---|---|---|
| `og-default.png` | 1200×630 | The preview card on LinkedIn, Instagram DMs, iMessage, Slack, X. Every page uses this same image. |
| `favicon.svg` | 64×64 box | Browser tab icon. It carries its own dark-mode rule, so it inverts with the browser's theme. |
| `apple-touch-icon.png` | 180×180 | Icon when a reader saves the site to a phone home screen. Cannot adapt to dark mode. |

The preview image shows the name in Source Serif 4, the tagline in Inter, and the domain in the
accent colour. The icons are a "Y" monogram: off-white on near-black.

## Regenerating them

```sh
npm install --no-save opentype.js @fontsource/source-serif-4 @fontsource/inter
node scripts/make-images.mjs
```

The script reads the light palette from `src/styles/tokens.css` and the domain from
`astro.config.mjs`, so after a palette change or a domain change it just needs re-running.
The three packages are only needed by this script, which is why they are installed with
`--no-save` rather than added to `package.json`.

The wording on the preview image (the name and tagline) is at the top of
`scripts/make-images.mjs`. If the tagline changes, update `SITE.ogImageAlt` in `src/consts.ts` to
match, since that is what screen readers and some link previews read.

## Why the script draws text as outlines

`sharp` renders SVG through a library that only sees fonts installed on the machine, so it cannot
use the site's self-hosted woff2 files, and `<text>` in the SVG would come out in some system
font. The script therefore converts each glyph to a vector path with `opentype.js`.

Two traps, both already handled in the script, worth knowing if it is ever rewritten:

- `font.getPath()` in opentype.js 2.0 returns **NaN** coordinates for these fonts, which silently
  truncates the text: the first image generated this way read "Yoan Kraste". The script places
  glyphs one at a time instead, using each glyph's advance width and kerning pair.
- Parsing these fonts throws on their `GSUB` table, so the script deletes it before use. Nothing
  in these images needs ligatures or contextual substitutions.

## Replacing them by hand

Any image editor will do, as long as:

- The preview image is exactly **1200×630** and saved as `public/og-default.png`. Keep text well
  inside the edges; some apps crop the card.
- The home-screen icon is **180×180** and saved as `public/apple-touch-icon.png`.
- `favicon.svg` stays an SVG. If it is replaced with a flat one, its dark-mode rule is lost, which
  is fine but makes it darker on dark browser chrome.

The filenames are referenced in `src/components/BaseHead.astro` (`SITE.ogImage` in
`src/consts.ts` for the preview image), so keep the names or update both places.

## Per-article preview images

Not built. Every page currently shares one image. Adding per-article cards (the article's title
drawn on the same background) is on the [roadmap](roadmap.md).

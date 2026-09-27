/**
 * Regenerates the static images in public/: the social preview image, the favicon
 * and the home-screen icon. They are the only place the palette and fonts are baked
 * into pixels, so re-run this after changing colours or typefaces.
 *
 * Usage (the three packages are only needed for this script, hence --no-save):
 *
 *   npm install --no-save opentype.js @fontsource/source-serif-4 @fontsource/inter
 *   node scripts/make-images.mjs
 *
 * Colours are read from src/styles/tokens.css (the light palette) and the domain from
 * astro.config.mjs, so this file only holds the wording of the image itself.
 *
 * Text is converted to vector outlines rather than set as SVG text, because the SVG
 * renderer inside sharp uses system fonts and would not find the site's self-hosted ones.
 */
import fs from 'node:fs';
import { createRequire } from 'node:module';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

// Wording on the social preview image. Keep SITE.ogImageAlt in src/consts.ts saying the same thing.
const NAME = 'Yoan Krastev';
const TAGLINE = 'Essays on work, ambition and leaving stable paths';

const sharp = require('sharp');
const opentypeModule = await import('opentype.js');
const opentype = opentypeModule.parse ? opentypeModule : opentypeModule.default;

const tokens = fs.readFileSync(path.join(root, 'src/styles/tokens.css'), 'utf8');
const token = (name) => {
	// The first match is the light palette, which is what these images use.
	const found = tokens.match(new RegExp(`--${name}:\\s*([^;]+);`));
	if (!found) throw new Error(`Token --${name} not found in src/styles/tokens.css`);
	return found[1].trim();
};
const bg = token('color-bg');
const text = token('color-text');
const muted = token('color-text-muted');
const accent = token('color-accent');

const config = fs.readFileSync(path.join(root, 'astro.config.mjs'), 'utf8');
const domain = config.match(/site:\s*'https?:\/\/([^'\/]+)'/)?.[1];
if (!domain) throw new Error("Could not read `site` from astro.config.mjs");

/** Loads a static (non-variable) Fontsource woff. */
const loadFont = (pkg, file) => {
	const buffer = fs.readFileSync(require.resolve(`${pkg}/files/${file}`));
	const font = opentype.parse(buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength));
	// opentype.js 2.0 throws on these fonts' GSUB tables; nothing here needs ligatures.
	delete font.tables.gsub;
	return font;
};
const serif = loadFont('@fontsource/source-serif-4', 'source-serif-4-latin-600-normal.woff');
const sans = loadFont('@fontsource/inter', 'inter-latin-400-normal.woff');
const sansMedium = loadFont('@fontsource/inter', 'inter-latin-500-normal.woff');

/**
 * Places glyphs one by one. font.getPath() would be simpler, but in opentype.js 2.0 it
 * returns NaN coordinates for these fonts, which silently truncates the rendered text.
 */
const outline = (font, string, x, y, size, letterSpacing = 0) => {
	const scale = size / font.unitsPerEm;
	const glyphs = font.stringToGlyphs(string);
	let d = '';
	glyphs.forEach((glyph, i) => {
		d += glyph.getPath(x, y, size).toPathData(2);
		const kerning = i < glyphs.length - 1 ? font.getKerningValue(glyph, glyphs[i + 1]) : 0;
		x += (glyph.advanceWidth + (Number.isFinite(kerning) ? kerning : 0)) * scale + letterSpacing * size;
	});
	return d;
};
const fill = (font, string, x, y, size, colour, letterSpacing = 0) =>
	`<path d="${outline(font, string, x, y, size, letterSpacing)}" fill="${colour}"/>`;

// 1. Social preview image (1200×630). LinkedIn, Instagram DMs, iMessage, Slack.
const og = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
<rect width="1200" height="630" fill="${bg}"/>
${fill(serif, NAME, 96, 300, 104, text, -0.01)}
${fill(sans, TAGLINE, 100, 372, 34, muted)}
${fill(sansMedium, domain, 100, 534, 28, accent)}
</svg>`;
await sharp(Buffer.from(og)).png({ compressionLevel: 9 }).toFile(path.join(root, 'public/og-default.png'));

// 2. Monogram, centred in a 64×64 box, reused by both icons.
const box = 64;
const glyphSize = 52;
const bounds = serif.getPath(NAME[0], 0, 0, glyphSize, { kerning: false }).getBoundingBox();
const dx = (box - (bounds.x2 - bounds.x1)) / 2 - bounds.x1;
const dy = (box - (bounds.y2 - bounds.y1)) / 2 - bounds.y1;
const monogram = serif.getPath(NAME[0], dx, dy, glyphSize, { kerning: false }).toPathData(2);

// Favicon: an SVG so it can follow the browser's light/dark setting.
const favicon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${box} ${box}">
<style>rect{fill:${text}}path{fill:${bg}}@media (prefers-color-scheme:dark){rect{fill:${bg}}path{fill:${text}}}</style>
<rect width="${box}" height="${box}" rx="12"/><path d="${monogram}"/>
</svg>
`;
fs.writeFileSync(path.join(root, 'public/favicon.svg'), favicon);

// Home-screen icon: a fixed 180×180 PNG, so it cannot adapt to dark mode.
const touch = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${box} ${box}"><rect width="${box}" height="${box}" fill="${text}"/><path d="${monogram}" fill="${bg}"/></svg>`;
await sharp(Buffer.from(touch)).resize(180, 180).png().toFile(path.join(root, 'public/apple-touch-icon.png'));

console.log(`Wrote public/og-default.png, public/favicon.svg and public/apple-touch-icon.png (${domain}).`);

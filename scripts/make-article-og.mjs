/**
 * Turns each article thumbnail into a social preview image.
 *
 * Social platforms do not accept SVG, so every article whose frontmatter has a `thumbnail`
 * needs a PNG of it at public/og/<slug>.png. The article page points og:image there.
 *
 * Run after adding or redrawing a thumbnail, and after a palette change:
 *
 *   node scripts/make-article-og.mjs
 *
 * It rewrites every PNG from scratch, so it is safe to run at any time.
 *
 * The background colour comes from the light palette in tokens.css: the artwork itself is
 * transparent (so the cards can show through), but a preview card needs a solid background or
 * it renders on black in some apps.
 */
import fs from 'node:fs';
import { createRequire } from 'node:module';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const sharp = require('sharp');
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

// Open Graph's expected size. LinkedIn, Slack and iMessage all read this.
const WIDTH = 1200;
const HEIGHT = 630;

const tokens = fs.readFileSync(path.join(root, 'src/styles/tokens.css'), 'utf8');
const background = tokens.match(/--color-bg:\s*([^;]+);/)?.[1].trim();
if (!background) throw new Error('Could not read --color-bg from src/styles/tokens.css');

const essaysDir = path.join(root, 'src/content/essays');
const outDir = path.join(root, 'public/og');
fs.mkdirSync(outDir, { recursive: true });

const essays = fs.readdirSync(essaysDir).filter((name) => name.endsWith('.md'));
let written = 0;

for (const file of essays) {
	const slug = file.replace(/\.md$/, '');
	const frontmatter = fs.readFileSync(path.join(essaysDir, file), 'utf8').split('---')[1] ?? '';
	const thumbnail = frontmatter.match(/^thumbnail:\s*(\S+)/m)?.[1];
	if (!thumbnail) continue;

	const source = path.resolve(essaysDir, thumbnail);
	if (!fs.existsSync(source)) throw new Error(`${file}: thumbnail not found at ${source}`);

	// Fit the drawing inside the frame rather than filling it, so nothing is cut off here.
	// Platforms that crop further then eat into the margin, not the artwork.
	const art = await sharp(source, { density: 300 })
		.resize(Math.round(WIDTH * 0.86), Math.round(HEIGHT * 0.86), { fit: 'inside' })
		.png()
		.toBuffer();

	await sharp({ create: { width: WIDTH, height: HEIGHT, channels: 4, background } })
		.composite([{ input: art, gravity: 'centre' }])
		.png({ compressionLevel: 9 })
		.toFile(path.join(outDir, `${slug}.png`));

	console.log(`public/og/${slug}.png`);
	written++;
}

console.log(written === 0 ? 'No article has a thumbnail yet; nothing to do.' : `Wrote ${written} preview image(s).`);

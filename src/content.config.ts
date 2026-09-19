import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

// Each markdown file in src/content/essays/ is one essay.
// The file name becomes the URL: my-essay.md -> /articles/my-essay/
const essays = defineCollection({
	loader: glob({ base: './src/content/essays', pattern: '**/*.md' }),
	schema: z.object({
		title: z.string(),
		// Shown as the one-line excerpt in lists, and as the meta/social description.
		description: z.string(),
		pubDate: z.coerce.date(),
		updatedDate: z.coerce.date().optional(),
		tags: z.array(z.string()).optional(),
		// Drafts are visible in `astro dev` but never built for production.
		draft: z.boolean().default(false),
	}),
});

// The wording of every page, one markdown file per page (home.md, about.md, ...).
// Each `## Heading` names a piece of text; src/lib/pages.ts looks them up by name.
const pages = defineCollection({
	loader: glob({ base: './src/content/pages', pattern: '*.md' }),
	schema: z.object({
		// Search results and LinkedIn/Instagram link previews.
		description: z.string(),
	}),
});

export const collections = { essays, pages };

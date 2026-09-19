import { type CollectionEntry, getCollection } from 'astro:content';
import { WORDS_PER_MINUTE } from '../consts';

export type Essay = CollectionEntry<'essays'>;

/**
 * All essays that should appear on the site, newest first.
 * Drafts are included in `astro dev` so they can be previewed, and excluded from
 * production builds, so they never reach pages, RSS or the sitemap.
 * Every page and feed must go through this function rather than calling getCollection directly.
 */
export async function getPublishedEssays(): Promise<Essay[]> {
	const essays = await getCollection('essays', ({ data }) => import.meta.env.DEV || !data.draft);
	return essays.sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());
}

export function essayUrl(essay: Essay): string {
	return `/articles/${essay.id}/`;
}

/** Whole minutes, rounded up, from the markdown source. */
export function readingTime(markdown = ''): number {
	const text = markdown
		.replace(/```[\s\S]*?```/g, ' ') // code blocks
		.replace(/!\[[^\]]*\]\([^)]*\)/g, ' ') // images
		.replace(/\[([^\]]*)\]\([^)]*\)/g, '$1') // links -> link text
		.replace(/<[^>]+>/g, ' ') // html tags
		.replace(/[#>*_`~-]/g, ' '); // markdown punctuation
	const words = text.split(/\s+/).filter(Boolean).length;
	return Math.max(1, Math.ceil(words / WORDS_PER_MINUTE));
}

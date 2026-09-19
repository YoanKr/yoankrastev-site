import { getEntry } from 'astro:content';

/**
 * Page wording from src/content/pages/<id>.md.
 *
 * Each file is split into named sections by its `## Heading` lines. The heading text is the
 * section's name (never shown on the site); code refers to it by the heading's slug,
 * e.g. `## Signup heading` -> 'signup-heading'.
 */
export type PageCopy = {
	/** Frontmatter `description`, for search results and link previews. */
	description: string;
	/** Section as HTML, paragraphs included. Use for running text. */
	block: (section: string) => string;
	/** Section as HTML without its wrapping <p>. Use inside headings, links and buttons. */
	inline: (section: string) => string;
	/** Section as plain text. Use for <title> and attributes. */
	text: (section: string) => string;
};

const ENTITIES: Record<string, string> = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ' };

function decodeEntities(value: string): string {
	return value.replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (match, entity: string) => {
		if (entity[0] !== '#') return ENTITIES[entity.toLowerCase()] ?? match;
		const code = entity[1] === 'x' || entity[1] === 'X' ? parseInt(entity.slice(2), 16) : parseInt(entity.slice(1), 10);
		return String.fromCodePoint(code);
	});
}

export async function getPageCopy(id: string): Promise<PageCopy> {
	const file = `src/content/pages/${id}.md`;
	const entry = await getEntry('pages', id);
	if (!entry) throw new Error(`Missing wording file ${file}`);

	// Split the rendered HTML at each <h2 id="...">; the id names the text that follows it.
	const parts = (entry.rendered?.html ?? '').split(/<h2[^>]*\sid="([^"]+)"[^>]*>[\s\S]*?<\/h2>/);
	const sections = new Map<string, string>();
	for (let i = 1; i < parts.length; i += 2) sections.set(parts[i], parts[i + 1].trim());

	const block = (section: string) => {
		const html = sections.get(section);
		if (html === undefined || html === '') {
			const heading = section.charAt(0).toUpperCase() + section.slice(1).replace(/-/g, ' ');
			throw new Error(`${file} is missing the "## ${heading}" section, or it is empty.`);
		}
		return html;
	};
	const inline = (section: string) => {
		const html = block(section);
		const single = html.match(/^<p>([\s\S]*)<\/p>$/);
		return single && !single[1].includes('<p>') ? single[1] : html;
	};
	const text = (section: string) => decodeEntities(inline(section).replace(/<[^>]+>/g, '')).trim();

	return { description: entry.data.description, block, inline, text };
}

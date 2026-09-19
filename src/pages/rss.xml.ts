import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { SITE } from '../consts';
import { essayUrl, getPublishedEssays } from '../lib/essays';
import { getPageCopy } from '../lib/pages';

export async function GET(context: APIContext) {
	const essays = await getPublishedEssays();
	return rss({
		title: SITE.title,
		description: (await getPageCopy('site')).description,
		site: context.site!,
		items: essays.map((essay) => ({
			title: essay.data.title,
			description: essay.data.description,
			pubDate: essay.data.pubDate,
			categories: essay.data.tags,
			link: essayUrl(essay),
		})),
		customData: '<language>en-gb</language>',
	});
}

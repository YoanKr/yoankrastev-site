// Site-wide settings: names, URLs and links reused across pages, meta tags, RSS and the footer.
// Visible wording (headings, paragraphs, button labels, descriptions) lives in src/content/pages/*.md.

export const SITE = {
	name: 'Yoan Krastev',
	title: 'Yoan Krastev',
	locale: 'en_GB',
	// Default social preview image (1200×630) in /public.
	ogImage: '/og-default.png',
	ogImageAlt: 'Yoan Krastev: essays on work, ambition and leaving stable paths',
};

export const SOCIAL_LINKS = [
	{ label: 'LinkedIn', href: 'https://www.linkedin.com/in/yoankrastev1111/' },
	{ label: 'Email', href: 'mailto:blog@yoankrastev.com' },
];

export const NEWSLETTER = {
	// The beehiiv publication the signup form subscribes people to. Not a secret; the API key is
	// (it lives in the BEEHIIV_API_KEY secret on the Cloudflare Worker, never in this repo).
	publicationId: 'pub_b8cb18b3-4746-44b4-91b8-5ecb549ec694',
	// Fallback for when the signup form cannot subscribe someone itself: beehiiv's own page.
	subscribeUrl: 'https://yoankrastev.beehiiv.com/subscribe',
};

// Average adult silent-reading speed for non-fiction.
export const WORDS_PER_MINUTE = 230;

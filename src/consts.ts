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
	{ label: 'Instagram', href: 'https://www.instagram.com/ionzy17/' },
	{ label: 'GitHub', href: 'https://github.com/YoanKr' },
	{ label: 'Email', href: 'mailto:yoan.krastev@icloud.com' },
];

export const NEWSLETTER = {
	// The signup button links here; readers enter their email and subscribe on beehiiv.
	subscribeUrl: 'https://yoankrastev.beehiiv.com/subscribe',
};

// Average adult silent-reading speed for non-fiction.
export const WORDS_PER_MINUTE = 230;

// Site-wide settings. Page copy lives in the pages themselves; this file holds
// the values reused across pages, meta tags, RSS and the footer.

export const SITE = {
	name: 'Yoan Krastev',
	title: 'Yoan Krastev',
	description:
		'Essays on work, ambition, discipline and career decisions, for people in the corporate world thinking about what comes next.',
	locale: 'en_GB',
	// Default social preview image (1200×630) in /public.
	ogImage: '/og-default.png',
	ogImageAlt: 'Yoan Krastev: essays on work, ambition and leaving stable paths',
};

// TODO: replace the placeholder handles and address with the real ones.
export const SOCIAL_LINKS = [
	{ label: 'LinkedIn', href: 'https://www.linkedin.com/in/yoankrastev/' },
	{ label: 'Instagram', href: 'https://www.instagram.com/yoankrastev/' },
	{ label: 'GitHub', href: 'https://github.com/yoankrastev' },
	{ label: 'Email', href: 'mailto:hello@yoankrastev.com' },
];

export const NEWSLETTER = {
	// The signup button links here; readers enter their email and subscribe on beehiiv.
	// buttonLabel is used everywhere the signup appears (homepage, end of every article, /newsletter).
	subscribeUrl: 'https://yoankrastev.beehiiv.com/subscribe',
	buttonLabel: 'Join the waitlist',
};

// Average adult silent-reading speed for non-fiction.
export const WORDS_PER_MINUTE = 230;

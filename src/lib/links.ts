import type { ImageMetadata } from 'astro';

// EVERYTHING ON THE /links PAGE. Edit this file; never edit links.astro.
//
// This is the "link in bio" page: the one URL that goes in the Instagram, TikTok and
// YouTube bios. Someone taps it inside those apps' built-in browsers, gives it about
// five seconds and one thumb, and the page's only real job is to get them onto the
// newsletter. Everything else is secondary.
//
// To change something:
//   A link        -> edit its `href` below.
//   A label       -> edit its `label`. Keep it short, plain, no emoji, no exclamation marks.
//   The order     -> move the whole { ... } block up or down in the list.
//   Hide an item  -> set `enabled: false`. It stays here, ready to switch back on.
//   The photo     -> see `profile.photo` below.
//   A new social  -> see `socials` below.
//
// See docs/links-page.md for the longer version, and for what is still a placeholder.

export type MainButton = {
	/**
	 * Optional emoji before the label. Screen readers skip it, so the label alone has
	 * to make sense on its own. One emoji, no more: a row of them stops being a signal.
	 */
	emoji?: string;
	/** The words on the button. */
	label: string;
	/** Where it goes. A full https:// URL, or a path on this site like '/essays/'. */
	href: string;
	/** 'primary' is the one filled, dominant button. Use it exactly once. */
	style: 'primary' | 'secondary';
	/** false hides the button without deleting it. */
	enabled: boolean;
	/**
	 * Marks the email button. It becomes a `mailto:` to `businessEmail` below, and the
	 * address appears underneath only after someone taps it — because `mailto:` often
	 * does nothing inside the Instagram and TikTok browsers, and a button that silently
	 * does nothing is the one outcome worth engineering against. Nothing is shown until
	 * then, so the page stays clean.
	 */
	isEmail?: boolean;
};

/** The small icons under the buttons. `icon` picks the drawing in links.astro. */
export type SocialIcon = {
	/** Read out by screen readers, and the tooltip on hover. */
	label: string;
	href: string;
	icon: 'instagram' | 'tiktok' | 'youtube' | 'strava' | 'linkedin' | 'medium';
	enabled: boolean;
};

export const LINKS = {
	/** Browser tab, search results and link previews. */
	meta: {
		title: 'Yoan Krastev — links',
		description: 'Essays on building a life that feels as good as it looks on paper. Newsletter, essays and where to find Yoan Krastev.',
		/** 1200×630 preview image in /public. See docs/links-page.md for how to make a proper one. */
		ogImage: '/og-default.png',
		ogImageAlt: 'Yoan Krastev: essays on work, ambition and leaving stable paths',
	},

	profile: {
		name: 'Yoan Krastev',
		/*
		  PLACEHOLDER. Three short lines, and they should match the Instagram, TikTok and
		  YouTube bios word for word, so someone who taps through recognises the same person.
		  Replace all three when the real bio is written.
		*/
		bio: [
			'Ex-risk consultant, now risk taker.',
			'Philosophy for doing hard things.',
			'Essays + newsletter below.',
		],
		/*
		  PLACEHOLDER. Until a photo is set this renders as a circle with the initials in it,
		  which is deliberate, not broken.

		  To add the real photo:
		    1. Put a square file, at least 800×800, in src/assets/links/.
		    2. Import it at the top of this file:  import profilePhoto from '../assets/links/profile.jpg';
		    3. Set `photo: profilePhoto` below.
		  Astro crops it to a circle and serves WebP at the right size. Use the same photo as
		  the social accounts.
		*/
		photo: undefined as ImageMetadata | undefined,
		photoAlt: 'Yoan Krastev',
	},

	/*
	  THE MAIN BUTTONS, top to bottom. The first one is the primary call to action.
	  Six is the most this page should ever have; four is better.
	*/
	buttons: [
		{
			/*
			  OFF. The newsletter is the signup box under these buttons instead, where a
			  reader types their address without leaving the page. Switch this to true to
			  go back to a plain button that sends them to beehiiv, and set
			  `newsletter.enabled` to false so there are not two of them.
			*/
			emoji: '🗞️',
			label: 'Newsletter',
			href: 'https://yoankrastev.beehiiv.com/subscribe?utm_source=website&utm_medium=links',
			style: 'primary',
			enabled: false,
		},
		{
			emoji: '✍️',
			label: 'Essays',
			href: 'https://yoankrastev.com/essays/',
			style: 'secondary',
			enabled: true,
		},
		{
			emoji: '💼',
			label: 'LinkedIn',
			href: 'https://www.linkedin.com/in/yoankrastev1111/',
			style: 'secondary',
			enabled: true,
		},
		{
			emoji: '📧',
			label: 'Email',
			// Built from `businessEmail` below, so the address is written in one place only.
			href: '',
			style: 'secondary',
			enabled: true,
			isEmail: true,
		},
		{
			/*
			  OFF FOR NOW. Switch `enabled` to true once there is an actual offering to send
			  people to, and point `href` at the page describing it. Nothing else to change.
			*/
			emoji: '🤝',
			label: 'Work with me',
			href: '',
			style: 'secondary',
			enabled: false,
		},
	] satisfies MainButton[],

	/*
	  THE NEWSLETTER SIGNUP BOX, under the buttons and above the icon row. The reader
	  types their address here and never leaves the page: the form posts to the site's
	  own /api/subscribe, exactly like the signup on every other page, and lands them on
	  /newsletter/thank-you/.

	  Only the heading and the pitch are here. The field label, its placeholder, the
	  button word and the small print under it come from src/content/pages/newsletter.md,
	  shared with the five signups on the rest of the site, so changing the wording in
	  that one file changes all of them and this page can never contradict them. That
	  file is also where the "First issue goes out in January" line lives.

	  Set `enabled: false` to remove the box; then switch the Newsletter button above
	  back on, or the page loses its main purpose.
	*/
	newsletter: {
		enabled: true,
		/*
		  Where the box sits. 'below' puts it under the buttons and above the icons;
		  'above' puts it directly under the bio, before the buttons.

		  Worth knowing before changing it: with the box below the buttons, its Subscribe
		  button lands about 790px down. That is on screen on any current phone, but below
		  the fold on a 375x667 one (an iPhone SE), where someone has to scroll to reach
		  the thing this page exists for. 'above' is always on screen.
		*/
		position: 'below' as 'above' | 'below',
		heading: 'Risk Appetite',
		pitch: 'A new essay every other week, plus shorter notes on what I’m thinking, doing and reading.',
	},

	/*
	  THE SMALL ICON ROW under the buttons. Deliberately small: most visitors arrive FROM
	  one of these, so sending them back is not the point of the page.

	  To add one: copy a block, set `label`, `href` and `icon`. `icon` must be one of the
	  names in the SocialIcon type above, and each of those has a drawing in links.astro.
	  A name with no drawing will fail the build rather than render a blank space.
	*/
	socials: [
		{ label: 'Instagram', href: 'https://www.instagram.com/yoan.of.all.trades/', icon: 'instagram', enabled: true },
		{ label: 'TikTok', href: 'https://www.tiktok.com/@yoan.of.all.trades', icon: 'tiktok', enabled: true },
		{ label: 'YouTube', href: 'https://www.youtube.com/@yoan.of.all.trades', icon: 'youtube', enabled: true },
		{ label: 'Strava', href: 'https://strava.app.link/t8FUBnjwq8b', icon: 'strava', enabled: true },
	] satisfies SocialIcon[],

	/*
	  The public business address. Deliberately NOT a personal inbox: this page is indexed
	  and the address is readable by anyone, including scrapers. iCloud catches everything
	  at @yoankrastev.com, so this arrives in the same place as the personal address without
	  publishing it.
	*/
	businessEmail: 'business@yoankrastev.com',

	/*
	  OPTIONAL "LATEST" CARD above the buttons, for the newest essay or video.
	  Off by default. Switch `enabled` to true and fill in the three fields to use it;
	  changing what it features is then a one-line edit.
	*/
	latest: {
		enabled: false,
		/** Small label above the title, e.g. 'New essay' or 'New video'. */
		kicker: 'New essay',
		title: '',
		href: '',
	},

	footer: {
		copyright: '© Yoan Krastev',
		/** Set to a path like '/privacy/' once a privacy page exists; empty hides the link. */
		privacyUrl: '',
		/** The words on that link. Only shown when privacyUrl is set. */
		privacyLabel: 'Privacy',
	},

	/*
	  The last few words on the page: the small Copy button next to the business address
	  and what it says after a tap. They live here too, so that every word a visitor can
	  read is in this one file and none of them are in the markup.

	  `copyHint` is the fallback. Some in-app browsers offer a clipboard and then refuse to
	  write to it; in that case the page selects the address instead, so the phone's own
	  Copy menu is one tap away, and this is what the button says.
	*/
	ui: {
		copy: 'Copy',
		copied: 'Copied',
		copyHint: 'Press to copy',
	},
};

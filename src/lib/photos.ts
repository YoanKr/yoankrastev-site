import type { ImageMetadata } from 'astro';

// Photos for the homepage "About" teaser and the /about page.
//
// To add a photo:
//   1. Put the file in src/assets/about/ (JPG or PNG, at least 1200px on the long side).
//   2. Import it below and set it as `src`, with alt text describing the photo.
//      import portrait from '../assets/about/portrait.jpg';
//      home: { src: portrait, alt: 'Yoan at his desk' },
//
// Until a slot has a `src`, an empty frame holds its place. Frames are portrait (4:5);
// photos are cropped to fit.

export type Photo = { src?: ImageMetadata; alt: string };

export const PHOTOS = {
	/** Homepage "About" teaser. */
	home: { alt: 'Portrait of Yoan Krastev' },
	/** /about page, top to bottom. Rows alternate: photo left, right, left. */
	about: [
		{ alt: 'Photo placeholder one' },
		{ alt: 'Photo placeholder two' },
		{ alt: 'Photo placeholder three' },
	],
} satisfies { home: Photo; about: Photo[] };

import type { ImageMetadata } from 'astro';
import aboutOne from '../assets/about/About-1.jpg';
import aboutTwo from '../assets/about/About-2.JPG';
import aboutThree from '../assets/about/About-3.jpeg';
import home from '../assets/about/Home.jpg';

// Photos for the homepage "About" teaser and the /about page.
//
// To change a photo:
//   1. Put the file in src/assets/about/.
//   2. Import it above and use it as the slot's `src` below.
//   3. Update `alt` to describe what the photo shows, for screen readers and for
//      readers whose connection drops the image.
//
// A slot with no `src` renders as an empty frame. Frames are portrait (4:5) and photos are
// cropped from the centre to fit, so keep faces away from the very top and bottom of the frame.

export type Photo = { src?: ImageMetadata; alt: string };

export const PHOTOS = {
	/** Homepage "About" teaser. */
	home: { src: home, alt: 'Yoan Krastev in a navy blazer and light blue shirt' },
	/** /about page, top to bottom. Rows alternate: photo left, right, left. */
	about: [
		{ src: aboutOne, alt: 'Yoan Krastev in a navy blazer and light blue shirt' },
		{ src: aboutTwo, alt: 'Yoan Krastev speaking at a lectern in cap and gown at a graduation ceremony' },
		{ src: aboutThree, alt: 'Yoan Krastev on Westminster Bridge in London, with Big Ben and the Thames behind him' },
	],
} satisfies { home: Photo; about: Photo[] };

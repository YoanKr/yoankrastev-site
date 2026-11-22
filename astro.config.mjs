// @ts-check

import cloudflare from '@astrojs/cloudflare';
import sitemap from '@astrojs/sitemap';
import { defineConfig, fontProviders } from 'astro/config';

// https://astro.build/config
export default defineConfig({
	// Production URL. Used for canonical links, Open Graph URLs, RSS and the sitemap.
	site: 'https://yoankrastev.com',
	// Every page is still pre-rendered at build time. The adapter exists only so that
	// src/pages/api/subscribe.ts can run on the Cloudflare Worker, which it opts into with
	// `export const prerender = false`. Keep it that way: pages should stay static.
	output: 'static',
	adapter: cloudflare(),
	integrations: [sitemap()],
	// Fonts are self-hosted from src/assets/fonts. Nothing is fetched from a font CDN.
	// The font stacks that use these live in src/styles/tokens.css.
	fonts: [
		{
			provider: fontProviders.local(),
			name: 'Source Serif 4',
			cssVariable: '--font-source-serif',
			fallbacks: ['Georgia', 'serif'],
			options: {
				variants: [
					{
						src: ['./src/assets/fonts/source-serif-4-wght-normal.woff2'],
						weight: '200 900',
						style: 'normal',
						display: 'swap',
					},
					{
						src: ['./src/assets/fonts/source-serif-4-wght-italic.woff2'],
						weight: '200 900',
						style: 'italic',
						display: 'swap',
					},
				],
			},
		},
		{
			provider: fontProviders.local(),
			name: 'Inter',
			cssVariable: '--font-inter',
			fallbacks: ['system-ui', 'sans-serif'],
			options: {
				variants: [
					{
						src: ['./src/assets/fonts/inter-wght-normal.woff2'],
						weight: '100 900',
						style: 'normal',
						display: 'swap',
					},
				],
			},
		},
	],
});

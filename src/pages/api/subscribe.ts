import type { APIRoute } from 'astro';
// The Worker's environment, which is where the API key secret lives. Astro 7 removed
// `Astro.locals.runtime.env`; this import is the supported way to read it.
import { env } from 'cloudflare:workers';
import { NEWSLETTER } from '../../consts';

/**
 * Newsletter signup, server side.
 *
 * The form in NewsletterSignup.astro posts here. This route calls the beehiiv API with the
 * secret key, so the key never reaches the browser (beehiiv blocks browser-side calls anyway),
 * then sends the reader to the thank-you page.
 *
 * It is the only route on the site that is not pre-rendered.
 *
 * Whenever it cannot subscribe someone — no API key configured, beehiiv unreachable or
 * unhappy, an address it rejects — it falls back to the beehiiv signup page rather than
 * showing an error. The reader can always finish there, which is how the site worked before
 * this route existed.
 *
 * Needs one secret on the Cloudflare Worker: BEEHIIV_API_KEY.
 */
export const prerender = false;

const BEEHIIV_API = 'https://api.beehiiv.com/v2';

/** Where to send someone we could not subscribe ourselves. */
function fallbackUrl(placement: string): string {
	const url = new URL(NEWSLETTER.subscribeUrl);
	url.searchParams.set('utm_source', 'website');
	url.searchParams.set('utm_medium', placement);
	return url.href;
}

/** A deliberately loose check: beehiiv does the real validation. */
function looksLikeEmail(value: string): boolean {
	return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) && value.length <= 254;
}

export const POST: APIRoute = async ({ request, redirect, site }) => {
	let form: FormData;
	try {
		form = await request.formData();
	} catch {
		return redirect(fallbackUrl('unknown'), 303);
	}

	const email = String(form.get('email') ?? '').trim();
	const placement = String(form.get('placement') ?? 'unknown').slice(0, 40);
	const decoy = String(form.get('company') ?? '').trim();

	// A bot filled the hidden field. Thank it and do nothing.
	if (decoy) return redirect('/newsletter/thank-you/', 303);

	if (!looksLikeEmail(email)) return redirect(fallbackUrl(placement), 303);

	// Set as a secret on the Cloudflare Worker in production, and in a local .env for `astro dev`.
	const apiKey = (env as Record<string, unknown>).BEEHIIV_API_KEY as string | undefined;
	if (!apiKey) {
		console.warn('BEEHIIV_API_KEY is not set; sending the reader to beehiiv instead.');
		return redirect(fallbackUrl(placement), 303);
	}

	try {
		const response = await fetch(`${BEEHIIV_API}/publications/${NEWSLETTER.publicationId}/subscriptions`, {
			method: 'POST',
			headers: {
				Authorization: `Bearer ${apiKey}`,
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				email,
				// Someone filling in the form means it on purpose, so bring back an address
				// that unsubscribed before.
				reactivate_existing: true,
				send_welcome_email: false,
				utm_source: 'website',
				utm_medium: placement,
				referring_site: site?.href ?? 'https://yoankrastev.com',
				// No double_opt_override: whatever the publication is set to in beehiiv wins.
			}),
			signal: AbortSignal.timeout(8000),
		});

		if (!response.ok) {
			// 400 invalid address, 401 bad key, 404 wrong publication, 429 rate limited, 5xx beehiiv.
			console.warn(`beehiiv subscribe failed: ${response.status} ${await response.text().catch(() => '')}`);
			return redirect(fallbackUrl(placement), 303);
		}
	} catch (error) {
		console.warn('beehiiv subscribe threw:', error);
		return redirect(fallbackUrl(placement), 303);
	}

	return redirect('/newsletter/thank-you/', 303);
};

/** Nobody should land here by hand, but if they do, show them the newsletter page. */
export const GET: APIRoute = ({ redirect }) => redirect('/newsletter/', 303);

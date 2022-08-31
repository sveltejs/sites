import { API_BASE } from '$lib/env';

/** @type {import('./$types').PageLoad} */
export async function load({ fetch, setHeaders }) {
	const faqs = await fetch(`${API_BASE}/docs/svelte/faq?content`).then((r) => r.json());

	setHeaders({
		'cache-control': 'public, max-age=60'
	});

	return { faqs };
}

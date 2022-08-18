import { json } from '@sveltejs/kit';
import { API_BASE } from '$lib/env';

export async function load({ fetch }) {
	const faqs = await fetch(`${API_BASE}/docs/svelte/faq?content`).then((r) => r.json());

	return json(faqs, {
		cache: {
			maxage: 60
		}
	});
}

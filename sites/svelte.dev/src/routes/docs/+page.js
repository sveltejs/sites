import { json } from '@sveltejs/kit';
import { API_BASE } from '$lib/env';

export async function load({ fetch }) {
	const sections = await fetch(`${API_BASE}/docs/svelte/docs?content`).then((r) => r.json());
	return json(sections, {
		cache: {
			maxage: 60
		}
	});
}
